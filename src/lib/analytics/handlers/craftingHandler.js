import { firestore } from "@/firebaseAdmin";

export async function trackCraftingEvent({
  userId,
  rewardId,
  relatedGame,
  requiredAchievements,
}) {
  const batch = firestore.batch();
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // 1. Create analytics event document
  const analyticsRef = firestore.collection("analytics").doc();
  batch.set(analyticsRef, {
    userId,
    action: "addon_crafted",
    timestamp: now,
    context: {
      rewardId,
      relatedGame,
      requiredAchievements,
    },
  });

  // 2. Update stats document for crafting
  const statsRef = firestore.collection("stats").doc("crafting_stats");
  const statsDoc = await statsRef.get();
  const currentStats = statsDoc.exists ? statsDoc.data() : {};

  const statsUpdate = {
    // Update daily crafts count
    [`craftsByDay.${today}`]: (currentStats?.craftsByDay?.[today] || 0) + 1,
    // Update total crafts for this specific add-on
    [`addonCrafts.${rewardId}`]:
      (currentStats?.addonCrafts?.[rewardId] || 0) + 1,
    // Update total crafts overall
    totalCrafts: (currentStats?.totalCrafts || 0) + 1,
  };

  if (statsDoc.exists) {
    batch.update(statsRef, statsUpdate);
  } else {
    batch.set(statsRef, statsUpdate);
  }

  await batch.commit();
}
