import { firestore } from "@/firebaseAdmin"; // Use your existing admin instance path

// --- Helper: Refresh Patreon Token ---
// Handles refreshing the token and updating Firestore
export async function refreshPatreonToken(userId, refreshToken) {
  console.log(`[Patreon Helper] Attempting token refresh for user: ${userId}`);
  const clientId = process.env.PATREON_CLIENT_ID;
  const clientSecret = process.env.PATREON_CLIENT_SECRET;

  if (!clientId || !clientSecret || !refreshToken) {
    console.error("[Patreon Helper] Missing credentials or refresh token.");
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
        "[Patreon Helper] Refresh failed:",
        response.status,
        errorBody
      );
      if (response.status === 400 || response.status === 401) {
        console.warn(
          `[Patreon Helper] Refresh token invalid for user ${userId}. Clearing stored token.`
        );
        try {
          const userDocRef = firestore.collection("users").doc(userId);
          await userDocRef.update({
            "patreon.refreshToken": null,
            "patreon.accessToken": null,
            "patreon.status": "disconnected", // Mark as disconnected
            "patreon.tier": null,
          });
        } catch (dbError) {
          console.error(
            `[Patreon Helper] Failed to clear tokens in Firestore for user ${userId}:`,
            dbError
          );
        }
        throw new Error("patreon_reconnect_required");
      }
      throw new Error(`Patreon API Error during refresh: ${response.status}`);
    }

    const newTokens = await response.json();
    console.log("[Patreon Helper] Received new tokens:", {
      ...newTokens,
      access_token: "***",
      refresh_token: "***",
    });

    // --- Update Firestore with NEW tokens ---
    const userDocRef = firestore.collection("users").doc(userId);
    const patreonUpdate = {
      "patreon.accessToken": newTokens.access_token, // ENCRYPT!
      "patreon.tokenExpiresAt": Date.now() + newTokens.expires_in * 1000,
      ...(newTokens.refresh_token && {
        "patreon.refreshToken": newTokens.refresh_token,
      }), // ENCRYPT!
    };
    await userDocRef.update(patreonUpdate);
    console.log(
      `[Patreon Helper] Updated tokens in Firestore for user ${userId}`
    );
    // --- End Update ---

    return newTokens.access_token; // Return the new access token
  } catch (error) {
    console.error(
      `[Patreon Helper] Error refreshing token for user ${userId}:`,
      error
    );
    if (error.message === "patreon_reconnect_required") throw error;
    throw new Error("Failed to refresh Patreon token.");
  }
}

