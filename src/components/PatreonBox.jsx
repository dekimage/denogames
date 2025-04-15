"use client";
import Image from "next/image";
import { ExternalLink, Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import patreonImg from "@/assets/patreonCover.png";
import patreonLogo from "@/assets/patreon-logo.png";

export const PatreonBox = () => {
  const patreonLink = "https://patreon.com/deno_games";

  return (
    <div className="w-full rounded-xl overflow-hidden border bg-card shadow-lg flex flex-col">
      {/* Top Section */}
      <div className="p-8 border-b bg-muted/50">
        <div className="flex items-center gap-3 mb-4 flex-col">
          <Image
            src={patreonLogo}
            alt="Patreon"
            width={1920}
            height={1920}
            className="w-[140px] h-[100px]"
          />
          <h2 className="text-4xl font-strike text-center">
            Patreon Monthly Subscription Game Box
          </h2>
          <div className="inline-block bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full">
            NEW
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative w-full aspect-video md:aspect-[2.5/1]">
        <Image
          src={patreonImg}
          alt="Patreon Benefits"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Middle Section (Perks and CTAs) */}
      <div className="p-8 bg-muted/50">
        <p className="text-2xl font-strike mb-6 text-muted-foreground">
          Support Deno on Patreon to get these rewards:
        </p>

        {/* Benefits Lists Container */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-8">
          {/* Paid Benefits Column */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="h-6 w-6 text-yellow-500" />
              <h3 className="font-strike text-xl">Paid Membership Perks</h3>
            </div>
            <ul className="space-y-2.5">
              {[
                "Monthly Game Box with Exclusive Content",
                "Early Access to New Releases",
                "Exclusive Behind-the-Scenes Content",
                "Priority Support",
                "Vote on Future Game Features",
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base">{benefit}</span>
                </li>
              ))}
            </ul>
            {/* Paid Member Button - Moved Here */}
            <div className="pt-4">
              {" "}
              {/* Added padding top for spacing */}
              <Button asChild className="w-full sm:w-auto">
                <a
                  href={patreonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2"
                >
                  <span>Become a Paid Member</span>
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block border-l border-muted mx-4"></div>

          {/* Free Benefits Column */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="h-6 w-6 text-blue-500" />
              <h3 className="font-strike text-xl">Free Account Perks</h3>
            </div>
            <ul className="space-y-2.5">
              {[
                "Access to Secret Codes",
                "Occasional Free Games",
                "Special Community Events",
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base">{benefit}</span>
                </li>
              ))}
            </ul>
            {/* Free Member Button - Moved Here */}
            <div className="pt-4">
              {" "}
              {/* Added padding top for spacing */}
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <a
                  href={patreonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2"
                >
                  <span>Become Free Member</span>
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        {/* Removed the separate button container div */}
      </div>

      {/* Bottom Section */}
      <div className="p-8 border-t bg-muted/80">
        <div className="text-center">
          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-muted/50 px-4 text-sm text-muted-foreground">
                Already a Patron?
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="inline-flex items-center justify-center gap-2 mx-auto"
          >
            Connect via Patreon Auth
          </Button>
        </div>
        <div className="mt-8 space-y-2 text-sm text-muted-foreground text-center md:text-left">
          <p>
            *Note: All game assets and rewards will be automatically sent at the
            1st of every month and available in "My Games" collection of your
            connected account.
          </p>
          <p>
            **You may also connect your FREE Patreon account to access secret
            codes for collectibles and occasional FREE games that we drop.
          </p>
        </div>
      </div>
    </div>
  );
};
