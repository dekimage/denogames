import { auth, firestore } from "@/firebaseAdmin";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);

export async function POST(req) {
  const authHeader = req.headers.get("authorization"); // Get the Authorization header
  const token = authHeader ? authHeader.split("Bearer ")[1] : null; // Extract the token

  if (!token) {
    return new Response(JSON.stringify({ error: "No token provided" }), {
      status: 401,
    });
  }

  try {
    // Verify the Firebase token to get the user ID
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid; // Extract userId securely

    const { cartItems } = await req.json(); // Parse the cart items from the body

    const lineItems = await Promise.all(
      cartItems.map(async (cartItem) => {
        const { id } = cartItem;
        const productDoc = await firestore.collection("products").doc(id).get();

        if (!productDoc.exists) {
          throw new Error(`Product with ID ${id} not found`);
        }

        const productData = productDoc.data();

        return {
          price_data: {
            currency: "usd",
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

    // Only send product IDs and quantities in metadata to Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      metadata: {
        cartItems: JSON.stringify(
          cartItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          }))
        ),
        userId, // Send the userId in metadata
      },
    });

    return new Response(JSON.stringify({ id: session.id }), { status: 200 });
  } catch (error) {
    console.error("Error verifying token or creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: "Authentication failed or checkout error" }),
      { status: 500 }
    );
  }
}
