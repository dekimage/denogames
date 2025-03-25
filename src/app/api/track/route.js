import { NextResponse } from "next/server";
import { firestore, auth } from "@/firebaseAdmin";
import { isServerOnlyEvent, isValidClientEvent } from "@/lib/analytics/events";
import { FieldValue } from "firebase-admin/firestore";
import { ensureStatsDocuments } from "@/lib/analytics/initStats";
import { updateStats } from "@/lib/analytics/updateStats";
import { getEventHandler } from "@/lib/analytics/handlers";

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

    // Log the analytics event (common for all events)
    const analyticsRef = firestore.collection("analytics").doc();
    batch.set(analyticsRef, {
      ...eventData,
      timestamp: new Date(),
    });

    // Handle event-specific logic
    const handler = getEventHandler(eventData.action);
    if (handler) {
      await handler(eventData, batch);
    }

    await batch.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error tracking event:", error);
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 }
    );
  }
}
