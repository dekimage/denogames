import { isServerOnlyEvent } from "./events";

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

    // Call our own API endpoint
    const response = await fetch(
      new URL(
        "/api/track",
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
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
