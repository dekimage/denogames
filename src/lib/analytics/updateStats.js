import { firestore } from "@/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function updateStats(eventData, batch) {
  const { action, userId, context } = eventData;

  // Update user document
  const userRef = firestore.collection("users").doc(userId);

  // Update game-specific stats
  if (context.relatedGame) {
    const gameStatsRef = firestore
      .collection("stats")
      .doc(`game_${context.relatedGame}`);

    // First check if document exists
    const gameStatsDoc = await gameStatsRef.get();

    if (!gameStatsDoc.exists) {
      // Create the document first with initial values
      batch.set(gameStatsRef, {
        totalPlays: 0,
        totalAddonsUnlocked: 0,
        addonStats: {},
        lastUpdated: FieldValue.serverTimestamp(),
      });
    }

    switch (action) {
      case "addon_unlocked":
        batch.update(gameStatsRef, {
          totalAddonsUnlocked: FieldValue.increment(1),
          [`addonStats.${context.rewardId}`]: {
            totalUnlocks: FieldValue.increment(1),
            lastUnlock: FieldValue.serverTimestamp(),
          },
          lastUpdated: FieldValue.serverTimestamp(),
        });
        break;

      case "game_started":
        batch.update(gameStatsRef, {
          totalPlays: FieldValue.increment(1),
          lastUpdated: FieldValue.serverTimestamp(),
        });
        break;
    }
  }

  // Update global stats
  const globalStatsRef = firestore.collection("stats").doc("general");

  // Check if global stats document exists
  const globalStatsDoc = await globalStatsRef.get();

  if (!globalStatsDoc.exists) {
    // Create the document first with initial values
    batch.set(globalStatsRef, {
      totalUsers: 0,
      totalGamesPlayed: 0,
      totalAddonsUnlocked: 0,
      gameStats: {},
      lastUpdated: FieldValue.serverTimestamp(),
    });
  }

  switch (action) {
    case "addon_unlocked":
      const updateData = {
        totalAddonsUnlocked: FieldValue.increment(1),
        lastUpdated: FieldValue.serverTimestamp(),
      };

      // Initialize the game stats object if it doesn't exist
      if (
        !globalStatsDoc.exists ||
        !globalStatsDoc.data()?.gameStats?.[context.relatedGame]
      ) {
        updateData[`gameStats.${context.relatedGame}`] = {
          addonsUnlocked: 1,
          lastUpdate: FieldValue.serverTimestamp(),
        };
      } else {
        updateData[`gameStats.${context.relatedGame}.addonsUnlocked`] =
          FieldValue.increment(1);
        updateData[`gameStats.${context.relatedGame}.lastUpdate`] =
          FieldValue.serverTimestamp();
      }

      batch.update(globalStatsRef, updateData);
      break;

    case "banner_click":
      if (context.bannerId) {
        // Update banner-specific stats only
        const bannerStatsRef = firestore
          .collection("stats")
          .doc(`banner_${context.bannerId}`);
        const bannerStatsDoc = await bannerStatsRef.get();

        if (!bannerStatsDoc.exists) {
          batch.set(bannerStatsRef, {
            totalClicks: 1,
            clicksByDay: {
              [new Date().toISOString().split("T")[0]]: 1,
            },
          });
        } else {
          batch.update(bannerStatsRef, {
            totalClicks: FieldValue.increment(1),
            [`clicksByDay.${new Date().toISOString().split("T")[0]}`]:
              FieldValue.increment(1),
          });
        }
      }
      break;

    // Add other action cases here as we add more tracking
    default:
      console.log(`No stat updates defined for action: ${action}`);
      break;
  }

  // Update user document
  switch (action) {
    case "addon_unlocked":
      batch.update(userRef, {
        unlockedRewards: FieldValue.arrayUnion(context.rewardId),
        updatedAt: FieldValue.serverTimestamp(),
      });
      break;
  }
}
