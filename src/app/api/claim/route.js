import { admin, firestore } from "@/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { code, email } = await req.json();

    if (!code || !email) {
      return NextResponse.json(
        { error: "Code and email are required" },
        { status: 400 }
      );
    }

    // Find the backer with the given code
    const backerSnapshot = await firestore
      .collection("backers")
      .where("uniqueCode", "==", code)
      .limit(1)
      .get();

    if (backerSnapshot.empty) {
      return NextResponse.json(
        { error: "Invalid code. Please check and try again." },
        { status: 400 }
      );
    }

    const backerDoc = backerSnapshot.docs[0];
    const backer = { id: backerDoc.id, ...backerDoc.data() };

    // Check if code is already claimed
    if (backer.isClaimed) {
      return NextResponse.json(
        { error: "This code has already been claimed." },
        { status: 400 }
      );
    }

    // Check if the code belongs to the user trying to claim it
    if (backer.email && backer.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: "This code belongs to a different user. Please check your email and try again." },
        { status: 403 }
      );
    }

    // Get user document
    const userSnapshot = await firestore
      .collection("users")
      .where("email", "==", email.toLowerCase())
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const userDoc = userSnapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() };

    // Start a batch write
    const batch = firestore.batch();

    // Update backer document
    const backerRef = firestore.collection("backers").doc(backer.id);
    batch.update(backerRef, {
      isClaimed: true,
      claimedBy: email.toLowerCase(),
      claimedAt: new Date(),
    });

    // Update user document
    const userRef = firestore.collection("users").doc(userDoc.id);
    batch.update(userRef, {
      purchasedProducts: admin.firestore.FieldValue.arrayUnion(
        ...backer.productIds
      ),
      tags: admin.firestore.FieldValue.arrayUnion(`${backer.source}_backer`),
    });

    await batch.commit();

    // Fetch product details for the response
    const productIds = backer.productIds || [];
    const productsSnapshot = await firestore
      .collection("products")
      .where(admin.firestore.FieldPath.documentId(), "in", productIds)
      .get();

    const claimedProducts = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      ...doc.data(),
    }));

    // Get updated user data
    const updatedUserDoc = await userRef.get();
    const updatedUser = { id: updatedUserDoc.id, ...updatedUserDoc.data() };

    return NextResponse.json({
      success: true,
      message: "Code successfully claimed",
      claimedProducts,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error claiming code:", error);
    return NextResponse.json(
      { error: "Failed to claim code. Please try again." },
      { status: 500 }
    );
  }
}
