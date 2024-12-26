import { firestore, admin } from "@/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Get all backers that haven't been claimed
    const backersSnapshot = await firestore
      .collection("backers")
      .where("isClaimed", "==", false)
      .get();

    const backers = backersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Create a map of emails to backer data for faster lookup
    const backersByEmail = new Map();
    backers.forEach((backer) => {
      backersByEmail.set(backer.email.toLowerCase(), backer);
    });

    // Get all users
    const usersSnapshot = await firestore.collection("users").get();

    const batch = firestore.batch();
    let matchedCount = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userEmail = userData.email?.toLowerCase();

      if (userEmail && backersByEmail.has(userEmail)) {
        const backer = backersByEmail.get(userEmail);

        // Update user document
        const userRef = firestore.collection("users").doc(userDoc.id);
        batch.update(userRef, {
          purchasedProducts: admin.firestore.FieldValue.arrayUnion(
            ...(backer.productIds || [])
          ),
          tags: admin.firestore.FieldValue.arrayUnion(
            `${backer.source || "external"}_backer`
          ),
        });

        // Update backer document
        const backerRef = firestore.collection("backers").doc(backer.id);
        batch.update(backerRef, {
          isClaimed: true,
          claimedBy: userDoc.id,
          claimedAt: new Date(),
        });

        matchedCount++;
      }
    }

    if (matchedCount > 0) {
      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      matched: matchedCount,
    });
  } catch (error) {
    console.error("Error matching users:", error);
    return NextResponse.json(
      { error: "Failed to match users" },
      { status: 500 }
    );
  }
}
