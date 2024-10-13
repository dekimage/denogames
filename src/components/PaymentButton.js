import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { auth } from "@/firebase";

const PaymentButton = observer(({ cartItems }) => {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY));
  }, []);

  const handlePayment = async () => {
    if (!stripePromise) {
      console.error("Stripe hasn't loaded yet");
      return;
    }

    const stripe = await stripePromise;

    // Check if user is logged in
    const user = auth.currentUser;

    // Initialize the payload for the checkout session request
    let payload = {
      cartItems, // Send the cart items in the body
    };

    if (user) {
      // If authenticated, get the Firebase token
      const token = await user.getIdToken();
      payload.token = token;
    }

    // Send the request to the backend to create the checkout session
    const response = await fetch("/api/checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Error creating checkout session:", errorMessage);
      return;
    }

    const session = await response.json();

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-500 text-white p-4 rounded-lg"
      disabled={!stripePromise}
    >
      Proceed to Payment
    </button>
  );
});

export default PaymentButton;
