import { NextResponse } from "next/server";
import { auth, firestore } from "@/firebaseAdmin";

export async function POST(request) {
  try {
    // Verify auth token
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);

    // Get reward ID from request
    const { rewardId } = await request.json();
    if (!rewardId) {
      return NextResponse.json(
        { error: "Reward ID is required" },
        { status: 400 }
      );
    }

    // Get user data and reward data in parallel
    const [userDoc, rewardDoc] = await Promise.all([
      firestore.collection("users").doc(decodedToken.uid).get(),
      firestore.collection("specialRewards").doc(rewardId).get(),
    ]);

    // Verify user exists
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify reward exists
    if (!rewardDoc.exists) {
      return NextResponse.json({ error: "Reward not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    const rewardData = rewardDoc.data();

    // Check if reward is already claimed
    if (userData.unlockedRewards?.includes(rewardId)) {
      return NextResponse.json(
        { error: "Reward already claimed" },
        { status: 400 }
      );
    }

    // Verify user has all required achievements
    const hasAllAchievements = rewardData.requiredAchievements.every(
      (achievementKey) => userData.achievements?.includes(achievementKey)
    );

    if (!hasAllAchievements) {
      return NextResponse.json(
        { error: "Missing required achievements" },
        { status: 400 }
      );
    }

    // Update user's unlockedRewards
    const unlockedRewards = [...(userData.unlockedRewards || []), rewardId];
    await userDoc.ref.update({ unlockedRewards });

    return NextResponse.json({ unlockedRewards });
  } catch (error) {
    console.error("Error claiming reward:", error);
    return NextResponse.json(
      { error: "Failed to claim reward" },
      { status: 500 }
    );
  }
}
