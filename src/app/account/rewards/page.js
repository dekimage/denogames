"use client";

import { useEffect, useMemo } from "react";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import Image from "next/image";
import Link from "next/link";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Lock,
  ExternalLink,
  Trophy,
  Loader2,
  Hammer,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  AlertTriangle,
  FileDown,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AchievementCard } from "../my-collection/page";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const AddonRewardCard = ({ addon, userAchievements, requiredAchievements }) => {
  const { toast } = useToast();
  const { claimingReward, products, user } = MobxStore;
  const router = useRouter();

  // Check if user has all required achievements
  const isUnlocked = requiredAchievements.every((achievement) =>
    userAchievements?.includes(achievement.id)
  );

  // Check if user has crafted/unlocked this add-on
  const hasUnlockedAddon = MobxStore.user?.unlockedRewards?.includes(addon.id);

  // Calculate progress
  const achievementsCompleted = requiredAchievements.filter((achievement) =>
    userAchievements?.includes(achievement.id)
  ).length;
  const progressPercentage =
    (achievementsCompleted / requiredAchievements.length) * 100;

  // Check if user owns the main game
  const mainGameId = addon.relatedGames;
  const ownsMainGame = mainGameId
    ? (user?.purchasedProducts || []).includes(mainGameId)
    : true; // If no related game, we assume it's standalone

  // Find main game for display
  const mainGame = mainGameId
    ? products.find((p) => p.id === mainGameId)
    : null;

  const handleCraft = async () => {
    try {
      await MobxStore.claimSpecialReward(addon.id);
      toast({
        title: "Success!",
        description: `${addon.name} crafted successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const navigateToAddonDetails = () => {
    router.push(`/product-details/${addon.slug}`);
  };

  const navigateToMainGame = () => {
    if (mainGameId && mainGame) {
      router.push(`/product-details/${mainGame.slug}`);
    }
  };

  return (
    <div
      onClick={navigateToAddonDetails}
      className="relative rounded-lg border p-4 sm:p-5 transition-all hover:shadow-lg bg-card cursor-pointer group"
    >
      {/* Reward Image */}
      <div className="relative h-36 sm:h-48 w-full mb-3">
        <Image
          src={addon.thumbnail || "/placeholder-image.jpg"}
          alt={addon.name}
          fill
          className="object-contain transition-all duration-300"
        />
      </div>

      {/* Title and Status */}
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-semibold truncate group-hover:text-primary transition-colors">
          {addon.name}
        </h3>
        <div className="flex items-center gap-2">
          {hasUnlockedAddon ? (
            <Badge
              variant="default"
              className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Owned</span>
            </Badge>
          ) : !isUnlocked ? (
            <Badge
              variant="secondary"
              className="bg-muted text-muted-foreground flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Locked</span>
            </Badge>
          ) : null}
        </div>
      </div>

      {/* Related Game Section */}
      {mainGame && (
        <div className="mt-3 border rounded-md p-2 bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 flex-shrink-0 border rounded-md overflow-hidden">
              <Image
                src={mainGame.thumbnail || "/placeholder-image.jpg"}
                alt={mainGame.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-sm font-medium truncate">{mainGame.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {ownsMainGame ? (
                  <div className="flex items-center text-green-600 dark:text-green-400 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    <span>Owned</span>
                  </div>
                ) : (
                  <div className="flex items-center text-amber-600 dark:text-amber-400 text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    <span>Required</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Game Warning - Only show if not unlocked yet */}
      {isUnlocked && !hasUnlockedAddon && !ownsMainGame && mainGame && (
        <div className="mt-3 p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md">
          <div className="flex gap-2 text-amber-700 dark:text-amber-400 text-xs items-start">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">You've Unlocked This Add-on!</p>
              <p className="mt-0.5">
                You have all the required achievements, but you need to own{" "}
                {mainGame.name} before you can craft this add-on.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Grid - Show without progress indicators if already unlocked */}
      <div className="mt-4">
        {!hasUnlockedAddon && (
          <div className="text-sm text-muted-foreground mb-3">
            Collectibles required to unlock:
          </div>
        )}

        {/* Achievement Thumbnails */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
          {requiredAchievements.map((achievement) => (
            <Dialog key={achievement.id}>
              <DialogTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full pt-[100%] rounded-lg border overflow-hidden hover:border-primary transition-colors bg-card"
                >
                  <div className="absolute inset-0 p-2">
                    <Image
                      src={achievement.image || "/placeholder-achievement.jpg"}
                      alt={achievement.name}
                      fill
                      className="object-contain p-1.5"
                    />
                    {userAchievements?.includes(achievement.id) && (
                      <div className="absolute top-1 right-1 bg-background rounded-full p-0.5">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      </div>
                    )}
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent>
                <AchievementCard
                  achievement={achievement}
                  isUnlocked={userAchievements?.includes(achievement.id)}
                  relatedRewards={[]}
                  fromReward={true}
                />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-4">
        {hasUnlockedAddon ? (
          // Show Files Download button when add-on is owned
          <Button
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/account/my-games/${mainGame?.id}`);
            }}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Files Download
          </Button>
        ) : (
          // Show Craft button if unlocked but not yet crafted
          isUnlocked && (
            <Button
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                handleCraft();
              }}
              disabled={claimingReward || !ownsMainGame}
              title={
                !ownsMainGame && mainGame
                  ? `You need to own ${mainGame.name} first`
                  : ""
              }
            >
              {claimingReward ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Crafting...
                </>
              ) : (
                <>
                  <Hammer className="mr-2 h-4 w-4" />
                  Craft Add-on
                </>
              )}
            </Button>
          )
        )}

        {/* View Add-on button only shows if not owned */}
        {!hasUnlockedAddon && (
          <Button
            className="w-full"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              navigateToAddonDetails();
            }}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Add-on
          </Button>
        )}
      </div>
    </div>
  );
};

