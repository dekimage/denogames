import { auth, firestore } from "@/firebaseAdmin";
import { NextResponse } from "next/server";

// Secret codes mapping (in production, consider storing this in a secure database)
const SECRET_CODES = {
  49245: "collection-starter",
  MAGICWORD: "achievement-id-2",
  // Add more codes here
};

const DAILY_ATTEMPTS_LIMIT = 10;

export async function POST(req) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get request body
    const { code } = await req.json();
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

    if (userData.lastCookingDate !== today) {
      // Reset attempts for new day
      await userRef.update({
        dailyCookingAttempts: 0,
        lastCookingDate: today,
      });
      userData.dailyCookingAttempts = 0;
    }

    if (userData.dailyCookingAttempts >= DAILY_ATTEMPTS_LIMIT) {
      return NextResponse.json(
        { message: "You've used all your cooking attempts for today!" },
        { status: 429 }
      );
    }

    // Increment attempts
    await userRef.update({
      dailyCookingAttempts: (userData.dailyCookingAttempts || 0) + 1,
      lastCookingDate: today,
    });

    // Check if code exists
    const achievementId = SECRET_CODES[code];
    if (!achievementId) {
      return NextResponse.json(
        { message: "Wrong combination! Try again!" },
        { status: 400 }
      );
    }

    // Check if user already has this achievement
    if (userData.achievements?.includes(achievementId)) {
      return NextResponse.json(
        { message: "You already have this achievement!" },
        { status: 400 }
      );
    }

    // Get achievement details
    const achievementDoc = await firestore
      .collection("achievements")
      .doc(achievementId)
      .get();

    if (!achievementDoc.exists) {
      return NextResponse.json(
        { message: "Achievement not found" },
        { status: 404 }
      );
    }

    // Add achievement to user
    await userRef.update({
      achievements: [...(userData.achievements || []), achievementId],
    });

    // Return success with achievement data
    return NextResponse.json({
      success: true,
      message: "Achievement unlocked!",
      achievement: {
        id: achievementId,
        ...achievementDoc.data(),
      },
    });
  } catch (error) {
    console.error("Error in cook route:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
