import { NextResponse } from "next/server";
import { admin, storage } from "@/firebaseAdmin";

export async function GET(request) {
  const url = new URL(request.url);
  const fileUrl = url.searchParams.get("url");

  if (!fileUrl) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    let response;
    let contentType;
    let filename = "download";

    // Handle Firebase Storage gs:// URLs
    if (fileUrl.startsWith("gs://")) {
      console.log("Processing Firebase Storage path:", fileUrl);

      // Get a reference to the file in Firebase Storage
      const bucket = storage.bucket(fileUrl.split("/")[2]);
      const filePath = fileUrl.split("/").slice(3).join("/");

      try {
        // Get file metadata to determine Content-Type
        const [metadata] = await bucket.file(filePath).getMetadata();
        contentType = metadata.contentType;

        // Get the download URL
        const [signedUrl] = await bucket.file(filePath).getSignedUrl({
          action: "read",
          expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        });

        // Extract filename from the path
        filename = filePath.split("/").pop();

        // Fetch the file using the signed URL
        response = await fetch(signedUrl);
      } catch (storageError) {
        console.error("Firebase Storage error:", storageError);
        throw new Error(
          `Failed to access Firebase Storage: ${storageError.message}`
        );
      }
    } else {
      // Handle regular HTTP URLs as before
      response = await fetch(fileUrl);

      // Extract a filename from the URL
      const urlPath = new URL(fileUrl).pathname;
      const pathParts = urlPath.split("/");
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart && !lastPart.includes("?")) {
          filename = decodeURIComponent(lastPart);
        }
      }

      // Try to determine content type from filename extension
      if (filename.endsWith(".pdf")) {
        contentType = "application/pdf";
      } else if (filename.endsWith(".zip")) {
        contentType = "application/zip";
      } else {
        contentType = "application/octet-stream";
      }
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Get the file content
    const fileBuffer = await response.arrayBuffer();

    // Create a response with the file content
    const headers = new Headers();
    headers.set("Content-Type", contentType || "application/octet-stream");
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to download file: " + error.message },
      { status: 500 }
    );
  }
}
