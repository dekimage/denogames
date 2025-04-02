"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 border-b pb-4">
          Terms of Service
        </h1>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            1. ACCEPTANCE OF TERMS
          </h2>
          <p className="mb-4 text-muted-foreground">
            Welcome to Deno Games. By accessing or using our services, you agree
            to be bound by these Terms of Service (&quot;Terms&quot;). If you do
            not agree to these Terms, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            2. CHANGES TO TERMS
          </h2>
          <p className="mb-4 text-muted-foreground">
            Deno Games reserves the right to modify these Terms at any time. We
            will notify users of any significant changes. Your continued use of
            our services after such modifications constitutes your acceptance of
            the updated Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            3. PRIVACY POLICY
          </h2>
          <p className="mb-4 text-muted-foreground">
            Your use of Deno Games&apos; services is also governed by our
            <Link
              href="/privacy-policy"
              className="text-primary hover:underline mx-1"
            >
              Privacy Policy
            </Link>
            which can be found on our website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            4. USER ACCOUNTS
          </h2>
          <p className="mb-4 text-muted-foreground">
            You may be required to create an account to access certain features
            of our services. You are responsible for maintaining the
            confidentiality of your account information and for all activities
            that occur under your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            5. INTELLECTUAL PROPERTY
          </h2>
          <p className="mb-4 text-muted-foreground">
            All content and materials available through Deno Games&apos;
            services are the property of Deno Games or its licensors and are
            protected by copyright, trademark, and other intellectual property
            laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            6. LIMITATION OF LIABILITY
          </h2>
          <p className="mb-4 text-muted-foreground">
            Deno Games shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages resulting from your use
            of or inability to use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            7. GOVERNING LAW
          </h2>
          <p className="mb-4 text-muted-foreground">
            These Terms shall be governed by and construed in accordance with
            the laws of the jurisdiction where Deno Games is registered, without
            regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            8. CONTACT INFORMATION
          </h2>
          <p className="mb-4 text-muted-foreground">
            If you have any questions about these Terms, please contact us at:
          </p>
          <div className="p-4 bg-muted rounded-md text-muted-foreground">
            <p className="mb-2">Deno Games</p>
            <p>denogames.official@gmail.com</p>
          </div>
        </section>

        <footer className="mt-12 text-sm text-muted-foreground border-t pt-4">
          <p>Last updated: March 26, 2025</p>
        </footer>
      </div>
    </div>
  );
}
