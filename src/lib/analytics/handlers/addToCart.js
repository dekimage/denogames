import { handleFirstTimeAction } from "./baseHandler";
import { FieldValue } from "firebase-admin/firestore";

export async function handleAddToCart(eventData, batch, firestore) {
  const productId = eventData.context.productId;
  const cartStatsRef = firestore
    .collection("stats")
    .doc(`addedCart_${productId}`);

  // Update user analytics for first-time adds
  if (eventData.isAuthenticated && eventData.context.isFirstClick) {
    await handleFirstTimeAction(
      batch,
      eventData.userId,
      "addedToCart",
      productId
    );
  }

  // Get source from path
  let source = eventData.context.currentPath;
  if (source === "/") source = "home";
  else
    source = source.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "-");

  // Update stats with proper casing
  const today = new Date().toISOString().split("T")[0];
  const doc = await cartStatsRef.get();

  if (!doc.exists) {
    batch.set(cartStatsRef, {
      totalAdds: 1,
      uniqueAdds: eventData.context.isFirstClick ? 1 : 0,
      addsBySource: {
        [source]: 1,
      },
      addsByDay: {
        [today]: 1,
      },
      authenticatedAdds: eventData.isAuthenticated ? 1 : 0,
      anonymousAdds: eventData.isAuthenticated ? 0 : 1,
      valueTotal: eventData.context.productPrice || 0,
    });
  } else {
    const updates = {
      totalAdds: FieldValue.increment(1),
      [`addsByDay.${today}`]: FieldValue.increment(1),
      [`addsBySource.${source}`]: FieldValue.increment(1),
      [eventData.isAuthenticated ? "authenticatedAdds" : "anonymousAdds"]:
        FieldValue.increment(1),
      valueTotal: FieldValue.increment(eventData.context.productPrice || 0),
    };

    if (eventData.context.isFirstClick) {
      updates.uniqueAdds = FieldValue.increment(1);
    }

    batch.update(cartStatsRef, updates);
  }
}
