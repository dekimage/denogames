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
import { Button } from "@/components/ui/button";
import { Lock, Download, Trophy } from "lucide-react";

const RewardCard = ({ reward, userAchievements, requiredAchievements }) => {
  // Check if user has all required achievements
  const isUnlocked = requiredAchievements.every((achievement) =>
    userAchievements?.includes(achievement.key)
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={`relative cursor-pointer rounded-lg border p-4 transition-all hover:shadow-lg ${
            isUnlocked ? "bg-white" : "bg-gray-100 grayscale"
          }`}
        >
          {!isUnlocked && (
            <div className="absolute top-2 right-2">
              <Lock className="w-5 h-5 text-gray-500" />
            </div>
          )}

          <div className="relative h-32 w-full mb-3">
            <Image
              src={reward.thumbnail}
              alt={reward.title}
              fill
              className="object-contain"
            />
          </div>

          <h3 className="font-semibold truncate">{reward.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {reward.description}
          </p>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="relative h-12 w-12">
              <Image
                src={reward.thumbnail}
                alt={reward.title}
                fill
                className="object-contain"
              />
            </div>
            {reward.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{reward.description}</p>

          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Required Achievements
            </h4>
            <div className="space-y-2">
              {requiredAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center gap-3 p-2 rounded-lg border ${
                    userAchievements?.includes(achievement.key)
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <Image
                      src={achievement.image}
                      alt={achievement.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isUnlocked && reward.fileUrl && (
            <Button
              className="w-full"
              onClick={() => window.open(reward.fileUrl, "_blank")}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Reward
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Special Rewards</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {specialRewards.map((reward) => (
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
