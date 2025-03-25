import { NextResponse } from "next/server";
import { firestore, auth } from "@/firebaseAdmin";
import {
  isServerOnlyEvent,
  isValidClientEvent,
  ALLOWED_CLICK_LABELS,
  CLIENT_EVENTS,
} from "@/lib/analytics/events";
import { FieldValue } from "firebase-admin/firestore";
import { ensureStatsDocuments } from "@/lib/analytics/initStats";
import { updateStats } from "@/lib/analytics/updateStats";
import { getEventHandler } from "@/lib/analytics/handlers";

export async function POST(req) {
  try {
    const eventData = await req.json();

    // Validate the event type first
    if (!isValidClientEvent(eventData.action)) {
      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400 }
      );
    }

    // For generic clicks, validate the click label
    if (
      eventData.action === CLIENT_EVENTS.GENERIC_CLICK &&
      !Object.values(ALLOWED_CLICK_LABELS).includes(
        eventData.context?.clickLabel
      )
    ) {
      return NextResponse.json(
        { error: "Invalid click label" },
        { status: 400 }
      );
    }

    // For authenticated requests, validate token
    if (eventData.isAuthenticated) {
      const authHeader = req.headers.get("authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const token = authHeader.split("Bearer ")[1];
      const decodedToken = await auth.verifyIdToken(token);

      if (decodedToken.uid !== eventData.userId) {
        throw new Error("User ID mismatch");
      }
    }

    const batch = firestore.batch();

    // Add the analytics event
    const analyticsRef = firestore.collection("analytics").doc();
    batch.set(analyticsRef, {
      ...eventData,
      timestamp: new Date(),
    });

    // Get and execute the appropriate handler for the event
    const handler = getEventHandler(eventData.action);
    if (handler) {
      await handler(eventData, batch, firestore);
    }

    await batch.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error tracking event:", error);

    // Special handling for invalid click labels
    if (error.message === "INVALID_CLICK_LABEL") {
      return NextResponse.json(
        { error: "Invalid click label" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 }
    );
  }
}
