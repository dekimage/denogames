"use client";
import { Loader2 } from "lucide-react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import MobxStore from "@/mobx";
import { Button } from "./ui/button";

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const MyCheckoutForm = ({ email, total, cartItems, user }) => {
  const router = useRouter();
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const [cardHolderName, setCardHolderName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!validateEmail(email) || cardHolderName === "") {
      toast({
        title:
          cardHolderName === ""
            ? "Error: Please enter your cardholder name"
            : "Error: Please enter a valid email address.",
        duration: 5000,
      });
      setLoading(false);
      return;
    }

    if (!stripe || !elements) {
      console.error("Stripe has not been initialized yet.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log("[error]", error);
      setLoading(false);
      toast({
        title: `Error: ${error.message}`,
      });
    } else {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          productIds: cartItems.map((item) => item.id),
          email: user.email,
          userId: user.uid,
        }),
      });

      const paymentResult = await response.json();
      if (paymentResult.status !== 200) {
        toast({
          title: `Error: ${paymentResult.message}`,
        });
      } else {
        toast({
          title: "Payment successful",
          description: "You have successfully completed the payment.",
          duration: 5000,
        });

        setLoading(false);
        MobxStore.clearCart();

        const notification = {
          title: "Order Placed Successfully!",
          message: `Thank you for your purchase! You have gained ${paymentResult.xp} XP. Check the rewards section to see if you've unlocked any rewards!`,
          link: `/rewards`,
          type: "order",
        };

        MobxStore.addNotification(notification);

        // router.push("/thank-you");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <div>
        <Label className="mt-4">Cardholder Name</Label>
        <Input
          label="Name"
          placeholder="Cardholder Name"
          value={cardHolderName}
          onChange={(e) => setCardHolderName(e.target.value)}
          className="mb-4"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium ">Card Details</label>
        <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
          <CardElement className="p-2" />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe}
        loading={loading ? "true" : "false"}
        className="w-full h-16 flex justify-center text-lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
          </>
        ) : (
          `Place Order - $${total.toFixed(2)}`
        )}
      </Button>
    </form>
  );
};

export default MyCheckoutForm;
