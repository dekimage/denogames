"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useEffect } from "react";

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
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul className="space-y-4">
            {cartItems.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <img
                    src={product.imageUrls?.[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-bold">{product.name}</h3>
                    <p className="text-gray-600">${product.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <h3 className="text-lg font-bold">
              Total: ${totalPrice.toFixed(2)}
            </h3>
            <button
              onClick={continueToCheckout}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default CartPage;
