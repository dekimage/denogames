import { firestore } from "@/firebaseAdmin";

export async function ensureStatsDocuments(userId, gameId = null) {
  const batch = firestore.batch();

  // Use existing 'stats' collection instead of 'globalStats'
  const globalStatsRef = firestore.collection("stats").doc("general");
  const globalStatsDoc = await globalStatsRef.get();
  if (!globalStatsDoc.exists) {
    batch.set(globalStatsRef, {
      totalUsers: 0,
      totalGamesPlayed: 0,
      totalAddonsUnlocked: 0,
      gameStats: {}, // Per-game aggregated stats
      lastUpdated: new Date(),
    });
  }

  // Initialize game analytics
  if (gameId) {
    const gameStatsRef = firestore.collection("stats").doc(`game_${gameId}`);
    const gameStatsDoc = await gameStatsRef.get();
    if (!gameStatsDoc.exists) {
      batch.set(gameStatsRef, {
        totalPlays: 0,
        totalAddonsUnlocked: 0,
        addonStats: {}, // Per-addon stats
        lastUpdated: new Date(),
      });
    }
  }

  await batch.commit();
}
