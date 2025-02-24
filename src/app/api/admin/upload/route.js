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

export async function DELETE(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);

    const userDoc = await firestore
      .collection("users")
      .doc(decodedToken.uid)
      .get();
    if (!userDoc.exists || !userDoc.data().isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileUrl } = await request.json();
    console.log("Received fileUrl:", fileUrl);

    if (!fileUrl) {
      return NextResponse.json(
        { error: "No file URL provided" },
        { status: 400 }
      );
    }

    try {
      const bucket = storage.bucket();

      // Get everything between appspot.com/ and ?
      const path = fileUrl.split("appspot.com/")[1].split("?")[0];
      console.log("File path to delete:", path);

      const file = bucket.file(path);
      await file.delete();

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting file:", error);
      return NextResponse.json(
        { error: "Failed to delete file" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in upload delete API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
