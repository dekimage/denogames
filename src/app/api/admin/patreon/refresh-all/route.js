import { NextResponse } from "next/server";
import { firestore, auth } from "@/firebaseAdmin"; // Ensure auth is imported
import {
  getCampaignMembershipForUser,
  refreshPatreonToken,
} from "@/lib/patreonHelper";

// --- COPY THIS HELPER from the patrons/route.js ---
async function verifyFirebaseAdmin(request) {
  const authorization = request.headers.get("Authorization");
  if (authorization?.startsWith("Bearer ")) {
    const idToken = authorization.split("Bearer ")[1];
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      return decodedToken; // Contains user UID, email etc.
    } catch (error) {
      console.error("Error verifying Firebase ID token:", error);
      if (error.code === "auth/id-token-expired") {
        throw new Error("Authentication token expired.");
      } else if (error.code === "auth/argument-error") {
        throw new Error("Invalid authentication token provided.");
      }
      throw new Error("Invalid authentication token.");
    }
  }
  throw new Error("Authorization header missing or invalid.");
}
// --- END HELPER ---

export async function POST(request) {
  console.log("[API Admin Refresh POST] Received request");

  let updatedCount = 0;
  let failedCount = 0;
  const failedUsers = [];

  try {
    // --- 1. Verify Admin using Firebase Token ---
    const adminUser = await verifyFirebaseAdmin(request);
    console.log(
      `[API Admin Refresh POST] Admin verified: ${adminUser.email} (UID: ${adminUser.uid})`
    );

    // --- 2. Fetch all users with Patreon data ---
    console.log(
      "[API Admin Refresh POST] Fetching users with Patreon data from Firestore..."
    );
    const usersSnapshot = await firestore
      .collection("users")
      .where("patreon.id", "!=", null) // Query for users where patreon.id exists
      .get();

    if (usersSnapshot.empty) {
      console.log("[API Admin Refresh POST] No users with Patreon data found.");
      return NextResponse.json(
        {
          message: "No Patreon users found to refresh.",
          updatedCount: 0,
          failedCount: 0,
        },
        { status: 200 }
      );
    }

    console.log(
      `[API Admin Refresh POST] Found ${usersSnapshot.size} users with Patreon data.`
    );
    const promises = [];

    usersSnapshot.forEach((doc) => {
      const userId = doc.id;
      const userData = doc.data();
      const patreonData = userData.patreon;

      if (
        !patreonData ||
        !patreonData.id ||
        !patreonData.accessToken ||
        !patreonData.refreshToken
      ) {
        console.warn(
          `[API Admin Refresh POST] Skipping user ${userId} due to missing Patreon data (id, accessToken, or refreshToken).`
        );
        failedCount++;
        failedUsers.push({
          userId: userId,
          name: userData.displayName || userData.email || userId,
          error: "Missing critical Patreon data in Firestore.",
        });
        return; // Skip this user
      }

      promises.push(
        (async () => {
          console.log(`[API Admin Refresh POST] Processing user: ${userId}`);
          // Placeholder: Needs decryption
          let currentAccessToken = patreonData.accessToken;
          let currentRefreshToken = patreonData.refreshToken;
          let tokensRefreshed = false;

          try {
            const now = Date.now();
            if (
              !patreonData.tokenExpiresAt ||
              patreonData.tokenExpiresAt < now + 3600 * 1000
            ) {
              console.log(
                `[API Admin Refresh POST] Token for user ${userId} needs refresh. Refreshing...`
              );
              // Ensure refreshPatreonToken handles decryption of input refresh token
              // and encryption of output tokens before saving
              const newTokens = await refreshPatreonToken(
                userId,
                currentRefreshToken
              );
              currentAccessToken = newTokens.accessToken; // This should be the decrypted token for immediate use
              tokensRefreshed = true;
              console.log(
                `[API Admin Refresh POST] Token refreshed successfully for user ${userId}.`
              );
            }

            console.log(
              `[API Admin Refresh POST] Fetching membership status for user ${userId} (Patreon ID: ${patreonData.id})...`
            );
            const membershipDetails = await getCampaignMembershipForUser(
              currentAccessToken,
              patreonData.id
            );
            console.log(
              `[API Admin Refresh POST] Membership status received for ${userId}:`,
              membershipDetails
            );

            // Prepare update data - DO NOT include tokens unless refreshed AND encrypted by helper
            const updateData = {
              "patreon.status": membershipDetails.status,
              "patreon.tier": membershipDetails.tier,
              "patreon.patronStatusString":
                membershipDetails.patronStatusString,
              "patreon.pledgeStartDate": membershipDetails.pledgeStartDate,
              "patreon.lastChecked": new Date().toISOString(),
            };
            console.log(
              `[API Admin Refresh POST] Preparing Firestore update for ${userId}:`,
              updateData
            );
            await firestore.collection("users").doc(userId).update(updateData);
            console.log(
              `[API Admin Refresh POST] Firestore updated successfully for user ${userId}.`
            );
            updatedCount++;
          } catch (error) {
            console.error(
              `[API Admin Refresh POST] Failed to process user ${userId}:`,
              error.message
            );
            failedCount++;
            failedUsers.push({
              userId: userId,
              name:
                patreonData.name ||
                userData.displayName ||
                userData.email ||
                userId,
              error: error.message,
            });
          }
        })()
      );
    });

    await Promise.allSettled(promises);

    console.log(
      `[API Admin Refresh POST] Processing complete. Updated: ${updatedCount}, Failed: ${failedCount}`
    );
    return NextResponse.json(
      {
        message: `Patreon status refresh complete. Updated: ${updatedCount}, Failed: ${failedCount}`,
        updatedCount,
        failedCount,
        failures: failedUsers, // Return details about failures
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API Admin Refresh POST] Error:", error.message);
    if (
      error.message.includes("Authorization") ||
      error.message.includes("authentication")
    ) {
      return NextResponse.json(
        { error: "Unauthorized: " + error.message },
        { status: 401 }
      );
    }
    if (error.message.includes("token expired")) {
      return NextResponse.json(
        { error: "Unauthorized: Token expired." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      {
        error: "Internal server error during refresh.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
