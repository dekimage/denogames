import { NextResponse } from "next/server";
import { auth as adminAuth, firestore } from "@/firebaseAdmin"; // Use correct imports
import { doc, getDoc, updateDoc } from "firebase/firestore";

// --- Helper: Refresh Patreon Token ---
async function refreshPatreonToken(userId, refreshToken) {
  console.log(`[Patreon Refresh] Attempting token refresh for user: ${userId}`);
  const clientId = process.env.PATREON_CLIENT_ID;
  const clientSecret = process.env.PATREON_CLIENT_SECRET;

  if (!clientId || !clientSecret || !refreshToken) {
    console.error("[Patreon Refresh] Missing credentials or refresh token.");
    throw new Error(
      "Missing credentials or refresh token for Patreon refresh."
    );
  }

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);

  try {
    const response = await fetch("https://www.patreon.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        "[Patreon Refresh] Refresh failed:",
        response.status,
        errorBody
      );
      // If refresh fails (e.g., token revoked), we might need to clear stored data
      if (response.status === 400 || response.status === 401) {
        console.warn(
          `[Patreon Refresh] Refresh token invalid for user ${userId}. Clearing stored token.`
        );
        // Optionally clear the bad token from Firestore here
        const userDocRef = firestore.collection("users").doc(userId);
        await userDocRef.update({
          "patreon.refreshToken": null,
          "patreon.accessToken": null,
        }); // Clear tokens
        throw new Error("patreon_reconnect_required"); // Specific error signal
      }
      throw new Error(`Patreon API Error during refresh: ${response.status}`);
    }

    const newTokens = await response.json();
    console.log("[Patreon Refresh] Received new tokens:", {
      ...newTokens,
      access_token: "***",
      refresh_token: "***",
    });

    // --- Update Firestore with NEW tokens ---
    const userDocRef = firestore.collection("users").doc(userId);
    const patreonUpdate = {
      "patreon.accessToken": newTokens.access_token, // ENCRYPT!
      "patreon.tokenExpiresAt": Date.now() + newTokens.expires_in * 1000,
      // Patreon MAY or MAY NOT return a new refresh token
      ...(newTokens.refresh_token && {
        "patreon.refreshToken": newTokens.refresh_token,
      }), // ENCRYPT!
    };
    await userDocRef.update(patreonUpdate);
    console.log(
      `[Patreon Refresh] Updated tokens in Firestore for user ${userId}`
    );
    // --- End Update ---

    return newTokens.access_token; // Return the new access token
  } catch (error) {
    console.error(
      `[Patreon Refresh] Error refreshing token for user ${userId}:`,
      error
    );
    if (error.message === "patreon_reconnect_required") throw error; // Propagate specific error
    throw new Error("Failed to refresh Patreon token."); // Generic error
  }
}

