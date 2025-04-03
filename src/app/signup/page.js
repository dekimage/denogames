"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { FaGoogle } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import MobxStore from "@/mobx";
import { observer } from "mobx-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

// Tell Next.js this page is dynamic and should not be statically generated
export const dynamic = "force-dynamic";

// Loading component for Suspense
function Loading() {
  return (
    <div className="container flex justify-center items-center my-12 md:my-16 px-4">
      <div className="flex flex-col items-center justify-center">
        <CgSpinner className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

const formSchema = z
  .object({
    displayName: z.string().min(2, {
      message: "Display name must be at least 2 characters.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const SignupForm = observer(() => {
  const { toast } = useToast();
  const { signupWithEmail, upgradeAccount, isUserAnonymous, user } = MobxStore;
  const isAuthenticated = !!user;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    const { displayName, email, password } = values;
    setIsLoading(true);
    setError(null);

    try {
      if (isAuthenticated && isUserAnonymous) {
        // Upgrade the anonymous account
        await upgradeAccount(email, password, displayName);
        toast({
          title: "Account upgraded!",
          description: "Your anonymous account has been upgraded successfully.",
        });
      } else {
        // Regular signup
        await signupWithEmail(email, password, displayName);
        toast({
          title: "Account created!",
          description: "Welcome to Deno Games!",
        });
        // Check for redirect parameter
        const searchParams = new URLSearchParams(window.location.search);
        const redirectPath = searchParams.get("redirect");
        router.push(redirectPath || "/");
      }
    } catch (error) {
      console.error("Signup error:", error);
      // Handle different error scenarios
      let errorMessage = "Failed to create account. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already in use. Please use a different email or try logging in.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format. Please check and try again.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "Password is too weak. Please choose a stronger password.";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="text-sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel className="text-sm font-semibold">EMAIL</FormLabel>
              <FormControl>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Email Address"
                  disabled={isLoading}
                  className="bg-background"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel className="text-sm font-semibold">USERNAME</FormLabel>
              <FormControl>
                <Input
                  id="signup-username"
                  type="string"
                  placeholder="Choose a username"
                  disabled={isLoading}
                  className="bg-background"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel className="text-sm font-semibold">PASSWORD</FormLabel>
              <FormControl>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Password (6+ characters)"
                  disabled={isLoading}
                  className="bg-background"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel className="text-sm font-semibold">
                CONFIRM PASSWORD
              </FormLabel>
              <FormControl>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  className="bg-background"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button
          className="w-full font-medium mt-4"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && <CgSpinner className="mr-2 h-4 w-4 animate-spin" />}
          {isUserAnonymous ? "Upgrade Account" : "Create Account"}
        </Button>
      </form>
    </Form>
  );
});

const SignupCardContent = observer(() => {
  const { toast } = useToast();
  const router = useRouter();
  const { signInWithGoogle } = MobxStore;
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState(null);
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setGoogleError(null);
      await signInWithGoogle();
      toast({
        title: "Account created!",
        description: "Welcome to Deno Games!",
      });
      router.push("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
      // Handle different Google sign-in errors
      if (error.code === "auth/popup-closed-by-user") {
        setGoogleError("Sign-in popup was closed. Please try again.");
      } else if (error.code === "auth/cancelled-popup-request") {
        setGoogleError("Another sign-in attempt is in progress.");
      } else {
        setGoogleError("Failed to sign in with Google. Please try again.");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="box max-w-md w-full mx-auto">
      <div className="box-inner">
        <div className="box-broken py-8 px-2 sm:px-6 font-strike">
          <CardHeader className="space-y-2">
            <div className="text-2xl uppercase font-bold text-center">
              Join the Adventure
            </div>
            <CardDescription className="text-center">
              Create an account to start collecting achievements
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 py-4">
            {googleError && (
              <Alert variant="destructive" className="text-sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{googleError}</AlertDescription>
              </Alert>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <CgSpinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FaGoogle className="mr-2 h-4 w-4" />
              )}
              {isGoogleLoading ? "Signing in..." : "Continue with Google"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <SignupForm />
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4 pt-2">
            <div className="text-sm text-muted-foreground">
              Already have an account?
            </div>
            <Link
              href={`/login${redirectPath ? `?redirect=${redirectPath}` : ""}`}
              className="w-full"
            >
              <Button variant="outline" className="w-full">
                Login
              </Button>
            </Link>
          </CardFooter>
        </div>
      </div>
    </div>
  );
});

const SignupPageContent = observer(() => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  useEffect(() => {
    // If user becomes authenticated and we have a redirect path, use it
    if (MobxStore.user && redirectPath) {
      router.push(redirectPath);
    }
  }, [MobxStore.user, redirectPath, router]);

  return (
    <div className="container flex justify-center items-center my-12 md:my-16 px-4">
      <SignupCardContent />
    </div>
  );
});

// Wrap everything in Suspense
const SignupPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <SignupPageContent />
    </Suspense>
  );
};

export default SignupPage;
