import { NextResponse } from "next/server";
import { auth, firestore } from "@/firebaseAdmin";

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
    const { userId, username } = body;

    // Ensure the authenticated user is only modifying their own profile
    if (decodedToken.uid !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: You can only modify your own profile" },
        { status: 403 }
      );
    }

    if (!username || typeof username !== "string" || username.trim() === "") {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Validate username
    if (username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { error: "Username must be between 3 and 30 characters" },
        { status: 400 }
      );
    }

    // Update user document in Firestore
    await firestore.collection("users").doc(userId).update({
      username: username,
      updatedAt: new Date(),
    });

    // Also update the display name in Firebase Auth
    await auth.updateUser(userId, {
      displayName: username,
    });

    return NextResponse.json({
      message: "Username updated successfully",
      username,
    });
  } catch (error) {
    console.error("Error updating username:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
