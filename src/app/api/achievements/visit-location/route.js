import { auth, firestore } from "@/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { locationId } = await req.json();
    if (!locationId) {
      return NextResponse.json(
        { message: "Location ID is required" },
        { status: 400 }
      );
    }

    // Get user document
    const userRef = firestore.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    // Verify user has discovered this location
    const hasDiscoveredLocation =
      userData.discoveredLocations?.includes(locationId) ||
      userData.achievements?.includes(locationId);

    if (!hasDiscoveredLocation) {
      return NextResponse.json(
        { message: "You haven't discovered this location yet!" },
        { status: 400 }
      );
    }

    // Get location details
    const locationDoc = await firestore
      .collection("achievements")
      .doc(locationId)
      .get();

    if (!locationDoc.exists) {
      return NextResponse.json(
        { message: "Location not found" },
        { status: 404 }
      );
    }

    const location = locationDoc.data();

    // If it has foundItems, fetch their data too
    if (location.foundItems && Array.isArray(location.foundItems)) {
      const itemPromises = location.foundItems.map(async (itemId) => {
        const itemDoc = await firestore
          .collection("achievements")
          .doc(itemId)
          .get();

        if (!itemDoc.exists) return null;

        return {
          id: itemId,
          ...itemDoc.data(),
          collected: userData.achievements?.includes(itemId) || false,
        };
      });

      const foundItems = (await Promise.all(itemPromises)).filter(Boolean);
      location.foundItems = foundItems;
    } else {
      location.foundItems = [];
    }

    // Return the location data
    return NextResponse.json({
      success: true,
      message: "Location loaded",
      location: {
        id: locationId,
        ...location,
      },
    });
  } catch (error) {
    console.error("Error in visit-location route:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
