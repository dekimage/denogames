import { handleFirstTimeAction, updateDailyStats } from "./baseHandler";

export async function handleBannerClick(eventData, batch, firestore) {
  const bannerId = eventData.context.bannerId;
  const bannerStatsRef = firestore
    .collection("stats")
    .doc(`banner_${bannerId}`);

  // Update user analytics for first-time clicks
  if (eventData.isAuthenticated && eventData.context.isFirstClick) {
    await handleFirstTimeAction(
      batch,
      eventData.userId,
      "bannersClicked",
      bannerId
    );
  }

  // Update daily stats
  await updateDailyStats(batch, bannerStatsRef, eventData.context.isFirstClick);
}
