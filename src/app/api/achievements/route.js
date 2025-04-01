import { NextResponse } from "next/server";
import { auth, firestore } from "@/firebaseAdmin";

// Add this line to force dynamic rendering
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    await auth.verifyIdToken(token);

    const achievementsSnap = await firestore.collection("achievements").get();

    const achievements = achievementsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ achievements });
  } catch (error) {
    console.error("Error in achievements API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
