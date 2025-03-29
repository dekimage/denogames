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
import {
  CheckCircle,
  Lock,
  ChevronRight,
  Map,
  Search,
  X,
  Award,
  Trophy,
  Star,
  FileQuestion,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <div className="absolute top-2 right-2 z-10">
          {isUnlocked ? (
            <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 border border-emerald-500/20">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                Unlocked
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 border border-muted-foreground/20">
              <Lock className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground">
                Locked
              </span>
            </div>
          )}
        </div>

        {/* Type Badge */}
        <div className="absolute top-2 left-2 z-10">
          <Badge
            variant="secondary"
            className={cn(
              "capitalize text-[10px] px-2 py-0.5",
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
        <div className="p-3">
          <div className="relative w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-2">
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
          <h3 className="text-sm sm:text-base font-semibold text-center mb-1 line-clamp-1">
            {achievement.name}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground text-center line-clamp-2 mb-1">
            {achievement.description}
          </p>
          <div className="text-xs sm:text-sm text-center">
            <span className="text-muted-foreground">Obtained by:</span>
            <p className="text-xs sm:text-sm line-clamp-2">
              {achievement.obtainedBy}
            </p>
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
  const { achievements, products, achievementsLoading, user } = MobxStore;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all", "achievement", "collectible", "location"
  const [sortBy, setSortBy] = useState("status"); // "status", "name", "recent"

  const getRelatedRewards = (achievementKey) => {
    // Filter products to find add-ons that require this achievement
    return MobxStore.products.filter(
      (product) =>
        product.type === "add-on" &&
        product.requiredAchievements &&
        Array.isArray(product.requiredAchievements) &&
        product.requiredAchievements.includes(achievementKey)
    );
  };

  // Calculate stats for all achievement types
  const stats = useMemo(() => {
    // First, let's create a helper function to check if an achievement is unlocked
    const isUnlocked = (achievement) => {
      if (!user?.achievements) return false;

      // Check if either the id or key is in the user's achievements
      return user.achievements.some(
        (userAchievement) =>
          userAchievement === achievement.id ||
          userAchievement === achievement.key
      );
    };

    return {
      achievements: {
        total: achievements.filter((a) => a.type === "achievement").length || 0,
        unlocked:
          achievements.filter((a) => a.type === "achievement" && isUnlocked(a))
            .length || 0,
      },
      collectibles: {
        total: achievements.filter((a) => a.type === "collectible").length || 0,
        unlocked:
          achievements.filter((a) => a.type === "collectible" && isUnlocked(a))
            .length || 0,
      },
      locations: {
        total: achievements.filter((a) => a.type === "location").length || 0,
        unlocked:
          achievements.filter((a) => a.type === "location" && isUnlocked(a))
            .length || 0,
      },
    };
  }, [achievements, user?.achievements]);

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

  // Apply filters and sorting to achievements
  const filteredAchievements = useMemo(() => {
    let filtered = [...achievements];

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((a) => a.type === filterType);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query) ||
          a.obtainedBy.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "status":
        // Sort by unlocked status (unlocked first)
        filtered.sort((a, b) => {
          const aUnlocked = isAchievementUnlocked(a);
          const bUnlocked = isAchievementUnlocked(b);

          if (aUnlocked !== bUnlocked) return bUnlocked ? 1 : -1;

          // If same unlock status, sort by type: achievements -> collectibles -> locations
          const typeOrder = { achievement: 0, collectible: 1, location: 2 };
          return typeOrder[a.type] - typeOrder[b.type];
        });
        break;
      case "name":
        // Sort alphabetically by name
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "recent":
        // Most recent at the top (assuming we have a timestamp)
        filtered.sort((a, b) => {
          // If no timestamp, use ID as fallback (newer achievements usually have higher IDs)
          const aTime = a.createdAt || a.id;
          const bTime = b.createdAt || b.id;
          return bTime - aTime;
        });
        break;
    }

    return filtered;
  }, [achievements, filterType, searchQuery, sortBy, isAchievementUnlocked]);

  if (achievementsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container py-6 md:py-8 px-4 sm:px-6">
      {/* Enhanced Header Section */}
      <div className="space-y-4 sm:space-y-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold font-strike">
            My Collection
          </h1>

          {/* Search Input - Hidden on mobile */}
          <div className="relative w-full sm:w-72 hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search achievements..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Achievement Type Stats & Filters - 2x2 grid on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          {/* Stats cards with reduced padding and smaller text on mobile */}
          <div
            className={cn(
              "rounded-lg border bg-card text-card-foreground shadow-sm p-2 sm:p-4 cursor-pointer transition-colors",
              filterType === "all"
                ? "border-primary"
                : "hover:border-primary/50"
            )}
            onClick={() => setFilterType("all")}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium">All Items</h3>
                <p className="text-sm sm:text-xl font-bold text-primary">
                  {stats.achievements.unlocked +
                    stats.collectibles.unlocked +
                    stats.locations.unlocked}
                  /
                  {stats.achievements.total +
                    stats.collectibles.total +
                    stats.locations.total}
                </p>
              </div>
            </div>
          </div>

          {/* Achievements Filter Card */}
          <div
            className={cn(
              "rounded-lg border bg-card text-card-foreground shadow-sm p-2 sm:p-4 cursor-pointer transition-colors",
              filterType === "achievement"
                ? "border-primary"
                : "hover:border-primary/50"
            )}
            onClick={() => setFilterType("achievement")}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium">Achievements</h3>
                <p className="text-sm sm:text-xl font-bold text-primary">
                  {stats.achievements.unlocked}/{stats.achievements.total}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <Progress
                value={
                  (stats.achievements.unlocked / stats.achievements.total) * 100
                }
                className="h-1.5"
              />
            </div>
          </div>

          {/* Collectibles Filter Card */}
          <div
            className={cn(
              "rounded-lg border bg-card text-card-foreground shadow-sm p-2 sm:p-4 cursor-pointer transition-colors",
              filterType === "collectible"
                ? "border-primary"
                : "hover:border-primary/50"
            )}
            onClick={() => setFilterType("collectible")}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-500/10">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium">Collectibles</h3>
                <p className="text-sm sm:text-xl font-bold text-primary">
                  {stats.collectibles.unlocked}/{stats.collectibles.total}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <Progress
                value={
                  (stats.collectibles.unlocked / stats.collectibles.total) * 100
                }
                className="h-1.5"
              />
            </div>
          </div>

          {/* Locations Filter Card */}
          <div
            className={cn(
              "rounded-lg border bg-card text-card-foreground shadow-sm p-2 sm:p-4 cursor-pointer transition-colors",
              filterType === "location"
                ? "border-primary"
                : "hover:border-primary/50"
            )}
            onClick={() => setFilterType("location")}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-500/10">
                <Map className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium">Locations</h3>
                <p className="text-sm sm:text-xl font-bold text-primary">
                  {stats.locations.unlocked}/{stats.locations.total}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <Progress
                value={(stats.locations.unlocked / stats.locations.total) * 100}
                className="h-1.5"
              />
            </div>
          </div>
        </div>

        {/* Portal and Cauldron Section */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <Cauldron />
          <Portal />
        </div> */}
        <Cauldron />

        {/* Sort and Results in one line */}
        <div className="flex justify-between items-center gap-4 text-sm">
          <div className="text-muted-foreground">
            Showing {filteredAchievements.length} of {achievements.length}
          </div>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[120px] sm:w-[160px] h-8 text-xs sm:text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Unlock Status</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Filtered Achievements Grid - 2 columns on mobile */}
      {filteredAchievements.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-4">
          {filteredAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isUnlocked={isAchievementUnlocked(achievement)}
              relatedRewards={getRelatedRewards(achievement.key)}
              fromReward={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No achievements found</h3>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your filters or search query
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setFilterType("all");
              setSearchQuery("");
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
});

export default AchievementsPage;
