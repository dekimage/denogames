import { NextResponse } from "next/server";
import { firestore } from "@/firebaseAdmin";

export async function GET(request) {
  try {
    // Get products from Firestore
    const productsSnapshot = await firestore.collection("products").get();

    // Process products to sanitize sensitive data and filter drafts
    const products = productsSnapshot.docs
      .map((doc) => {
        const data = doc.data();

        // Skip draft products
        if (data.isDraft === true) {
          return null;
        }

        // Deep clone the product data to avoid modifying the original
        const sanitizedProduct = { ...data, id: doc.id };

        // Remove sensitive fileUrls from providedComponents
        if (
          sanitizedProduct.providedComponents &&
          Array.isArray(sanitizedProduct.providedComponents)
        ) {
          sanitizedProduct.providedComponents =
            sanitizedProduct.providedComponents.map((component) => {
              const componentCopy = { ...component };
              // Remove the fileUrl property if it exists
              if (componentCopy.fileUrl) {
                delete componentCopy.fileUrl;
              }
              return componentCopy;
            });
        }

        return sanitizedProduct;
      })
      .filter(Boolean); // Remove null entries (drafts)

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
