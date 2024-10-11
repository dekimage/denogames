import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

const PaymentButton = ({ cartItems }) => {
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
    const response = await fetch("/api/checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
};

export default PaymentButton;
