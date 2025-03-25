import { auth } from "@/firebase"; // client-side Firebase only
import { isServerOnlyEvent, isValidClientEvent } from "./events";

// Add this function to generate and manage sessions
function getOrCreateSessionId() {
  let sessionId = localStorage.getItem("analytics_session_id");
  const lastActivity = localStorage.getItem("analytics_last_activity");
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

  const now = Date.now();

  // Create new session if:
  // - No session exists
  // - No last activity
  // - Last activity was more than 30 minutes ago
  if (
    !sessionId ||
    !lastActivity ||
    now - parseInt(lastActivity) > SESSION_TIMEOUT
  ) {
    sessionId =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("analytics_session_id", sessionId);
  }

  // Update last activity
  localStorage.setItem("analytics_last_activity", now.toString());

  return sessionId;
}

export async function trackEvent({
  action,
  category,
  label,
  value,
  context = {},
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
      sessionId: getOrCreateSessionId(), // Use the managed session ID
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
