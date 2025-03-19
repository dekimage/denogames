import { auth, firestore } from "@/firebaseAdmin";
import { NextResponse } from "next/server";

// Secret codes mapping
const SECRET_CODES = {
  // Cauldron codes (achievements/collectibles)
  49245: "achievement-id-1",
  MAGICWORD: "achievement-id-2",
  magic: "expansion-expert",
  // Portal codes (locations)
  PORTAL1: "early-supporter",
  PORTAL2: "location-id-2",
};

const DAILY_ATTEMPTS_LIMIT = 10;

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { code, type = "cauldron" } = await req.json();
    if (!code) {
      return NextResponse.json(
        { message: "Code is required" },
        { status: 400 }
      );
    }

    // Get user document
    const userRef = firestore.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    // Check daily attempts
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const attemptsField =
      type === "portal" ? "dailyPortalAttempts" : "dailyCookingAttempts";
    const dateField = type === "portal" ? "lastPortalDate" : "lastCookingDate";

    if (userData[dateField] !== today) {
      // Reset attempts for new day
      await userRef.update({
        [attemptsField]: 0,
        [dateField]: today,
      });
      userData[attemptsField] = 0;
    }

    if (userData[attemptsField] >= DAILY_ATTEMPTS_LIMIT) {
      return NextResponse.json(
        { message: `You've used all your ${type} attempts for today!` },
        { status: 429 }
      );
    }

    // Increment attempts
    await userRef.update({
      [attemptsField]: (userData[attemptsField] || 0) + 1,
      [dateField]: today,
    });

    // Check if code exists
    const achievementId = SECRET_CODES[code];
    if (!achievementId) {
      return NextResponse.json(
        { message: "Wrong combination! Try again!" },
        { status: 400 }
      );
    }

    // Get achievement/location details
    const achievementDoc = await firestore
      .collection("achievements")
      .doc(achievementId)
      .get();

    if (!achievementDoc.exists) {
      return NextResponse.json(
        { message: "Location/Achievement not found" },
        { status: 404 }
      );
    }

    const achievement = achievementDoc.data();

    // Verify type matches
    if (type === "portal" && achievement.type !== "location") {
      return NextResponse.json(
        { message: "This code can only be used in the Cauldron!" },
        { status: 400 }
      );
    }

    if (type === "cauldron" && achievement.type === "location") {
      return NextResponse.json(
        { message: "This code can only be used in the Portal!" },
        { status: 400 }
      );
    }

    // For locations, check if already discovered
    if (achievement.type === "location") {
      // Get the found items data regardless of discovery status
      const itemPromises =
        achievement.foundItems?.map(async (itemId) => {
          const itemDoc = await firestore
            .collection("achievements")
            .doc(itemId)
            .get();
          return {
            id: itemId,
            ...itemDoc.data(),
          };
        }) || [];

      const foundItems = await Promise.all(itemPromises);

      // Check if this is a new discovery or a revisit
      const isNewDiscovery =
        !userData.discoveredLocations?.includes(achievementId);

      // If it's a new discovery, update the user's discovered locations
      if (isNewDiscovery) {
        await userRef.update({
          discoveredLocations: [
            ...(userData.discoveredLocations || []),
            achievementId,
          ],
        });
      }

      return NextResponse.json({
        success: isNewDiscovery, // true for new discoveries, false for revisits
        message: isNewDiscovery ? "Location discovered!" : "Location found!",
        achievement: {
          id: achievementId,
          ...achievement,
          foundItems,
        },
        userAchievements: userData.achievements || [],
      });
    } else {
      // For achievements/collectibles
      if (userData.achievements?.includes(achievementId)) {
        return NextResponse.json(
          { message: "You already have this achievement!" },
          { status: 400 }
        );
      }

      // Add achievement to user
      await userRef.update({
        achievements: [...(userData.achievements || []), achievementId],
      });
    }

    // Return success with data
    return NextResponse.json({
      success: true,
      message:
        type === "portal" ? "Location discovered!" : "Achievement unlocked!",
      achievement: {
        id: achievementId,
        ...achievement,
      },
      userAchievements: userData.achievements || [],
    });
  } catch (error) {
    console.error("Error in cook route:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
