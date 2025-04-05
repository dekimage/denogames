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

const formSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
});

export const LoginForm = observer(() => {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loginWithEmail } = MobxStore;
  const isAuthenticated = !!user;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    const { email, password } = values;
    setIsLoading(true);
    setError(null);

    if (isAuthenticated) {
      setIsLoading(false);
      router.push("/");
      return;
    }

    try {
      await loginWithEmail({
        email,
        password,
      });
      toast({
        title: "Login successful!",
        description: "Welcome back to Deno Games.",
      });

      const searchParams = new URLSearchParams(window.location.search);
      const redirectPath = searchParams.get("redirect");

      router.push(redirectPath || "/");
      console.log("redirectPath", redirectPath);
    } catch (error) {
      // Handle different error scenarios
      let errorMessage = "Failed to login. Please try again.";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid login credentials. Please check and try again.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage =
          "Too many failed login attempts. Please try again later.";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 font-strike"
      >
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
                  id="login-email"
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
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel className="text-sm font-semibold">PASSWORD</FormLabel>
              <FormControl>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Password"
                  disabled={isLoading}
                  className="bg-background"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="text-right">
          <Link
            href="/reset-password"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          className="w-full font-medium"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && <CgSpinner className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>
    </Form>
  );
});

const LoginCardContent = observer(() => {
  const router = useRouter();
  const { toast } = useToast();
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
        title: "Login successful!",
        description: "Welcome to Deno Games.",
      });

      const searchParams = new URLSearchParams(window.location.search);
      const redirectPath = searchParams.get("redirect");

      await router.push(redirectPath || "/");
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
              Welcome Back!
            </div>
            <CardDescription className="text-center">
              Glad to see you again! Log in to continue your journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 py-4">
            {googleError && (
              <Alert variant="destructive" className="text-sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{googleError}</AlertDescription>
              </Alert>
            )}

            {/* <Button
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
            </Button> */}

            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div> */}

            <LoginForm />
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4 pt-2">
            <div className="text-sm text-muted-foreground">
              Don&apos;t have an account?
            </div>
            <Link
              href={`/signup${redirectPath ? `?redirect=${redirectPath}` : ""}`}
              className="w-full"
            >
              <Button variant="outline" className="w-full">
                Create Account
              </Button>
            </Link>
          </CardFooter>
        </div>
      </div>
    </div>
  );
});

const LoginPageContent = observer(() => {
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
      <LoginCardContent />
    </div>
  );
});

// Wrap everything in Suspense
const LoginPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <LoginPageContent />
    </Suspense>
  );
};

export default LoginPage;
