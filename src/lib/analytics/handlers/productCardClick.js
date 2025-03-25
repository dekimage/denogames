import { handleFirstTimeAction } from "./baseHandler";
import { FieldValue } from "firebase-admin/firestore";

export async function handleProductCardClick(eventData, batch, firestore) {
  const productId = eventData.context.productId;
  const productStatsRef = firestore
    .collection("stats")
    .doc(`product_${productId}`);

  // Update user analytics for first-time clicks
  if (eventData.isAuthenticated && eventData.context.isFirstClick) {
    await handleFirstTimeAction(
      batch,
      eventData.userId,
      "clickedProductCards",
      productId
    );
  }

  // Get source from path
  let source = eventData.context.currentPath;
  if (source === "/") source = "home";
  else
    source = source.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "-");

  // Update stats with product-specific tracking
  const today = new Date().toISOString().split("T")[0];
  const doc = await productStatsRef.get();

  if (!doc.exists) {
    batch.set(productStatsRef, {
      totalClicks: 1,
      uniqueClicks: eventData.context.isFirstClick ? 1 : 0,
      clicksBySource: {
        [source]: 1,
      },
      clicksByDay: {
        [today]: 1,
      },
      authenticatedClicks: eventData.isAuthenticated ? 1 : 0,
      anonymousClicks: eventData.isAuthenticated ? 0 : 1,
      productType: eventData.context.productType,
    });
  } else {
    const updates = {
      totalClicks: FieldValue.increment(1),
      [`clicksByDay.${today}`]: FieldValue.increment(1),
      [`clicksBySource.${source}`]: FieldValue.increment(1),
      [eventData.isAuthenticated ? "authenticatedClicks" : "anonymousClicks"]:
        FieldValue.increment(1),
    };

    if (eventData.context.isFirstClick) {
      updates.uniqueClicks = FieldValue.increment(1);
    }

    batch.update(productStatsRef, updates);
  }
}
