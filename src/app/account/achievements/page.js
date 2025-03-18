"use client";

import { useEffect, useMemo, useCallback, useState } from "react";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import Image from "next/image";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle, Lock, ChevronRight, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Cauldron } from "@/components/achievements/Cauldron";
import { Portal } from "@/components/achievements/Portal";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { auth } from "@/firebase";

function useScrollToTop() {
  const scrollToTop = useCallback(() => {
    if (typeof window === "undefined") return;

    // Primary method
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });

    // Fallbacks for different browsers
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.scrollTo(0, 0);

        if (typeof document !== "undefined") {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }
      }
    }, 10);
  }, []);

  return scrollToTop;
}

export const AchievementCard = observer(
  ({ achievement, isUnlocked, relatedRewards, fromReward }) => {
    const router = useRouter();
    const [visitingLocation, setVisitingLocation] = useState(false);
    const [open, setOpen] = useState(false);
    const scrollToTop = useScrollToTop();

    // Get unlockable add-ons from MobxStore's products
    const unlockedAddons = useMemo(() => {
      if (
        !achievement.unlocksAddons ||
        !Array.isArray(achievement.unlocksAddons)
      )
        return [];

      return achievement.unlocksAddons
        .map((addonId) => MobxStore.products.find((p) => p.id === addonId))
        .filter(Boolean);
    }, [achievement.unlocksAddons, MobxStore.products]);

    const handleTravelToLocation = useCallback(
      async (e) => {
        e.stopPropagation();
        setVisitingLocation(true);

        try {
          // Safely scroll to top
          scrollToTop();

          const user = auth.currentUser;
          if (!user) {
            throw new Error("You must be logged in to travel!");
          }

          const token = await user.getIdToken();

          const response = await fetch("/api/achievements/visit-location", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              locationId: achievement.id,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || data.error);
          }

          MobxStore.setActiveLocation(data.location);

          // Close the dialog after successful location loading
          setOpen(false);

          // After location is set
          setTimeout(scrollToTop, 100);

          toast({
            title: "Location Loaded",
            description: `You've traveled to ${data.location.name}`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setVisitingLocation(false);
        }
      },
      [achievement.id, scrollToTop]
    );

    const cardContent = (
      <div
        className={cn(
          "group relative cursor-pointer rounded-lg border bg-card text-card-foreground transition-all hover:shadow-md",
          !isUnlocked && "bg-muted/50"
        )}
      >
        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          {isUnlocked ? (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-1 border border-emerald-500/20">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Unlocked
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 border border-muted-foreground/20">
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Locked
              </span>
            </div>
          )}
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge
            variant="secondary"
            className={cn(
              "capitalize text-xs",
              achievement.type === "achievement"
                ? "bg-primary/10 text-primary dark:bg-primary/20"
                : achievement.type === "location"
                ? "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                : "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
            )}
          >
            {achievement.type}
          </Badge>
        </div>

        {/* Main Content */}
        <div className="p-5">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src={achievement.image}
              alt={achievement.name}
              fill
              className={cn(
                "object-contain transition-all duration-300",
                !isUnlocked && "grayscale opacity-50"
              )}
            />
          </div>
          <h3 className="text-base font-semibold text-center mb-2 line-clamp-1">
            {achievement.name}
          </h3>
          <p className="text-sm text-muted-foreground text-center line-clamp-2 mb-2">
            {achievement.description}
          </p>
          <div className="text-sm text-center">
            <span className="text-muted-foreground">Obtained by:</span>
            <p className="text-sm line-clamp-2">{achievement.obtainedBy}</p>
          </div>
        </div>
      </div>
    );

    // If fromReward is true, return just the card content
    if (fromReward) return cardContent;

    // Otherwise, wrap in Dialog
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{cardContent}</DialogTrigger>
        <DialogContent className="max-w-lg sm:max-w-2xl max-h-[95vh] p-0">
          <ScrollArea className="max-h-[calc(100vh-40px)] p-6">
            <div className="space-y-6">
              {/* Achievement Header */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                  <Image
                    src={achievement.image}
                    alt={achievement.name}
                    fill
                    className={cn(
                      "object-contain rounded-xl transition-all duration-300",
                      !isUnlocked && "grayscale opacity-50"
                    )}
                  />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold mb-2">
                    {achievement.name}
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              </div>

              {/* Add Travel Button for locations inside dialog */}
              {isUnlocked && achievement.type === "location" && (
                <Button
                  className="w-full"
                  onClick={handleTravelToLocation}
                  disabled={visitingLocation}
                >
                  {visitingLocation ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Traveling...
                    </>
                  ) : (
                    <>
                      <Map className="mr-2 h-4 w-4" />
                      Travel to this Location
                    </>
                  )}
                </Button>
              )}

              {/* Achievement Details */}
              <div className="grid gap-4">
                <div className="rounded-lg border bg-card p-3 sm:p-4">
                  <h4 className="text-sm font-medium mb-1.5">How to Obtain</h4>
                  <p className="text-sm text-muted-foreground">
                    {achievement.obtainedBy}
                  </p>
                </div>

                {achievement.hint && (
                  <div className="rounded-lg border bg-card p-3 sm:p-4">
                    <h4 className="text-sm font-medium mb-1.5">Hint</h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.hint}
                    </p>
                  </div>
                )}

                {/* Unlockable Add-ons */}
                {unlockedAddons?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Unlockable Add-ons</h4>
                    <div className="grid gap-2">
                      {unlockedAddons.map((addon) => {
                        const baseGame = MobxStore.products.find(
                          (p) => p.id === addon.relatedGames
                        );

                        return (
                          <button
                            key={addon.id}
                            onClick={() =>
                              router.push(`/product-details/${addon.slug}`)
                            }
                            className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors text-left group"
                          >
                            <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                              <Image
                                src={
                                  addon.thumbnail || "/placeholder-image.png"
                                }
                                alt={addon.name}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                                {addon.name}
                              </h5>
                              {baseGame && (
                                <p className="text-xs text-muted-foreground">
                                  Add-on for {baseGame.name}
                                </p>
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Footer - With fixed border */}
              <div className="flex items-center justify-between rounded-lg border bg-card p-3 border-border">
                <div className="flex items-center gap-2">
                  {isUnlocked ? (
                    <div className="flex items-center gap-1.5 text-emerald-500">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {achievement.type === "achievement" &&
                          "Achievement Unlocked"}
                        {achievement.type === "collectible" &&
                          "Collectible Unlocked"}
                        {achievement.type === "location" &&
                          "Location Discovered"}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {achievement.type === "achievement" &&
                          "Achievement Locked"}
                        {achievement.type === "collectible" &&
                          "Collectible Locked"}
                        {achievement.type === "location" &&
                          "Location Undiscovered"}
                      </span>
                    </div>
                  )}
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    "capitalize text-xs",
                    achievement.type === "achievement"
                      ? "bg-primary/10 text-primary dark:bg-primary/20"
                      : achievement.type === "location"
                      ? "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                      : "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
                  )}
                >
                  {achievement.type}
                </Badge>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }
);

const AchievementsPage = observer(() => {
  const { achievements, specialRewards, achievementsLoading, user } = MobxStore;

  useEffect(() => {
    MobxStore.fetchAchievementsAndRewards();
  }, []);

  if (achievementsLoading) {
    return <LoadingSpinner />;
  }

  const getRelatedRewards = (achievementKey) => {
    return specialRewards.filter((reward) =>
      reward.requiredAchievements.includes(achievementKey)
    );
  };

  // Calculate stats correctly based on all achievements
  const stats = {
    achievements: {
      total: achievements.filter((a) => a.type === "achievement").length || 0,
      unlocked:
        achievements.filter(
          (a) => a.type === "achievement" && user?.achievements?.includes(a.key)
        ).length || 0,
    },
    collectibles: {
      total: achievements.filter((a) => a.type === "collectible").length || 0,
      unlocked:
        achievements.filter(
          (a) => a.type === "collectible" && user?.achievements?.includes(a.key)
        ).length || 0,
    },
  };

  // Sort achievements: unlocked first
  const sortedAchievements = [...achievements].sort((a, b) => {
    const aUnlocked = user?.achievements?.includes(a.key) || false;
    const bUnlocked = user?.achievements?.includes(b.key) || false;
    if (aUnlocked !== bUnlocked) return bUnlocked ? 1 : -1;
    return 0;
  });

  // Helper function to check if achievement is unlocked
  const isAchievementUnlocked = useCallback(
    (achievement) => {
      if (!user?.achievements) return false;

      return user.achievements.some(
        (userAchievement) =>
          userAchievement === achievement.id ||
          userAchievement === achievement.key
      );
    },
    [user?.achievements]
  );

  return (
    <div className="container py-6 md:py-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Achievements</h1>

        <div className="w-full sm:w-auto grid grid-cols-2 gap-3">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <h3 className="text-sm text-muted-foreground font-medium mb-1">
              Achievements
            </h3>
            <p className="text-xl font-bold text-primary">
              {stats.achievements.unlocked}/{stats.achievements.total}
            </p>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <h3 className="text-sm text-muted-foreground font-medium mb-1">
              Collectibles
            </h3>
            <p className="text-xl font-bold text-primary">
              {stats.collectibles.unlocked}/{stats.collectibles.total}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Cauldron />
        <Portal />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {sortedAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            isUnlocked={isAchievementUnlocked(achievement)}
            relatedRewards={getRelatedRewards(achievement.key)}
            fromReward={false}
          />
        ))}
      </div>
    </div>
  );
});

export default AchievementsPage;
