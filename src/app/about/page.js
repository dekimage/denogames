"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Facebook, Instagram } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function About() {
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
          About Us
        </h1>

        <div className="mb-12">
          <div className="relative w-full h-[200px] md:h-[300px] mb-8 rounded-lg overflow-hidden">
            <Image
              src="/about-banner.jpg"
              alt="Deno Games - Print and Play Board Games"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          </div>

          <p className="text-lg text-muted-foreground mb-6">
            Hey friend! We&apos;re Deno & Maca, the duo behind Deno Games.
            We&apos;re just two passionate creators who love games, one of us
            loves building them, the other loves testing and showing them to the
            world.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-muted/20 p-6 rounded-lg flex flex-col items-center">
              <div className="relative w-[180px] h-[180px] rounded-full overflow-hidden mb-4">
                <Image
                  src="/deno.jpg"
                  alt="Deno"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-full"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Deno</h3>
              <p className="text-muted-foreground text-center mb-4">
                The brain behind the games. A lifelong game lover, designer, and
                developer. He&apos;s been into games since he was a kid, and now
                he finally gets to create ones and share them with the world. If
                there&apos;s a rule to tweak, a mechanic to test, or a deck to
                build, he&apos;s already deep in it.
              </p>
              <Button variant="outline" size="sm" className="mt-auto" asChild>
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
            </div>

            <div className="bg-muted/20 p-6 rounded-lg flex flex-col items-center">
              <div className="relative w-[180px] h-[180px] rounded-full overflow-hidden mb-4">
                <Image
                  src="/maca.jpg"
                  alt="Maca"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-full"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Maca</h3>
              <p className="text-muted-foreground text-center mb-4">
                The soul of our projects. She&apos;s our marketing wizard,
                playtester-in-chief, and the person who makes sure everything we
                do actually gets seen and played! She loves helping people
                discover new games and always brings the fun energy.
              </p>
              <Button variant="outline" size="sm" className="mt-auto" asChild>
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
            </div>
          </div>

          <p className="text-muted-foreground mb-6">
            We&apos;re both passionate about games that are exciting, fun, and
            easy to setup.
          </p>
          <p className="text-muted-foreground mb-6">
            That&apos;s why we make print-and-play experiences that&apos;s not
            only fun and fast to set up, but also packed with smart design and
            endless replayability. This platform is our way of bringing creative
            print and play games.
          </p>
          <p className="text-muted-foreground mb-8">
            We&apos;re so excited you&apos;re here to be part of it!
          </p>
          <p className="text-muted-foreground italic mb-12">
            With love,
            <br />
            Deno & Maca
          </p>

          <h2 className="text-2xl font-bold mb-4">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Unique Download System</h3>
              <p className="text-muted-foreground">
                Each game purchase generates a unique PDF file, ensuring that
                your copy has special features and variations that make every
                game session a new experience.
              </p>
            </div>
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Instant Gratification</h3>
              <p className="text-muted-foreground">
                No waiting for shipping or dealing with inventory problems.
                Download, print, and play your new game within minutes of
                purchase.
              </p>
            </div>
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Companion Apps</h3>
              <p className="text-muted-foreground">
                We create companion apps for our games that either help you save
                time on cutting and assembling files/cards or introduce cool new
                mechanics that aren&apos;t possible in physical format alone.
              </p>
            </div>
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Creative Authentic Art</h3>
              <p className="text-muted-foreground">
                Our games feature original artwork and invite you to explore
                weird and wonderful worlds with unique themes and settings you
                won&apos;t find anywhere else.
              </p>
            </div>
          </div>
        </div>

        {/* Join Our Community Section - Disabled for now
        <div className="bg-primary/10 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
          <p className="text-muted-foreground mb-4">
            Deno Games is more than just a game company - it&apos;s a community
            of like-minded individuals who share a passion for tabletop gaming.
            We invite you to join us on this creative journey!
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/newsletter">Subscribe to Newsletter</Link>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://discord.gg/denogames"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Discord Community
              </a>
            </Button>
          </div>
        </div>
        */}

        <footer className="mt-12 text-sm text-muted-foreground border-t pt-4">
          <p>© {new Date().getFullYear()} Deno Games. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
