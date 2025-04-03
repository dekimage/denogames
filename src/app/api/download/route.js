import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const fileUrl = url.searchParams.get("url");

  if (!fileUrl) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    // Fetch the file from Firebase Storage
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Get the file content
    const fileBuffer = await response.arrayBuffer();

    // Extract a filename from the URL
    let filename = "download.pdf";
    const urlPath = new URL(fileUrl).pathname;
    const pathParts = urlPath.split("/");
    if (pathParts.length > 0) {
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart && !lastPart.includes("?")) {
        filename = decodeURIComponent(lastPart);
      }
    }

    // Create a response with the file content
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}
