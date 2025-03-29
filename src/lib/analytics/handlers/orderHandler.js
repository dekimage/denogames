import { firestore } from "@/firebaseAdmin";

export async function trackOrderEvent({
  userId,
  orderId,
  cartItems,
  amountTotal,
  stripeSessionId,
  customerEmail,
}) {
  const batch = firestore.batch();
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // 1. Create analytics event document
  const analyticsRef = firestore.collection("analytics").doc();
  batch.set(analyticsRef, {
    userId,
    action: "order_created",
    timestamp: now,
    context: {
      orderId,
      stripeSessionId,
      customerEmail,
      amountTotal,
      products: cartItems.map((item) => ({
        productId: item.id,
        price: item.price,
      })),
    },
  });

  // 2. Update stats document for orders
  const statsRef = firestore.collection("stats").doc("order_stats");
  const statsDoc = await statsRef.get();
  const currentStats = statsDoc.exists ? statsDoc.data() : {};

  const statsUpdate = {
    // Update daily orders count
    [`ordersByDay.${today}`]: (currentStats?.ordersByDay?.[today] || 0) + 1,
    // Update total revenue per day
    [`revenueByDay.${today}`]:
      (currentStats?.revenueByDay?.[today] || 0) + amountTotal,
    // Update total orders
    totalOrders: (currentStats?.totalOrders || 0) + 1,
    // Update total revenue
    totalRevenue: (currentStats?.totalRevenue || 0) + amountTotal,
  };

  // Update purchase count for each product in the cart
  cartItems.forEach((item) => {
    statsUpdate[`productPurchases.${item.id}`] =
      (currentStats?.productPurchases?.[item.id] || 0) + 1;
  });

  if (statsDoc.exists) {
    batch.update(statsRef, statsUpdate);
  } else {
    batch.set(statsRef, statsUpdate);
  }

  await batch.commit();
}
