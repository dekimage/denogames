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
    const { reviewId, productId, rating, comment } = await request.json();

    if (!reviewId || !productId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the existing review
    const reviewRef = firestore.collection("reviews").doc(reviewId);
    const reviewDoc = await reviewRef.get();

    if (!reviewDoc.exists) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const reviewData = reviewDoc.data();

    // Ensure the user owns this review
    if (reviewData.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to update this review" },
        { status: 403 }
      );
    }

    const oldRating = reviewData.rating;

    // Update the review
    await reviewRef.update({
      rating,
      comment,
      updatedAt: new Date(),
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
    const newTotalRating = currentRating * totalReviews - oldRating + rating;
    const newAverageRating = parseFloat(
      (newTotalRating / totalReviews).toFixed(1)
    );

    // Update product with new average rating
    await productRef.update({
      averageRating: newAverageRating,
    });

    // Track the review update
    await trackReviewEvent({
      userId,
      productId,
      action: "update",
      rating,
      oldRating,
      reviewId,
    });

    return NextResponse.json({
      success: true,
      newAverageRating,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}
