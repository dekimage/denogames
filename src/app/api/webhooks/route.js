import Stripe from "stripe";

import { NextResponse } from "next/server";
import { firestore } from "@/firebaseAdmin";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle Stripe's raw request body
  },
};

export async function POST(req) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature"); // Get Stripe's signature from headers

  let event;

  try {
    // Verify that the event came from Stripe using the webhook secret
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.NEXT_STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the `checkout.session.completed` event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const cartItems = JSON.parse(session.metadata.cartItems);

      // Fetch product details for each cart item
      const enrichedCartItems = await Promise.all(
        cartItems.map(async (item) => {
          const productDoc = await firestore
            .collection("products")
            .doc(item.productId)
            .get();
          const productData = productDoc.data();
          return {
            ...item,
            name: productData.name,
            price: productData.price,
          };
        })
      );

      // Store the order in Firestore
      await firestore.collection("orders").add({
        cartItems: enrichedCartItems,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total / 100, // Stripe sends amount in cents, convert to euros
        stripeSessionId: session.id,
        createdAt: new Date(),
        customerEmail: session.customer_details.email,
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error saving order to Firestore:", error);
      return NextResponse.json(
        { error: "Error saving order" },
        { status: 500 }
      );
    }
  }

  // Acknowledge receipt of the event
  return NextResponse.json({ received: true });
}
