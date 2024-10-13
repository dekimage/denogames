import { firestore } from "@/firebaseAdmin"; // Ensure you are using your Firebase Admin instance

export async function POST(req) {
  try {
    const { email, userId } = await req.json(); // Get email and userId from the request body

    // Find pending orders for the provided email
    const pendingOrdersSnapshot = await firestore
      .collection("orders")
      .where("customerEmail", "==", email)
      .where("isPending", "==", true)
      .get();

    if (!pendingOrdersSnapshot.empty) {
      // Start a batch operation to handle all updates at once
      const batch = firestore.batch();
      let purchasedProductIds = [];

      pendingOrdersSnapshot.forEach((doc) => {
        const orderData = doc.data();
        // Collect product IDs from the order's cartItems to add to user's purchasedProducts
        purchasedProductIds = [
          ...purchasedProductIds,
          ...orderData.cartItems.map((item) => item.id),
        ];

        // Update the order to link it to the user and mark it as not pending
        const orderRef = firestore.collection("orders").doc(doc.id);
        batch.update(orderRef, {
          userId: userId, // Link the order to the user
          isPending: false, // Mark the order as completed
        });
      });

      // Update the user's purchasedProducts array with the product IDs from the order
      const userRef = firestore.collection("users").doc(userId);
      batch.update(userRef, {
        purchasedProducts: firestore.FieldValue.arrayUnion(
          ...purchasedProductIds
        ), // Add products to the purchasedProducts array
      });

      // Commit the batch transaction
      await batch.commit();

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No pending orders found for this email",
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error merging pending orders:", error);
    return new Response(
      JSON.stringify({ error: "Failed to merge pending orders" }),
      { status: 500 }
    );
  }
}
