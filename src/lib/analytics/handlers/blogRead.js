import { handleFirstTimeAction } from "./baseHandler";
import { FieldValue } from "firebase-admin/firestore";

export async function handleBlogRead(eventData, batch, firestore) {
  const blogId = eventData.context.blogId;
  const blogStatsRef = firestore.collection("stats").doc(`blogRead_${blogId}`);

  // Update user analytics for first-time reads
  if (eventData.isAuthenticated && eventData.context.isFirstTime) {
    await handleFirstTimeAction(batch, eventData.userId, "readBlogs", blogId);
  }

  // Get source from path
  let source = eventData.context.currentPath;
  if (source === "/") source = "home";
  else
    source = source.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "-");

  const today = new Date().toISOString().split("T")[0];
  const doc = await blogStatsRef.get();

  if (!doc.exists) {
    batch.set(blogStatsRef, {
      totalReads: 1,
      uniqueReads: eventData.context.isFirstTime ? 1 : 0,
      readsBySource: {
        [source]: 1,
      },
      readsByDay: {
        [today]: 1,
      },
      authenticatedReads: eventData.isAuthenticated ? 1 : 0,
      anonymousReads: eventData.isAuthenticated ? 0 : 1,
    });
  } else {
    const updates = {
      totalReads: FieldValue.increment(1),
      [`readsByDay.${today}`]: FieldValue.increment(1),
      [`readsBySource.${source}`]: FieldValue.increment(1),
      [eventData.isAuthenticated ? "authenticatedReads" : "anonymousReads"]:
        FieldValue.increment(1),
    };

    if (eventData.context.isFirstTime) {
      updates.uniqueReads = FieldValue.increment(1);
    }

    batch.update(blogStatsRef, updates);
  }
}