const RewardsPage = observer(() => {
  const { achievements, products, achievementsLoading, user } = MobxStore;

  // Filter products to only include add-ons
  const addons = useMemo(() => {
    return products.filter((product) => product.type === "add-on");
  }, [products]);

  if (achievementsLoading || MobxStore.loadingProducts) {
    return <LoadingSpinner />;
  }

  const getRequiredAchievements = (addon) => {
    if (!addon.requiredAchievements?.length) return [];

    return addon.requiredAchievements
      .map((achievementId) => {
        const achievement = achievements.find((a) => a.id === achievementId);
        return achievement || null;
      })
      .filter(Boolean);
  };

  // Calculate progress for an addon
  const getAddonProgress = (addon) => {
    const required = getRequiredAchievements(addon);
    if (!required.length) return 0;

    return (
      required.filter((achievement) =>
        user?.achievements?.includes(achievement.id)
      ).length / required.length
    );
  };

  // Sort addons by:
  // 1. Claimed first
  // 2. Unlocked (all achievements completed) but not claimed
  // 3. Progress percentage on incomplete rewards
  const sortedAddons = [...addons].sort((a, b) => {
    const aIsClaimed = user?.unlockedRewards?.includes(a.id) || false;
    const bIsClaimed = user?.unlockedRewards?.includes(b.id) || false;

    // If one is claimed and the other isn't, claimed comes first
    if (aIsClaimed !== bIsClaimed) return bIsClaimed ? 1 : -1;

    const aProgress = getAddonProgress(a);
    const bProgress = getAddonProgress(b);
    const aIsUnlocked = aProgress === 1;
    const bIsUnlocked = bProgress === 1;

    // If one is unlocked and the other isn't, unlocked comes first
    if (aIsUnlocked !== bIsUnlocked) return bIsUnlocked ? 1 : -1;

    // Otherwise sort by progress percentage
    return bProgress - aProgress;
  });

  const claimedRewardsCount = user?.unlockedRewards?.length || 0;
  const totalRewardsCount = addons.length;

  return (
    <div className="container mx-auto py-8 mt-16 sm:mt-0">
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold font-strike">Add-ons</h1>
          <div className="bg-card p-4 rounded-lg shadow-sm border">
            <span className="text-sm text-muted-foreground mr-2">
              Add-ons Claimed:
            </span>
            <span className="text-2xl font-bold text-primary">
              {claimedRewardsCount}/{totalRewardsCount}
            </span>
          </div>
        </div>
        <p className="text-muted-foreground">
          Craft Add-ons by collecting{" "}
          <Link
            href="/account/my-collection"
            className="text-primary underline hover:text-primary/80"
          >
            collectibles
          </Link>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedAddons.map((addon) => (
          <AddonRewardCard
            key={addon.id}
            addon={addon}
            userAchievements={user?.achievements}
            requiredAchievements={getRequiredAchievements(addon)}
          />
        ))}
      </div>
    </div>
  );
});

export default RewardsPage;
