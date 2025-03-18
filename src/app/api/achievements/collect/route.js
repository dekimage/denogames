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

    const { itemId, locationId } = await req.json();

    if (!itemId || !locationId) {
      return NextResponse.json(
        { message: "Item ID and Location ID are required" },
        { status: 400 }
      );
    }

    // Get user document
    const userRef = firestore.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    // Verify location is discovered
    if (!userData.discoveredLocations?.includes(locationId)) {
      return NextResponse.json(
        { message: "You haven't discovered this location yet!" },
        { status: 400 }
      );
    }

    // Get location document to verify item belongs to it
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
    if (!location.foundItems?.includes(itemId)) {
      return NextResponse.json(
        { message: "This item cannot be collected from this location" },
        { status: 400 }
      );
    }

    // Check if user already has this achievement
    if (userData.achievements?.includes(itemId)) {
      return NextResponse.json(
        { message: "You already have this item!" },
        { status: 400 }
      );
    }

    // Get item details
    const itemDoc = await firestore
      .collection("achievements")
      .doc(itemId)
      .get();

    if (!itemDoc.exists) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    // Add item to user's achievements
    await userRef.update({
      achievements: [...(userData.achievements || []), itemId],
    });

    // Return success with item data and updated user achievements
    return NextResponse.json({
      success: true,
      message: "Item collected successfully!",
      item: {
        id: itemId,
        ...itemDoc.data(),
      },
      userAchievements: [...(userData.achievements || []), itemId],
    });
  } catch (error) {
    console.error("Error in collect route:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
