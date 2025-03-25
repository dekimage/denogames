import { handleFirstTimeAction, updateDailyStats } from "./baseHandler";
import { FieldValue } from "firebase-admin/firestore";

export async function handleInitiateCheckoutFromCart(
  eventData,
  batch,
  firestore
) {
  const statsRef = firestore.collection("stats").doc("proceedToCheckout");

  // Update user analytics for first-time general checkout
  if (eventData.isAuthenticated && eventData.context.isFirstTime) {
    await handleFirstTimeAction(
      batch,
      eventData.userId,
      "proceedToCheckout",
      true
    );
  }

  // Get source from path
  let source = eventData.context.currentPath;
  if (source === "/") source = "home";
  else
    source = source.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "-");

  const today = new Date().toISOString().split("T")[0];
  const doc = await statsRef.get();

  if (!doc.exists) {
    batch.set(statsRef, {
      totalCheckouts: 1,
      checkoutsBySource: {
        [source]: 1,
      },
      checkoutsByDay: {
        [today]: 1,
      },
      cartValueTotal: eventData.context.cartValue || 0,
      authenticatedCheckouts: eventData.isAuthenticated ? 1 : 0,
      anonymousCheckouts: eventData.isAuthenticated ? 0 : 1,
      averageCartSize: eventData.context.cartItems?.length || 0,
      totalCartItems: eventData.context.cartItems?.length || 0,
    });
  } else {
    const updates = {
      totalCheckouts: FieldValue.increment(1),
      [`checkoutsByDay.${today}`]: FieldValue.increment(1),
      [`checkoutsBySource.${source}`]: FieldValue.increment(1),
      cartValueTotal: FieldValue.increment(eventData.context.cartValue || 0),
      [eventData.isAuthenticated
        ? "authenticatedCheckouts"
        : "anonymousCheckouts"]: FieldValue.increment(1),
      totalCartItems: FieldValue.increment(
        eventData.context.cartItems?.length || 0
      ),
    };

    // Update average cart size
    const currentTotal = doc.data().totalCartItems || 0;
    const currentCheckouts = doc.data().totalCheckouts || 0;
    const newTotal = currentTotal + (eventData.context.cartItems?.length || 0);
    const newCheckouts = currentCheckouts + 1;
    updates.averageCartSize = newTotal / newCheckouts;

    batch.update(statsRef, updates);
  }
}
