import { NextResponse } from "next/server";
import { firestore, auth } from "@/firebaseAdmin";

export async function POST(request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get product IDs from request body
    const { productIds } = await request.json();

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { message: "No products specified" },
        { status: 400 }
      );
    }

    // Fetch products from Firestore to verify they are indeed free
    const productsRef = firestore.collection("products");
    const productsSnapshots = await Promise.all(
      productIds.map((id) => productsRef.doc(id).get())
    );

    // Check if all products exist and are free
    const invalidProducts = productsSnapshots.filter(
      (snapshot, index) =>
        !snapshot.exists ||
        snapshot.data().price !== 0 ||
        snapshot.data().isDraft === true
    );

    if (invalidProducts.length > 0) {
      return NextResponse.json(
        { message: "Some products are not valid for free checkout" },
        { status: 400 }
      );
    }

    // All products are valid and free, add them to user's purchased products
    const userRef = firestore.collection("users").doc(userId);

    // Get current purchased products
    const userDoc = await userRef.get();
    const userData = userDoc.data() || {};
    const currentPurchasedProducts = userData.purchasedProducts || [];

    // Add new products (avoiding duplicates)
    const newPurchasedProducts = [
      ...new Set([...currentPurchasedProducts, ...productIds]),
    ];

    // Update user document
    await userRef.update({
      purchasedProducts: newPurchasedProducts,
      updatedAt: new Date(),
    });

    // Clear cart (optional, can also be handled client-side)
    if (userData.cart && Array.isArray(userData.cart)) {
      const updatedCart = userData.cart.filter(
        (id) => !productIds.includes(id)
      );
      await userRef.update({ cart: updatedCart });
    }

    // Return success
    return NextResponse.json({
      success: true,
      message: "Free products added to your library",
    });
  } catch (error) {
    console.error("Free checkout error:", error);
    return NextResponse.json(
      { message: "Error processing free checkout: " + error.message },
      { status: 500 }
    );
  }
}
