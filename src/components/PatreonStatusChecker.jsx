"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertCircle, CheckCircle, BadgeInfo } from "lucide-react";
import { getAuth, getIdToken } from "firebase/auth";
import MobxStore from "@/mobx"; // Optional: If you want to update MobxStore too
import { observer } from "mobx-react"; // If using MobxStore

// Interface for the expected API response structure
// interface PatreonStatusData {
//   isPatron: boolean;
//   needsConnect?: boolean;
//   tier?: {
//     id: string;
//     title: string;
//     amount_cents: number;
//   } | null;
//   error?: string; // Include potential error message from API
// }

export const PatreonStatusChecker = observer(() => {
  const { user } = MobxStore; // Get user to check initial connection status
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [patreonData, setPatreonData] = useState(null); // Store API response
  const [error, setError] = useState(null);

  const fetchPatreonData = async () => {
    setIsLoading(true);
    setError(null);
    setPatreonData(null); // Clear previous data
    console.log("Attempting to fetch Patreon data...");

    const auth = getAuth();
    if (!auth.currentUser) {
      setError("You must be logged in to check Patreon status.");
      setIsLoading(false);
      toast({
        title: "Error",
        description: "User not logged in.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = await getIdToken(auth.currentUser, true); // Force refresh if needed
      console.log("Fetched ID token for Patreon check.");

      const response = await fetch("/api/patreon/membership", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(
        "Received response from /api/patreon/membership:",
        response.status,
        data
      );

      if (!response.ok || data.error) {
        // Handle errors from the API response body if available
        throw new Error(
          data.details ||
            data.error ||
            `Failed to fetch Patreon status (${response.status})`
        );
      }

      setPatreonData(data);
      // Optional: Update Mobx store if needed
      // runInAction(() => {
      //   if (user && user.patreon) { // Check if patreon object exists
      //      user.patreon.currentTier = data.tier || null; // Example update
      //      user.patreon.isCurrentlyActive = data.isPatron || false;
      //   }
      // });
      toast({ title: "Success", description: "Patreon data fetched." });
    } catch (err) {
      console.error("Error fetching Patreon data:", err);
      setError(err.message || "An unexpected error occurred.");
      toast({
        title: "Error Fetching Data",
        description: err.message || "Could not fetch Patreon data.",
        variant: "destructive",
      });
      setPatreonData(null); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  };

  // Determine initial connection status from Mobx user if available
  const initiallyConnected = !!user?.patreon?.id;

  return (
    <div className="p-6 border rounded-lg bg-card shadow-md w-full max-w-md mx-auto my-8">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Patreon Connection Status
      </h3>

      {!initiallyConnected && (
        <div className="text-center text-muted-foreground mb-4">
          Your Patreon account is not yet connected. Please connect it first
          using the button elsewhere (e.g., on the homepage).
        </div>
      )}

      {initiallyConnected && (
        <Button
          onClick={fetchPatreonData}
          disabled={isLoading}
          className="w-full mb-4"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <BadgeInfo className="mr-2 h-4 w-4" /> // Using BadgeInfo icon
          )}
          {isLoading ? "Checking Status..." : "Check/Refresh Patreon Status"}
        </Button>
      )}

      {/* Display Area for Status */}
      <div className="mt-4 space-y-3 text-center">
        {error && (
          <div className="flex items-center justify-center text-red-600 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>Error: {error}</span>
          </div>
        )}

        {patreonData && !error && (
          <>
            {patreonData.isPatron ? (
              <div className="flex flex-col items-center justify-center text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 p-4 rounded-md">
                <CheckCircle className="h-6 w-6 mb-2" />
                <span className="font-semibold">You are an Active Patron!</span>
                {patreonData.tier ? (
                  <span className="text-sm text-muted-foreground">
                    Current Tier:{" "}
                    <span className="font-medium text-foreground">
                      {patreonData.tier.title}
                    </span>{" "}
                    (${(patreonData.tier.amount_cents / 100).toFixed(2)})
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Active patron, but tier details unavailable.
                  </span>
                )}
              </div>
            ) : patreonData.isFreeMember ? (
              <div className="flex items-center justify-center text-blue-600 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-md">
                <BadgeInfo className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>
                  You are connected as a Free Member/Follower. (Status:{" "}
                  {patreonData.status || "N/A"})
                </span>
              </div>
            ) : patreonData.needsConnect ? (
              <div className="flex items-center justify-center text-orange-600 bg-orange-100 dark:bg-orange-900/30 p-3 rounded-md">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>Patreon account needs to be connected.</span>
              </div>
            ) : (
              <div className="flex items-center justify-center text-muted-foreground bg-muted/50 p-3 rounded-md">
                <BadgeInfo className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>
                  No active or past Patreon membership found for this campaign.
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

// If not default export, export it like this:
// export { PatreonStatusChecker };
