import { firestore } from "@/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { backers } = await request.json();

    if (!Array.isArray(backers)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    const batch = firestore.batch();
    let processed = 0;

    for (const backer of backers) {
      // Check if email exists
      if (!backer.email) {
        console.warn("Skipping backer without email");
        continue;
      }

      const backerId = firestore.collection("backers").doc().id;
      const backerRef = firestore.collection("backers").doc(backerId);

      // Ensure productIds is always an array
      let productIds = backer.productIds;
      if (!Array.isArray(productIds)) {
        if (typeof productIds === "string") {
          // If it's a semicolon-separated string, split it
          productIds = productIds.split(";").map((id) => id.trim());
        } else {
          // Default to empty array
          productIds = [];
        }
      }

      // Handle new backer format
      batch.set(backerRef, {
        // Basic required fields
        email: backer.email,
        productIds: productIds,
        source: backer.source || "kickstarter",
        campaignName: backer.campaignName || "Monster Mixology Campaign",
        uniqueCode:
          backer.uniqueCode ||
          Math.random().toString(36).substring(2, 8).toUpperCase(),
        isClaimed: false,
        createdAt: new Date(),

        // Preserve original data
        originalData: backer.originalData || {},

        // Extract useful fields to top level if they exist
        ...(backer.backerName && { backerName: backer.backerName }),
        ...(backer.backerNumber && { backerNumber: backer.backerNumber }),
        ...(backer.backerUid && { backerUid: backer.backerUid }),
        ...(backer.rewardTitle && { rewardTitle: backer.rewardTitle }),
        ...(backer.pledgeAmount && { pledgeAmount: backer.pledgeAmount }),
      });

      processed++;
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      processed,
      uploaded: processed,
    });
  } catch (error) {
    console.error("Error uploading backers:", error);
    return NextResponse.json(
      { error: "Failed to upload backers: " + error.message },
      { status: 500 }
    );
  }
}
