import { firestore } from "@/firebaseAdmin";

export async function trackAchievementEvent({
  userId,
  achievementId,
  achievementKey,
  context = {},
}) {
  const batch = firestore.batch();
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // Create analytics event document
  const analyticsRef = firestore.collection("analytics").doc();
  batch.set(analyticsRef, {
    userId,
    action: "achievement_unlocked",
    timestamp: now,
    context: {
      achievementId,
      achievementKey,
      ...context,
    },
  });

  // Update stats document
  const statsRef = firestore.collection("stats").doc("achievement_stats");
  const statsDoc = await statsRef.get();
  const currentStats = statsDoc.exists ? statsDoc.data() : {};

  const statsUpdate = {
    [`unlocksByDay.${today}`]: (currentStats?.unlocksByDay?.[today] || 0) + 1,
    [`achievementUnlocks.${achievementId}`]:
      (currentStats?.achievementUnlocks?.[achievementId] || 0) + 1,
    totalUnlocks: (currentStats?.totalUnlocks || 0) + 1,
  };

  if (statsDoc.exists) {
    batch.update(statsRef, statsUpdate);
  } else {
    batch.set(statsRef, statsUpdate);
  }

  await batch.commit();
}
