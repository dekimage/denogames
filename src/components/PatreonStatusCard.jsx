"use client";
import Image from "next/image";
import { ExternalLink, Check, LogIn, BadgeCheck } from "lucide-react"; // Added BadgeCheck, LogIn
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // For status display
import { useToast } from "@/components/ui/use-toast";
import MobxStore from "@/mobx";
import { observer } from "mobx-react-lite"; // Use mobx-react-lite
import { useState } from "react";
import { getAuth, getIdToken } from "firebase/auth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// --- NEW Patreon Logo SVG (User Provided) ---
const PatreonNewLogoIcon = (props) => (
  <svg
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    fillRule="evenodd" // Note: React uses camelCase for attributes
    clipRule="evenodd" // Note: React uses camelCase for attributes
    strokeLinejoin="round" // Note: React uses camelCase for attributes
    strokeMiterlimit="2" // Note: React uses camelCase for attributes
    fill="currentColor" // Set fill to inherit color
    {...props} // Pass className, width, height etc.
  >
    <g transform="matrix(.47407 0 0 .47407 .383 .422)">
      {/* ClipPath needs a unique ID within the page, React usually handles this okay */}
      <clipPath id="prefix__a">
        <path d="M0 0h1080v1080H0z" />
      </clipPath>
      <g clipPath="url(#prefix__a)">
        {" "}
        {/* Reference the clipPath ID */}
        <path
          d="M1033.05 324.45c-.19-137.9-107.59-250.92-233.6-291.7-156.48-50.64-362.86-43.3-512.28 27.2-181.1 85.46-237.99 272.66-240.11 459.36-1.74 153.5 13.58 557.79 241.62 560.67 169.44 2.15 194.67-216.18 273.07-321.33 55.78-74.81 127.6-95.94 216.01-117.82 151.95-37.61 255.51-157.53 255.29-316.38z"
          fillRule="nonzero" // Note: React uses camelCase for attributes
        />
      </g>
    </g>
  </svg>
);
// --- End SVG Icon ---

export const PatreonStatusCard = observer(() => {
  const patreonLink = "https://patreon.com/deno_games"; // Your Patreon page link
  const { user } = MobxStore;
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();

  const handleConnectClick = async () => {
    // --- (Copied handleConnectClick logic from PatreonBox) ---
    setIsConnecting(true);
    console.log("[PatreonStatusCard] Connect Clicked");

    if (!user) {
      // This case should ideally be handled by the main conditional rendering below,
      // but added as a safeguard.
      console.log("[PatreonStatusCard] User not logged in.");
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
          "[PatreonStatusCard] Cannot connect Patreon: Firebase auth.currentUser is null."
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
        "[PatreonStatusCard] Fetching fresh ID token for user:",
        auth.currentUser.uid
      );
      const token = await getIdToken(auth.currentUser, true); // Force refresh

      if (!token) {
        console.error("[PatreonStatusCard] Failed to retrieve ID token.");
        throw new Error("Failed to retrieve authentication token.");
      }

      const connectUrl = `/api/auth/patreon/connect?token=${encodeURIComponent(token)}`;
      console.log(
        "[PatreonStatusCard] Navigating to:",
        connectUrl.split("token=")[0] + "token=..."
      );

      window.location.href = connectUrl;
      // No need to setIsConnecting(false) here as the page navigates away
    } catch (error) {
      console.error(
        "[PatreonStatusCard] Error preparing Patreon connection:",
        error
      );
      toast({
        title: "Connection Error",
        description: `Could not initiate Patreon connection: ${error.message || "Please try again."}`,
        variant: "destructive",
      });
      setIsConnecting(false); // Set connecting false only on error
    }
    // --- End handleConnectClick ---
  };

  // Determine Patreon state
  const isConnected = !!user?.patreon?.id;
  const patreonStatus = isConnected ? user.patreon.status : "not_connected";

  let cardTitle = "Patreon Status";
  let cardDescription = "";
  let statusElement = null;
  let ctaElement = null;

  // Logic for different states
  if (!user) {
    // State: User not logged in
    cardDescription = "Log in to see your Patreon status and benefits.";
    statusElement = <Badge variant="outline">Not Logged In</Badge>;
    ctaElement = (
      <Button variant="secondary" onClick={() => router.push("/login")}>
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Button>
    );
  } else if (!isConnected) {
    // State: Logged in, Not Connected
    cardDescription =
      "Connect your Patreon account (even a free one!) to sync benefits, unlock exclusive content, and get secret codes.";
    statusElement = <Badge variant="outline">Not Connected</Badge>;
    ctaElement = (
      <Button
        variant="outline"
        disabled={isConnecting}
        onClick={handleConnectClick}
      >
        <PatreonNewLogoIcon className="h-5 w-auto mr-1.5" />
        {isConnecting ? "Connecting..." : "Connect with Patreon"}
      </Button>
    );
  } else if (patreonStatus === "free") {
    // State: Connected, Free Member
    cardTitle = "Patreon Status: Free Member";
    cardDescription =
      "You're connected as a Free Member! Upgrade for just $5/mo to get a new game every month, early access, and support game development.";
    statusElement = <Badge variant="secondary">Free Member</Badge>;
    ctaElement = (
      <Button
        variant="default" // Use primary color for upgrade CTA
        size="sm"
        asChild
      >
        <a
          href={patreonLink} // Link to your Patreon page
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5"
        >
          Become Paid Member
          <ExternalLink className="h-4 w-4" />
        </a>
      </Button>
    );
  } else if (patreonStatus === "paid") {
    // State: Connected, Paid Member
    cardTitle = "Patreon Status: Paid Patron";
    cardDescription =
      "THANKS FOR BEING A PATRON! You are getting one new PnP Game every month linked directly to this account.";
    statusElement = (
      <Button
        variant="default"
        disabled={true}
        size="sm"
        className={cn(
          "inline-flex items-center justify-center gap-1.5",
          "!bg-green-600 !text-white",
          "!opacity-100 cursor-default pointer-events-none"
        )}
      >
        <BadgeCheck className="h-4 w-4" />
        Paid Patron Active
      </Button>
    );
    ctaElement = null;
  } else {
    // --- CORRECTED State: Connected, but status is 'none' or unknown ---
    cardTitle = "Patreon Status"; // Keep title simple
    cardDescription =
      "Your Patreon account is connected. Become a free or paid member on Patreon to access exclusive rewards and support game development!"; // Updated description
    statusElement = <Badge variant="outline">Not a Member</Badge>; // Indicate connection without membership
    ctaElement = (
      <Button
        variant="default" // Use primary color for CTA
        size="sm"
        asChild
      >
        <a
          href={patreonLink} // Link to Patreon page
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5"
        >
          Become a Member {/* Changed CTA Text */}
          <ExternalLink className="h-4 w-4" />
        </a>
      </Button>
    );
    // --- End Correction ---
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex gap-4 p-4 items-start">
        {/* Image */}
        <div className="w-20 h-20 rounded-lg flex-shrink-0 border p-1 flex items-center justify-center bg-muted/20">
          <PatreonNewLogoIcon className="w-12 h-12 text-foreground" />
        </div>
        {/* Text Content */}
        <div className="flex-grow">
          <h3 className="text-lg font-semibold">{cardTitle}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {cardDescription}
          </p>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="flex items-center justify-between p-4 bg-muted/50 border-t min-h-[65px]">
        {/* Status Area (Left) */}
        <div className="flex items-center">{statusElement}</div>
        {/* CTA Area (Right) */}
        <div className="flex items-center">{ctaElement}</div>
      </div>
    </Card>
  );
});