// --- Helper: Get Current Patreon Membership Info ---
// Fetches identity and parses membership status/tier for YOUR campaign
export async function getCurrentMembershipInfo(accessToken) {
  console.log(
    "[Patreon Helper] Fetching identity including memberships, campaign, and related tiers..."
  );
  const campaignId = process.env.PATREON_CAMPAIGN_ID;

  if (!campaignId) {
    console.error(
      "[Patreon Helper] PATREON_CAMPAIGN_ID environment variable is not set!"
    );
    throw new Error("Server configuration error: Campaign ID missing.");
  }

  try {
    const includes = [
      "memberships",
      "memberships.currently_entitled_tiers",
      "memberships.campaign",
    ].join(",");

    const fields = {
      user: "full_name",
      member: "patron_status,last_charge_date,pledge_relationship_start",
      tier: "title,amount_cents",
    };

    const params = new URLSearchParams();
    params.append("include", includes);
    for (const type in fields) {
      if (fields[type]) {
        params.append(`fields[${type}]`, fields[type]);
      }
    }

    const url = `https://www.patreon.com/api/oauth2/v2/identity?${params.toString()}`;
    console.log("[Patreon Helper] Request URL:", url);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        "[Patreon Helper] Fetch failed:",
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
    // console.log('[Patreon Helper] Full included data:', JSON.stringify(identityData.included || [], null, 2));

    // --- Parse Membership ---
    let membershipResult = {
      isPatron: false,
      isFreeMember: false,
      tier: null,
      status: "none", // Default status
      patronStatusString: null, // Raw status from Patreon
      pledgeStartDate: null,
      lastChargeDate: null,
    };

    if (identityData.included) {
      const membership = identityData.included.find(
        (item) =>
          item.type === "member" &&
          item.relationships?.campaign?.data?.id === campaignId
      );

      if (membership) {
        membershipResult.patronStatusString =
          membership.attributes?.patron_status;
        membershipResult.lastChargeDate =
          membership.attributes?.last_charge_date;
        membershipResult.pledgeStartDate =
          membership.attributes?.pledge_relationship_start;

        if (membership.attributes?.patron_status === "active_patron") {
          membershipResult.isPatron = true;
          membershipResult.isFreeMember = false; // Is an active patron
          membershipResult.status = "paid"; // Our simplified status

          const tierId =
            membership.relationships?.currently_entitled_tiers?.data?.[0]?.id;
          if (tierId) {
            const tier = identityData.included.find(
              (item) => item.type === "tier" && item.id === tierId
            );
            if (tier) {
              membershipResult.tier = {
                id: tier.id,
                title: tier.attributes.title,
                amount_cents: tier.attributes.amount_cents,
              };
            }
          }
        } else if (membership.attributes?.patron_status) {
          // Any other status (former_patron, declined_patron, etc.) consider 'free' for simplicity
          membershipResult.isFreeMember = true;
          membershipResult.status = "free"; // Our simplified status
        }
      }
    } else {
      console.log('[Patreon Helper] No "included" data in Patreon response.');
    }

    console.log("[Patreon Helper] Parsed Membership Result:", membershipResult);
    return membershipResult;
  } catch (error) {
    console.error("[Patreon Helper] Error fetching/parsing membership:", error);
    throw new Error(
      error.message || "Failed to fetch Patreon membership details."
    );
  }
}

