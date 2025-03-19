import { NextResponse } from "next/server";
import { auth, firestore, storage } from "@/firebaseAdmin";

// POST handler for image upload
export async function POST(req) {
  try {
    // Get multipart form data
    const formData = await req.formData();
    const image = formData.get("image");
    const userId = formData.get("userId");

    // Validate authorization
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);

    // Verify user can only modify their own profile
    if (decodedToken.uid !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: You can only modify your own profile" },
        { status: 403 }
      );
    }

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert the image to buffer
    const buffer = Buffer.from(await image.arrayBuffer());

    // Define the storage path
    const imageName = `${userId}_profile`;
    const bucket = storage.bucket();
    const file = bucket.file(`users/profile/${imageName}`);

    // Check if old image exists and delete it (overwrite)
    try {
      const [exists] = await file.exists();
      if (exists) {
        await file.delete();
      }
    } catch (error) {
      console.error("Error checking/deleting existing file:", error);
      // Continue with upload even if delete fails
    }

    // Upload the new image
    await file.save(buffer, {
      metadata: {
        contentType: image.type,
      },
    });

    // Make the file publicly accessible
    await file.makePublic();

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

    // Update user document in Firestore
    await firestore.collection("users").doc(userId).update({
      avatarImg: publicUrl,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      message: "Profile image uploaded successfully",
      imageUrl: publicUrl,
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE handler for removing profile image
export async function DELETE(req) {
  try {
    // Get request body
    const body = await req.json();
    const { userId } = body;

    // Validate authorization
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);

    // Verify user can only modify their own profile
    if (decodedToken.uid !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: You can only modify your own profile" },
        { status: 403 }
      );
    }

    // Define the storage path
    const imageName = `${userId}_profile`;
    const bucket = storage.bucket();
    const file = bucket.file(`users/profile/${imageName}`);

    // Check if image exists
    const [exists] = await file.exists();

    if (!exists) {
      return NextResponse.json(
        { error: "No profile image found" },
        { status: 404 }
      );
    }

    // Delete the image
    await file.delete();

    // Update user document in Firestore
    await firestore.collection("users").doc(userId).update({
      avatarImg: null,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      message: "Profile image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting profile image:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
