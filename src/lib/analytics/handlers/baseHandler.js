import { firestore } from "@/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function handleFirstTimeAction(batch, userId, actionType, itemId) {
  const userRef = firestore.collection("users").doc(userId);
  batch.update(userRef, {
    [`analytics.${actionType}`]: FieldValue.arrayUnion(itemId),
  });
}

export async function updateDailyStats(
  batch,
  statsDocRef,
  isFirstTime = false
) {
  const today = new Date().toISOString().split("T")[0];

  const doc = await statsDocRef.get();
  if (!doc.exists) {
    batch.set(statsDocRef, {
      totalClicks: 1,
      uniqueClicks: isFirstTime ? 1 : 0,
      clicksByDay: {
        [today]: 1,
      },
    });
  } else {
    const updates = {
      totalClicks: FieldValue.increment(1),
      [`clicksByDay.${today}`]: FieldValue.increment(1),
    };
    if (isFirstTime) {
      updates.uniqueClicks = FieldValue.increment(1);
    }
    batch.update(statsDocRef, updates);
  }
}
