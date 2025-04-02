"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    try {
      // In a real implementation, you would send the data to your API here
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus({
        success: true,
        message: "Your message has been sent! We'll get back to you soon.",
      });
      // Reset form
      setFormState({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: "There was an error sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <CardContent>
              <a
                href="mailto:denogames.official@gmail.com"
                className="text-primary hover:underline"
              >
                denogames.official@gmail.com
              </a>
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
            <CardContent className="space-y-2">
              <p>
                <a
                  href="https://discord.gg/denogames"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Discord
                </a>
              </p>
              <p>
                <a
                  href="https://twitter.com/denogames"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Twitter
                </a>
              </p>
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
                We typically respond within 1-2 business days.
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formState.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formState.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="How can we help you?"
              value={formState.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Please provide details about your inquiry..."
              className="min-h-[150px]"
              value={formState.message}
              onChange={handleChange}
              required
            />
          </div>

          {submitStatus && (
            <div
              className={`p-4 rounded-md ${
                submitStatus.success
                  ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                  : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Sending...</span>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </>
            ) : (
              <>
                Send Message
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
