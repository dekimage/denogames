"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Lock,
  ShieldCheck,
  User,
  Mail,
  Key,
  AlertCircle,
  Tag,
  X,
  PlusCircle,
  Plus,
  Minus,
  ArrowDown,
  InfoIcon,
  AlertTriangle,
  Gift,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import PaymentButton from "@/components/PaymentButton";
import { motion, AnimatePresence } from "framer-motion";

import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { auth } from "@/firebase";
import { runInAction } from "mobx";
import { ProductTypeBadge } from "@/components/ProductTypeBadge";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Form schema for guest checkout
const guestCheckoutSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  username: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

// Form schema for discount code
const discountCodeSchema = z.object({
  code: z.string().min(1, {
    message: "Please enter a discount code.",
  }),
});

const CheckoutItem = ({ product, onRemove }) => {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-50">
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
            className="font-medium text-foreground hover:text-blue-600 transition-colors"
          >
            {product.name}
          </Link>
          {onRemove && (
            <button
              onClick={() => onRemove(product.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Remove item"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {product.type && (
          <ProductTypeBadge type={product.type} className="mt-1 text-xs" />
        )}
      </div>

      <div className="text-right">
        <span className="font-medium">${product.price}.00</span>
        {product.originalPrice && (
          <div className="text-xs text-gray-500 line-through">
            ${product.originalPrice}.00
          </div>
        )}
      </div>
    </div>
  );
};

const OrderSummary = ({
  cartItems,
  subtotal,
  discount,
  total,
  onRemoveItem,
}) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4">
        <h3 className="text-lg font-strike mb-4">Order Summary</h3>

        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <CheckoutItem
              key={item.id}
              product={item}
              onRemove={onRemoveItem}
            />
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal}.00</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${discount}.00</span>
            </div>
          )}

          <Separator className="my-2" />

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${total}.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DiscountForm = ({ onApplyDiscount }) => {
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);

  const form = useForm({
    resolver: zodResolver(discountCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data) => {
    setIsApplying(true);
    try {
      // Simulate API call to validate discount code
      await new Promise((resolve) => setTimeout(resolve, 800));

      // For demo purposes, let's say "WELCOME10" gives 10% off
      if (data.code.toUpperCase() === "WELCOME10") {
        onApplyDiscount(10);
        toast({
          title: "Discount applied!",
          description: "10% discount has been applied to your order.",
        });
      } else {
        toast({
          title: "Invalid code",
          description: "The discount code you entered is invalid or expired.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply discount code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="Discount code"
                    {...field}
                    disabled={isApplying}
                  />
                </FormControl>
                <Button type="submit" variant="outline" disabled={isApplying}>
                  {isApplying ? "Applying..." : "Apply"}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

// Update the BackerEmailForm component
const BackerEmailForm = ({ onApplyBackerEmail }) => {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);

  const form = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().email("Please enter a valid email address"),
      })
    ),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsChecking(true);

      // Call the API to check if this email is in the backers collection
      const token = await auth.currentUser?.getIdToken();
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/backer/check", {
        method: "POST",
        headers,
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();
      console.log("Backer check result:", result); // Debug log

      if (!response.ok) {
        throw new Error(result.error || "Failed to verify backer email");
      }

      if (result.found) {
        if (result.isClaimed) {
          toast({
            title: "Already claimed",
            description: "This backer has already claimed their reward!",
            variant: "destructive",
          });
        } else {
          // Apply the backer email and product IDs to the checkout
          onApplyBackerEmail(data.email, result.productIds);

          toast({
            title: "Backer found!",
            description:
              "Your backer status has been verified. Monster Mixology has been marked as free.",
          });
        }
      } else {
        toast({
          title: "Not found",
          description: "No backer found with this email address.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking backer email:", error);
      toast({
        title: "Verification failed",
        description:
          error.message || "Failed to verify backer email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="bg-card p-4 rounded-lg border mb-6">
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <Gift className="mr-2 h-5 w-5" />
        Kickstarter Backer?
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        If you backed Monster Mixology on Kickstarter, enter your backer email
        to unlock your free copy.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter your backer email..."
                      {...field}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isChecking}>
                      {isChecking ? <LoadingSpinner size="sm" /> : "Verify"}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

// Add this new component for the backer claim button
const BackerClaimButton = ({ backerEmail, backerProducts, disabled }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClaim = async () => {
    try {
      setIsProcessing(true);

      // Get the current user's ID token
      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      // Call the API to claim the game
      const response = await fetch("/api/backer/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: backerEmail,
          productIds: backerProducts,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to claim your game");
      }

      // Update MobX state with the newly purchased products
      runInAction(() => {
        // First, ensure user.purchasedProducts exists
        if (!MobxStore.user.purchasedProducts) {
          MobxStore.user.purchasedProducts = [];
        }

        // Add the new product IDs to the user's purchasedProducts
        MobxStore.user.purchasedProducts = [
          ...new Set([...MobxStore.user.purchasedProducts, ...backerProducts]),
        ];
      });

      // Clear the cart
      MobxStore.clearCart();

      toast({
        title: "Success!",
        description: "Monster Mixology has been added to your library.",
      });

      // Redirect to success page
      router.push("/checkout/success");
    } catch (error) {
      console.log("Error claiming game:", error);
      toast({
        title: "Claim failed",
        description:
          error.message || "Failed to claim your game. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white"
      onClick={handleClaim}
      disabled={disabled || isProcessing}
    >
      {isProcessing ? (
        <>
          <LoadingSpinner size={20} className="mr-2" /> Processing...
        </>
      ) : (
        <>
          <Gift className="mr-2 h-5 w-5" />
          Unlock Kickstarter Reward
        </>
      )}
    </Button>
  );
};

const GuestCheckoutForm = ({ onComplete, onSwitchToLogin }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signupWithEmail } = MobxStore;
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(guestCheckoutSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await signupWithEmail(data.email, data.password, data.username);
      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });
      onComplete();
    } catch (error) {
      console.error("Error creating account:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-muted/50 p-4 rounded-lg border mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <User className="mr-2 h-5 w-5" />
        Create Account
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Authentication is required to complete your purchase and access your
        games.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Email address"
                      className="pl-10"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Your name"
                      className="pl-10"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Create password (min. 6 characters)"
                      className="pl-10"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? <LoadingSpinner /> : "Create Account"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onSwitchToLogin}
            >
              Already Have an Account
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

// Update the QuickLoginForm to include toggle to signup
const QuickLoginForm = ({ onComplete, onSwitchToSignup }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginWithEmail } = MobxStore;
  const { toast } = useToast();

  const loginSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, {
      message: "Password is required.",
    }),
  });

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await loginWithEmail({ email: data.email, password: data.password });
      toast({
        title: "Login successful!",
        description: "You can now complete your purchase.",
      });
      onComplete();
    } catch (error) {
      console.error("Error logging in:", error);
      toast({
        title: "Login failed",
        description:
          error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-muted/50 p-4 rounded-lg border mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <User className="mr-2 h-5 w-5" />
        Log In
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Log in to complete your purchase quickly
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Email address"
                      className="pl-10"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Password"
                      className="pl-10"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? <LoadingSpinner /> : "Log In"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onSwitchToSignup}
            >
              Don&apos;t Have an Account?
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

// Update the UpsellItem component to only have Add functionality
const UpsellItem = ({ product, onAdd }) => {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      // Add to cart (this will update MobX store)
      onAdd(product);

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your order.`,
      });
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg hover:border-primary transition-colors">
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-gray-50">
        <Image
          src={product.thumbnail || "https://via.placeholder.com/80"}
          alt={product.name}
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{product.name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold">${product.price}.00</span>
          {product.type && (
            <ProductTypeBadge type={product.type} className="mt-1 text-xs" />
          )}
        </div>
      </div>

      <Button
        size="sm"
        variant="outline"
        className="flex-shrink-0 h-8 px-3"
        onClick={handleAdd}
        disabled={isAdding}
      >
        <Plus className={`h-4 w-4 mr-1 ${isAdding ? "animate-pulse" : ""}`} />
        Add
      </Button>
    </div>
  );
};

// Update the UpsellSection component to filter out already purchased products
const UpsellSection = ({ cartItems, onAddToCart }) => {
  const { products, cart, user } = MobxStore;
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Find related products based on cart items
    if (cartItems.length > 0 && products.length > 0) {
      // Get IDs of products the user already owns
      const userOwnedProductIds = user?.purchasedProducts || [];

      // Get IDs of products in the current cart
      const cartProductIds = cartItems.map((item) => item.id);
      const cartProductTypes = cartItems.map((item) => item.type);
      const cartGameIds = cartItems
        .filter((item) => item.type === "game")
        .map((item) => item.id);

      // Find expansions for games in cart and games related to expansions
      let related = products.filter(
        (product) =>
          // Don't include products already in cart
          !cartProductIds.includes(product.id) &&
          // Don't include products the user already owns
          !userOwnedProductIds.includes(product.id) &&
          product.type !== "add-on" &&
          // Find expansions for games in cart
          ((product.type === "expansion" &&
            product.relatedGames &&
            cartGameIds.includes(product.relatedGames)) ||
            // Or find games related to expansions in cart
            (product.type === "game" &&
              cartProductTypes.includes("expansion") &&
              cartItems.some(
                (item) =>
                  item.type === "expansion" &&
                  item.relatedGames &&
                  item.relatedGames === product.id
              )))
      );

      // If we don't have enough related products, add some popular ones
      if (related.length < 3) {
        const popular = products
          .filter(
            (p) =>
              p.type !== "add-on" &&
              !cartProductIds.includes(p.id) &&
              // Don't include products the user already owns
              !userOwnedProductIds.includes(p.id) &&
              !related.some((r) => r.id === p.id)
          )
          .sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0))
          .slice(0, 3 - related.length);

        related = [...related, ...popular];
      }

      // Limit to 3 products
      setRelatedProducts(related.slice(0, 3));
    }
  }, [cartItems, products, cart, user?.purchasedProducts]); // Add user.purchasedProducts as dependency

  if (relatedProducts.length === 0) {
    // If no related products but cart has free item(s), show some paid products
    if (cartItems.some((item) => item.price === 0)) {
      // Get IDs of products the user already owns
      const userOwnedProductIds = user?.purchasedProducts || [];

      const freeCartProductIds = cartItems.map((item) => item.id);

      // Filter to show non-free products that aren't already in cart and aren't already owned
      const paidProducts = products
        .filter(
          (p) =>
            p.price > 0 &&
            !freeCartProductIds.includes(p.id) &&
            !userOwnedProductIds.includes(p.id) &&
            p.type !== "add-on"
        )
        .sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0))
        .slice(0, 3);

      if (paidProducts.length > 0) {
        return (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm mt-6">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                You Might Also Like
              </h3>
              <div className="space-y-3">
                {paidProducts.map((product) => (
                  <UpsellItem
                    key={product.id}
                    product={product}
                    onAdd={onAddToCart}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      }
    }

    return null;
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm mt-6">
      <div className="p-4">
        <h3 className="text-lg font-strike mb-4">Frequently Bought Together</h3>
        <div className="space-y-3">
          {relatedProducts.map((product) => (
            <UpsellItem
              key={product.id}
              product={product}
              onAdd={onAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Update the FreeCheckoutButton component
const FreeCheckoutButton = ({ cartItems, disabled }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFreeCheckout = async () => {
    try {
      setIsProcessing(true);

      // Get the current user's ID token
      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      // Call API to process zero-cost checkout with auth token
      const response = await fetch("/api/checkout/free", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productIds: cartItems.map((item) => item.id),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to process free checkout");
      }

      // Get the product IDs that were just purchased
      const purchasedProductIds = cartItems.map((item) => item.id);

      // Update MobX state with the newly purchased products
      runInAction(() => {
        // First, ensure user.purchasedProducts exists
        if (!MobxStore.user.purchasedProducts) {
          MobxStore.user.purchasedProducts = [];
        }

        // Add the new product IDs to the user's purchasedProducts
        MobxStore.user.purchasedProducts = [
          ...new Set([
            ...MobxStore.user.purchasedProducts,
            ...purchasedProductIds,
          ]),
        ];
      });

      // Clear the cart
      MobxStore.clearCart();

      // Show success toast
      toast({
        title: "Success!",
        description: "Your free product is now available in your library.",
      });

      // Redirect to success page
      router.push("/checkout/success");
    } catch (error) {
      console.error("Free checkout error:", error);
      toast({
        title: "Checkout failed",
        description:
          error.message ||
          "There was a problem processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      className="w-full h-12 text-lg font-semibold"
      onClick={handleFreeCheckout}
      disabled={disabled || isProcessing}
    >
      {isProcessing ? (
        <>
          <LoadingSpinner size={20} className="mr-2" /> Processing...
        </>
      ) : (
        "Get for Free"
      )}
    </Button>
  );
};

// Add this new function at the top of your checkout page
const validateExpansionsInCart = (cartItems, userPurchasedProducts = []) => {
  // Track expansions and their related games
  const expansions = cartItems.filter((item) => item.type === "expansion");
  const cartGameIds = cartItems
    .filter((item) => item.type === "game")
    .map((game) => game.id);
  const ownedGameIds = userPurchasedProducts || [];

  // Find problematic expansions (those without their main game)
  const problematicExpansions = expansions.filter((expansion) => {
    const mainGameId = expansion.relatedGames;
    // If this expansion doesn't have a related game, skip validation
    if (!mainGameId) return false;

    // It's valid if user already owns the main game OR is buying it now
    const ownsMainGame = ownedGameIds.includes(mainGameId);
    const isBuyingMainGame = cartGameIds.includes(mainGameId);

    return !(ownsMainGame || isBuyingMainGame);
  });

  return {
    isValid: problematicExpansions.length === 0,
    problematicExpansions,
  };
};

const CheckoutPage = observer(() => {
  const router = useRouter();
  const {
    cart,
    products,
    user,
    removeFromCart,
    addToCart,
    loading: mobxLoading,
  } = MobxStore;
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [accountCreated, setAccountCreated] = useState(false);
  const { toast } = useToast();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [validationIssues, setValidationIssues] = useState([]);
  const [backerEmail, setBackerEmail] = useState(null);
  const [backerProducts, setBackerProducts] = useState([]);

  // Add this function to find related games for expansions
  const findRelatedGame = (gameId) => {
    return products.find((product) => product.id === gameId);
  };

  // Update the validation effect to ensure it runs when needed
  useEffect(() => {
    if (cartItems.length > 0) {
      const { isValid, problematicExpansions } = validateExpansionsInCart(
        cartItems,
        user?.purchasedProducts
      );

      // Update validation issues state
      setValidationIssues(problematicExpansions);
    } else {
      setValidationIssues([]);
    }
  }, [cartItems, user?.purchasedProducts, cart]); // Add cart as a dependency to ensure revalidation

  // Update the handleAddRelatedGame function to ensure checkout state is updated
  const handleAddRelatedGame = (gameId) => {
    const gameToAdd = findRelatedGame(gameId);
    if (gameToAdd) {
      // Add to MobX store
      addToCart(gameToAdd);

      // Update local component state directly
      setCartItems((prevItems) => [...prevItems, gameToAdd]);

      // Update totals
      const newSubtotal = subtotal + gameToAdd.price;
      setSubtotal(newSubtotal);

      // If this was a free order and now it's not, we need to recalculate discount
      if (total === 0 && gameToAdd.price > 0) {
        // Recalculate discount for the new order
        const newDiscount = Math.round(
          (newSubtotal * discount) / subtotal || 0
        );
        setDiscount(newDiscount);
        setTotal(newSubtotal - newDiscount);
      } else {
        setTotal((prev) => prev + gameToAdd.price);
      }

      // Re-run validation immediately
      const updatedCart = [...cartItems, gameToAdd];
      const { isValid, problematicExpansions } = validateExpansionsInCart(
        updatedCart,
        user?.purchasedProducts
      );
      setValidationIssues(problematicExpansions);

      // Show toast notification
      toast({
        title: "Main game added",
        description: `${gameToAdd.name} has been added to your cart.`,
      });
    }
  };

  // This effect will handle the initial loading when MobX data is ready
  useEffect(() => {
    const loadCheckoutData = async () => {
      // Wait for MobX store to be ready - we need to wait for both products AND userFullyLoaded
      if (
        mobxLoading ||
        !Array.isArray(products) ||
        products.length === 0 ||
        !MobxStore.userFullyLoaded ||
        !MobxStore.cartFetched
      ) {
        return; // Exit early, we'll try again when everything is ready
      }

      try {
        // Ensure cart is an array and has valid data
        if (!Array.isArray(cart)) {
          console.log("Cart is not ready yet");
          return;
        }

        setLoading(true);

        // Map cart IDs to product objects
        const items = cart
          .map((id) => products.find((p) => p.id === id))
          .filter(Boolean);

        setCartItems(items);

        // Calculate totals
        const calculatedSubtotal = items.reduce(
          (sum, item) => sum + (item.price || 0),
          0
        );
        setSubtotal(calculatedSubtotal);
        setTotal(calculatedSubtotal - discount);

        // Set initial load attempted only after successful data loading
        if (!initialLoadAttempted) {
          setInitialLoadAttempted(true);
        }
      } catch (error) {
        console.error("Error loading checkout data:", error);
        toast({
          title: "Error",
          description: "Failed to load checkout data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();

    // Crucial improvement: If cart doesn't load within a reasonable time, try to force a fetch
    const timeoutId = setTimeout(() => {
      if (!initialLoadAttempted && MobxStore.userFullyLoaded) {
        console.log("Forcing cart fetch due to timeout");
        // Force fetch cart if it hasn't happened yet
        MobxStore.fetchCart();
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [
    mobxLoading,
    products,
    cart, // This is the critical dependency - now we'll refresh when cart changes
    initialLoadAttempted,
    discount,
    toast,
    MobxStore.userFullyLoaded,
    MobxStore.cartFetched,
  ]);

  // Add this effect to keep local state in sync with MobX state
  useEffect(() => {
    if (Array.isArray(cart) && cart.length !== cartItems.length) {
      // If cart length changed in MobX, sync local state
      const items = cart
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean);

      setCartItems(items);

      // Recalculate totals
      const calculatedSubtotal = items.reduce(
        (sum, item) => sum + (item.price || 0),
        0
      );
      setSubtotal(calculatedSubtotal);
      setTotal(calculatedSubtotal - discount);
    }
  }, [cart, products, discount]);

  // Always show loading until both MobX data is loaded and our cart processing is complete
  if (
    mobxLoading ||
    loading ||
    !initialLoadAttempted ||
    !MobxStore.userFullyLoaded ||
    !MobxStore.cartFetched
  ) {
    return (
      <div className="container mx-auto py-16 flex flex-col justify-center items-center min-h-[60vh]">
        <LoadingSpinner size={40} />
        <p className="mt-4 text-muted-foreground">Loading your checkout...</p>
      </div>
    );
  }

  // Only show empty cart message when we're SURE data is fully loaded
  if (initialLoadAttempted && cartItems.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 max-w-4xl">
        <div className="text-center py-16">
          <div className="bg-gray-50 p-4 rounded-full inline-flex mb-4">
            <AlertCircle className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4 font-strike">
            Your cart is empty
          </h1>
          <p className="mb-8 text-muted-foreground">
            You don&apos;t have any items in your cart. Add some products to
            proceed with checkout.
          </p>
          <Link href="/shop">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleApplyDiscount = (discountPercentage) => {
    const discountAmount = Math.round((subtotal * discountPercentage) / 100);
    setDiscount(discountAmount);
    setTotal(subtotal - discountAmount);
  };

  const handleAccountCreated = () => {
    setAccountCreated(true);
  };

  const handleRemoveItem = (productId) => {
    // Find the item being removed to access its price
    const removedItem = cartItems.find((item) => item.id === productId);
    if (!removedItem) return;

    // Remove from MobX store first
    removeFromCart(productId);

    // Then update local state to reflect the removal
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );

    // Recalculate subtotal and total
    const newSubtotal = subtotal - removedItem.price;
    setSubtotal(newSubtotal);

    // Recalculate total with discount
    setTotal(newSubtotal - discount);

    // Re-run validation immediately with the updated cart
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    const { isValid, problematicExpansions } = validateExpansionsInCart(
      updatedCart,
      user?.purchasedProducts
    );
    setValidationIssues(problematicExpansions);
  };

  const handleAddToCart = (product) => {
    // First check if product is already in cart to avoid duplicates
    if (!cart.includes(product.id)) {
      // Add to MobX store first
      addToCart(product);

      // Then update local state
      setCartItems((prevItems) => [...prevItems, product]);

      // Update totals
      const newSubtotal = subtotal + product.price;
      setSubtotal(newSubtotal);

      // If this was a free order and now it's not, we need to recalculate discount
      if (total === 0 && product.price > 0) {
        // Recalculate discount for the new order
        const newDiscount = Math.round(
          (newSubtotal * discount) / subtotal || 0
        );
        setDiscount(newDiscount);
        setTotal(newSubtotal - newDiscount);
      } else {
        setTotal((prev) => prev + product.price);
      }
    }
  };

  // Determine if the order is free (all products cost zero)
  const isZeroCostOrder = total === 0 && cartItems.length > 0;

  // Determine if checkout should be disabled due to validation issues
  const disableCheckout = validationIssues.length > 0;

  // Add this handler for backer email verification
  const handleApplyBackerEmail = (email, productIds) => {
    console.log("Applying backer email:", email, productIds); // Debug log

    setBackerEmail(email);
    setBackerProducts(productIds);

    // Adjust the cart items to make Monster Mixology free
    if (productIds.includes("monstermixology")) {
      const updatedItems = cartItems.map((item) => {
        if (item.id === "monstermixology") {
          console.log("Making Monster Mixology free"); // Debug log
          return {
            ...item,
            backerDiscount: true,
            originalPrice: item.price,
            price: 0,
          };
        }
        return item;
      });
      setCartItems(updatedItems);

      // Recalculate totals
      const newSubtotal = updatedItems.reduce(
        (sum, item) => sum + (item.price || 0),
        0
      );
      console.log("New subtotal:", newSubtotal); // Debug log
      setSubtotal(newSubtotal);
      setTotal(newSubtotal - discount);
    }
  };

  // Modify the calculateTotals function to account for backer discounts
  const calculateTotals = (items, discountPercentage) => {
    const subtotalValue = items.reduce((acc, item) => acc + item.price, 0);
    const discountValue = Math.round(
      (subtotalValue * discountPercentage) / 100
    );
    setSubtotal(subtotalValue);
    setDiscount(discountValue);
    setTotal(subtotalValue - discountValue);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <Link
          href="/shop"
          className="text-muted-foreground hover:text-foreground flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 font-strike">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Add Validation Issues Warning */}
          {validationIssues.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-amber-800 dark:text-amber-300 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Unable to Complete Checkout
              </h3>
              <p className="mb-4 text-amber-700 dark:text-amber-300">
                To use these expansions, you need their main games. Add the
                required game(s) to continue:
              </p>

              <div className="space-y-6 mb-4">
                {validationIssues.map((expansion) => {
                  const mainGame = findRelatedGame(expansion.relatedGames);
                  if (!mainGame) return null;

                  return (
                    <div
                      key={expansion.id}
                      className="bg-card rounded-lg overflow-hidden border"
                    >
                      {/* Expansion Item */}
                      <div className="flex items-center gap-3 p-3 bg-muted/50 border-b">
                        <div className="relative h-14 w-14 flex-shrink-0">
                          <Image
                            src={expansion.thumbnail || "/placeholder.jpg"}
                            alt={expansion.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-blue-500/10 text-blue-600 border-blue-200"
                            >
                              Expansion
                            </Badge>
                          </div>
                          <p className="font-medium mt-1">{expansion.name}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">
                            ${expansion.price}.00
                          </span>
                        </div>
                      </div>

                      {/* Arrow Connector */}
                      <div className="flex justify-center py-2 bg-amber-50 dark:bg-amber-950/50">
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          Requires Main Game
                        </span>
                      </div>

                      {/* Main Game Item */}
                      <div className="flex items-center gap-3 p-3">
                        <div className="relative h-14 w-14 flex-shrink-0">
                          <Image
                            src={mainGame.thumbnail || "/placeholder.jpg"}
                            alt={mainGame.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-green-500/10 text-green-600 border-green-200"
                            >
                              Main Game
                            </Badge>
                          </div>
                          <p className="font-medium mt-1">{mainGame.name}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-medium">
                            ${mainGame.price}.00
                          </span>
                          <Button
                            size="sm"
                            className="gap-1"
                            onClick={() =>
                              handleAddRelatedGame(expansion.relatedGames)
                            }
                          >
                            <Plus className="h-4 w-4" /> Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-sm text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 p-3 rounded">
                <p className="flex items-start">
                  <InfoIcon className="h-5 w-5 mr-2 flex-shrink0 mt-0.5" />
                  <span>
                    <strong>Why is this important?</strong> Expansions enhance
                    the main game but cannot be played on their own. You must
                    own the main game to use its expansions.
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Account Section */}
          {!user && !accountCreated ? (
            <AnimatePresence mode="wait">
              {showLoginForm ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <QuickLoginForm
                    onComplete={handleAccountCreated}
                    onSwitchToSignup={() => setShowLoginForm(false)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="signup-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <GuestCheckoutForm
                    onComplete={handleAccountCreated}
                    onSwitchToLogin={() => setShowLoginForm(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                  {user ? "Logged in" : "Account created"}
                </h3>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                {user
                  ? `You're logged in as ${user.email || user.username}`
                  : "Your account has been created successfully. You'll be able to access your games after purchase."}
              </p>
            </div>
          )}

          {/* Discount Code Section - only show for paid products */}
          {/* disabled-feature */}
          {/* {!isZeroCostOrder && (
            <div className="bg-card p-4 rounded-lg border mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Tag className="mr-2 h-5 w-5" />
                Discount Code
              </h3>
              <DiscountForm onApplyDiscount={handleApplyDiscount} />
            </div>
          )} */}

          {/* Add the backer email form if Monster Mixology is in the cart */}
          {cartItems.some((item) => item.id === "monstermixology") &&
            !backerEmail && (
              <BackerEmailForm onApplyBackerEmail={handleApplyBackerEmail} />
            )}

          {/* Add backer found message if user has verified backer status */}
          {backerEmail && backerProducts.includes("monstermixology") && (
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                  Backer Verified!
                </h3>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                Your Kickstarter backer status has been verified. Monster
                Mixology has been marked as free.
              </p>
            </div>
          )}

          {/* Payment Section - modified to handle both backer and regular free checkouts */}
          <div
            className={`bg-card p-4 rounded-lg border ${
              (!user && !accountCreated) || disableCheckout
                ? "opacity-60 pointer-events-none relative"
                : ""
            }`}
          >
            {/* Add an overlay for validation issues */}
            {disableCheckout && (
              <div className="absolute inset-0 bg-background/40 flex items-center justify-center z-10 rounded-lg">
                <div className="bg-card p-4 rounded-lg shadow-md border max-w-md text-center">
                  <AlertCircle className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Checkout Unavailable</h4>
                  <p className="text-sm text-muted-foreground">
                    Please resolve the validation issues above to continue.
                  </p>
                </div>
              </div>
            )}

            <h3 className="text-lg font-semibold mb-4 flex items-center">
              {isZeroCostOrder ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Free Product
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment
                </>
              )}
            </h3>

            {isZeroCostOrder ? (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-100 dark:border-green-800">
                  <p className="flex items-center text-green-800 dark:text-green-300">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                    {backerEmail && backerProducts.includes("monstermixology")
                      ? "Your Kickstarter reward is ready to claim!"
                      : "This product is available for free!"}
                  </p>
                  <p className="mt-2 text-sm text-green-700 dark:text-green-300">
                    {backerEmail && backerProducts.includes("monstermixology")
                      ? "Click the button below to unlock your Kickstarter reward."
                      : "Click the button below to add it to your library. No payment required."}
                  </p>
                </div>

                {backerEmail && backerProducts.includes("monstermixology") ? (
                  <BackerClaimButton
                    backerEmail={backerEmail}
                    backerProducts={backerProducts}
                    disabled={disableCheckout || !user}
                  />
                ) : (
                  <FreeCheckoutButton
                    cartItems={cartItems}
                    disabled={disableCheckout || !user}
                  />
                )}
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-6 mr-2 flex items-center justify-center">
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                        alt="Stripe"
                        width={40}
                        height={16}
                      />
                    </div>
                    <span className="text-sm">
                      Secure payment processing by Stripe
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Image
                      src="https://cdn-icons-png.flaticon.com/512/196/196578.png"
                      alt="Visa"
                      width={40}
                      height={25}
                    />
                    <Image
                      src="https://cdn-icons-png.flaticon.com/512/196/196561.png"
                      alt="MasterCard"
                      width={40}
                      height={25}
                    />
                    <Image
                      src="https://cdn-icons-png.flaticon.com/512/196/196539.png"
                      alt="Amex"
                      width={40}
                      height={25}
                    />
                    <Image
                      src="https://cdn-icons-png.flaticon.com/512/196/196565.png"
                      alt="Discover"
                      width={40}
                      height={25}
                    />
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg mb-4 text-sm">
                    <div className="flex items-center text-foreground/80 mb-2">
                      <Lock className="h-4 w-4 mr-2" />
                      <span>Your payment information is secure</span>
                    </div>
                    <div className="flex items-center text-foreground/80">
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      <span>We don&apos;t store your card details</span>
                    </div>
                  </div>
                </div>

                <PaymentButton
                  cartItems={cartItems}
                  total={total}
                  disabled={disableCheckout}
                />
              </>
            )}

            <p className="text-xs text-center text-muted-foreground mt-4">
              By proceeding with your{" "}
              {isZeroCostOrder ? "download" : "purchase"}, you agree to our{" "}
              <Link href="/terms" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Order Summary and Upsell */}
        <div className="lg:col-span-1">
          <OrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            discount={discount}
            total={total}
            onRemoveItem={handleRemoveItem}
          />

          {/* Always show upsell section, regardless of order cost */}
          <UpsellSection cartItems={cartItems} onAddToCart={handleAddToCart} />
        </div>
      </div>
    </div>
  );
});

export default CheckoutPage;