// --- Refined Helper: Get Membership Status using /identity and Tier check ---
export async function getCampaignMembershipForUser(accessToken, patreonUserId) {
  console.log(
    `[Patreon Helper Refined] Checking membership for user ${patreonUserId} in campaign...`
  );
  const campaignId = process.env.PATREON_CAMPAIGN_ID;

  if (!campaignId) {
    console.error(
      "[Patreon Helper Refined] PATREON_CAMPAIGN_ID environment variable is not set!"
    );
    throw new Error("Server configuration error: Campaign ID missing.");
  }
  if (!patreonUserId) {
    console.error("[Patreon Helper Refined] Patreon User ID is required.");
    throw new Error("Patreon User ID missing.");
  }

  try {
    const identityIncludes =
      "memberships,memberships.currently_entitled_tiers,memberships.campaign";
    const identityFields = {
      user: "full_name", // Keep user fields minimal unless needed
      member: "patron_status,last_charge_date,pledge_relationship_start",
      tier: "title,amount_cents",
    };

    const identityParams = new URLSearchParams();
    identityParams.append("include", identityIncludes);
    for (const type in identityFields) {
      if (identityFields[type]) {
        identityParams.append(`fields[${type}]`, identityFields[type]);
      }
    }
    const identityUrl = `https://www.patreon.com/api/oauth2/v2/identity?${identityParams.toString()}`;
    console.log("[Patreon Helper Refined] Request URL:", identityUrl);

    const response = await fetch(identityUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        "[Patreon Helper Refined] Fetch failed:",
        response.status,
        response.statusText,
        errorBody
      );
      let detail = `Patreon API Error fetching identity/membership: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorBody);
        if (errorJson.errors && errorJson.errors[0]?.detail)
          detail = errorJson.errors[0].detail;
      } catch (e) {}
      throw new Error(detail);
    }

    const identityData = await response.json();
    console.log(
      "[Patreon Helper Refined] Full API Response:",
      JSON.stringify(identityData, null, 2)
    ); // Log full response

    // --- Parse Membership Result ---
    let membershipResult = {
      isPatron: false,
      isFreeMember: false,
      tier: null,
      status: "none",
      patronStatusString: null,
      pledgeStartDate: null,
      lastChargeDate: null,
    };

    if (identityData.included) {
      // Find *any* member object linked to the target campaign ID
      const membership = identityData.included.find(
        (item) =>
          item.type === "member" &&
          item.relationships?.campaign?.data?.id === campaignId
      );

      if (membership) {
        console.log(
          `[Patreon Helper Refined] Found membership record for campaign ${campaignId}:`,
          JSON.stringify(membership, null, 2)
        );
        membershipResult.patronStatusString =
          membership.attributes?.patron_status; // Store raw status
        membershipResult.lastChargeDate =
          membership.attributes?.last_charge_date;
        membershipResult.pledgeStartDate =
          membership.attributes?.pledge_relationship_start;

        // --- Always try to find the associated tier ---
        const tierId =
          membership.relationships?.currently_entitled_tiers?.data?.[0]?.id;
        let foundTier = null;
        if (tierId) {
          foundTier = identityData.included.find(
            (item) => item.type === "tier" && item.id === tierId
          );
          if (foundTier) {
            console.log(
              `[Patreon Helper Refined] Found associated tier ${tierId}:`,
              JSON.stringify(foundTier, null, 2)
            );
            membershipResult.tier = {
              id: foundTier.id,
              title: foundTier.attributes.title,
              amount_cents: foundTier.attributes.amount_cents,
            };
          } else {
            console.warn(
              `[Patreon Helper Refined] Tier ID ${tierId} found in membership, but tier object not found in included data.`
            );
          }
        } else {
          console.log(
            `[Patreon Helper Refined] No currently entitled tier linked to membership ${membership.id}.`
          );
        }

        // --- Determine Status based on patron_status and tier ---
        if (membership.attributes?.patron_status === "active_patron") {
          membershipResult.isPatron = true;
          membershipResult.isFreeMember = false;
          membershipResult.status = "paid";
          // Tier already set above if found
        } else {
          // Not an active patron, check if they have a zero-cost tier (explicitly free)
          if (foundTier && foundTier.attributes.amount_cents === 0) {
            membershipResult.isPatron = false;
            membershipResult.isFreeMember = true; // Explicitly a free tier member
            membershipResult.status = "free";
            console.log(
              `[Patreon Helper Refined] Classified as 'free' based on zero amount tier.`
            );
          } else {
            // They have a membership record, but it's not 'active_patron' AND not linked to a $0 tier.
            // This could be a former patron, declined payment, etc. Classify as 'free' for simplicity for now,
            // but could be refined further if needed (e.g., 'declined', 'former').
            membershipResult.isPatron = false;
            membershipResult.isFreeMember = true; // Treat as connected but non-paying
            membershipResult.status = "free"; // Defaulting non-active, non-$0-tier to 'free'
            console.warn(
              `[Patreon Helper Refined] Membership status is '${membershipResult.patronStatusString}', not linked to a $0 tier. Classifying as 'free'.`
            );
          }
        }
      } else {
        console.log(
          `[Patreon Helper Refined] No membership object found linked to campaign ID: ${campaignId} in included data.`
        );
        // Status remains 'none'
      }
    } else {
      console.log(
        '[Patreon Helper Refined] No "included" data in Patreon response.'
      );
    }

    console.log(
      "[Patreon Helper Refined] Final Parsed Membership Result:",
      membershipResult
    );
    return membershipResult; // Return the structured result
  } catch (error) {
    console.error(
      "[Patreon Helper Refined] Error fetching/parsing membership:",
      error
    );
    // Rethrow to be caught by the API route handler
    throw new Error(
      error.message || "Failed to fetch Patreon membership details."
    );
  }
}

// --- Main Membership Check Handler in API route will use this ---
// export async function GET(request) { ... call getCampaignMembershipForUser ... }

// Make sure getCurrentMembershipInfo is removed or renamed if not used anymore
// export { refreshPatreonToken, getCampaignMembershipForUser }; // Export new helper
