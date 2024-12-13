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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full">
        {/* <div className="absolute top-0 left-0 z-10">
          <Image
            src="/landing/monster-mixology/a4.png"
            alt="Monster Mixology Game"
            className="w-[300px] h-[250px]"
            width={600}
            height={300}
          />
        </div> */}
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
      <main className="container px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-strike mb-8">
            {/* Play Monster Mixology for FREE! */}
            Download Monster Mixology Files
          </h1>

          <div className="flex justify-center items-center mb-8">
            <ChevronDown className="w-10 h-10" />
          </div>
          {/* <p className="text-xl mb-8">
            Play the basic version for FREE right now!
          </p> */}

          <form onSubmit={handleDownload} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              className="w-full bg-green-400 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send files to my email"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
