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

    const getTypeConfig = (type) => {
      switch (type) {
        case "achievement":
          return {
            icon: Trophy,
            styles:
              "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
          };
        case "location":
          return {
            icon: Map,
            styles:
              "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
          };
        case "collectible":
          return {
            icon: Star,
            styles:
              "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
          };
        default:
          return {
            icon: Trophy,
            styles: "",
          };
      }
    };

    const TypeIcon = getTypeConfig(achievement.type).icon;

    const cardContent = (
      <div
        className={cn(
          "group relative cursor-pointer rounded-lg border bg-card text-card-foreground transition-all hover:shadow-md",
          !isUnlocked && "bg-muted/50"
        )}
      >
        {/* Status Badge - Moved to center top */}
        <div className="absolute top-3 left-0 right-0 flex justify-center">
          {isUnlocked ? (
            <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-4 py-1.5 border border-emerald-500/20">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Owned
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 border border-muted-foreground/20">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Locked
              </span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="p-4 pt-14">
          {" "}
          {/* Increased top padding for the centered badge */}
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-3">
            <Image
              src={achievement.image}
              alt={achievement.name}
              fill
              className={cn(
                "object-contain transition-all duration-300"
                // !isUnlocked && "grayscale opacity-50"
              )}
            />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-base sm:text-lg font-semibold line-clamp-1">
              {achievement.name}
            </h3>

            <div className="flex justify-center">
              <Badge
                variant="secondary"
                className={cn(
                  "capitalize text-xs inline-flex items-center gap-1.5 whitespace-nowrap",
                  getTypeConfig(achievement.type).styles
                )}
              >
                <TypeIcon className="w-3 h-3" />
                {achievement.type}
              </Badge>
            </div>

            <div className="text-xs text-muted-foreground pt-2">
              <span className="block mb-1">Obtained by:</span>
              <p className="line-clamp-2 text-foreground">
                {achievement.obtainedBy}
              </p>
            </div>
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
              {/* Achievement Header with centered status badge */}
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Status Badge */}
                {isUnlocked ? (
                  <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-6 py-2 border border-emerald-500/20">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-base font-medium text-emerald-600 dark:text-emerald-400">
                      Owned
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-full bg-muted px-6 py-2 border border-muted-foreground/20">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                    <span className="text-base font-medium text-muted-foreground">
                      Locked
                    </span>
                  </div>
                )}

                <div className="relative w-32 h-32 sm:w-40 sm:h-40">
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

                <div className="space-y-3">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {achievement.name}
                  </h2>

                  <div className="flex justify-center">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "capitalize text-sm px-4 py-1 inline-flex items-center gap-2 whitespace-nowrap",
                        getTypeConfig(achievement.type).styles
                      )}
                    >
                      <TypeIcon className="w-4 h-4" />
                      {achievement.type}
                    </Badge>
                  </div>

                  <p className="text-base text-muted-foreground">
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
  const [sortBy, setSortBy] = useState("type"); // Changed from "status" to "type"

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

    // Apply search filter
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
        filtered.sort((a, b) => {
          const aUnlocked = isAchievementUnlocked(a);
          const bUnlocked = isAchievementUnlocked(b);
          if (aUnlocked !== bUnlocked) return bUnlocked ? 1 : -1;
          return 0;
        });
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "recent":
        filtered.sort((a, b) => {
          const aTime = a.createdAt || a.id;
          const bTime = b.createdAt || b.id;
          return bTime - aTime;
        });
        break;
      case "type":
        // Sort by type: achievements first, then collectibles, then locations
        filtered.sort((a, b) => {
          const typeOrder = { achievement: 0, collectible: 1, location: 2 };
          return typeOrder[a.type] - typeOrder[b.type];
        });
        break;
    }

    return filtered;
  }, [achievements, searchQuery, sortBy, isAchievementUnlocked]);

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

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
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

        {/* Stats cards - now non-clickable */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          {/* All Items Card */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2 sm:p-4">
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

          {/* Achievements Card */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-amber-800 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium">Achievements</h3>
                <p className="text-sm sm:text-xl font-bold">
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

          {/* Collectibles Card */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-500/10">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium">Collectibles</h3>
                <p className="text-sm sm:text-xl font-bold">
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

          {/* Locations Card - reverted back to original */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-500/10">
                <Map className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium">
                  Locations (Coming Soon)
                </h3>
                <p className="text-sm sm:text-xl font-bold">
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

        {/* Sort and Results Section */}
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
                <SelectItem value="type">Type</SelectItem>
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
