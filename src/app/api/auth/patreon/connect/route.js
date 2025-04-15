import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth as adminAuth, adminDb } from "@/firebaseAdmin"; // Import 'auth' and alias if needed, or just 'auth'
import { doc, setDoc } from "firebase/firestore";
import crypto from "crypto"; // Node.js crypto module for state generation
// You might need a way to verify the user session server-side here.
// If using Firebase client-side auth, you might need to send the ID token
// via headers/cookies from the client link click, or use a server session library.
// This example assumes you can somehow get the logged-in user's ID server-side.
// import { verifyUserSession } from '@/lib/server-auth'; // Placeholder for your auth logic

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token"); // Get token from query param
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  console.log("[API /connect] Received request."); // Log request received

  if (!token) {
    console.warn("[API /connect] No token provided in query parameters.");
    return NextResponse.redirect(new URL("/login?error=auth_required", appUrl));
  }

  // *** LOG RECEIVED TOKEN ***
  console.log(
    "[API /connect] Received Token (first/last 15 chars):",
    token.substring(0, 15) + "..." + token.substring(token.length - 15)
  );
  // console.log("[API /connect] Full Token Received (DEBUG ONLY, REMOVE LATER):", token); // Risky, use carefully

  let userId;
  let decodedTokenInfo; // To store decoded info for logging
  try {
    console.log(
      "[API /connect] Attempting to verify ID token with adminAuth..."
    );
    // Verify the ID token passed from the client
    const decodedToken = await adminAuth.verifyIdToken(token, true); // Pass true to check for revocation
    userId = decodedToken.uid;
    decodedTokenInfo = {
      // Store relevant non-sensitive info
      uid: decodedToken.uid,
      email: decodedToken.email,
      issuer: decodedToken.iss,
      audience: decodedToken.aud,
      issuedAt: new Date(decodedToken.iat * 1000).toISOString(),
      expiresAt: new Date(decodedToken.exp * 1000).toISOString(),
      auth_time: new Date(decodedToken.auth_time * 1000).toISOString(),
    };
    console.log(
      "[API /connect] ID Token verified successfully:",
      JSON.stringify(decodedTokenInfo)
    );
  } catch (error) {
    // *** LOG VERIFICATION ERROR DETAILS ***
    console.error(
      "[API /connect] Firebase Admin SDK verifyIdToken Error:",
      error
    );
    console.error("[API /connect] Error Code:", error.code); // Firebase specific error code
    console.error("[API /connect] Error Message:", error.message);

    // Determine redirect reason based on error code
    let errorParam = "invalid_token";
    if (error.code === "auth/id-token-expired") {
      errorParam = "token_expired";
    } else if (error.code === "auth/argument-error") {
      errorParam = "token_malformed"; // Often happens if token is corrupted/truncated
    } else if (error.code === "auth/id-token-revoked") {
      errorParam = "token_revoked";
    }

    // Redirect to login with a more specific error if available
    return NextResponse.redirect(new URL(`/login?error=${errorParam}`, appUrl));
  }

  // **IMPORTANT**: Verify the application user is logged in here before proceeding.
  // const userId = await verifyUserSession(request); // Replace with your actual verification
  // if (!userId) {
  //   return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
  // }

  const clientId = process.env.PATREON_CLIENT_ID;
  const redirectUri = process.env.PATREON_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    console.error(
      "[API /connect] Patreon environment variables missing (CLIENT_ID or REDIRECT_URI)."
    );
    return NextResponse.redirect(new URL("/?error=config_error", appUrl));
  }

  // --- TEST: Request ONLY identity and memberships ---
  const scopes = [
    "identity",
    "identity[email]",
    "identity.memberships",
    "campaigns",
    "campaigns.members",
  ];
  const scopeString = scopes.join(" ");
  console.log("[API /connect] TEST: Requesting scope:", scopeString);
  // --- END TEST ---

  // Generate and store a state parameter for CSRF protection and user linking
  const state = crypto.randomBytes(16).toString("hex");

  // Store the state temporarily, linking it to the user ID.
  // Using a short-lived cookie is simpler than Firestore for this.
  cookies().set(`patreon_state_${state}`, userId, {
    maxAge: 60 * 15, // 15 minutes expiry
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    path: "/api/auth/patreon/callback", // Scope cookie to the callback path
    sameSite: "lax",
  });
  console.log(
    `[API /connect] Stored state cookie for user ${userId} with state ${state}. Redirecting to Patreon...`
  );

  // --- Refactored URL Construction using URLSearchParams ---
  const patreonAuthParams = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri, // No need to encode here, URLSearchParams handles it
    scope: scopeString, // Pass the space-separated string
    state: state,
  });

  const patreonAuthUrl = `https://www.patreon.com/oauth2/authorize?${patreonAuthParams.toString()}`;
  // --- End Refactored URL Construction ---

  console.log("[API /connect] Redirect URL:", patreonAuthUrl); // Log the final URL
  return NextResponse.redirect(patreonAuthUrl);
}
