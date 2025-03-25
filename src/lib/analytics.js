import { auth } from "@/firebase";
import {
  isServerOnlyEvent,
  isValidClientEvent,
  getEventMetadata,
} from "./analytics/events";
import { firestore } from "@/firebaseAdmin";

// List of actions that can only be triggered from the server
const SECURE_ACTIONS = [
  "purchase",
  "write_review",
  "unlock_addon",
  "redeem_reward",
  "complete_onboarding",
  "claim_achievement",
];

export async function trackEvent({
  action,
  category,
  label,
  value,
  context = {},
  sessionId,
}) {
  try {
    // Validate the event
    if (!isValidClientEvent(action)) {
      console.log(`Invalid client event: ${action}`);
      return;
    }

    if (isServerOnlyEvent(action)) {
      console.log(`Event "${action}" can only be triggered from the server`);
      return;
    }

    // Get current user
    const user = auth.currentUser;
    if (!user) {
      console.log("No user logged in");
      return;
    }

    // Get auth token
    const token = await user.getIdToken();

    // Get current route and add to context
    const currentRoute =
      typeof window !== "undefined" ? window.location.pathname : "";
    const referrer = typeof document !== "undefined" ? document.referrer : "";

    // Prepare the event data
    const eventData = {
      userId: user.uid,
      action,
      category,
      label,
      value,
      context: {
        ...context,
        route: currentRoute,
        referrer,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      },
      sessionId: sessionId || generateSessionId(),
      source: "client",
      timestamp: new Date().toISOString(),
    };

    // Send to our tracking endpoint
    const response = await fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error("Failed to track event");
    }
  } catch (error) {
    console.log("Error tracking event:", error);
  }
}

// Helper function to generate a session ID
function generateSessionId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Server-side tracking function (to be used in API routes)
export async function trackSecureEvent({
  userId,
  action,
  category,
  label,
  value,
  context = {},
}) {
  try {
    if (!process.env.INTERNAL_TRACKING_SECRET) {
      throw new Error("INTERNAL_TRACKING_SECRET not configured");
    }

    // Validate server event
    if (!isServerOnlyEvent(action)) {
      console.log(`Invalid server event: ${action}`);
      return;
    }

    const eventData = {
      userId,
      action,
      category,
      label,
      value,
      context,
      source: "server",
      timestamp: new Date().toISOString(),
    };

    // Call our own API endpoint using internal fetch
    const response = await fetch(
      new URL(
        "/api/track",
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      ),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.INTERNAL_TRACKING_SECRET}`,
        },
        body: JSON.stringify(eventData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to track secure event");
    }
  } catch (error) {
    console.log("Error tracking secure event:", error);
  }
}
