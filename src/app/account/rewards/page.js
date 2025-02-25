"use client";

import { useEffect } from "react";
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
  Download,
  Trophy,
  Loader2,
  Gift,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AchievementCard } from "../achievements/page";

const RewardCard = ({ reward, userAchievements, requiredAchievements }) => {
  const { toast } = useToast();
  const { claimingReward } = MobxStore;

  // Check if user has all required achievements
  const isUnlocked = requiredAchievements.every((achievement) =>
    userAchievements?.includes(achievement.key)
  );

  // Check if reward is already claimed
  const isClaimed = MobxStore.user?.unlockedRewards?.includes(reward.id);

  // Calculate progress
  const achievementsCompleted = requiredAchievements.filter((achievement) =>
    userAchievements?.includes(achievement.key)
  ).length;
  const progressPercentage =
    (achievementsCompleted / requiredAchievements.length) * 100;

  const handleClaim = async () => {
    try {
      await MobxStore.claimSpecialReward(reward.id);
      toast({
        title: "Success!",
        description: "Reward claimed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
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
          src={reward.thumbnail}
          alt={reward.title}
          fill
          className={`object-contain ${!isUnlocked ? "grayscale" : ""}`}
        />
      </div>

      {/* Title and Description */}
      <h3 className="font-semibold truncate">{reward.title}</h3>
      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
        {reward.description}
      </p>

      {/* Achievement Progress */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Required Achievements</span>
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
                    src={achievement.image}
                    alt={achievement.name}
                    fill
                    className={`object-cover p-1 ${
                      !userAchievements?.includes(achievement.key)
                        ? "grayscale"
                        : ""
                    }`}
                  />
                  {userAchievements?.includes(achievement.key) && (
                    <div className="absolute top-0.5 right-0.5">
                      <CheckCircle className="w-3 h-3 text-primary fill-white" />
                    </div>
                  )}
                </button>
              </DialogTrigger>
              <DialogContent>
                <AchievementCard
                  achievement={achievement}
                  isUnlocked={userAchievements?.includes(achievement.key)}
                  relatedRewards={[]}
                  fromReward={true}
                />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>

      {/* Action Button */}
      {isUnlocked && !isClaimed && (
        <Button
          className="w-full mt-4"
          size="sm"
          onClick={handleClaim}
          disabled={claimingReward}
        >
          {claimingReward ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Claiming...
            </>
          ) : (
            <>
              <Gift className="mr-2 h-3 w-3" />
              Claim Reward
            </>
          )}
        </Button>
      )}

      {isClaimed && (
        <Button
          className="w-full mt-4"
          variant="outline"
          size="sm"
          onClick={() => window.open(reward.fileUrl, "_blank")}
        >
          <Download className="mr-2 h-3 w-3" />
          Download Reward
        </Button>
      )}
    </div>
  );
};

const RewardsPage = observer(() => {
  const { achievements, specialRewards, achievementsLoading, user } = MobxStore;

  useEffect(() => {
    MobxStore.fetchAchievementsAndRewards();
  }, []);

  if (achievementsLoading) {
    return <LoadingSpinner />;
  }

  const getRequiredAchievements = (reward) => {
    return reward.requiredAchievements
      .map((key) => achievements.find((a) => a.key === key))
      .filter(Boolean);
  };

  // Calculate progress for a reward
  const getRewardProgress = (reward) => {
    const required = getRequiredAchievements(reward);
    return (
      required.filter((achievement) =>
        user?.achievements?.includes(achievement.key)
      ).length / required.length
    );
  };

  // Sort rewards by:
  // 1. Claimed first
  // 2. Unlocked (all achievements completed) but not claimed
  // 3. Progress percentage on incomplete rewards
  const sortedRewards = [...specialRewards].sort((a, b) => {
    const aIsClaimed = user?.unlockedRewards?.includes(a.id) || false;
    const bIsClaimed = user?.unlockedRewards?.includes(b.id) || false;

    // If one is claimed and the other isn't, claimed comes first
    if (aIsClaimed !== bIsClaimed) return bIsClaimed ? 1 : -1;

    const aProgress = getRewardProgress(a);
    const bProgress = getRewardProgress(b);
    const aIsUnlocked = aProgress === 1;
    const bIsUnlocked = bProgress === 1;

    // If one is unlocked and the other isn't, unlocked comes first
    if (aIsUnlocked !== bIsUnlocked) return bIsUnlocked ? 1 : -1;

    // Otherwise sort by progress percentage
    return bProgress - aProgress;
  });

  const claimedRewardsCount = user?.unlockedRewards?.length || 0;
  const totalRewardsCount = specialRewards.length;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold">Special Rewards</h1>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <span className="text-sm text-muted-foreground mr-2">
              Rewards Claimed:
            </span>
            <span className="text-2xl font-bold text-primary">
              {claimedRewardsCount}/{totalRewardsCount}
            </span>
          </div>
        </div>
        <p className="text-muted-foreground">
          To unlock rewards you must collect{" "}
          <Link
            href="/account/achievements"
            className="text-primary underline hover:text-primary/80"
          >
            achievements
          </Link>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedRewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            userAchievements={user?.achievements}
            requiredAchievements={getRequiredAchievements(reward)}
          />
        ))}
      </div>
    </div>
  );
});

export default RewardsPage;
