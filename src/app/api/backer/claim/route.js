import { NextResponse } from "next/server";
import { auth, firestore, admin } from "@/firebaseAdmin";

export async function POST(request) {
  try {
    // Get the current user's authentication token
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get the request body
    const { email, productIds } = await request.json();

    if (!email || !productIds || !productIds.length) {
      return NextResponse.json(
        { error: "Email and product IDs are required" },
        { status: 400 }
      );
    }

    // Verify productIds contains "monstermixology"
    if (!productIds.includes("monstermixology")) {
      return NextResponse.json(
        { error: "You can only claim Monster Mixology as a backer reward" },
        { status: 400 }
      );
    }

    // Check attempt limit
    const userRef = firestore.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    const attemptCount = userData.backerAttemptMM || 0;

    // Check if limit exceeded
    if (attemptCount >= 10) {
      return NextResponse.json(
        {
          error:
            "You've reached the maximum number of claim attempts. Please contact denogames.official@gmail.com for assistance.",
        },
        { status: 429 } // Too Many Requests
      );
    }

    // Increment the attempt counter
    await userRef.update({
      backerAttemptMM: admin.firestore.FieldValue.increment(1),
    });

    // Find the backer document
    const backersRef = firestore.collection("backers");
    const snapshot = await backersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "No backer found with this email" },
        { status: 404 }
      );
    }

    // Get the backer document
    const backerDoc = snapshot.docs[0];
    const backerData = backerDoc.data();

    // Check if already claimed
    if (backerData.isClaimed) {
      return NextResponse.json(
        { error: "This backer reward has already been claimed" },
        { status: 400 }
      );
    }

    // Update the backer document to mark as claimed
    await backerDoc.ref.update({
      isClaimed: true,
      claimedBy: userId,
      claimedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update the user's purchasedProducts array
    await userRef.update({
      purchasedProducts:
        admin.firestore.FieldValue.arrayUnion("monstermixology"),
      tags: admin.firestore.FieldValue.arrayUnion("kickstarter_backer"),
      // Reset attempt counter on successful claim
      backerAttemptMM: 0,
    });

    return NextResponse.json({
      success: true,
      message: "Monster Mixology has been added to your library",
    });
  } catch (error) {
    console.error("Error claiming backer reward:", error);
    return NextResponse.json(
      { error: "Failed to claim backer reward" },
      { status: 500 }
    );
  }
}
