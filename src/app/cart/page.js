"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CartPage = observer(() => {
  const { cart, products, removeFromCart, continueToCheckout, loading } =
    MobxStore;

  // Get the product details for each item in the cart
  const cartItems = cart.map((productId) =>
    products.find((product) => product.id === productId)
  );

  const totalPrice = cartItems.reduce(
    (total, product) => total + product.price,
    0
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sm:mx-auto py-4 m-0 p-2 sm:p-8">
      <div className="text-2xl font-bold mb-6">Your Cart</div>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="flex flex-col items-between justify-between h-[80vh]">
          <div>
            {cartItems.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center">
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="h-16 w-16 sm:h-32 sm:w-32 object-cover rounded"
                  />
                  <div className="ml-4 flex justify-start items-start">
                    <Link href={`/product-details/${product.slug}`}>
                      <div className="text-sm sm:text-lg font-bold  sm:w-[150px]">
                        {product.name}
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-lg">${product.price}.00</p>
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-none"
                    onClick={() => removeFromCart(product.id)}
                  >
                    <X />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* <div className="flex justify-center items-center border w-full h-64">
            Suggestions: Upsell
          </div> */}

          <div className=" flex justify-end">
            <div className="mt-8 w-full">
              <div className="flex justify-between mb-6">
                <div className="text-lg font-bold">Total</div>
                <div className="text-lg font-bold">${totalPrice}.00</div>
              </div>

              <Link href="/checkout" className="w-full">
                <Button
                  className="w-full h-16 text-xl"
                  disabled={cartItems.length === 0}
                >
                  Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default CartPage;
