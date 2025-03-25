import { auth } from "@/firebase"; // client-side Firebase only
import { CLIENT_EVENTS, isServerOnlyEvent, isValidClientEvent } from "./events";
import MobxStore from "@/mobx";
import { getOrCreateDeviceId } from "./deviceId";
import { getOrCreateSessionId } from "./session";

export async function trackEvent({ action, context = {} }) {
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

    const user = auth.currentUser;
    const deviceId = getOrCreateDeviceId();
    const sessionId = getOrCreateSessionId();

    // Prepare the event data
    const eventData = {
      action,
      context: {
        ...context,
        deviceId,
        route: typeof window !== "undefined" ? window.location.pathname : "",
        referrer: typeof document !== "undefined" ? document.referrer : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      },
      sessionId,
      source: "client",
      timestamp: new Date().toISOString(),
    };

    // Add user data if authenticated
    if (user) {
      eventData.userId = user.uid;
      eventData.isAuthenticated = true;
    } else {
      eventData.isAuthenticated = false;
    }

    // Send to our tracking endpoint
    const headers = {
      "Content-Type": "application/json",
    };

    // Only add authorization if user is logged in
    if (user) {
      const token = await user.getIdToken();
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch("/api/track", {
      method: "POST",
      headers,
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error("Failed to track event");
    }

    // Only update MobX for authenticated users
    if (user && context.isFirstClick) {
      switch (action) {
        case CLIENT_EVENTS.BANNER_CLICK:
          MobxStore.updateUserAnalytics("bannersClicked", context.bannerId);
          break;
        case CLIENT_EVENTS.PRODUCT_CARD_CLICK:
          MobxStore.updateUserAnalytics(
            "clickedProductCards",
            context.productId
          );
          break;
      }
    }
  } catch (error) {
    console.log("Error tracking event:", error);
  }
}
