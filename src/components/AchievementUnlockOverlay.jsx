"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import MobxStore from "@/mobx";
import { Star, Trophy, Award } from "lucide-react";

const AchievementUnlockOverlay = observer(() => {
  const {
    showAchievementAnimation,
    newlyUnlockedAchievement,
    clearNewAchievement,
  } = MobxStore;

  useEffect(() => {
    // Auto-hide after 5 seconds
    if (showAchievementAnimation) {
      const timer = setTimeout(() => {
        clearNewAchievement();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAchievementAnimation, clearNewAchievement]);

  console.log("showAchievementAnimation", showAchievementAnimation);
  console.log("newlyUnlockedAchievement", newlyUnlockedAchievement);

  // Return null when there's no achievement to show
  if (!showAchievementAnimation || !newlyUnlockedAchievement) {
    return null;
  }

  const achievement = newlyUnlockedAchievement;

  // KEEPING ALL YOUR BEAUTIFUL UI!
  return (
    <AnimatePresence mode="wait">
      {showAchievementAnimation && newlyUnlockedAchievement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => {
            clearNewAchievement();
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-card p-8 rounded-lg shadow-xl max-w-md w-full mx-4 text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated stars in background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.5],
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200,
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="absolute"
                >
                  {i % 2 === 0 ? (
                    <Star className="text-yellow-400 h-4 w-4" />
                  ) : (
                    <Trophy className="text-yellow-400 h-4 w-4" />
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  delay: 0.3,
                }}
                className="flex justify-center mb-2"
              >
                <Award className="h-8 w-8 text-yellow-400" />
              </motion.div>

              <h2 className="text-2xl font-bold mb-6 text-yellow-400">
                Achievement Unlocked!
              </h2>

              <div className="relative w-32 h-32 mx-auto mb-6 rounded-lg overflow-hidden">
                <Image
                  src={achievement.image}
                  alt={achievement.name}
                  fill
                  className="object-contain"
                />
              </div>

              <h3 className="text-xl font-semibold mb-2">{achievement.name}</h3>

              {achievement.difficulty && (
                <div className="flex justify-center gap-1 mb-3">
                  {[...Array(achievement.difficulty)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>
              )}

              <p className="text-muted-foreground">{achievement.description}</p>

              {achievement.unlocksRewards?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 p-3 bg-yellow-400/10 rounded-lg"
                >
                  <p className="text-sm font-medium text-yellow-400">
                    🎁 Unlocks {achievement.unlocksRewards.length} reward
                    {achievement.unlocksRewards.length > 1 ? "s" : ""}
                  </p>
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={() => {
                  clearNewAchievement();
                }}
                className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Awesome!
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default AchievementUnlockOverlay;
