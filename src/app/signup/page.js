"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { FaGoogle } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MobxStore from "@/mobx";
import { observer } from "mobx-react";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
});

export const SignupForm = observer(() => {
  const { signupWithEmail, upgradeAccount, isUserAnonymous, user } = MobxStore;
  const isAuthenticated = !!user;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  async function onSubmit(values) {
    const { username, email, password } = values;
    setIsLoading(true);

    try {
      if (isAuthenticated && isUserAnonymous) {
        // Upgrade the anonymous account
        await upgradeAccount(email, password, username);
      } else {
        // Regular signup
        await signupWithEmail(email, password, username);
      }
      setIsLoading(false);
      router.push("/"); // Redirect after successful operation
    } catch (error) {
      // Handle errors
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  id="username"
                  type="string"
                  placeholder="First and Last Name"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password (8+ characters)"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading && <CgSpinner className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>
    </Form>
  );
});

export const SignupCard = observer(() => {
  const router = useRouter();
  const { isUserAnonymous, signInWithGoogle } = MobxStore;
  const [isLoading, setIsLoading] = useState(false);
  const handleGoogleSignIn = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      await signInWithGoogle();
      setIsLoading(false);
      router.push("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
      setIsLoading(false); // Reset loading state if an error occurs
    }
  };
  return (
    <div className="box">
      <div className="box-inner ">
        <div className="box-broken py-8 min-w-3xl font-strike">
          <CardHeader className="space-y-1">
            <div className="text-2xl uppercase">
              {isUserAnonymous
                ? "Upgrade to Permanent Account"
                : "Create an account"}
            </div>
            <CardDescription className="text-light">
              {isUserAnonymous
                ? "Don't lose your hard work. Sign up to save your progress."
                : "You must have an account to download any games."}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 gap-6">
              <Button
                variant="reverse"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CgSpinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FaGoogle className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Signing in..." : "Sign in with Google"}
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <SignupForm />
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-light text-sm text-center">
              By continuing, you agree to Pathway&apos;s{" "}
              <Link href="/terms-of-service" className="underline">
                Terms & Conditions
              </Link>{" "}
              and
              <Link href="/privacy-policy" className="underline">
                {" "}
                Privacy Policy
              </Link>
            </div>
            <div className="flex flex-col gap-2 text-center mt-4 text-sm">
              Already Have An Account?{" "}
              <Link href="/login">
                <Button variant="cream" className="w-full">
                  Login
                </Button>
              </Link>
            </div>
          </CardFooter>
        </div>
      </div>
    </div>
  );
});

const SignupPage = observer(() => {
  const router = useRouter();
  const [shouldReturnToCheckout, setShouldReturnToCheckout] = useState(false);

  // Check if we should return to checkout
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShouldReturnToCheckout(
        localStorage.getItem("returnToCheckout") === "true"
      );
    }
  }, []);

  // Handle successful signup
  const handleSignupSuccess = () => {
    if (shouldReturnToCheckout) {
      localStorage.removeItem("returnToCheckout");
      router.push("/checkout");
    } else {
      router.push("/");
    }
  };

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      await MobxStore.signupWithEmail(
        values.email,
        values.password,
        values.username
      );

      toast({
        title: "Account created!",
        description: "You can now log in with your new account.",
        variant: "success",
      });

      handleSignupSuccess();
    } catch (error) {
      // Error handling...
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-8">
      <SignupCard />
    </div>
  );
});

export default SignupPage;
