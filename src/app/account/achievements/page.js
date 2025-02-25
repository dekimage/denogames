"use client";

import { useEffect } from "react";
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
import { CheckCircle, Lock } from "lucide-react";

export const AchievementCard = ({
  achievement,
  isUnlocked,
  relatedRewards,
  fromReward,
}) => {
  const cardContent = (
    <div
      className={`relative cursor-pointer rounded-lg border p-4 transition-all hover:shadow-lg ${
        isUnlocked ? "bg-white" : "bg-gray-100 grayscale"
      }`}
    >
      <div className="absolute top-2 right-2">
        {isUnlocked ? (
          <CheckCircle className="w-5 h-5 text-primary" />
        ) : (
          <Lock className="w-5 h-5 text-gray-500" />
        )}
      </div>

      <div className="absolute top-2 left-2">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            achievement.type === "achievement"
              ? "bg-primary/10 text-primary"
              : "bg-purple-100 text-purple-600"
          }`}
        >
          {achievement.type === "achievement" ? "Achievement" : "Collectible"}
        </span>
      </div>

      <div className="relative h-24 w-24 mx-auto mb-3 mt-6">
        <Image
          src={achievement.image}
          alt={achievement.name}
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-center font-semibold">{achievement.name}</h3>
      <p className="text-sm text-center text-muted-foreground mt-1">
        {achievement.description}
      </p>
    </div>
  );

  // If fromReward is true, return just the card content without Dialog
  if (fromReward) {
    return cardContent;
  }

  // Otherwise, wrap it in Dialog
  return (
    <Dialog>
      <DialogTrigger asChild>{cardContent}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="relative h-12 w-12">
              <Image
                src={achievement.image}
                alt={achievement.name}
                fill
                className="object-contain"
              />
            </div>
            {achievement.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">Description</h4>
            <p className="text-sm text-muted-foreground">
              {achievement.description}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-1">How to Unlock</h4>
            <p className="text-sm text-muted-foreground">
              {achievement.requirement}
            </p>
          </div>

          {relatedRewards.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Required for Special Rewards</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {relatedRewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center gap-2 p-2 rounded-lg border"
                  >
                    <div className="relative h-10 w-10 flex-shrink-0">
                      <Image
                        src={reward.thumbnail}
                        alt={reward.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <span className="text-sm font-medium line-clamp-2">
                      {reward.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

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

  // Debug logs
  console.log(
    "All achievements:",
    achievements.map((a) => ({ key: a.key, type: a.type }))
  );
  console.log("User achievements:", user?.achievements);
  console.log("Achievement stats:", {
    total: {
      achievements: achievements.filter((a) => a.type === "achievement").length,
      collectibles: achievements.filter((a) => a.type === "collectible").length,
    },
    unlocked: {
      achievements: achievements
        .filter(
          (a) => a.type === "achievement" && user?.achievements?.includes(a.key)
        )
        .map((a) => a.key),
      collectibles: achievements
        .filter(
          (a) => a.type === "collectible" && user?.achievements?.includes(a.key)
        )
        .map((a) => a.key),
    },
  });

  // Sort achievements: unlocked first
  const sortedAchievements = [...achievements].sort((a, b) => {
    const aUnlocked = user?.achievements?.includes(a.key) || false;
    const bUnlocked = user?.achievements?.includes(b.key) || false;
    if (aUnlocked !== bUnlocked) return bUnlocked ? 1 : -1;
    return 0;
  });

  return (
    <div className="container mx-auto py-8">
      <div className="sm:flex justify-between items-start mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Achievements</h1>

        <div className="space-y-2 sm:space-y-0 sm:flex sm:gap-6 text-center sm:text-left">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm text-muted-foreground mb-1">
              Achievements Progress
            </h3>
            <p className="text-2xl font-bold text-primary">
              {stats.achievements.unlocked}/{stats.achievements.total}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm text-muted-foreground mb-1">
              Collectibles Progress
            </h3>
            <p className="text-2xl font-bold text-primary">
              {stats.collectibles.unlocked}/{stats.collectibles.total}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            isUnlocked={user?.achievements?.includes(achievement.key)}
            relatedRewards={getRelatedRewards(achievement.key)}
            fromReward={false}
          />
        ))}
      </div>
    </div>
  );
});

export default AchievementsPage;
