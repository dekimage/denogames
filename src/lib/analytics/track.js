import { auth } from "@/firebase";
import {
  isServerOnlyEvent,
  isValidClientEvent,
  getEventMetadata,
} from "./events";

export async function trackEvent({
  action,
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
    if (!process.env.ANALYTICS_SECRET) {
      throw new Error("ANALYTICS_SECRET not configured");
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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/track`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ANALYTICS_SECRET}`,
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
