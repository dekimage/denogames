// src/components/PatreonBox.jsx
"use client";
import Image from "next/image";
import { ExternalLink, Check, Crown } from "lucide-react";

export const PatreonBox = () => {
  return (
    <div className="w-full rounded-xl overflow-hidden border bg-card shadow-lg">
      <div className="flex flex-col md:flex-row">
        {/* Left Content Side */}
        <div className="flex-1 p-8">
          {/* Patreon Logo and Title */}
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/assets/patreon.svg"
              alt="Patreon"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <h2 className="text-2xl font-bold">
              Patreon Monthly Subscription Game Box
            </h2>
          </div>

          {/* NEW Badge */}
          <div className="inline-block bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full mb-6">
            NEW
          </div>

          {/* Description */}
          <p className="text-lg mb-6 text-muted-foreground">
            Support Deno on Patreon to get these rewards:
          </p>

          {/* Benefits Lists */}
          <div className="space-y-6 mb-8">
            {/* Paid Benefits */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Crown className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold text-lg">Paid Membership Perks</h3>
              </div>
              <ul className="space-y-2">
                {[
                  "Monthly Game Box with Exclusive Content",
                  "Early Access to New Releases",
                  "Exclusive Behind-the-Scenes Content",
                  "Priority Support",
                  "Vote on Future Game Features",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Free Benefits */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Crown className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-lg">Free Account Perks</h3>
              </div>
              <ul className="space-y-2">
                {[
                  "Access to Secret Codes",
                  "Occasional Free Games",
                  "Special Community Events",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <a
              href="https://patreon.com/your-page"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-[#FF424D] text-white rounded-lg font-semibold hover:bg-[#FF424D]/90 transition-colors"
            >
              <span>View on Patreon</span>
              <ExternalLink className="h-5 w-5" />
            </a>

            <div className="text-center">
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-4 text-sm text-muted-foreground">
                    Already a Patron?
                  </span>
                </div>
              </div>

              <button className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#FF424D] text-[#FF424D] rounded-lg font-semibold hover:bg-[#FF424D]/10 transition-colors">
                Connect via Patreon Auth
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p>
              *Note: All game assets and rewards will be automatically sent at
              the 1st of every month and available in "My Games" collection of
              your connected account.
            </p>
            <p>
              **You may also connect your FREE Patreon account to access secret
              codes for collectibles and occasional FREE games that we drop.
            </p>
          </div>
        </div>

        {/* Right Image Side */}
        <div className="relative w-full md:w-[40%] min-h-[300px] md:min-h-full">
          <Image
            src="/assets/patreonCover.png"
            alt="Patreon Benefits"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
};
