import Stripe from "stripe";
import { NextResponse } from "next/server";
import { firestore, admin } from "@/firebaseAdmin"; // Ensure you import admin to access Firestore utilities

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle Stripe's raw request body
  },
};

export async function POST(req) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.NEXT_STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId; // Extract userId from metadata

    try {
      const cartItems = JSON.parse(session.metadata.cartItems); // Only product IDs and quantities

      // Use a Firestore transaction to ensure atomic updates
      await firestore.runTransaction(async (transaction) => {
        // Fetch the product prices for reference
        const productPrices = await Promise.all(
          cartItems.map(async (item) => {
            const productDoc = await transaction.get(
              firestore.collection("products").doc(item.id)
            );
            const productData = productDoc.data();
            return {
              id: item.id,
              price: productData.price, // Store the price at the time of purchase
            };
          })
        );

        // Store the order in Firestore inside the transaction
        transaction.set(firestore.collection("orders").doc(), {
          userId, // Add userId for easier querying
          cartItems: productPrices.map((item) => ({
            id: item.id,
            price: item.price, // Only store product ID and price
          })),
          paymentStatus: session.payment_status,
          amountTotal: session.amount_total / 100, // Stripe sends amount in cents, convert to dollars
          stripeSessionId: session.id,
          createdAt: new Date(),
          customerEmail: session.customer_details.email,
        });

        // Add product IDs to the user's purchasedProducts array inside the transaction
        transaction.update(firestore.collection("users").doc(userId), {
          purchasedProducts: admin.firestore.FieldValue.arrayUnion(
            ...cartItems.map((item) => item.id) // Add the product IDs to the user's array
          ),
        });

        // Clear the user's cart inside the transaction
        transaction.update(firestore.collection("carts").doc(userId), {
          items: [], // Clear the cart by setting the items array to empty
        });
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error saving order to Firestore:", error.message);
      return NextResponse.json(
        { error: "Error saving order" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
