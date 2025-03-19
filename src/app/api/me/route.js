import { NextResponse } from "next/server";
import { firestore, auth } from "@/firebaseAdmin";

export async function GET(request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract and verify the token
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Fetch the user document from Firestore
    const userDoc = await firestore.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      // If user document doesn't exist, return basic user info
      return NextResponse.json({
        user: {
          uid,
          email: decodedToken.email || null,
          newUser: true,
        },
      });
    }

    // Return the full user data
    return NextResponse.json({
      user: {
        uid,
        ...userDoc.data(),
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to authenticate user" },
      { status: 500 }
    );
  }
}
