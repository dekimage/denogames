import { auth, firestore } from "@/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { token, gameId } = await request.json();

    if (!token || !gameId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Verify Firebase token
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Get user document from Firestore
    const userDoc = await firestore.collection("users").doc(uid).get();
    const userData = userDoc.data();

    // Check if user has purchased the game
    const purchasedProducts = userData?.purchasedProducts || [];
    const hasAccess = purchasedProducts.includes(gameId);

    if (!hasAccess) {
      return NextResponse.json(
        { error: "User does not have access to this game" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error checking game access:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}
