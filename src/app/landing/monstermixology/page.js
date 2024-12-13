"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function MonsterMixologyPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async (e) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to send email");

      toast({
        title: "Success!",
        description: "Check your email for the download link!",
      });
      setEmail("");
    } catch (error) {
      console.log("Error sending email:", error);
      toast({
        variant: "destructive",
        title: "Uh oh!",
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <div className="h-[40vh] w-full">
        <div className="absolute top-40 left-[65%] z-10">
          <Image
            src="/landing/monster-mixology/app.png"
            alt="Monster Mixology APP"
            className="w-[300px] h-auto"
            width={1000}
            height={1000}
          />
        </div>
        <div className="absolute inset-0">
          <Image
            // src="/pozadina.png"
            src="/landing/monster-mixology/a4.png"
            alt="Monster Mixology game artwork showing various potion ingredients and quirky monsters"
            className="h-[40vh] w-full object-cover"
            width={2000}
            height={400}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="container px-4 mt-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-strike mb-8">
            Download Monster Mixology Files
          </h1>

          <div className="flex justify-center items-center mb-8">
            <ChevronDown className="w-10 h-10" />
          </div>
        </div>
      </main>

      {/* Fixed Form at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
        <div className="container max-w-2xl mx-auto ">
          <form onSubmit={handleDownload} className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-[40px]"
            />
            <Button
              type="submit"
              className="bg-green-400 text-white whitespace-nowrap"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send files to my email"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
