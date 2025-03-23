"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MobxStore from "@/mobx";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CgSpinner } from "react-icons/cg";
import { AlertCircle, ArrowLeft } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const PasswordResetPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    setError(null);

    try {
      await MobxStore.sendPasswordReset(values.email);
      setIsSubmitted(true);
      toast({
        title: "Reset email sent",
        description: "Check your inbox for password reset instructions.",
        variant: "success",
      });
    } catch (error) {
      console.error("Password reset error:", error);

      let errorMessage = "Failed to send reset email. Please try again.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format. Please check and try again.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many reset attempts. Please try again later.";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex justify-center items-center my-12 md:my-16 px-4">
      <div className="box max-w-md w-full mx-auto">
        <div className="box-inner">
          <div className="box-broken py-8 px-2 sm:px-6 font-strike">
            <CardHeader className="space-y-2">
              <div className="text-2xl uppercase font-bold text-center">
                Reset Password
              </div>
              <CardDescription className="text-center">
                {!isSubmitted
                  ? "Enter your email address and we'll send you a link to reset your password."
                  : "Password reset email sent! Check your inbox for further instructions."}
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6 py-4">
              {error && (
                <Alert variant="destructive" className="text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isSubmitted ? (
                <div className="bg-primary/10 rounded-md p-4 text-center">
                  <p className="text-sm">
                    We've sent a password reset link to your email address. The
                    link will expire in 1 hour for security reasons.
                  </p>
                </div>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel className="text-sm font-semibold">
                            EMAIL
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter your email address"
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
                      {isLoading && (
                        <CgSpinner className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>

            <CardFooter className="flex flex-col items-center gap-4 pt-2">
              <Link
                href="/login"
                className="flex items-center text-sm text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </CardFooter>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
