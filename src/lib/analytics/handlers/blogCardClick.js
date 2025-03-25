import { handleFirstTimeAction } from "./baseHandler";
import { FieldValue } from "firebase-admin/firestore";

export async function handleBlogCardClick(eventData, batch, firestore) {
  const blogId = eventData.context.blogId;
  const blogStatsRef = firestore.collection("stats").doc(`openBlog_${blogId}`);

  // Update user analytics for first-time opens
  if (eventData.isAuthenticated && eventData.context.isFirstTime) {
    await handleFirstTimeAction(batch, eventData.userId, "openBlogs", blogId);
  }

  // Get source from path
  let source = eventData.context.currentPath;
  if (source === "/") source = "home";
  else
    source = source.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "-");

  // Update stats with blog-specific tracking
  const today = new Date().toISOString().split("T")[0];
  const doc = await blogStatsRef.get();

  if (!doc.exists) {
    batch.set(blogStatsRef, {
      totalOpens: 1,
      uniqueOpens: eventData.context.isFirstTime ? 1 : 0,
      opensBySource: {
        [source]: 1,
      },
      opensByDay: {
        [today]: 1,
      },
      authenticatedOpens: eventData.isAuthenticated ? 1 : 0,
      anonymousOpens: eventData.isAuthenticated ? 0 : 1,
    });
  } else {
    const updates = {
      totalOpens: FieldValue.increment(1),
      [`opensByDay.${today}`]: FieldValue.increment(1),
      [`opensBySource.${source}`]: FieldValue.increment(1),
      [eventData.isAuthenticated ? "authenticatedOpens" : "anonymousOpens"]:
        FieldValue.increment(1),
    };

    if (eventData.context.isFirstTime) {
      updates.uniqueOpens = FieldValue.increment(1);
    }

    batch.update(blogStatsRef, updates);
  }
}
