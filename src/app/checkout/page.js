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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import PaymentButton from "@/components/PaymentButton";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
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
          src={product.image || "https://via.placeholder.com/80"}
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
          <Badge variant="outline" className="w-fit mt-1 text-xs">
            {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
          </Badge>
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
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

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
          variant: "success",
        });
      } else {
        toast({
          title: "Invalid code",
          description: "The discount code you entered is invalid or expired.",
          variant: "destructive",
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

const GuestCheckoutForm = ({ onComplete }) => {
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
    <div className="bg-gray-50 p-6 rounded-lg border mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <User className="mr-2 h-5 w-5" />
        Create Account
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Create an account to complete your purchase and access your games after
        checkout.
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <LoadingSpinner /> : "Create Account & Continue"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline">
              Log in
            </Link>
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
          src={product.image || "https://via.placeholder.com/80"}
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
            <Badge variant="outline" className="text-xs">
              {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
            </Badge>
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

// Update the UpsellSection to filter out items already in cart
const UpsellSection = ({ cartItems, onAddToCart }) => {
  const { products, cart } = MobxStore;
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Find related products based on cart items
    if (cartItems.length > 0 && products.length > 0) {
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
          // Find expansions for games in cart
          ((product.type === "expansion" &&
            product.relatedGames &&
            product.relatedGames.some((gameId) =>
              cartGameIds.includes(gameId)
            )) ||
            // Or find games related to expansions in cart
            (product.type === "game" &&
              cartProductTypes.includes("expansion") &&
              cartItems.some(
                (item) =>
                  item.type === "expansion" &&
                  item.relatedGames &&
                  item.relatedGames.includes(product.id)
              )))
      );

      // If we don't have enough related products, add some popular ones
      if (related.length < 3) {
        const popular = products
          .filter(
            (p) =>
              !cartProductIds.includes(p.id) &&
              !related.some((r) => r.id === p.id)
          )
          .sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0))
          .slice(0, 3 - related.length);

        related = [...related, ...popular];
      }

      // Limit to 3 products
      setRelatedProducts(related.slice(0, 3));
    }
  }, [cartItems, products, cart]); // Add cart as dependency to update when cart changes

  if (relatedProducts.length === 0) return null;

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm mt-6">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Frequently Bought Together
        </h3>
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

const CheckoutPage = observer(() => {
  const router = useRouter();
  const { cart, products, user, removeFromCart, addToCart } = MobxStore;
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [accountCreated, setAccountCreated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load cart items
    const loadCartItems = async () => {
      setLoading(true);

      // Add a small delay to ensure we show the loading state
      await new Promise((resolve) => setTimeout(resolve, 300));

      try {
        const items = cart
          .map((id) => {
            const product = products.find((p) => p.id === id);
            return product || null;
          })
          .filter(Boolean);

        setCartItems(items);

        // Calculate subtotal
        const calculatedSubtotal = items.reduce(
          (sum, item) => sum + (item.price || 0),
          0
        );
        setSubtotal(calculatedSubtotal);

        // Calculate total (considering discount)
        const calculatedTotal = calculatedSubtotal - discount;
        setTotal(calculatedTotal);
      } catch (error) {
        console.error("Error loading cart items:", error);
        toast({
          title: "Error",
          description: "Failed to load cart items. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCartItems();
  }, [cart, products, discount, toast]);

  const handleApplyDiscount = (discountPercentage) => {
    const discountAmount = Math.round((subtotal * discountPercentage) / 100);
    setDiscount(discountAmount);
    setTotal(subtotal - discountAmount);
  };

  const handleAccountCreated = () => {
    setAccountCreated(true);
  };

  const handleRemoveItem = (productId) => {
    // Remove from MobX store first
    removeFromCart(productId);

    // Then update local state to reflect the removal
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );

    // Recalculate subtotal and total
    const removedItem = cartItems.find((item) => item.id === productId);
    if (removedItem) {
      const newSubtotal = subtotal - removedItem.price;
      setSubtotal(newSubtotal);

      // Recalculate total with discount
      setTotal(newSubtotal - discount);
    }
  };

  const handleAddToCart = (product) => {
    // First check if product is already in cart to avoid duplicates
    if (!cart.includes(product.id)) {
      // Add to MobX store first
      addToCart(product);

      // Then update local state
      setCartItems((prevItems) => [...prevItems, product]);

      // Update totals
      setSubtotal((prev) => prev + product.price);
      setTotal((prev) => prev + product.price - discount);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 flex flex-col justify-center items-center min-h-[60vh]">
        <LoadingSpinner size={40} />
        <p className="mt-4 text-muted-foreground">Loading your checkout...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 max-w-4xl">
        <div className="text-center py-16">
          <div className="bg-gray-50 p-6 rounded-full inline-flex mb-4">
            <AlertCircle className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="mb-8 text-muted-foreground">
            You don't have any items in your cart. Add some products to proceed
            with checkout.
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

  return (
    <div className="container mx-auto py-16 px-4 max-w-6xl">
      <div className="mb-8">
        <Link
          href="/shop"
          className="text-muted-foreground hover:text-foreground flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Account Section */}
          {!user && !accountCreated ? (
            <GuestCheckoutForm onComplete={handleAccountCreated} />
          ) : (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-green-800">
                  {user ? "Logged in" : "Account created"}
                </h3>
              </div>
              <p className="text-sm text-green-700 mt-2">
                {user
                  ? `You're logged in as ${user.email || user.username}`
                  : "Your account has been created successfully. You'll be able to access your games after purchase."}
              </p>
            </div>
          )}

          {/* Discount Code Section */}
          <div className="bg-white p-6 rounded-lg border mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Tag className="mr-2 h-5 w-5" />
              Discount Code
            </h3>
            <DiscountForm onApplyDiscount={handleApplyDiscount} />
          </div>

          {/* Payment Section */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Payment
            </h3>

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

              <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm">
                <div className="flex items-center text-gray-700 mb-2">
                  <Lock className="h-4 w-4 mr-2" />
                  <span>Your payment information is secure</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  <span>We don't store your card details</span>
                </div>
              </div>
            </div>

            <PaymentButton cartItems={cartItems} total={total} />

            <p className="text-xs text-center text-muted-foreground mt-4">
              By proceeding with your purchase, you agree to our{" "}
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

          {/* Add the new upsell section */}
          <UpsellSection cartItems={cartItems} onAddToCart={handleAddToCart} />
        </div>
      </div>
    </div>
  );
});

export default CheckoutPage;
