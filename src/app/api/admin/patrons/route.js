import { NextResponse } from "next/server";
import { firestore, auth } from "@/firebaseAdmin"; // Assuming admin is your initialized admin.auth()

// Helper to verify Firebase ID token
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

export async function GET(request) {
  console.log("[API Admin Patrons GET] Received request");
  try {
    // --- 1. Verify Admin using Firebase Token ---
    const adminUser = await verifyFirebaseAdmin(request);
    console.log(
      `[API Admin Patrons GET] Admin verified: ${adminUser.email} (UID: ${adminUser.uid})`
    );

    // --- 2. Fetch users with Patreon data ---
    console.log(
      "[API Admin Patrons GET] Fetching users with Patreon data (simplified query)..."
    );
    const usersSnapshot = await firestore
      .collection("users")
      .where("patreon.id", "!=", null)
      .get();

    if (usersSnapshot.empty) {
      console.log("[API Admin Patrons GET] No users with Patreon data found.");
      return NextResponse.json({ patrons: [] });
    }

    // --- 3. Map data for client-side display (exclude sensitive tokens) ---
    const patrons = usersSnapshot.docs.map((doc) => {
      const data = doc.data();
      const patreonData = data.patreon || {};
      const displayName =
        patreonData.name || data.displayName || data.email || "N/A";
      const displayEmail = patreonData.email || data.email || "N/A";
      return {
        userId: doc.id, // Firebase User ID
        patreonId: patreonData.id,
        name: displayName,
        email: displayEmail,
        status: patreonData.status || "unknown",
        tier: patreonData.tier || null, // Include tier info
        patronStatusString: patreonData.patronStatusString, // Raw status from Patreon
        pledgeStartDate: patreonData.pledgeStartDate || null,
        lastChecked: patreonData.lastChecked || null,
      };
    });

    console.log(
      `[API Admin Patrons GET] Found ${patrons.length} patrons (unsorted from server).`
    );
    return NextResponse.json({ patrons });
  } catch (error) {
    console.error("[API Admin Patrons GET] Error:", error.message);
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
        error: "Internal server error fetching patrons.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
