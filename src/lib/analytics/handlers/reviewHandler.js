import { firestore } from "@/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function trackReviewEvent({
  userId,
  productId,
  action, // 'create' or 'update'
  rating,
  oldRating = null,
  reviewId,
}) {
  const batch = firestore.batch();
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // 1. Create analytics event document
  const analyticsRef = firestore.collection("analytics").doc();
  batch.set(analyticsRef, {
    userId,
    action: `review_${action}`,
    timestamp: now,
    context: {
      productId,
      reviewId,
      rating,
      ...(oldRating !== null && { oldRating }),
    },
  });

  // 2. Update stats document for product reviews
  const statsRef = firestore.collection("stats").doc(`reviews_${productId}`);
  const statsDoc = await statsRef.get();
  const currentStats = statsDoc.exists ? statsDoc.data() : {};

  const statsUpdate = {
    [`${action}ByDay.${today}`]:
      (currentStats?.[`${action}ByDay`]?.[today] || 0) + 1,
    [`total${action.charAt(0).toUpperCase() + action.slice(1)}s`]:
      (currentStats?.[
        `total${action.charAt(0).toUpperCase() + action.slice(1)}s`
      ] || 0) + 1,
  };

  if (statsDoc.exists) {
    batch.update(statsRef, statsUpdate);
  } else {
    batch.set(statsRef, statsUpdate);
  }

  // 3. Update user's analytics in their document
  const userRef = firestore.collection("users").doc(userId);
  const userDoc = await userRef.get();
  const userData = userDoc.data();

  // Initialize analytics if it doesn't exist
  const analyticsUpdate = {};

  if (!userData.analytics) {
    analyticsUpdate.analytics = {};
  }

  if (action === "create") {
    // For create, always add to reviewsCreated array
    analyticsUpdate[`analytics.reviewsCreated`] =
      FieldValue.arrayUnion(productId);
  } else if (action === "update") {
    // For update, only add to reviewsUpdated if not already there
    if (!userData.analytics.reviewsUpdated?.includes(productId)) {
      analyticsUpdate[`analytics.reviewsUpdated`] =
        FieldValue.arrayUnion(productId);
    }
  }

  if (Object.keys(analyticsUpdate).length > 0) {
    batch.update(userRef, analyticsUpdate);
  }

  await batch.commit();
}
