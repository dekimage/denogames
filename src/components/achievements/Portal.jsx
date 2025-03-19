"use client";

import { useState, useCallback, memo, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { auth } from "@/firebase";
import { ChevronLeft, Sparkles, Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";

// Memoize the CollectibleItem component
const CollectibleItem = memo(({ item, onCollect, isCollecting }) => (
  <div
    className={cn(
      "flex items-start space-x-4 p-4 rounded-lg border transition-all",
      item.collected
        ? "bg-muted border-muted-foreground/20"
        : "bg-card border-border hover:border-primary/50"
    )}
  >
    <div className="relative w-16 h-16 flex-shrink-0">
      <Image
        src={item.image}
        alt={item.name}
        fill
        className={cn(
          "object-contain rounded-md transition-all",
          item.collected && "grayscale opacity-80"
        )}
      />
    </div>
    <div className="flex-1 min-w-0 space-y-1">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{item.name}</h4>
        {item.collected && (
          <Badge variant="secondary" className="ml-2">
            Collected
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {item.description}
      </p>
      <Button
        size="sm"
        variant={item.collected ? "outline" : "default"}
        onClick={() => onCollect(item.id)}
        disabled={item.collected || isCollecting === item.id}
        className="mt-2"
      >
        {isCollecting === item.id ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Collecting...
          </>
        ) : item.collected ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Collected
          </>
        ) : (
          "Collect"
        )}
      </Button>
    </div>
  </div>
));

CollectibleItem.displayName = "CollectibleItem";

// Memoize the LocationView component
const LocationView = memo(({ location, onBack, onCollect, collectingItem }) => {
  // Add this check to prevent rendering broken locations
  if (!location || !location.name || !location.image) {
    return (
      <div className="w-full max-w-md mx-auto rounded-xl border bg-card p-6 shadow-lg text-center">
        <Button variant="ghost" className="mb-2 -ml-2" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Portal
        </Button>
        <p className="text-muted-foreground my-4">
          This location seems to be unavailable.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto rounded-xl border bg-card p-6 shadow-lg">
      <div className="space-y-6">
        <Button variant="ghost" className="mb-2 -ml-2" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Portal
        </Button>

        <div className="space-y-4">
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image
              src={location.image}
              alt={location.name}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">{location.name}</h2>
            <p className="text-muted-foreground">{location.description}</p>
          </div>
        </div>

        {location.foundItems?.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Discoverable Items
            </h3>
            <div className="grid gap-4">
              {location.foundItems.map((item) => (
                <CollectibleItem
                  key={item.id}
                  item={item}
                  onCollect={onCollect}
                  isCollecting={collectingItem}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No items to discover in this location.
          </p>
        )}
      </div>
    </div>
  );
});

LocationView.displayName = "LocationView";

// Main Portal component
export const Portal = observer(() => {
  console.log("Portal component rendered"); // Log 1: Initial render

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [collectingItem, setCollectingItem] = useState(null);
  const { theme } = useTheme();
  const { toast } = useToast();

  // Use the store's active location if available
  const activeLocation = MobxStore.activeLocation;

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isLoading]);

  const handleTravel = useCallback(async () => {
    if (!code.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a portal code!",
      });
      return;
    }

    setIsLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("You must be logged in to use the portal!");
      }

      const token = await user.getIdToken();
      const response = await fetch("/api/achievements/cook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: code.trim(),
          type: "portal",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error);
      }

      if (data.achievement && data.achievement.type === "location") {
        const locationData = {
          ...data.achievement,
          foundItems:
            data.achievement.foundItems?.map((item) => {
              return {
                ...item,
                collected: data.userAchievements?.includes(item.id) || false,
              };
            }) || [],
        };

        MobxStore.setActiveLocation(locationData);

        toast({
          title: data.success ? "Location Discovered!" : "Location Found",
          description: `${data.success ? "You've discovered" : "Welcome to"} ${
            locationData.name
          }!`,
        });
      } else {
        throw new Error("Invalid location code");
      }
    } catch (error) {
      console.error("Travel error:", error); // Log 11: Error handling
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
      setCode("");
    }
  }, [code, toast]);

  const handleCollectItem = useCallback(
    async (itemId) => {
      if (collectingItem) return;
      setCollectingItem(itemId);

      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error("You must be logged in to collect items!");
        }

        const token = await user.getIdToken();

        const response = await fetch("/api/achievements/collect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            itemId,
            locationId: activeLocation.id,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.error);
        }

        // Update the item's collected status locally
        const updatedLocation = {
          ...activeLocation,
          foundItems: activeLocation.foundItems.map((item) =>
            item.id === itemId ? { ...item, collected: true } : item
          ),
        };
        MobxStore.setActiveLocation(updatedLocation);

        // Update the user's achievements in MobxStore
        if (data.userAchievements) {
          MobxStore.user = {
            ...MobxStore.user,
            achievements: data.userAchievements,
          };
        }

        toast({
          title: "Success!",
          description: data.message || "Item collected successfully!",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } finally {
        setCollectingItem(null);
      }
    },
    [activeLocation, collectingItem, toast]
  );

  const handleBack = useCallback(() => {
    MobxStore.setActiveLocation(null);
  }, []);

  if (activeLocation) {
    // Add validation check
    if (!activeLocation.name || !activeLocation.image) {
      // Invalid location data, reset it and show the portal
      MobxStore.setActiveLocation(null);
      return (
        <div className="w-full max-w-md mx-auto rounded-xl border bg-card p-6 shadow-lg">
          {/* Portal UI */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold font-strike">The Portal</h2>
              <p className="text-sm text-muted-foreground">
                Enter a secret code to travel to mysterious locations!
              </p>
            </div>
            {/* Rest of portal UI */}
          </div>
        </div>
      );
    }

    // Valid location data, show the location view
    return (
      <LocationView
        location={activeLocation}
        onBack={handleBack}
        onCollect={handleCollectItem}
        collectingItem={collectingItem}
      />
    );
  }

  // Portal view (default)
  return (
    <div className="w-full max-w-md mx-auto rounded-xl border bg-card p-6 shadow-lg">
      <div className="space-y-6">
        {/* Portal Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold font-strike">The Portal</h2>
          <p className="text-sm text-muted-foreground">
            Enter a secret code to travel to mysterious locations!
          </p>
        </div>

        {/* Portal Image */}
        <div className="relative w-48 h-48 mx-auto">
          <Image
            src="/portal-placeholder.png"
            alt="Magical Portal"
            fill
            className="object-contain"
          />
        </div>

        {/* Input and Button */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter portal code..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isLoading}
              className="text-center"
            />
          </div>

          {isLoading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">
                Traveling... {progress}%
              </p>
            </div>
          )}

          <Button
            onClick={handleTravel}
            disabled={isLoading || !code.trim()}
            className="w-full"
          >
            {isLoading ? "Traveling..." : "Travel"}
          </Button>
        </div>
      </div>
    </div>
  );
});
