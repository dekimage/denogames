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

    const user = auth.currentUser; // Get current user from Firebase Auth

    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    // Get the Firebase token
    const token = await user.getIdToken();

    const stripe = await stripePromise;

    // Send the token in the Authorization header and cartItems in the body
    const response = await fetch("/api/checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send token securely
      },
      body: JSON.stringify({ cartItems }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Error creating checkout session:", errorMessage);
      return;
    }

    const session = await response.json();

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
