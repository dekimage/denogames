"use client";
import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobxStore from "@/mobx";
import { observer } from "mobx-react";

const CheckoutSuccessPage = observer(() => {
  // Clear the cart on success page load
  useEffect(() => {
    MobxStore.clearCart();
  }, []);

  return (
    <div className="container mx-auto py-20 px-4 text-center max-w-3xl">
      <div className="bg-green-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold mb-4">Thank You!</h1>

      <p className="text-lg mb-8">
        Your product is now available in your library. You can access it anytime
        from your account.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/account/my-games">Go to My Library</Link>
        </Button>

        <Button variant="outline" asChild size="lg">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
});

export default CheckoutSuccessPage;
