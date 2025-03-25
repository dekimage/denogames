import { handleFirstTimeAction } from "./baseHandler";
import { FieldValue } from "firebase-admin/firestore";
import { ALLOWED_CLICK_LABELS } from "../events";

export async function handleGenericClick(eventData, batch, firestore) {
  const clickLabel = eventData.context.clickLabel;

  // Validate click label
  if (!Object.values(ALLOWED_CLICK_LABELS).includes(clickLabel)) {
    throw new Error(`Invalid click label: ${clickLabel}`);
  }

  // Update user analytics for first-time clicks of this label
  if (eventData.isAuthenticated && eventData.context.isFirstTime) {
    await handleFirstTimeAction(batch, eventData.userId, "clicked", clickLabel);
  }

  // Get source from path
  let source = eventData.context.currentPath;
  if (source === "/") source = "home";
  else
    source = source.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "-");

  // Update individual click document
  const clickDocRef = firestore.collection("analytics").doc();
  batch.set(clickDocRef, {
    type: "click",
    label: clickLabel,
    timestamp: new Date(),
    isAuthenticated: eventData.isAuthenticated,
    userId: eventData.userId || null,
    source: source,
  });

  // Update aggregated stats
  const aggregatedStatsRef = firestore.collection("stats").doc("clicks");
  const today = new Date().toISOString().split("T")[0];

  const doc = await aggregatedStatsRef.get();
  if (!doc.exists) {
    batch.set(aggregatedStatsRef, {
      totalClicks: 1,
      clicksByLabel: {
        [clickLabel]: 1,
      },
      clicksByDay: {
        [today]: {
          total: 1,
          [clickLabel]: 1,
        },
      },
      authenticatedClicks: eventData.isAuthenticated ? 1 : 0,
      anonymousClicks: eventData.isAuthenticated ? 0 : 1,
    });
  } else {
    const updates = {
      totalClicks: FieldValue.increment(1),
      [`clicksByLabel.${clickLabel}`]: FieldValue.increment(1),
      [`clicksByDay.${today}.total`]: FieldValue.increment(1),
      [`clicksByDay.${today}.${clickLabel}`]: FieldValue.increment(1),
      [eventData.isAuthenticated ? "authenticatedClicks" : "anonymousClicks"]:
        FieldValue.increment(1),
    };

    batch.update(aggregatedStatsRef, updates);
  }
}
