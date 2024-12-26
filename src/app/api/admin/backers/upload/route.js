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
      const backerId = firestore.collection("backers").doc().id;
      const backerRef = firestore.collection("backers").doc(backerId);

      batch.set(backerRef, {
        ...backer,
        createdAt: new Date(),
        source: "kickstarter", // or could be dynamic based on input
        isClaimed: false,
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
      { error: "Failed to upload backers" },
      { status: 500 }
    );
  }
}
