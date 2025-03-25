import { firestore } from "@/firebaseAdmin";
import { handleFirstTimeAction, updateDailyStats } from "./baseHandler";

export async function handleBannerClick(eventData, batch) {
  const { userId, context } = eventData;
  const { bannerId, isFirstClick } = context;

  // Handle first-time action
  if (isFirstClick) {
    await handleFirstTimeAction(batch, userId, "bannersClicked", bannerId);
  }

  // Update banner stats
  const bannerStatsRef = firestore
    .collection("stats")
    .doc(`banner_${bannerId}`);
  await updateDailyStats(batch, bannerStatsRef, isFirstClick);
}