// --- Helper: Get Current Patreon Membership ---
async function getCurrentMembership(accessToken) {
  console.log(
    "[Patreon Membership] Fetching identity including memberships, CAMPAIGN, and related tiers..."
  ); // Added CAMPAIGN to log
  const campaignId = process.env.PATREON_CAMPAIGN_ID;

  if (!campaignId) {
    console.error("PATREON_CAMPAIGN_ID environment variable is not set!");
    throw new Error("Server configuration error: Campaign ID missing.");
  }

  try {
    // --- REVISED includes ---
    const includes = [
      "memberships", // Get membership objects linked to the user
      "memberships.currently_entitled_tiers", // For those memberships, get the tiers
      "memberships.campaign", // *** ADDED: For those memberships, also get the campaign ***
    ].join(",");

    // Fields remain the same - only attributes are listed here
    const fields = {
      user: "full_name",
      member: "patron_status,last_charge_date,pledge_relationship_start",
      tier: "title,amount_cents",
      // 'campaign': '...' // We don't need campaign fields if just checking ID
    };
    // --- END REVISION ---

    const params = new URLSearchParams();
    params.append("include", includes);
    for (const type in fields) {
      if (fields[type]) {
        params.append(`fields[${type}]`, fields[type]);
      }
    }

    const url = `https://www.patreon.com/api/oauth2/v2/identity?${params.toString()}`;
    console.log("[Patreon Membership] Request URL:", url);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        "[Patreon Membership] Fetch failed:",
        response.status,
        response.statusText,
        errorBody
      );
      let detail = `Patreon API Error fetching membership: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorBody);
        if (errorJson.errors && errorJson.errors[0]?.detail)
          detail = errorJson.errors[0].detail;
      } catch (e) {}
      throw new Error(detail);
    }

    const identityData = await response.json();
    console.log(
      "[Patreon Membership] Full included data:",
      JSON.stringify(identityData.included || [], null, 2)
    ); // Keep this log active!

    // --- Find Active Membership and Tier (Logic remains the same) ---
    let membershipResult = {
      isPatron: false,
      isFreeMember: false,
      tier: null,
      status: null,
      lastChargeDate: null,
      startDate: null,
    };

    if (identityData.included) {
      console.log("[Patreon Membership] Processing included data...");
      // Find the member object for YOUR campaign
      const membership = identityData.included.find(
        (item) =>
          item.type === "member" &&
          item.relationships?.campaign?.data?.id === campaignId // THIS CHECK SHOULD NOW WORK
      );

      if (membership) {
        console.log(
          `[Patreon Membership] Found membership object linked to campaign ${campaignId}. Status: ${membership.attributes?.patron_status}`
        );
        membershipResult.status = membership.attributes?.patron_status;
        membershipResult.lastChargeDate =
          membership.attributes?.last_charge_date;
        membershipResult.startDate =
          membership.attributes?.pledge_relationship_start;

        if (membership.attributes?.patron_status === "active_patron") {
          membershipResult.isPatron = true;
          membershipResult.isFreeMember = false;
          const tierId =
            membership.relationships?.currently_entitled_tiers?.data?.[0]?.id;
          if (tierId) {
            // Find tier details within the *same* included array
            const tier = identityData.included.find(
              (item) => item.type === "tier" && item.id === tierId
            );
            if (tier) {
              membershipResult.tier = {
                id: tier.id,
                title: tier.attributes.title,
                amount_cents: tier.attributes.amount_cents,
              };
              console.log(
                "[Patreon Membership] Found active tier:",
                membershipResult.tier
              );
            } else {
              console.warn(
                "[Patreon Membership] Tier object not found in included data for tier ID:",
                tierId
              );
            }
          } else {
            console.warn(
              "[Patreon Membership] Active patron, but no currently entitled tier relationship found for member:",
              membership.id
            );
          }
        } else {
          membershipResult.isFreeMember = true;
          console.log(
            `[Patreon Membership] User has a membership record for campaign ${campaignId} but is not an active patron (status: ${membershipResult.status}).`
          );
        }
      } else {
        console.log(
          "[Patreon Membership] No membership object found linked to campaign ID:",
          campaignId
        );
      }
    } else {
      console.log(
        '[Patreon Membership] No "included" data in Patreon response.'
      );
    }
    return membershipResult;
  } catch (error) {
    console.error(
      "[Patreon Membership] Error fetching/parsing membership:",
      error
    );
    throw new Error(
      error.message || "Failed to fetch Patreon membership details."
    );
  }
}

// --- Main Membership Check Handler ---
export async function GET(request) {
  try {
    // 1. Verify Firebase User Auth
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing token" },
        { status: 401 }
      );
    }
    const token = authHeader.split("Bearer ")[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token, true);
    } catch (error) {
      console.error("Token verification failed:", error.code);
      return NextResponse.json(
        { error: "Unauthorized: Invalid token", code: error.code },
        { status: 401 }
      );
    }
    const userId = decodedToken.uid;
    console.log(`[Patreon Membership Check] Request for user: ${userId}`);

    // 2. Get User's Patreon Data from Firestore
    const userDocRef = firestore.collection("users").doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userData = userDoc.data();
    const patreonData = userData.patreon;

    if (
      !patreonData ||
      !patreonData.accessToken ||
      !patreonData.tokenExpiresAt
    ) {
      console.log(
        `[Patreon Membership Check] User ${userId} has no valid Patreon data stored.`
      );
      return NextResponse.json(
        {
          isPatron: false,
          needsConnect: true,
          error: "Patreon not connected or token missing",
        },
        { status: 200 }
      ); // Or 404? Decide behavior
    }

    let { accessToken, refreshToken, tokenExpiresAt } = patreonData;

    // 3. Check Token Expiry and Refresh if Needed
    if (Date.now() >= tokenExpiresAt) {
      console.log(
        `[Patreon Membership Check] Token expired for user ${userId}. Attempting refresh...`
      );
      if (!refreshToken) {
        console.error(
          `[Patreon Membership Check] Token expired but no refresh token available for user ${userId}.`
        );
        // Clear bad tokens and signal reconnect needed
        await userDocRef.update({
          "patreon.refreshToken": null,
          "patreon.accessToken": null,
        });
        return NextResponse.json(
          {
            isPatron: false,
            needsConnect: true,
            error:
              "Patreon token expired, refresh needed but no token available.",
          },
          { status: 401 }
        ); // Use 401 to signal re-auth maybe
      }
      try {
        accessToken = await refreshPatreonToken(userId, refreshToken); // Update accessToken with the new one
      } catch (error) {
        if (error.message === "patreon_reconnect_required") {
          return NextResponse.json(
            {
              isPatron: false,
              needsConnect: true,
              error: "Patreon connection revoked or invalid.",
            },
            { status: 401 }
          );
        }
        // Other refresh errors
        return NextResponse.json(
          { error: "Failed to refresh Patreon token", details: error.message },
          { status: 500 }
        );
      }
    } else {
      console.log(
        `[Patreon Membership Check] Token is valid for user ${userId}.`
      );
    }

    // 4. Fetch Current Membership Details from Patreon
    const membershipDetails = await getCurrentMembership(accessToken);

    // 5. Return Membership Status
    if (membershipDetails && membershipDetails.status === "active_patron") {
      console.log(
        `[Patreon Membership Check] User ${userId} IS an active patron. Tier:`,
        membershipDetails.tier?.title
      );
      return NextResponse.json({
        isPatron: true,
        needsConnect: false,
        tier: membershipDetails.tier, // Send full tier object
        // Add other relevant details if needed
        // lastChargeDate: membershipDetails.lastChargeDate,
        // startDate: membershipDetails.startDate,
      });
    } else {
      console.log(
        `[Patreon Membership Check] User ${userId} is NOT an active patron for campaign ${process.env.PATREON_CAMPAIGN_ID}.`
      );
      const patreonDataExists = !!userDoc.data().patreon; // Check if they are connected at all
      return NextResponse.json({
        isPatron: false,
        needsConnect: !patreonDataExists, // Only true if never connected
        tier: null,
      });
    }
  } catch (error) {
    console.error(
      "[Patreon Membership Check] General Error in GET handler:",
      error
    );
    return NextResponse.json(
      { error: "Failed to check Patreon membership", details: error.message },
      { status: 500 }
    );
  }
}
