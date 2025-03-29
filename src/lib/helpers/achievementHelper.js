import { auth, firestore } from "@/firebaseAdmin";
import { ACHIEVEMENTS } from "@/lib/constants/achievements";
import { trackAchievementEvent } from "@/lib/analytics/handlers/achievementHandler";

export async function unlockAchievement(userId, achievementKey, context = {}) {
  try {
    // Validate achievement exists
    const achievement = ACHIEVEMENTS[achievementKey];
    if (!achievement) {
      throw new Error("Invalid achievement key");
    }

    // Get user data
    const userRef = firestore.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();

    // Check if user already has this achievement
    if (userData.achievements?.includes(achievement.id)) {
      return {
        success: false,
        message: "Achievement already unlocked",
      };
    }

    // Check product ownership if required
    if (achievement.requiresOwnership && achievement.productId) {
      const hasProduct = userData.purchasedProducts?.includes(
        achievement.productId
      );
      if (!hasProduct) {
        return {
          success: false,
          message: "Product ownership required",
        };
      }
    }

    // Update user's achievements
    await userRef.update({
      achievements: [...(userData.achievements || []), achievement.id],
    });

    // Track the achievement unlock
    await trackAchievementEvent({
      userId,
      achievementId: achievement.id,
      achievementKey,
      context,
    });

    return {
      success: true,
      message: "Achievement unlocked",
      achievementId: achievement.id,
    };
  } catch (error) {
    console.error("Error unlocking achievement:", error);
    throw error;
  }
}
