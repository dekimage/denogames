import Stripe from "stripe";
import { NextResponse } from "next/server";
import { firestore, admin } from "@/firebaseAdmin"; // Ensure you import admin to access Firestore utilities
import { trackOrderEvent } from "@/lib/analytics/handlers/orderHandler";
import { sendEmail } from "@/lib/helpers/emailHelper";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);

// export const config = {
//   api: {
//     bodyParser: false, // Disable body parsing to handle Stripe's raw request body
//   },
// };
export const dynamic = "force-dynamic";

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
    let userId = session.metadata.userId || null; // Extract userId from metadata
    const email = session.customer_details.email; // This email is collected by Stripe during checkout
    const cartItems = JSON.parse(session.metadata.cartItems); // Only product IDs and quantities

    try {
      // Check if the email already exists in Firebase Auth
      if (!userId) {
        console.log(`Checking Firebase for existing user with email: ${email}`);

        const existingUser = await admin
          .auth()
          .getUserByEmail(email)
          .catch((error) => {
            console.log(
              `No existing user found for email: ${email}. Error: ${error.message}`
            );
            return null;
          });

        if (existingUser) {
          userId = existingUser.uid; // If a user exists, use their userId
          console.log(`Found existing user with uid: ${userId}`);
        } else {
          console.log(`No existing user found with email: ${email}`);
        }
      }

      // Use a Firestore transaction to ensure atomic updates
      await firestore.runTransaction(async (transaction) => {
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
        const orderData = {
          cartItems: productPrices.map((item) => ({
            id: item.id,
            price: item.price, // Only store product ID and price
          })),
          paymentStatus: session.payment_status,
          amountTotal: session.amount_total / 100, // Stripe sends amount in cents, convert to dollars
          stripeSessionId: session.id,
          createdAt: new Date(),
          customerEmail: email,
          userId: userId || null, // Attach userId if authenticated or found via email check
          isPending: !userId, // Mark order as pending if no userId (guest)
        };

        const orderRef = firestore.collection("orders").doc();
        transaction.set(orderRef, orderData);

        // Track the order creation
        await trackOrderEvent({
          userId: userId || "anonymous",
          orderId: orderRef.id,
          cartItems: productPrices,
          amountTotal: session.amount_total / 100,
          stripeSessionId: session.id,
          customerEmail: email,
        });

        if (userId) {
          // Add product IDs to the authenticated or identified user's purchasedProducts array
          transaction.update(firestore.collection("users").doc(userId), {
            purchasedProducts: admin.firestore.FieldValue.arrayUnion(
              ...cartItems.map((item) => item.id) // Add the product IDs to the user's array
            ),
          });

          // Clear the user's cart inside the transaction
          transaction.update(firestore.collection("carts").doc(userId), {
            items: [], // Clear the cart by setting the items array to empty
          });
        }

        // After successful order creation, send confirmation email
        const emailResult = await sendEmail({
          to: email,
          subject: "Thank you for your Deno Games purchase! 🎮",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #4a5568; text-align: center;">Order Confirmation</h1>
              
              <p style="font-size: 16px; line-height: 1.5;">
                Thank you for your purchase! Here's a summary of your order:
              </p>

              <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #2d3748; margin-bottom: 15px;">Order Details:</h2>
                ${productPrices
                  .map(
                    (item) => `
                  <div style="margin-bottom: 10px;">
                    <strong>${item.name}</strong> - $${item.price}
                  </div>
                `
                  )
                  .join("")}
                
                <div style="border-top: 2px solid #e2e8f0; margin-top: 15px; padding-top: 15px;">
                  <strong>Total:</strong> $${session.amount_total / 100}
                </div>
              </div>

              <p style="color: #718096; font-size: 14px;">
                Your games are now available in your account. If you have any questions, please don't hesitate to contact us.
              </p>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://denogames.com/my-games" 
                   style="background-color: #4f46e5; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 6px; font-weight: bold;">
                  View My Games
                </a>
              </div>
            </div>
          `,
        });

        console.log("Order confirmation email result:", emailResult);
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error processing order:", error.message);
      return NextResponse.json(
        { error: "Error processing order" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
