import { NextResponse } from "next/server";
import { auth, firestore, storage } from "@/firebaseAdmin";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);

    // Check if user is admin
    const userDoc = await firestore
      .collection("users")
      .doc(decodedToken.uid)
      .get();
    if (!userDoc.exists || !userDoc.data().isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");
    const filename = formData.get("filename");

    if (!file || !folder || !filename) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const defaultBucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
    const fileRef = defaultBucket.file(`${folder}/${filename}`);

    await fileRef.save(Buffer.from(buffer), {
      metadata: {
        contentType: file.type,
      },
    });

    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-01-2500", // Far future expiration
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error in upload API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
