import { NextResponse } from "next/server";
import { auth, firestore, admin } from "@/firebaseAdmin";

export async function POST(request) {
  try {
    // Get authorization token if available
    const authHeader = request.headers.get("authorization");
    let userId = null;

    // If user is logged in, verify token and get user ID
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split("Bearer ")[1];
      try {
        const decodedToken = await auth.verifyIdToken(token);
        userId = decodedToken.uid;
      } catch (err) {
        console.error("Token verification error:", err);
        // Continue without user ID - we'll use IP-based limiting as fallback
      }
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // If we have a userId, check attempt limits
    if (userId) {
      const userRef = firestore.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        const attemptCount = userData.backerAttemptMM || 0;

        // Check if limit exceeded
        if (attemptCount >= 10) {
          return NextResponse.json(
            {
              error:
                "You've reached the maximum number of verification attempts. Please contact denogames.official@gmail.com for assistance.",
            },
            { status: 429 } // Too Many Requests
          );
        }

        // Increment the attempt counter
        await userRef.update({
          backerAttemptMM: admin.firestore.FieldValue.increment(1),
        });
      }
    }

    // Query the backers collection for this email
    const backersRef = firestore.collection("backers");
    const snapshot = await backersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return NextResponse.json({ found: false });
    }

    // Get the first matching backer document
    const backerDoc = snapshot.docs[0];
    const backerData = backerDoc.data();

    return NextResponse.json({
      found: true,
      isClaimed: backerData.isClaimed || false,
      productIds: backerData.productIds || ["monstermixology"],
    });
  } catch (error) {
    console.error("Error checking backer email:", error);
    return NextResponse.json(
      { error: "Failed to check backer email" },
      { status: 500 }
    );
  }
}
