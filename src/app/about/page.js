"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
          About Deno Games
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
            Welcome to Deno Games, where creativity meets accessibility in the
            world of tabletop gaming!
          </p>

          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-muted-foreground mb-6">
            Founded in 2022 by game designer and developer Dejan Noveski, Deno
            Games was born from a passion for creating engaging, accessible
            tabletop games that anyone can enjoy. What started as a hobby
            designing games for friends and family has grown into a boutique
            print-and-play game studio with a dedicated community of players
            around the world.
          </p>

          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            At Deno Games, we believe that great gaming experiences should be
            accessible to everyone. Our mission is to create high-quality
            print-and-play board games that bring people together, spark
            imagination, and provide hours of entertainment without breaking the
            bank. We're committed to designing games that are easy to learn,
            challenging to master, and most importantly, fun to play again and
            again.
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
              <h3 className="text-xl font-bold mb-3">Eco-Friendly</h3>
              <p className="text-muted-foreground">
                Our digital-first approach reduces the carbon footprint
                associated with traditional board game manufacturing and
                shipping. Print only what you need!
              </p>
            </div>
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Community-Driven</h3>
              <p className="text-muted-foreground">
                We actively listen to player feedback and involve our community
                in the development process, resulting in games that continuously
                improve and evolve.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Meet the Creator</h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
            <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/creator-avatar.jpg"
                alt="Dejan Noveski"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-full"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Dejan Noveski</h3>
              <p className="text-muted-foreground mb-4">
                Game Designer & Developer
              </p>
              <p className="text-muted-foreground">
                With a background in software development and a lifelong love of
                board games, Dejan brings a unique perspective to game design.
                Combining technical expertise with creative storytelling, his
                games feature innovative mechanics and engaging themes that
                appeal to both casual players and dedicated hobbyists. When not
                designing games, Dejan enjoys hiking, reading fantasy novels,
                and playtesting new game ideas with friends.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary/10 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
          <p className="text-muted-foreground mb-4">
            Deno Games is more than just a game company - it's a community of
            like-minded individuals who share a passion for tabletop gaming. We
            invite you to join us on this creative journey!
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

        <footer className="mt-12 text-sm text-muted-foreground border-t pt-4">
          <p>© {new Date().getFullYear()} Deno Games. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
