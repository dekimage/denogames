"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            1. INTRODUCTION
          </h2>
          <p className="mb-4 text-muted-foreground">
            Deno Games (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
            committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when
            you use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            2. INFORMATION WE COLLECT
          </h2>
          <p className="mb-4 text-muted-foreground">
            We may collect personal information that you provide directly to us,
            such as your name, email address, and other information you choose
            to provide. We may also automatically collect certain information
            about your device and how you interact with our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            3. USE OF INFORMATION
          </h2>
          <p className="mb-4 text-muted-foreground">
            We use the information we collect to provide, maintain, and improve
            our services, to communicate with you, and to comply with legal
            obligations. We may also use your information to personalize your
            experience and to send you promotional materials.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            4. SHARING OF INFORMATION
          </h2>
          <p className="mb-4 text-muted-foreground">
            We may share your information with third-party service providers who
            perform services on our behalf, with your consent, or as required by
            law. We do not sell your personal information to third parties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            5. DATA SECURITY
          </h2>
          <p className="mb-4 text-muted-foreground">
            We implement appropriate technical and organizational measures to
            protect the security of your personal information. However, please
            be aware that no method of transmission over the internet or
            electronic storage is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">6. YOUR RIGHTS</h2>
          <p className="mb-4 text-muted-foreground">
            Depending on your location, you may have certain rights regarding
            your personal information, such as the right to access, correct, or
            delete your data. Please contact us to exercise these rights.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            7. CHILDREN&apos;S PRIVACY
          </h2>
          <p className="mb-4 text-muted-foreground">
            Our services are not intended for children under the age of 13. We
            do not knowingly collect personal information from children under
            13. If you are a parent or guardian and believe we may have
            collected information about a child, please contact us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            8. CHANGES TO THIS POLICY
          </h2>
          <p className="mb-4 text-muted-foreground">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            9. CONTACT INFORMATION
          </h2>
          <p className="mb-4 text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>
          <div className="p-4 bg-muted rounded-md text-muted-foreground">
            <p className="mb-2">Deno Games</p>
            <p className="mb-2">dejan.official@gmail.com</p>
          </div>
        </section>

        <footer className="mt-12 text-sm text-muted-foreground border-t pt-4">
          <p>Last updated: March 26, 2025</p>
        </footer>
      </div>
    </div>
  );
}
