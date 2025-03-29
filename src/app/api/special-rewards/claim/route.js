import { NextResponse } from "next/server";
import { auth, firestore } from "@/firebaseAdmin";
import { trackCraftingEvent } from "@/lib/analytics/handlers/craftingHandler";
import { SERVER_EVENTS } from "@/lib/analytics/events";

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

    // Get user data and product (reward) data in parallel
    const [userDoc, productDoc] = await Promise.all([
      firestore.collection("users").doc(decodedToken.uid).get(),
      firestore.collection("products").doc(rewardId).get(),
    ]);

    // Verify user exists
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify product exists and is an add-on (reward)
    if (!productDoc.exists) {
      return NextResponse.json({ error: "Add-on not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    const productData = productDoc.data();

    // Check if the product is actually an add-on type
    if (productData.type !== "add-on") {
      return NextResponse.json(
        { error: "Product is not a claimable add-on" },
        { status: 400 }
      );
    }

    // Check if reward is already claimed
    if (userData.unlockedRewards?.includes(rewardId)) {
      return NextResponse.json(
        { error: "Add-on already claimed" },
        { status: 400 }
      );
    }

    // NEW: Check if user owns the base game
    if (productData.relatedGames) {
      const userOwnsBaseGame = userData.purchasedProducts?.includes(
        productData.relatedGames
      );

      if (!userOwnsBaseGame) {
        return NextResponse.json(
          { error: "You must own the base game to claim this add-on" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "This add-on is not associated with any base game" },
        { status: 400 }
      );
    }

    // Verify user has all required achievements
    if (
      !productData.requiredAchievements ||
      productData.requiredAchievements.length === 0
    ) {
      return NextResponse.json(
        { error: "This add-on has no achievement requirements defined" },
        { status: 400 }
      );
    }

    const hasAllAchievements = productData.requiredAchievements.every(
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

    // Track the successful craft
    await trackCraftingEvent({
      userId: decodedToken.uid,
      rewardId,
      relatedGame: productData.relatedGames,
      requiredAchievements: productData.requiredAchievements,
    });

    return NextResponse.json({ unlockedRewards });
  } catch (error) {
    console.error("Error claiming reward:", error);
    return NextResponse.json(
      { error: "Failed to claim reward" },
      { status: 500 }
    );
  }
}
