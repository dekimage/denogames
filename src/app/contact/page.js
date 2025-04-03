"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  Send,
  ExternalLink,
  Instagram,
  Facebook,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Contact() {
  // State to track if component is mounted (client-side)
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after component mounts to avoid SSR issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Function to handle email click and open mail client
  const handleEmailClick = () => {
    // Create a hidden anchor element to trigger the mail client
    const emailLink = document.createElement("a");
    emailLink.href = "mailto:denogames.official@gmail.com";
    emailLink.target = "_blank";
    emailLink.rel = "noopener noreferrer";
    document.body.appendChild(emailLink);
    emailLink.click();
    document.body.removeChild(emailLink);
  };

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
          Contact Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl flex items-center">
                <Mail className="mr-2 h-5 w-5 text-primary" />
                Email Us
              </CardTitle>
              <CardDescription>Send us an email anytime</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-primary text-xs">
                denogames.official@gmail.com
              </p>
              {isMounted ? (
                <Button className="w-full" onClick={handleEmailClick}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              ) : (
                <Button className="w-full" asChild>
                  <a href="mailto:denogames.official@gmail.com">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Message
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                Social Media
              </CardTitle>
              <CardDescription>Connect with us online</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full" asChild>
                <a
                  href="https://www.instagram.com/deno_games"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                  <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <a
                  href="https://www.facebook.com/dejan.gavrilovic.73/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                  <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl flex items-center">
                <Send className="mr-2 h-5 w-5 text-primary" />
                Response Time
              </CardTitle>
              <CardDescription>When to expect a reply</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We typically respond within 1-2 business days, but sometimes we
                may not get the message notification. In case you want to
                connect faster, please send a DM on Instagram (Maca) or DM me on
                Facebook (Deno).
              </p>
            </CardContent>
          </Card>
        </div>
        {/* disabled-feature */}
        {/* <div className="bg-muted/30 p-6 rounded-lg border border-muted">
          <h2 className="text-2xl font-bold mb-4">
            Want to connect with Deno?
          </h2>
          <p className="mb-6 text-muted-foreground">
            I'm always happy to chat directly with gamers and backers. Reach out
            through my personal channels and we can even set up a call:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button variant="outline" className="w-full" asChild>
              <a
                href="https://www.facebook.com/dejan.gavrilovic.73/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <Facebook className="h-5 w-5 mr-2" />
                My Personal Facebook
                <ExternalLink className="h-3 w-3 ml-2" />
              </a>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <a
                href="https://wa.me/+yourphonenumberhere" // Replace with your actual WhatsApp number
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Me
                <ExternalLink className="h-3 w-3 ml-2" />
              </a>
            </Button>
          </div>

          {isMounted ? (
            <Button size="lg" className="w-full" onClick={handleEmailClick}>
              <Mail className="mr-2 h-5 w-5" />
              Or Send Me an Email
            </Button>
          ) : (
            <Button size="lg" className="w-full" asChild>
              <a href="mailto:denogames.official@gmail.com">
                <Mail className="mr-2 h-5 w-5" />
                Or Send Me an Email
              </a>
            </Button>
          )}
        </div> */}
      </div>
    </div>
  );
}
