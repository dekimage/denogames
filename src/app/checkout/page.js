"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useEffect, useState } from "react";
import { BadgeCheck, CheckCheck, Shield, ShieldCheck, X } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import MyCheckoutForm from "@/components/PaymentForm";
import { Button } from "@/components/ui/button";

import secureByImg from "../../assets/secureby.png";
import denoImg from "../../assets/deno.png";
import messengerImg from "../../assets/instagram.png";
import Image from "next/image";
import { Mimage } from "@/components/Mimage";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export const CheckoutPage = observer(() => {
  const { cart, user, products } = MobxStore;

  const [email, setEmail] = useState(user ? user.email : "");

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const cartItems = cart.map((productId) =>
    products.find((product) => product.id === productId)
  );

  const subtotal = cartItems.reduce((total, item) => total + item.price, 0);
  // const tax = subtotal * 0.1;
  const tax = 0;
  const total = subtotal + tax;

  return (
    <div className="checkout-page grid grid-cols-1 md:grid-cols-2 gap-8 p-4 bg-muted h-[90vh]">
      {/* Order Summary Sidebar */}

      <div className="checkout-content md:col-span-1">
        <Elements stripe={stripePromise}>
          <Card className="p-4 shadow-none">
            <div className="text-2xl font-bold">Payment Details</div>
            <div className="text-gray-400 text-sm mb-8">
              All transactions are secured and encrypted
            </div>
            <Label className="mt-4 flex gap-1 items-center">
              Email <CheckCheck size={16} />
            </Label>
            <Input
              disabled={user}
              label="Email"
              placeholder="Email"
              className="mb-4 mt-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <MyCheckoutForm
              email={email}
              total={total}
              cartItems={cartItems}
              user={user}
            />
            <div className="w-full flex justify-center pb-2">
              <Image
                src={secureByImg}
                alt="Stripe"
                width={250}
                height={200}
                className="mt-2"
              />
            </div>
          </Card>
        </Elements>
      </div>

      <aside className="order-summary bg-background p-4 border md:col-span-1">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        <div className="space-y-4 mb-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <Image
                src={item.thumbnail}
                alt={item.name}
                width={64}
                height={64}
                className="object-cover rounded"
              />
              <div className="ml-4">
                <div className="text-sm font-bold">{item.name}</div>
              </div>

              <div className="flex gap-2 items-center">
                <p className="text-lg">${item.price}.00</p>
                <Button
                  size="icon"
                  variant="outline"
                  className="border-none"
                  onClick={() => MobxStore.removeFromCart(item.id)}
                >
                  <X />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 flex gap-2 flex-col">
          <p className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </p>
          <p className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </p>
          <div className="flex justify-center items-center p-4 border-t mt-4">
            <ShieldCheck className="mr-1" /> SECURE SSL CHECKOUT
          </div>
          <div className="flex items-center justify-center">
            <Mimage muhar="secure" />
          </div>
        </div>

        <Card className="p-4 shadow-none mt-4 text-gray-500 text-sm flex flex-col gap-2">
          <div>
            <Image
              src={denoImg}
              alt="deno"
              width={50}
              height={50}
              className="rounded-full mb-2"
            />
          </div>
          <div>
            Psst, I`m using Stripe to collect payments. I don`t have access to
            any of the payment information you provide. Read more about Stripe
            on their official site{" "}
            <a
              href="https://www.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-class text-blue-400"
            >
              www.stripe.com
            </a>
          </div>
          <div>
            If you have any trouble with the payment, please message me on
            instagram @deno_games
            <a
              href="https://www.instagram.com/deno_games/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-class"
            >
              <Button className="flex gap-1 mt-2" variant="outline">
                Message me
                <Image
                  src={messengerImg}
                  alt="messenger"
                  width={25}
                  height={25}
                />
              </Button>
            </a>
          </div>
        </Card>
      </aside>
    </div>
  );
});

export default CheckoutPage;
