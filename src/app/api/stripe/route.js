import Stripe from "stripe";

import {
  doc,
  setDoc,
  updateDoc,
  increment,
  getDoc,
  arrayUnion,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);

export async function POST(req) {
  const data = await req.json();
  const { paymentMethodId, productIds, email, userId } = data;

  try {
    // Fetch products from Firestore
    let totalAmount = 0;
    const cartItems = [];

    for (const productId of productIds) {
      const productRef = doc(db, "products", productId);
      const productDoc = await getDoc(productRef);

      if (!productDoc.exists()) {
        throw new Error(`Product with ID ${productId} does not exist.`);
      }

      const productData = productDoc.data();
      totalAmount += productData.price * 100; // Stripe expects amount in cents
      cartItems.push({
        id: productId,
        name: productData.name,
        price: productData.price,
        type: productData.type,
      });
    }

    // Check if the customer already exists in Stripe
    let customer = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customer.data.length > 0) {
      customer = customer.data[0];
    } else {
      customer = await stripe.customers.create({
        email: email,
      });
    }

    // Create a Payment Intent with the calculated total amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount, // Amount in cents
      currency: "usd",
      customer: customer.id,
      payment_method: paymentMethodId,
      confirmation_method: "automatic",
      confirm: true,
      return_url: "https://www.denogames.com/thank-you",
    });

    // Create an order in Firestore
    const orderRef = doc(db, "orders", paymentIntent.id);
    const orderData = {
      userId,
      paymentId: paymentIntent.id,
      cartItems,
      productIds,
      total: totalAmount / 100, // Convert cents to dollars
      createdAt: new Date(),
    };
    await setDoc(orderRef, orderData);

    // Award XP based on products purchased
    const xp = cartItems.reduce((total, item) => {
      let points = 0;
      if (item.type === "game") points = 5;
      if (item.type === "expansion") points = 2;
      if (item.type === "bundle") points = 10;
      return total + points;
    }, 0);

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      xp: increment(xp),
      purchasedProducts: arrayUnion(...productIds), // Add product IDs to purchasedProducts array
    });

    // Return success response
    return Response.json({
      message: "Payment and order processing successful",
      xp,
      status: 200,
    });
  } catch (error) {
    console.log("Error processing payment:", error);
    return Response.json({
      message: `Payment failed: ${error.message}`,
      status: 500,
    });
  }
}
