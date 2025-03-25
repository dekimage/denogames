import { handleFirstTimeAction, updateDailyStats } from "./baseHandler";
import { FieldValue } from "firebase-admin/firestore";

export async function handleInitiateCheckoutFromProduct(
  eventData,
  batch,
  firestore
) {
  const productId = eventData.context.productId;
  const statsRef = firestore
    .collection("stats")
    .doc(`checkoutFrom_${productId}`);

  // Update user analytics for first-time checkouts from this product
  if (eventData.isAuthenticated && eventData.context.isFirstTime) {
    await handleFirstTimeAction(
      batch,
      eventData.userId,
      "checkoutProducts",
      productId
    );
  }

  // Get source from path
  let source = eventData.context.currentPath;
  if (source === "/") source = "home";
  else
    source = source.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "-");

  // Update daily stats
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
    };
    batch.update(statsRef, updates);
  }
}
