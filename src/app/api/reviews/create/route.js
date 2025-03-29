import { NextResponse } from "next/server";
import { auth, firestore } from "@/firebaseAdmin";
import { trackReviewEvent } from "@/lib/analytics/handlers/reviewHandler";

export async function POST(request) {
  try {
    // Get the authorization token from the request header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];

    // Verify the token and get the user
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get the request body
    const { productId, rating, comment } = await request.json();

    if (!productId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user data to check purchased products
    const userRef = firestore.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    const purchasedProducts = userData.purchasedProducts || [];

    // Ensure the user has purchased the product
    if (!purchasedProducts.includes(productId)) {
      return NextResponse.json(
        { error: "You can only review products you've purchased" },
        { status: 403 }
      );
    }

    // Check if the user has already left a review for this product
    const existingReviewSnapshot = await firestore
      .collection("reviews")
      .where("productId", "==", productId)
      .where("userId", "==", userId)
      .get();

    if (!existingReviewSnapshot.empty) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    // Create the review
    const reviewRef = await firestore.collection("reviews").add({
      productId,
      userId,
      username: userData.username || "User",
      rating,
      comment,
      createdAt: new Date(),
    });

    // Update the product's average rating
    const productRef = firestore.collection("products").doc(productId);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const productData = productDoc.data();
    const currentRating = productData.averageRating || 0;
    const totalReviews = productData.totalReviews || 0;

    // Calculate new average rating
    const newTotalRating = currentRating * totalReviews + rating;
    const newAverageRating = newTotalRating / (totalReviews + 1);

    // Update product with new average rating and increment total reviews
    await productRef.update({
      averageRating: parseFloat(newAverageRating.toFixed(1)),
      totalReviews: totalReviews + 1,
    });

    // Track the review creation
    await trackReviewEvent({
      userId,
      productId,
      action: "create",
      rating,
      reviewId: reviewRef.id,
    });

    return NextResponse.json({
      success: true,
      reviewId: reviewRef.id,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
