import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth as adminAuth, firestore } from "@/firebaseAdmin";

// Helper function to exchange code for tokens
async function getPatreonTokens(code) {
  const clientId = process.env.PATREON_CLIENT_ID;
  const clientSecret = process.env.PATREON_CLIENT_SECRET;
  const redirectUri = process.env.PATREON_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Patreon environment variables missing for token exchange");
  }

  const params = new URLSearchParams();
  params.append("code", code);
  params.append("grant_type", "authorization_code");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("redirect_uri", redirectUri);

  try {
    const response = await fetch("https://www.patreon.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        "Patreon token exchange failed:",
        response.status,
        errorBody
      );
      throw new Error(`Patreon API Error: ${response.status}`);
    }

    const tokens = await response.json();
    console.log("Received Patreon tokens:", tokens);
    return tokens; // { access_token, refresh_token, expires_in, scope, token_type }
  } catch (error) {
    console.error("Error fetching Patreon tokens:", error);
    throw error;
  }
}

// Helper function to get Patreon user identity
async function getPatreonIdentity(accessToken) {
  try {
    // Request identity and ensure memberships are included
    const fieldsUser = "email,full_name,image_url,url"; // Fields for the user object
    const includes = "memberships"; // Crucial to get membership data

    const url = `https://www.patreon.com/api/oauth2/v2/identity?include=${includes}&fields%5Buser%5D=${encodeURIComponent(fieldsUser)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        "Patreon identity fetch failed:",
        response.status,
        errorBody
      );
      throw new Error(
        `Patreon API Error fetching identity: ${response.status}`
      );
    }

    const identityData = await response.json();
    console.log(
      "Received Patreon identity:",
      JSON.stringify(identityData, null, 2)
    );
    // The user's Patreon ID is in identityData.data.id
    return identityData.data; // { id, attributes: { ... }, relationships: { ... } } included will contain memberships if applicable
  } catch (error) {
    console.error("Error fetching Patreon identity:", error);
    throw error;
  }
}

// --- Main Callback Handler ---
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const stateReceived = searchParams.get("state"); // Get state received from Patreon

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"; // Fallback needed

  // --- Validate State and Get User ID ---
  let firebaseUserId;
  if (!stateReceived) {
    console.error("No state parameter received from Patreon callback");
    return NextResponse.redirect(new URL("/?error=invalid_state", appUrl));
  }

  // Retrieve the user ID stored in the state cookie
  const stateCookieName = `patreon_state_${stateReceived}`;
  const userIdFromCookie = cookies().get(stateCookieName)?.value;

  // Immediately delete the state cookie to prevent reuse
  cookies().delete(stateCookieName);

  if (!userIdFromCookie) {
    console.error(
      `Invalid or expired state received. Cookie ${stateCookieName} not found.`
    );
    return NextResponse.redirect(new URL("/?error=invalid_state", appUrl));
  }

  firebaseUserId = userIdFromCookie;
  console.log("Retrieved Firebase User ID from state cookie:", firebaseUserId);
  // --- End State Validation ---

  if (!code) {
    console.error(
      "No authorization code received from Patreon in URL searchParams"
    );
    return NextResponse.redirect(
      new URL("/?error=patreon_auth_failed&reason=no_code", appUrl)
    );
  }

  // Ensure we actually have a user ID before proceeding
  if (!firebaseUserId) {
    console.error(
      "Critical Error: firebaseUserId is missing after state validation."
    );
    return NextResponse.redirect(
      new URL("/?error=internal_error&reason=no_userid", appUrl)
    );
  }

  try {
    console.log("[Callback] Attempting Patreon token exchange...");
    const tokens = await getPatreonTokens(code);
    const { access_token, refresh_token, expires_in } = tokens;
    if (!access_token)
      throw new Error("Failed to obtain Patreon access token.");
    console.log("[Callback] Patreon token exchange successful.");

    console.log("[Callback] Attempting to fetch Patreon identity...");
    const patreonUser = await getPatreonIdentity(access_token);
    const patreonUserId = patreonUser.id;
    const patreonEmail = patreonUser.attributes.email;
    const patreonName = patreonUser.attributes.full_name;
    if (!patreonUserId) throw new Error("Failed to obtain Patreon User ID.");
    console.log(
      "[Callback] Patreon identity fetch successful. Patreon User ID:",
      patreonUserId
    );

    // --- CHANGE FIRESTORE INTERACTION ---
    console.log(
      "[Callback] Preparing to update Firestore using Admin SDK methods."
    );
    console.log("[Callback] Firebase User ID:", firebaseUserId);
    console.log(
      "[Callback] Using 'firestore' instance from admin SDK:",
      !!firestore
    ); // Verify it exists

    if (!firestore) {
      throw new Error("Firestore Admin instance is not available.");
    }

    // Use the .doc() method directly on the admin firestore instance
    const userDocRef = firestore.collection("users").doc(firebaseUserId);
    console.log(
      "[Callback] Successfully created Firestore doc reference using firestore.collection().doc()."
    );

    const patreonData = {
      id: patreonUserId,
      email: patreonEmail || null,
      name: patreonName || null,
      accessToken: access_token, // ENCRYPT!
      refreshToken: refresh_token || null, // ENCRYPT!
      tokenExpiresAt: Date.now() + expires_in * 1000,
      scope: tokens.scope,
    };

    console.log(
      `[Callback] Attempting Firestore update for user: ${firebaseUserId}`
    );
    // Use the .update() method directly on the DocumentReference
    await userDocRef.update({ patreon: patreonData });
    console.log(
      `[Callback] Successfully updated Firestore for user: ${firebaseUserId}`
    );
    // --- END CHANGE ---

    // 4. Redirect back to the frontend
    console.log(
      "[Callback] Redirecting to success page:",
      `/account?patreon_connected=true`
    );
    return NextResponse.redirect(
      new URL("/account?patreon_connected=true", appUrl)
    );
  } catch (error) {
    console.error("[Callback] Error during callback processing:", error);
    // Log specific Firestore errors if possible
    if (error.code && error.code.startsWith("firestore/")) {
      console.error("Firestore specific error:", error.code, error.message);
      return NextResponse.redirect(
        new URL(
          `/?error=patreon_link_failed&reason=firestore_${error.code}`,
          appUrl
        )
      );
    } else if (error.message.includes("Firestore Admin instance")) {
      return NextResponse.redirect(
        new URL("/?error=patreon_link_failed&reason=firestore_init", appUrl)
      );
    }
    // Generic fallback
    return NextResponse.redirect(
      new URL("/?error=patreon_link_failed&reason=unknown", appUrl)
    );
  }
}
