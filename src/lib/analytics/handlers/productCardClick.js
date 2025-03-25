import { handleFirstTimeAction, updateDailyStats } from "./baseHandler";

export async function handleProductCardClick(eventData, batch, firestore) {
  const productId = eventData.context.productId;
  const productStatsRef = firestore
    .collection("stats")
    .doc(`product_${productId}`);

  // Update user analytics for first-time clicks
  if (eventData.isAuthenticated && eventData.context.isFirstClick) {
    await handleFirstTimeAction(
      batch,
      eventData.userId,
      "clickedProductCards",
      productId
    );
  }

  // Update daily stats
  await updateDailyStats(
    batch,
    productStatsRef,
    eventData.context.isFirstClick
  );
}
