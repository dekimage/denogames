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
import MobxStore from "@/mobx";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";

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
  const { user, loginWithEmail } = MobxStore;
  const isAuthenticated = !!user;

  const [isLoading, setIsLoading] = useState(false);
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

    if (isAuthenticated) {
      setIsLoading(false);
      router.push("/");
      return;
    }

    await loginWithEmail({
      email,
      password,
    });
    setIsLoading(false);
    router.push("/");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 font-strike"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>EMAIL</FormLabel>
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
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>PASSWORD</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
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
          Login
        </Button>
      </form>
    </Form>
  );
});

const LoginCard = observer(() => {
  const router = useRouter();
  const { signInWithGoogle } = MobxStore;
  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    router.push("/");
  };
  return (
    <div className="box">
      <div className="box-inner ">
        <div className="box-broken p-10 py-16 min-w-3xl font-strike">
          <CardHeader className="space-y-1">
            <div className="text-2xl uppercase">Welcome Back!</div>
            <CardDescription>
              Glad to see you again! Log in to continue your journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 gap-6">
              <Button variant="reverse" onClick={handleGoogleSignIn}>
                <FaGoogle className="mr-2 h-4 w-4" />
                Google
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
            <LoginForm />
          </CardContent>
          <CardFooter>
            <div className="flex flex-col text-center text-sm w-full gap-2">
              Don&apos;t have account?&nbsp;
              <Link href="/signup">
                <Button variant="cream" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
          </CardFooter>
        </div>
      </div>
    </div>
  );
});

const LoginPage = observer(() => {
  const router = useRouter();

  useEffect(() => {
    // If user is fully loaded and authenticated
    if (MobxStore.userFullyLoaded && MobxStore.user) {
      // Check for redirect URL
      const redirectUrl = localStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        localStorage.removeItem("redirectAfterLogin"); // Clean up
        router.push(redirectUrl);
      }
    }
  }, [router]);

  // Handle successful login
  const handleLoginSuccess = () => {
    const redirectUrl = localStorage.getItem("redirectAfterLogin");
    if (redirectUrl) {
      localStorage.removeItem("redirectAfterLogin");
      router.push(redirectUrl);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex justify-center items-center mt-8">
      <LoginCard />
    </div>
  );
});

export default LoginPage;
