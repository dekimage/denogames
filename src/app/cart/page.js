"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mimage } from "@/components/Mimage";
import PaymentButton from "@/components/PaymentButton";

export function getCartStatus(cartItemsLength) {
  let muhar;

  switch (cartItemsLength) {
    case 0:
      muhar = "cartempty";
      break;
    case 1:
      muhar = "cart1";
      break;
    case 2:
      muhar = "cart2";
      break;
    case 3:
      muhar = "cart3";
      break;
    default:
      if (cartItemsLength > 3) {
        muhar = "cartfull";
      } else {
        muhar = "cartempty"; // Default case if none of the above conditions are met
      }
      break;
  }

  return muhar;
}

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
    <div className="sm:mx-auto py-4 m-0 p-2 sm:p-8 pb-24">
      <div className="text-2xl font-strike uppercase mb-2">Your Cart</div>
      <Mimage
        muhar={getCartStatus(cartItems.length)}
        height={200}
        width={200}
      />

      {cartItems.length === 0 ? (
        <div className="p-8 border border-dashed flex items-center justify-center flex-col gap-4">
          <div className="text-2xl font-strike">Your cart is empty</div>

          <Link href="/">
            <Button className="h-16 text-xl">
              Browse Games <ArrowRight className="ml-1" size={24} />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-between justify-between">
          {cartItems.map((product) => (
            <div className="box-inner" key={product.id}>
              <div className="box-broken flex items-center justify-between border-b px-8 my-2 p-4">
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
                      <div className="text-sm sm:text-lg   sm:w-[150px]">
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
            </div>
          ))}
        </div>
      )}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="max-w-screen-xl mx-auto flex justify-between items-center">
            <div className="font-strike uppercase text-lg">
              Total: ${totalPrice}.00
            </div>
            <PaymentButton cartItems={cartItems} />
            <Link href="/checkout" className="w-1/2 sm:w-1/3">
              <Button
                className="w-full h-12 text-lg"
                disabled={cartItems.length === 0}
              >
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
});

export default CartPage;
