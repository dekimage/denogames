import { firestore } from "@/firebaseAdmin";
import { SERVER_EVENTS } from "@/lib/analytics/events";

export async function trackCookingAttempt({
  userId,
  code,
  success,
  failureReason = null,
  unlockedAchievementId = null,
  type = "cauldron", // or "portal"
}) {
  const batch = firestore.batch();
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // 1. Create analytics event document
  const analyticsRef = firestore.collection("analytics").doc();
  batch.set(analyticsRef, {
    userId,
    action: SERVER_EVENTS.ACHIEVEMENT_ATTEMPT,
    source: "cauldron",
    timestamp: now,
    context: {
      code,
      type,
      success,
      ...(failureReason && { failureReason }),
      ...(unlockedAchievementId && { unlockedAchievementId }),
    },
  });

  // 2. Update stats document
  const statsRef = firestore.collection("stats").doc("cooking_attempts");

  // Get current stats to update them
  const statsDoc = await statsRef.get();
  const currentStats = statsDoc.exists ? statsDoc.data() : {};

  const statsUpdate = {
    [`attemptsByDay.${today}`]: (currentStats?.attemptsByDay?.[today] || 0) + 1,
    totalAttempts: (currentStats?.totalAttempts || 0) + 1,
  };

  if (success) {
    statsUpdate[`successByDay.${today}`] =
      (currentStats?.successByDay?.[today] || 0) + 1;
    statsUpdate.totalSuccess = (currentStats?.totalSuccess || 0) + 1;

    if (unlockedAchievementId) {
      statsUpdate[`achievementUnlocks.${unlockedAchievementId}`] =
        (currentStats?.achievementUnlocks?.[unlockedAchievementId] || 0) + 1;
    }
  } else {
    statsUpdate[`failuresByDay.${today}`] =
      (currentStats?.failuresByDay?.[today] || 0) + 1;
    statsUpdate.totalFailures = (currentStats?.totalFailures || 0) + 1;

    if (failureReason) {
      statsUpdate[`failureReasons.${failureReason}`] =
        (currentStats?.failureReasons?.[failureReason] || 0) + 1;
    }
  }

  if (statsDoc.exists) {
    batch.update(statsRef, statsUpdate);
  } else {
    batch.set(statsRef, statsUpdate);
  }

  await batch.commit();
}
