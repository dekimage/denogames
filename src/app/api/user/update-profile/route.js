import { NextResponse } from "next/server";
import { auth, firestore } from "@/firebaseAdmin";
import { ACHIEVEMENTS } from "@/lib/constants/achievements";
import { unlockAchievement } from "@/lib/helpers/achievementHelper";

// PUT handler for updating username
export async function PUT(req) {
  try {
    // Get authorization token from header
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);

    // Get request body
    const body = await req.json();
    const { userId, username, avatarImg } = body;

    // Ensure the authenticated user is only modifying their own profile
    if (decodedToken.uid !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: You can only modify your own profile" },
        { status: 403 }
      );
    }

    // Get user data first
    const userRef = firestore.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    const updateData = {};

    // Handle username update
    if (username !== undefined) {
      if (!username || typeof username !== "string" || username.trim() === "") {
        return NextResponse.json(
          { error: "Username is required" },
          { status: 400 }
        );
      }

      if (username.length < 3 || username.length > 30) {
        return NextResponse.json(
          { error: "Username must be between 3 and 30 characters" },
          { status: 400 }
        );
      }

      updateData.username = username;

      // Update display name in Firebase Auth
      await auth.updateUser(userId, {
        displayName: username,
      });
    }

    // Handle avatar update
    if (avatarImg !== undefined) {
      updateData.avatarImg = avatarImg;
    }

    updateData.updatedAt = new Date();

    // Update user document in Firestore
    await userRef.update(updateData);

    // After avatar update
    if (
      avatarImg &&
      !userData.achievements?.includes(ACHIEVEMENTS.PROFILE_AVATAR.id)
    ) {
      await unlockAchievement(userId, "PROFILE_AVATAR", {
        previousAvatar: userData.avatarImg,
        newAvatar: avatarImg,
      });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      ...updateData,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
