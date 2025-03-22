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
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AchievementCard } from "../my-collection/page";
import { useRouter } from "next/navigation";

const AddonRewardCard = ({ addon, userAchievements, requiredAchievements }) => {
  const { toast } = useToast();
  const { claimingReward } = MobxStore;
  const router = useRouter();

  // Check if user has all required achievements
  const isUnlocked = requiredAchievements.every((achievement) =>
    userAchievements?.includes(achievement.id)
  );

  // Check if reward is already claimed
  const isClaimed = MobxStore.user?.unlockedRewards?.includes(addon.id);

  // Calculate progress
  const achievementsCompleted = requiredAchievements.filter((achievement) =>
    userAchievements?.includes(achievement.id)
  ).length;
  const progressPercentage =
    (achievementsCompleted / requiredAchievements.length) * 100;

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
    router.push(`/account/my-games/${addon.relatedGames}`);
  };

  return (
    <div
      className={`relative rounded-lg border p-4 transition-all hover:shadow-lg ${
        !isUnlocked ? "bg-white" : "bg-white"
      }`}
    >
      {/* Status Icon */}
      <div className="absolute top-2 right-2">
        {isClaimed ? (
          <CheckCircle className="w-5 h-5 text-primary" />
        ) : !isUnlocked ? (
          <Lock className="w-5 h-5 text-gray-400" />
        ) : null}
      </div>

      {/* Reward Image */}
      <div className="relative h-32 w-full mb-3">
        <Image
          src={addon.thumbnail || "/placeholder-image.jpg"} // Fallback image if thumbnail is empty
          alt={addon.name}
          fill
          className={`object-contain ${!isUnlocked ? "grayscale" : ""}`}
        />
      </div>

      {/* Title and Description */}
      <h3 className="font-semibold truncate">{addon.name}</h3>
      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
        {addon.description}
      </p>

      {/* Achievement Progress */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Required Collectibles</span>
          <span className="font-medium text-primary ml-auto">
            {achievementsCompleted}/{requiredAchievements.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Small Achievement Thumbnails */}
        <div className="grid grid-cols-4 gap-2 mt-2">
          {requiredAchievements.map((achievement) => (
            <Dialog key={achievement.id}>
              <DialogTrigger asChild>
                <button className="relative w-10 h-10 rounded-md border overflow-hidden hover:border-primary transition-colors">
                  <Image
                    src={achievement.image || "/placeholder-achievement.jpg"}
                    alt={achievement.name}
                    fill
                    className={`object-cover p-1 ${
                      !userAchievements?.includes(achievement.id)
                        ? "grayscale"
                        : ""
                    }`}
                  />
                  {userAchievements?.includes(achievement.id) && (
                    <div className="absolute top-0.5 right-0.5">
                      <CheckCircle className="w-3 h-3 text-primary fill-white" />
                    </div>
                  )}
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
        {isUnlocked && !isClaimed && (
          <Button
            className="w-full"
            size="sm"
            onClick={handleCraft}
            disabled={claimingReward}
          >
            {claimingReward ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Crafting...
              </>
            ) : (
              <>
                <Hammer className="mr-2 h-3 w-3" />
                Craft Add-on
              </>
            )}
          </Button>
        )}

        <Button
          className="w-full"
          variant="outline"
          size="sm"
          onClick={navigateToAddonDetails}
        >
          <ExternalLink className="mr-2 h-3 w-3" />
          View Add-on
        </Button>

        {isClaimed && (
          <Button
            className="w-full"
            variant="secondary"
            size="sm"
            onClick={navigateToMainGame}
          >
            <ExternalLink className="mr-2 h-3 w-3" />
            View in My Games
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
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold font-strike">Add-ons</h1>
          <div className="bg-white p-4 rounded-lg shadow-sm">
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
