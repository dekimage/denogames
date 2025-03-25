import { firestore } from "@/firebaseAdmin";
import { handleFirstTimeAction, updateDailyStats } from "./baseHandler";

export async function handleProductCardClick(eventData, batch) {
  const { userId, context } = eventData;
  const { productId, isFirstClick } = context;

  // Handle first-time action
  if (isFirstClick) {
    await handleFirstTimeAction(
      batch,
      userId,
      "clickedProductCards",
      productId
    );
  }

  // Update product card stats
  const productStatsRef = firestore
    .collection("stats")
    .doc(`product_${productId}`);
  await updateDailyStats(batch, productStatsRef, isFirstClick);
}
