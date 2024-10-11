// app/api/checkout-session/route.js

import { firestore } from "@/firebaseAdmin";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);

export async function POST(req) {
  const { cartItems } = await req.json();

  console.log({ cartItems });

  try {
    const lineItems = await Promise.all(
      cartItems.map(async (cartItem) => {
        const { id, quantity } = cartItem;
        const productDoc = await firestore.collection("products").doc(id).get();

        if (!productDoc.exists) {
          throw new Error(`Product with ID ${id} not found`);
        }

        const productData = productDoc.data();

        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: productData.name,
              images: [productData.image],
            },
            unit_amount: Math.round(productData.price * 100), // Price in cents
          },
          quantity: 1,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
      metadata: {
        cartItems: JSON.stringify(
          cartItems.map((item) => ({ id: item.id, quantity: item.quantity }))
        ),
      },
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
