import { admin, firestore } from "@/firebaseAdmin"; // Use your Firebase Admin instance
import { NextResponse } from "next/server"; // Import NextResponse for app router

export async function POST(req) {
  try {
    const { email, uid, username } = await req.json(); // Get email, userId, and username from the request body

    // Get a reference to the user document in Firestore
    const userDocRef = firestore.collection("users").doc(uid);

    // Fetch the user document from Firestore
    const userDoc = await userDocRef.get();

    let newUserProfile = {};

    // Check if the user document exists (correct usage: `exists` is a property)
    if (!userDoc.exists) {
      // <-- No parentheses here, just access the property
      newUserProfile = {
        createdAt: new Date(),
        username: username || "New User",
        email: email,
        uid: uid,
        purchasedProducts: [], // Empty array for purchased products
      };

      // Create the new user document in Firestore
      await userDocRef.set(newUserProfile);
    } else {
      // If the user already exists, fetch their data
      newUserProfile = userDoc.data();
    }

    // Now handle any pending orders
    const pendingOrdersSnapshot = await firestore
      .collection("orders")
      .where("customerEmail", "==", email)
      .where("isPending", "==", true)
      .get();

    if (!pendingOrdersSnapshot.empty) {
      const batch = firestore.batch();
      let purchasedProductIds = [];

      pendingOrdersSnapshot.forEach((doc) => {
        const orderData = doc.data();
        purchasedProductIds = [
          ...purchasedProductIds,
          ...orderData.cartItems.map((item) => item.id),
        ];

        // Update the order to link it to the user and mark it as not pending
        const orderRef = firestore.collection("orders").doc(doc.id);
        batch.update(orderRef, {
          userId: uid,
          isPending: false,
        });
      });

      // Update user's purchasedProducts with the product IDs
      batch.update(userDocRef, {
        purchasedProducts: admin.firestore.FieldValue.arrayUnion(
          ...purchasedProductIds
        ),
      });

      await batch.commit();

      // Update newUserProfile with the latest purchasedProducts
      newUserProfile.purchasedProducts = [
        ...new Set([
          ...newUserProfile.purchasedProducts,
          ...purchasedProductIds,
        ]),
      ];
    }

    return NextResponse.json({ success: true, user: newUserProfile }); // Return user document
  } catch (error) {
    console.error("Error during signup and merging pending orders:", error);
    return NextResponse.json(
      { error: "Failed to handle signup or pending orders" },
      { status: 500 }
    );
  }
}
