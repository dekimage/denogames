"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  // FAQ data - 5 dummy questions and answers
  const faqs = [
    {
      question: "How do I download my purchased games?",
      answer:
        "After purchase, navigate to your account's 'My Games' page. All your purchased games will be listed there with download buttons. Each game comes with a unique PDF that you can print and play immediately.",
    },
    {
      question: "What do I need to play your print and play games?",
      answer:
        "To enjoy our games, you'll need a printer (preferably color), scissors or a paper cutter, and sometimes basic crafting supplies like glue, cardstock, or laminating sheets. Each game provides specific requirements in its description page and downloadable instructions.",
    },
    {
      question: "Can I share my purchased games with friends?",
      answer:
        "Each purchase is for personal use only. While you're welcome to play the games with friends and family, redistributing or sharing the downloadable files is not permitted according to our Terms of Service. Consider purchasing gift codes for friends who might enjoy our games!",
    },
    {
      question: "Do you offer refunds if I'm not satisfied?",
      answer:
        "Due to the digital nature of our products, we generally don't offer refunds after the downloadable content has been accessed. However, we're committed to customer satisfaction - if you encounter any issues with your purchase, please contact us at denogames.official@gmail.com and we'll work to make it right.",
    },
    {
      question: "How often do you release new games or expansions?",
      answer:
        "We typically release new games quarterly and expansions monthly. The best way to stay updated is by subscribing to our newsletter or joining our Patreon where members get early access to all new releases and exclusive content.",
    },
  ];

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
          Frequently Asked Questions
        </h1>

        <p className="text-muted-foreground mb-8">
          Find answers to common questions about our games, purchasing process,
          and more. If you don&apos;t see your question answered here, please
          feel free to contact us at{" "}
          <Link
            href="mailto:denogames.official@gmail.com"
            className="text-primary hover:underline"
          >
            denogames.official@gmail.com
          </Link>
        </p>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg md:text-xl font-medium text-left py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-4">
            We&apos;re here to help! If you couldn&apos;t find the answer you
            were looking for, please don&apos;t hesitate to reach out to us
            directly.
          </p>
          <Button asChild>
            <Link href="mailto:denogames.official@gmail.com">
              Contact Support
            </Link>
          </Button>
        </div>

        <footer className="mt-12 text-sm text-muted-foreground border-t pt-4">
          <p>Last updated: April 1, 2025</p>
        </footer>
      </div>
    </div>
  );
}
