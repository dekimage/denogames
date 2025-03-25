"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  X,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  ShoppingCartIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Mimage } from "@/components/ui/Mimage";
import PaymentButton from "@/components/PaymentButton";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { ProductTypeBadge } from "./ProductTypeBadge";

import { CLIENT_EVENTS } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/client";

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

const CartItem = ({ product, onRemove }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex items-center gap-4 py-4 border-b border-border last:border-0"
    >
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={product.thumbnail || "https://via.placeholder.com/80"}
          alt={product.name}
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <Link
            href={`/product-details/${product.slug}`}
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
            {product.name}
          </Link>
          <button
            onClick={() => onRemove(product.id)}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {product.type && (
          <ProductTypeBadge type={product.type} className="mt-1 text-xs" />
        )}

        <div className="mt-2 flex items-center justify-between">
          <span className="font-medium">${product.price}.00</span>
        </div>
      </div>
    </motion.div>
  );
};

const RecommendedProduct = ({ product, onAdd }) => {
  const { toast } = useToast();

  const handleAdd = () => {
    onAdd(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-col items-center p-3 border rounded-lg hover:shadow-md transition-shadow bg-card">
      <div className="relative h-24 w-24 mb-2">
        <Image
          src={product.thumbnail || "https://via.placeholder.com/96"}
          alt={product.name}
          fill
          className="object-cover rounded-md"
        />
        {product.discountPercentage && (
          <div className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs font-bold px-1.5 py-0.5 rounded-bl-md rounded-tr-md">
            -{product.discountPercentage}%
          </div>
        )}
      </div>
      <h4 className="text-sm font-medium text-center line-clamp-1 mb-1 text-foreground">
        {product.name}
      </h4>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold text-sm">${product.price}.00</span>
        {product.originalPrice && (
          <span className="text-muted-foreground text-xs line-through">
            ${product.originalPrice}.00
          </span>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full gap-1 hover:bg-primary hover:text-primary-foreground transition-colors"
        onClick={handleAdd}
      >
        <Plus size={14} /> Add
      </Button>
    </div>
  );
};

const EmptyCart = ({ recommendedProducts, onAddToCart }) => {
  return (
    <div className="flex flex-col items-center py-8">
      <div className="bg-muted p-6 rounded-full mb-4">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-foreground">
        Your cart is empty
      </h3>
      <p className="text-muted-foreground text-center mb-6">
        Looks like you haven&apos;t added any products to your cart yet.
      </p>
      <Link href="/shop">
        <Button className="mb-8">
          Browse Products <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>

      {recommendedProducts.length > 0 && (
        <div className="w-full">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-4 w-4 text-primary" />
            <h4 className="font-medium text-foreground">Recommended for you</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recommendedProducts.map((product) => (
              <RecommendedProduct
                key={product.id}
                product={product}
                onAdd={onAddToCart}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ShoppingCart = observer(() => {
  const { cart, removeFromCart, addToCart, products, user } = MobxStore;
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    updateCartItemsAndRecommendations();
  }, [cart, products, user]);

  const updateCartItemsAndRecommendations = () => {
    const currentCart = MobxStore.cart;

    const items = currentCart
      .map((id) => {
        const product = products.find((p) => p.id === id);
        return product || null;
      })
      .filter(Boolean);

    setCartItems(items);

    const total = items.reduce((sum, item) => sum + (item.price || 0), 0);
    setSubtotal(total);

    if (products.length > 0) {
      const purchasedIds = user?.purchasedProducts || [];
      const cartIds = currentCart || [];

      const recommended = products
        .filter(
          (p) =>
            !cartIds.includes(p.id) &&
            !purchasedIds.includes(p.id) &&
            p.type !== "add-on" &&
            p.price !== 0
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

      setRecommendedProducts(recommended);
    }
  };

  const toggleCart = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      updateCartItemsAndRecommendations();
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    updateCartItemsAndRecommendations();
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    updateCartItemsAndRecommendations();
  };

  const cartCount = MobxStore.cart.length;

  const handleProceedToCheckout = async (e) => {
    e.preventDefault();

    await trackEvent({
      action: CLIENT_EVENTS.INITIATE_CHECKOUT_FROM_CART,
      context: {
        currentPath: window.location.pathname,
        cartItems: cart,
        cartValue: subtotal,
        isFirstTime: user ? !user?.analytics?.proceedToCheckout : undefined,
      },
    });

    window.location.href = "/checkout";
  };

  return (
    <div className="relative z-50">
      <button
        onClick={toggleCart}
        className="relative p-2 text-foreground hover:text-primary transition-colors"
        aria-label="Shopping cart"
      >
        <ShoppingCartIcon className="h-6 w-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {cartCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 dark:bg-black/70"
              onClick={toggleCart}
            />

            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 right-0 h-full w-full sm:w-96 bg-background shadow-xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <ShoppingCartIcon className="h-5 w-5" />
                  Your Cart {cart.length > 0 && `(${cart.length})`}
                </h2>
                <button
                  onClick={toggleCart}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.length > 0 ? (
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        product={item}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </AnimatePresence>
                ) : (
                  <EmptyCart
                    recommendedProducts={recommendedProducts}
                    onAddToCart={handleAddToCart}
                  />
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-4 border-t border-border bg-muted/50">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">
                      ${subtotal}.00
                    </span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-foreground">Free</span>
                  </div>
                  <Separator className="mb-4" />
                  <div className="flex justify-between mb-4">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-bold text-foreground">
                      ${subtotal}.00
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Link href="/checkout" onClick={handleProceedToCheckout}>
                      <Button className="w-full">Proceed to Checkout</Button>
                    </Link>
                    <Link href="/shop" onClick={toggleCart}>
                      <Button variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

export default ShoppingCart;
