"use client";
import Image from "next/image";
import { ExternalLink, Check, Crown, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import patreonImg from "@/assets/patreonCover.png";
import patreonLogo from "@/assets/patreon-logo.png";
import { useToast } from "@/components/ui/use-toast";
import MobxStore from "@/mobx";
import { observer } from "mobx-react";
import { useState } from "react";
import { getAuth, getIdToken } from "firebase/auth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// --- NEW Patreon Logo SVG (User Provided) ---
const PatreonNewLogoIcon = (props) => (
  <svg
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    fillRule="evenodd"
    clipRule="evenodd"
    strokeLinejoin="round"
    strokeMiterlimit="2"
    fill="currentColor" // Set fill to inherit color
    {...props}
  >
    <g transform="matrix(.47407 0 0 .47407 .383 .422)">
      <clipPath id="prefix__a_box">
        {" "}
        {/* Use a unique ID for this instance */}
        <path d="M0 0h1080v1080H0z" />
      </clipPath>
      <g clipPath="url(#prefix__a_box)">
        {" "}
        {/* Reference the unique ID */}
        <path
          d="M1033.05 324.45c-.19-137.9-107.59-250.92-233.6-291.7-156.48-50.64-362.86-43.3-512.28 27.2-181.1 85.46-237.99 272.66-240.11 459.36-1.74 153.5 13.58 557.79 241.62 560.67 169.44 2.15 194.67-216.18 273.07-321.33 55.78-74.81 127.6-95.94 216.01-117.82 151.95-37.61 255.51-157.53 255.29-316.38z"
          fillRule="nonzero"
        />
      </g>
    </g>
  </svg>
);
// --- End SVG Icon ---

export const PatreonBox = observer(() => {
  const patreonLink = "https://patreon.com/deno_games";
  const { user } = MobxStore;
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();

  const handleConnectClick = async () => {
    setIsConnecting(true);
    console.log("[PatreonBox] Connect Clicked");

    if (!user) {
      console.log("[PatreonBox] User not logged in.");
      toast({
        title: "Please Log In",
        description:
          "You need to be logged into your account to connect Patreon.",
        variant: "destructive",
      });
      setIsConnecting(false);
      return;
    }

    try {
      const auth = getAuth();
      if (!auth.currentUser) {
        console.error(
          "[PatreonBox] Cannot connect Patreon: Firebase auth.currentUser is null."
        );
        toast({
          title: "Error",
          description: "User session not found. Please refresh.",
          variant: "destructive",
        });
        setIsConnecting(false);
        return;
      }

      console.log(
        "[PatreonBox] Fetching fresh ID token for user:",
        auth.currentUser.uid
      );
      const token = await getIdToken(auth.currentUser, true);

      if (!token) {
        console.error("[PatreonBox] Failed to retrieve ID token.");
        throw new Error("Failed to retrieve authentication token.");
      }

      console.log(
        "[PatreonBox] Fresh ID Token acquired (first/last 15 chars):",
        token.substring(0, 15) + "..." + token.substring(token.length - 15)
      );

      const connectUrl = `/api/auth/patreon/connect?token=${encodeURIComponent(token)}`;
      console.log(
        "[PatreonBox] Navigating to:",
        connectUrl.split("token=")[0] + "token=..."
      );

      window.location.href = connectUrl;
    } catch (error) {
      console.error("[PatreonBox] Error preparing Patreon connection:", error);
      toast({
        title: "Connection Error",
        description: `Could not initiate Patreon connection: ${error.message || "Please try again."}`,
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  // Style for the black/white contrast buttons (more explicit)
  const contrastButtonStyle = cn(
    "border",
    "bg-black text-white border-black hover:bg-gray-800",
    "dark:bg-white dark:text-black dark:border-gray-300 dark:hover:bg-gray-200"
  );

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
          I make 1 Print-at-home Board Game every month. Support me on Patreon
          to access rewards:
        </p>

        {/* Benefits Lists Container */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-8">
          {/* Paid Benefits Column */}
          <div className="flex-1 flex flex-col justify-between">
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
            <div className="pt-4">
              <Button
                asChild
                className={cn(contrastButtonStyle, "w-full sm:w-auto")}
              >
                <a
                  href={patreonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2"
                >
                  <span>View on Patreon</span>
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block border-l border-muted mx-4"></div>

          {/* Free Benefits Column */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
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
            </div>
            <div className="pt-4">
              <Button
                asChild
                className={cn(contrastButtonStyle, "w-full sm:w-auto")}
              >
                <a
                  href={patreonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2"
                >
                  <span>View on Patreon</span>
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-8 border-t bg-muted/80">
        <div className="text-center">
          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-muted/80 px-4 text-sm text-muted-foreground">
                Already a Patron?
              </span>
            </div>
          </div>
          {!user ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-muted-foreground font-medium">
                Log In to connect Patreon
              </p>
              <Button variant="secondary" onClick={() => router.push("/login")}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </div>
          ) : !user.patreon?.id ? (
            <Button
              variant="outline"
              disabled={isConnecting}
              onClick={handleConnectClick}
            >
              <PatreonNewLogoIcon className="h-5 w-auto mr-1.5" />
              {isConnecting ? "Connecting..." : "Connect with Patreon"}
            </Button>
          ) : (
            <Button
              variant="default"
              disabled={true}
              className={cn(
                "inline-flex items-center justify-center gap-2 mx-auto",
                "!bg-green-600 !text-white",
                "!opacity-100 cursor-default"
              )}
            >
              <Check className="h-5 w-5" />
              Patreon Account Connected!
            </Button>
          )}
        </div>
        <div className="mt-8 space-y-2 text-sm text-muted-foreground text-center md:text-left">
          <p>
            *Note: All game assets and rewards will be automatically sent at the
            1st of every month and available in &quot;My Games&quot; collection
            of your connected account.
          </p>
          <p>
            **You may also connect your FREE Patreon account to access secret
            codes for collectibles and occasional FREE games that we drop.
          </p>
        </div>
      </div>
    </div>
  );
});
