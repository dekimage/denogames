"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MobxStore from "@/mobx";
import { observer } from "mobx-react";

import { Button } from "@/components/ui/button";
import { SignupCard } from "../signup/page";

const SuccessPage = observer(() => {
  const { user, clearCart } = MobxStore;
  const router = useRouter();

  // Clear cart from localStorage on load
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="success-page">
      <h1>Thank You for Your Purchase!</h1>
      <p>Your order has been successfully completed.</p>
      {/* <img
        src="/thank-you-image.jpg"
        alt="Thank You"
        className="thank-you-image"
      /> */}

      {!user ? (
        <div>
          <p>
            Please create an account to view your games and access your
            purchase.
          </p>
          <SignupCard /> {/* Reuse the signup card here */}
        </div>
      ) : (
        <div>
          <Button onClick={() => router.push("/profile")}>
            View Your Games
          </Button>
        </div>
      )}
    </div>
  );
});

export default SuccessPage;
