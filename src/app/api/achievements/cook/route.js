import { auth, firestore } from "@/firebaseAdmin";
import { NextResponse } from "next/server";
import { trackCookingAttempt } from "@/lib/analytics/handlers/cookingHandler";
import { unlockAchievement } from "@/lib/helpers/achievementHelper";
import { ACHIEVEMENTS } from "@/lib/constants/achievements";

// Secret codes mapping
const SECRET_CODES = {
  // Cauldron codes (achievements/collectibles)
  START: "welcome",
  SATISFIED: "c2",
  BOOO: "c4",
  SHOP_EXPLORER: "c5",
  DOODLER: "c3",

  // Portal codes (locations)
  // PORTAL1: "early-supporter",
  // PORTAL2: "location-id-2",
};

const DAILY_ATTEMPTS_LIMIT = 10;

export async function POST(req) {
  let userId = "anonymous";
  let code, type;

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      await trackCookingAttempt({
        userId: "anonymous",
        code: "unknown",
        success: false,
        failureReason: "unauthorized",
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);
    userId = decodedToken.uid;

    const body = await req.json();
    code = body.code;
    type = body.type || "cauldron";

    if (!code) {
      await trackCookingAttempt({
        userId,
        code: "empty",
        success: false,
        failureReason: "missing_code",
        type,
      });
      return NextResponse.json(
        { message: "Code is required" },
        { status: 400 }
      );
    }

    // Get user document
    const userRef = firestore.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.exists ? userDoc.data() || {} : {};

    // Check daily attempts
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const attemptsField =
      type === "portal" ? "dailyPortalAttempts" : "dailyCookingAttempts";
    const dateField = type === "portal" ? "lastPortalDate" : "lastCookingDate";

    // Add safety check for userData fields
    const currentAttempts = userData[attemptsField] || 0;
    const lastDate = userData[dateField] || "";

    if (lastDate !== today) {
      // Reset attempts for new day
      await userRef.update({
        [attemptsField]: 0,
        [dateField]: today,
      });
      userData[attemptsField] = 0;
    }

    if (currentAttempts >= DAILY_ATTEMPTS_LIMIT) {
      await trackCookingAttempt({
        userId,
        code,
        success: false,
        failureReason: "daily_limit_exceeded",
        type,
      });
      return NextResponse.json(
        { message: `You've used all your ${type} attempts for today!` },
        { status: 429 }
      );
    }

    // Increment attempts
    await userRef.update({
      [attemptsField]: currentAttempts + 1,
      [dateField]: today,
    });

    // Check if code exists
    const achievementId = SECRET_CODES[code];
    if (!achievementId) {
      await trackCookingAttempt({
        userId,
        code,
        success: false,
        failureReason: "invalid_code",
        type,
      });
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

    // After successful unlock
    await trackCookingAttempt({
      userId,
      code,
      success: true,
      unlockedAchievementId: achievementId,
      type,
    });

    // Check for first cook achievement
    if (!userData.achievements?.includes(ACHIEVEMENTS.FIRST_COOK.id)) {
      await unlockAchievement(userId, "FIRST_COOK", { code, type });
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
    await trackCookingAttempt({
      userId,
      code: code || "unknown",
      success: false,
      failureReason: "server_error",
      type: type || "cauldron",
    });
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
