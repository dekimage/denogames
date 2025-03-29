import { firestore } from "@/firebaseAdmin";

export async function updateAuthStats({
  action, // 'login', 'signup', 'logout'
  method, // 'email', 'google'
  success,
  userId,
  errorCode = null,
}) {
  const batch = firestore.batch();
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // Get the stats document
  const statsRef = firestore.collection("stats").doc("auth_stats");
  const statsDoc = await statsRef.get();
  const currentStats = statsDoc.exists ? statsDoc.data() : {};

  const statsUpdate = {
    [`${action}ByDay.${today}`]:
      (currentStats?.[`${action}ByDay`]?.[today] || 0) + 1,
    [`total${action.charAt(0).toUpperCase() + action.slice(1)}s`]:
      (currentStats?.[
        `total${action.charAt(0).toUpperCase() + action.slice(1)}s`
      ] || 0) + 1,
  };

  // Track method-specific stats for login/signup
  if (action === "login" || action === "signup") {
    statsUpdate[`${action}ByMethod.${method}`] =
      (currentStats?.[`${action}ByMethod`]?.[method] || 0) + 1;
  }

  // Track success/failure stats
  if (success) {
    statsUpdate[
      `successful${action.charAt(0).toUpperCase() + action.slice(1)}s`
    ] =
      (currentStats?.[
        `successful${action.charAt(0).toUpperCase() + action.slice(1)}s`
      ] || 0) + 1;
  } else {
    statsUpdate[`failed${action.charAt(0).toUpperCase() + action.slice(1)}s`] =
      (currentStats?.[
        `failed${action.charAt(0).toUpperCase() + action.slice(1)}s`
      ] || 0) + 1;

    // Track error types
    if (errorCode) {
      statsUpdate[`${action}ErrorTypes.${errorCode}`] =
        (currentStats?.[`${action}ErrorTypes`]?.[errorCode] || 0) + 1;
    }
  }

  // Update or create the stats document
  if (statsDoc.exists) {
    batch.update(statsRef, statsUpdate);
  } else {
    batch.set(statsRef, statsUpdate);
  }

  // Also update user-specific stats if we have a userId
  if (userId) {
    const userStatsRef = firestore.collection("stats").doc(`user_${userId}`);
    const userStatsDoc = await userStatsRef.get();
    const currentUserStats = userStatsDoc.exists ? userStatsDoc.data() : {};

    const userStatsUpdate = {
      [`${action}History`]: firestore.FieldValue.arrayUnion({
        timestamp: now.toISOString(),
        method,
        success,
        ...(errorCode && { errorCode }),
      }),
      [`last${action.charAt(0).toUpperCase() + action.slice(1)}`]:
        now.toISOString(),
      [`total${action.charAt(0).toUpperCase() + action.slice(1)}s`]:
        (currentUserStats?.[
          `total${action.charAt(0).toUpperCase() + action.slice(1)}s`
        ] || 0) + 1,
    };

    if (userStatsDoc.exists) {
      batch.update(userStatsRef, userStatsUpdate);
    } else {
      batch.set(userStatsRef, userStatsUpdate);
    }
  }

  await batch.commit();
}
