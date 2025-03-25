import { NextResponse } from "next/server";
import { firestore, auth } from "@/firebaseAdmin";
import { isServerOnlyEvent, isValidClientEvent } from "@/lib/analytics/events";
import { FieldValue } from "firebase-admin/firestore";
import { ensureStatsDocuments } from "@/lib/analytics/initStats";
import { updateStats } from "@/lib/analytics/updateStats";

export async function POST(req) {
  try {
    const eventData = await req.json();
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);

    // Validate the source and authorization
    if (eventData.source === "server") {
      // For server events, validate against internal secret
      if (token !== process.env.INTERNAL_TRACKING_SECRET) {
        return NextResponse.json(
          { error: "Invalid server authorization" },
          { status: 401 }
        );
      }
    } else {
      // For client events, validate Firebase token
      if (decodedToken.uid !== eventData.userId) {
        throw new Error("User ID mismatch");
      }

      // Prevent client-side tracking of secure actions
      if (isServerOnlyEvent(eventData.action)) {
        return NextResponse.json(
          { error: "This action can only be tracked server-side" },
          { status: 403 }
        );
      }
    }

    // Ensure stats documents exist
    await ensureStatsDocuments(eventData.userId, eventData.context?.gameId);

    const batch = firestore.batch();

    // Add the analytics event
    const analyticsRef = firestore.collection("analytics").doc();
    batch.set(analyticsRef, {
      ...eventData,
      timestamp: new Date(),
    });

    // If it's a first-time action, update the user document
    if (eventData.action === "banner_click" && eventData.context.isFirstClick) {
      const userRef = firestore.collection("users").doc(eventData.userId);
      batch.update(userRef, {
        [`analytics.bannersClicked`]: FieldValue.arrayUnion(
          eventData.context.bannerId
        ),
      });
    }

    // Update banner stats
    if (eventData.action === "banner_click" && eventData.context.bannerId) {
      const bannerStatsRef = firestore
        .collection("stats")
        .doc(`banner_${eventData.context.bannerId}`);
      const bannerStatsDoc = await bannerStatsRef.get();

      if (!bannerStatsDoc.exists) {
        batch.set(bannerStatsRef, {
          totalClicks: 1,
          uniqueClicks: eventData.context.isFirstClick ? 1 : 0,
          clicksByDay: {
            [new Date().toISOString().split("T")[0]]: 1,
          },
        });
      } else {
        const updates = {
          totalClicks: FieldValue.increment(1),
          [`clicksByDay.${new Date().toISOString().split("T")[0]}`]:
            FieldValue.increment(1),
        };

        if (eventData.context.isFirstClick) {
          updates.uniqueClicks = FieldValue.increment(1);
        }

        batch.update(bannerStatsRef, updates);
      }
    }

    // Update all relevant stats
    await updateStats(eventData, batch);

    // Commit all operations
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking event:", error);
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 }
    );
  }
}
