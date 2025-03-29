import { auth, firestore } from "@/firebaseAdmin";
import { NextResponse } from "next/server";
import { ACHIEVEMENTS } from "@/lib/constants/achievements";
import { trackAchievementEvent } from "@/lib/analytics/handlers/achievementHandler";

export async function POST(req) {
  try {
    // Verify auth
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get achievement key from request
    const { achievementKey, context = {} } = await req.json();

    // Validate achievement exists
    const achievement = ACHIEVEMENTS[achievementKey];
    if (!achievement) {
      return NextResponse.json(
        { error: "Invalid achievement key" },
        { status: 400 }
      );
    }

    // Get user data
    const userRef = firestore.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();

    // Check if user already has this achievement
    if (userData.achievements?.includes(achievement.id)) {
      return NextResponse.json({
        success: false,
        message: "Achievement already unlocked",
      });
    }

    // Check product ownership if required
    if (achievement.requiresOwnership && achievement.productId) {
      const hasProduct = userData.purchasedProducts?.includes(
        achievement.productId
      );
      if (!hasProduct) {
        return NextResponse.json({
          success: false,
          message: "Product ownership required",
        });
      }
    }

    // After successfully unlocking the achievement
    const result = {
      success: true,
      message: "Achievement unlocked",
      achievementId: achievement.id,
    };

    // Update user's achievements in Firestore
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

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error unlocking achievement:", error);
    return NextResponse.json(
      { error: "Failed to unlock achievement" },
      { status: 500 }
    );
  }
}
