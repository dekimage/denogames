import { NextResponse } from "next/server";
import { auth, firestore } from "@/firebaseAdmin";

export async function GET(request) {
  try {
    // Get the authorization token from the request header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];

    // Verify the token and get the user
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get all reviews for this user
    const reviewsSnapshot = await firestore
      .collection("reviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    // Get all products to map IDs to names
    const productsSnapshot = await firestore.collection("products").get();
    const productsMap = {};
    productsSnapshot.forEach((doc) => {
      productsMap[doc.id] = {
        name: doc.data().name,
        slug: doc.data().slug,
        type: doc.data().type,
      };
    });

    const reviews = reviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      product: productsMap[doc.data().productId] || null,
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString(),
    }));

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
