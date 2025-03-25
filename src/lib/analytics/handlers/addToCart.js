import { FieldValue } from "firebase-admin/firestore";
import { handleFirstTimeAction, updateDailyStats } from "./baseHandler";

export async function handleAddToCart(eventData, batch, firestore) {
  const productId = eventData.context.productId;
  const cartStatsRef = firestore
    .collection("stats")
    .doc(`addedCart_${productId}`);

  // Determine source from path
  let source = eventData.context.currentPath;
  // Clean up the path to be more readable
  if (source === "/") source = "home";
  else
    source = source.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "-");

  // Update user analytics for first-time adds (for authenticated users)
  if (eventData.isAuthenticated && eventData.context.isFirstClick) {
    await handleFirstTimeAction(
      batch,
      eventData.userId,
      "addedToCart",
      productId
    );
  }

  // Update daily stats
  const today = new Date().toISOString().split("T")[0];
  const doc = await cartStatsRef.get();

  if (!doc.exists) {
    batch.set(cartStatsRef, {
      totalAdds: 1,
      addsBySource: {
        [source]: 1,
      },
      addsByDay: {
        [today]: 1,
      },
      revenue: {
        potential: eventData.context.productPrice || 0,
      },
    });
  } else {
    const updates = {
      totalAdds: FieldValue.increment(1),
      [`addsByDay.${today}`]: FieldValue.increment(1),
      [`addsBySource.${source}`]: FieldValue.increment(1),
      "revenue.potential": FieldValue.increment(
        eventData.context.productPrice || 0
      ),
    };
    batch.update(cartStatsRef, updates);
  }
}
