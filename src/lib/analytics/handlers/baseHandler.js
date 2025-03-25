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
  {
    isFirstTime = false,
    isAuthenticated = false,
    value = null,
    source = null,
    type = "Clicks", // Capitalize first letter: 'Clicks', 'Adds', 'Checkouts', etc.
  } = {}
) {
  const today = new Date().toISOString().split("T")[0];
  const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1); // Ensure capitalization

  const doc = await statsDocRef.get();
  if (!doc.exists) {
    batch.set(statsDocRef, {
      [`total${typeCapitalized}`]: 1,
      [`unique${typeCapitalized}`]: isFirstTime ? 1 : 0,
      [`${type}ByDay`]: {
        [today]: 1,
      },
      ...(source && {
        [`${type}BySource`]: {
          [source]: 1,
        },
      }),
      ...(value !== null && {
        valueTotal: value,
      }),
      ...(isAuthenticated !== undefined && {
        authenticatedActions: isAuthenticated ? 1 : 0,
        anonymousActions: isAuthenticated ? 0 : 1,
      }),
    });
  } else {
    const updates = {
      [`total${typeCapitalized}`]: FieldValue.increment(1),
      [`${type}ByDay.${today}`]: FieldValue.increment(1),
    };

    if (isFirstTime) {
      updates[`unique${typeCapitalized}`] = FieldValue.increment(1);
    }

    if (source) {
      updates[`${type}BySource.${source}`] = FieldValue.increment(1);
    }

    if (value !== null) {
      updates.valueTotal = FieldValue.increment(value);
    }

    if (isAuthenticated !== undefined) {
      updates[isAuthenticated ? "authenticatedActions" : "anonymousActions"] =
        FieldValue.increment(1);
    }

    batch.update(statsDocRef, updates);
  }
}
