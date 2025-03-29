import { firestore } from "@/firebaseAdmin";
import { SERVER_EVENTS } from "@/lib/analytics/events";

export async function trackFreeProductClaim({ userId, productIds }) {
  const batch = firestore.batch();
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // 1. Create analytics event document
  const analyticsRef = firestore.collection("analytics").doc();
  batch.set(analyticsRef, {
    userId,
    action: SERVER_EVENTS.FREE_PRODUCT_CLAIMED,
    timestamp: now,
    context: {
      productIds,
      count: productIds.length,
    },
  });

  // 2. Update stats document for free checkouts
  const statsRef = firestore.collection("stats").doc("free_checkouts");
  const statsDoc = await statsRef.get();
  const currentStats = statsDoc.exists ? statsDoc.data() : {};

  // Initialize the base structure if it doesn't exist
  const statsUpdate = {
    checkoutsByDay: {
      [today]: (currentStats?.checkoutsByDay?.[today] || 0) + 1,
    },
    checkoutsByProduct: {},
    totalFreeCheckouts: (currentStats?.totalFreeCheckouts || 0) + 1,
    productCheckouts: (currentStats?.productCheckouts || 0) + productIds.length,
  };

  // Update per-product stats
  productIds.forEach((productId) => {
    statsUpdate.checkoutsByProduct[productId] = {
      ...(currentStats?.checkoutsByProduct?.[productId] || {}),
      total: (currentStats?.checkoutsByProduct?.[productId]?.total || 0) + 1,
      byDay: {
        ...(currentStats?.checkoutsByProduct?.[productId]?.byDay || {}),
        [today]:
          (currentStats?.checkoutsByProduct?.[productId]?.byDay?.[today] || 0) +
          1,
      },
    };
  });

  if (statsDoc.exists) {
    batch.update(statsRef, statsUpdate);
  } else {
    batch.set(statsRef, statsUpdate);
  }

  await batch.commit();
}
