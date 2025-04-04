"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { auth } from "@/firebase";
import MobxStore from "@/mobx";
import { runInAction } from "mobx";
import { EasterEggDialog } from "@/components/ui/easter-egg-dialog";

export function Cauldron() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);
  const [showCauldronEgg, setShowCauldronEgg] = useState(false);
  const { theme } = useTheme();
  const { toast } = useToast();

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

  const handleCook = async () => {
    if (!code.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a code first!",
      });
      return;
    }

    setIsLoading(true);
    setUnlockedAchievement(null);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("You must be logged in to use the cauldron!");
      }

      const token = await user.getIdToken();

      const response = await fetch("/api/achievements/cook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error);
      }

      if (data.success) {
        setUnlockedAchievement(data.achievement);

        runInAction(() => {
          if (!MobxStore.user.achievements.includes(data.achievement.id)) {
            MobxStore.user.achievements.push(data.achievement.id);
          }

          const existingIndex = MobxStore.achievements.findIndex(
            (a) => a.id === data.achievement.id
          );

          if (existingIndex === -1) {
            MobxStore.achievements.push(data.achievement);
          } else {
            MobxStore.achievements[existingIndex] = data.achievement;
          }
        });

        toast({
          title: "Achievement Unlocked!",
          description: (
            <div className="flex items-center gap-3">
              {data.achievement.image && data.achievement.image !== "" && (
                <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border">
                  <Image
                    src={data.achievement.image}
                    alt={data.achievement.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-medium">{data.achievement.name}</span>
                <span className="text-xs text-muted-foreground">
                  {data.achievement.description}
                </span>
              </div>
            </div>
          ),
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
      setCode("");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-xl border bg-card p-6 shadow-lg">
      <div className="space-y-6">
        {/* Cauldron Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold font-strike">
            The Magical Cauldron
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter a secret code to cook up something special!
          </p>
        </div>

        {/* Cauldron Image and Achievement Slot */}
        <div className="relative">
          <div
            className="relative w-48 h-48 mx-auto cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setShowCauldronEgg(true)}
          >
            <Image
              src="/platform/cauldron.png"
              alt="Magical Cauldron"
              fill
              className="object-contain"
            />
          </div>

          {/* Achievement Slot */}
          <div
            className={cn(
              "absolute top-0 right-0 w-24 h-24 rounded-lg border-2 border-dashed",
              unlockedAchievement
                ? "border-primary"
                : "border-muted-foreground/50"
            )}
          >
            {unlockedAchievement && (
              <div className="relative w-full h-full animate-fade-in">
                <Image
                  src={unlockedAchievement.image}
                  alt={unlockedAchievement.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
            )}
          </div>
        </div>

        {/* Input and Button */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter your secret code..."
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
                Cooking... {progress}%
              </p>
            </div>
          )}

          <Button
            onClick={handleCook}
            disabled={isLoading || !code.trim()}
            className="w-full"
          >
            {isLoading ? "Cooking..." : "Cook!"}
          </Button>
        </div>
      </div>

      {/* Add the Easter Egg Dialog */}
      <EasterEggDialog
        open={showCauldronEgg}
        onOpenChange={setShowCauldronEgg}
        title="You found it!"
        code="START"
        message="This was an easy easter egg! But it's good enough to get you warmed up! :D"
        image="/easterEggs/3.png"
        imageAlt="Easy Easter Egg"
      />
    </div>
  );
}
