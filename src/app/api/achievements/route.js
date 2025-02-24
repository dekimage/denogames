import { NextResponse } from "next/server";
import { auth, firestore } from "@/firebaseAdmin";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);

    const [achievementsSnap, specialRewardsSnap] = await Promise.all([
      firestore.collection("achievements").get(),
      firestore.collection("specialRewards").get(),
    ]);

    const achievements = achievementsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const specialRewards = specialRewardsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ achievements, specialRewards });
  } catch (error) {
    console.error("Error in achievements API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
