"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import MobxStore from "@/mobx";
import { observer } from "mobx-react";

const CheckoutSuccessPage = observer(() => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { user, clearCart, userFullyLoaded } = MobxStore;
  const [isClearing, setIsClearing] = useState(true);

  // Clear the cart on success page load
  useEffect(() => {
    const clearCartData = async () => {
      try {
        await clearCart();
      } finally {
        setIsClearing(false);
      }
    };

    clearCartData();

    // Optional: You could log the successful purchase for analytics
    if (sessionId) {
      console.log(`Purchase completed with session ID: ${sessionId}`);
    }
  }, [clearCart, sessionId]);

  // Show loading state while waiting for user to load or cart to clear
  if (!userFullyLoaded || isClearing) {
    return (
      <div className="container mx-auto py-20 px-4 text-center max-w-3xl">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <LoadingSpinner size={40} />
          <p className="mt-4 text-muted-foreground">
            Processing your purchase...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-20 px-4 text-center max-w-3xl">
      <div className="bg-green-50 dark:bg-green-900/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
        <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
      </div>

      <h1 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h1>

      <p className="text-lg mb-8">
        {user
          ? "Your product is now available in your library. You can access it anytime from your account."
          : "Your purchase was successful! Please log in to access your products."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {user ? (
          <>
            <Button asChild size="lg">
              <Link href="/account/my-games">Go to My Library</Link>
            </Button>

            <Button variant="outline" asChild size="lg">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </>
        ) : (
          <>
            <Button asChild size="lg">
              <Link href="/login">Log In</Link>
            </Button>

            <Button variant="outline" asChild size="lg">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
});

export default CheckoutSuccessPage;
