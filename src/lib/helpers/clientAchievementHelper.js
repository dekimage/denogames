import { auth } from "@/firebase";
import { ACHIEVEMENTS } from "@/lib/constants/achievements";
import MobxStore from "@/mobx";
import { runInAction } from "mobx";

export async function unlockProductAchievement(achievementKey) {
  try {
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      console.log("User must be logged in to unlock achievements");
      return { success: false, error: "Authentication required" };
    }

    // Validate achievement exists
    const achievement = ACHIEVEMENTS[achievementKey];
    if (!achievement) {
      console.log("Invalid achievement key:", achievementKey);
      return { success: false, error: "Invalid achievement" };
    }

    // Check if user already has this achievement
    if (MobxStore.user?.achievements?.includes(achievement.id)) {
      console.log("Achievement already unlocked");
      return { success: false, error: "Already unlocked" };
    }

    // Check product ownership if required
    if (achievement.requiresOwnership && achievement.productId) {
      const hasProduct = MobxStore.user?.purchasedProducts?.includes(
        achievement.productId
      );
      if (!hasProduct) {
        console.log(
          "User doesn't own required product:",
          achievement.productId
        );
        return { success: false, error: "Product ownership required" };
      }
    }

    // Get auth token
    const token = await user.getIdToken();

    // Call achievement API
    const response = await fetch("/api/achievements/unlock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        achievementKey,
        context: {
          source: "client",
          productId: achievement.productId,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to unlock achievement");
    }

    const data = await response.json();
    console.log("Achievement unlock response:", data);

    // If successful, update MobX state
    if (data.success) {
      console.log("Calling setNewAchievement with:", data.achievementId);

      // First update the user's achievements
      runInAction(() => {
        MobxStore.user.achievements = [
          ...(MobxStore.user.achievements || []),
          achievement.id,
        ];
      });

      // Then trigger the animation
      requestAnimationFrame(() => {
        MobxStore.setNewAchievement(data.achievementId);
      });
    }

    return data;
  } catch (error) {
    console.error("Error unlocking achievement:", error);
    return { success: false, error: error.message };
  }
}
