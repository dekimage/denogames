import { firestore } from "@/firebaseAdmin";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 100;
    const status = searchParams.get("status");
    const productId = searchParams.get("productId");
    const email = searchParams.get("email")?.toLowerCase();
    const source = searchParams.get("source");
    const sortField = searchParams.get("sortField") || "email";
    const sortDirection = searchParams.get("sortDirection") || "asc";

    let query = firestore.collection("backers");

    // Apply filters
    if (status && status !== "all") {
      query = query.where("isClaimed", "==", status === "claimed");
    }

    if (source && source !== "all") {
      query = query.where("source", "==", source);
    }

    if (email) {
      query = query
        .orderBy("email")
        .startAt(email)
        .endAt(email + "\uf8ff");
    }

    // Apply sorting
    if (!email) {
      // Only add this order if not already ordering by email
      if (sortField === "source") {
        query = query.orderBy("source", sortDirection);
      } else if (sortField !== "email") {
        query = query.orderBy(sortField, sortDirection);
      }
    }

    // Get total count
    let totalQuery = query;
    const totalSnapshot = await totalQuery.count().get();
    const total = totalSnapshot.data().count;

    // Get paginated results
    const offset = (page - 1) * limit;
    const backersSnapshot = await query.offset(offset).limit(limit).get();

    let backers = backersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Apply productId filter in memory
    if (productId) {
      backers = backers.filter((backer) => {
        const backerProducts = backer.productIds || [];
        return backerProducts.some((id) =>
          id.toLowerCase().includes(productId.toLowerCase())
        );
      });
    }

    // If sorting by status (isClaimed), sort in memory to handle all cases
    if (sortField === "isClaimed") {
      backers.sort((a, b) => {
        const aValue = a.isClaimed ? 1 : 0;
        const bValue = b.isClaimed ? 1 : 0;
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      });
    }

    return NextResponse.json({
      backers,
      total: productId ? backers.length : total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching backers:", error);
    return NextResponse.json(
      { error: "Failed to fetch backers: " + error.message },
      { status: 500 }
    );
  }
}
