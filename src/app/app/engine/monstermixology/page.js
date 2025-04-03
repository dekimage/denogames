"use client";
import PushLuckEngine from "../engines/PushLuckEngine";
import { monstermixologyDeck } from "./data";

import Image from "next/image";

import r1Img from "../../../../../public/monstermixology/ingridients/r1.png";
import r2Img from "../../../../../public/monstermixology/ingridients/r2.png";
import r3Img from "../../../../../public/monstermixology/ingridients/r3.png";
import r4Img from "../../../../../public/monstermixology/ingridients/r4.png";
import r5Img from "../../../../../public/monstermixology/ingridients/r5.png";
import r6Img from "../../../../../public/monstermixology/ingridients/r6.png";
import shieldImg from "../../../../../public/monstermixology/ingridients/shield.png";
import coinImg from "../../../../../public/monstermixology/ingridients/coin.png";
import boomImg from "../../../../../public/monstermixology/boom.png";

import vpImg from "../../../../../public/monstermixology/vp.png";
import shield3Img from "../../../../../public/monstermixology/ingridients/shield3.png";
import rerollImg from "../../../../../public/monstermixology/ingridients/reroll.png";

import c1Img from "../../../../../public/monstermixology/coctails/c1.png";
import c2Img from "../../../../../public/monstermixology/coctails/c2.png";
import c3Img from "../../../../../public/monstermixology/coctails/c3.png";
import c4Img from "../../../../../public/monstermixology/coctails/c4.png";
import c5Img from "../../../../../public/monstermixology/coctails/c5.png";
import c6Img from "../../../../../public/monstermixology/coctails/c6.png";
import c7Img from "../../../../../public/monstermixology/coctails/c7.png";
import c8Img from "../../../../../public/monstermixology/coctails/c8.png";
import c9Img from "../../../../../public/monstermixology/coctails/c9.png";
import c10Img from "../../../../../public/monstermixology/coctails/c10.png";
import c11Img from "../../../../../public/monstermixology/coctails/c11.png";
import c12Img from "../../../../../public/monstermixology/coctails/c12.png";
import c13Img from "../../../../../public/monstermixology/coctails/c13.png";
import c14Img from "../../../../../public/monstermixology/coctails/c14.png";
import c15Img from "../../../../../public/monstermixology/coctails/c15.png";
import c16Img from "../../../../../public/monstermixology/coctails/c16.png";
import c17Img from "../../../../../public/monstermixology/coctails/c17.png";
import c18Img from "../../../../../public/monstermixology/coctails/c18.png";
import c19Img from "../../../../../public/monstermixology/coctails/c19.png";
import c20Img from "../../../../../public/monstermixology/coctails/c20.png";
import c21Img from "../../../../../public/monstermixology/coctails/c21.png";
import c22Img from "../../../../../public/monstermixology/coctails/c22.png";
import c23Img from "../../../../../public/monstermixology/coctails/c23.png";
import c24Img from "../../../../../public/monstermixology/coctails/c24.png";

import e1Img from "../../../../../public/monstermixology/events/e1.png";
import e2Img from "../../../../../public/monstermixology/events/e2.png";
import e3Img from "../../../../../public/monstermixology/events/e3.png";
import e4Img from "../../../../../public/monstermixology/events/e4.png";
import e5Img from "../../../../../public/monstermixology/events/e5.png";
import e6Img from "../../../../../public/monstermixology/events/e6.png";

import pushLuckStore from "@/app/stores/pushLuckStore";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { observer } from "mobx-react-lite";
import MobxStore from "@/mobx";
import { auth } from "@/firebase";
import { runInAction } from "mobx";

// Color mappings using hex codes (pastel palette)
export const SPACE_MINERS_COLORS = {
  cardTypes: {
    resource: "#ffe9cd", // soft yellow (fixed hex code)
    blueprint: "#CCE5FF", // soft blue
    disaster: "#FFCCD4", // soft red
    event: "#d9ed92", // Light green background for event cards
  },
  resourceTypes: {
    crystal: "#FED9A6", // Pale yellow-green / SEPA
    gem: "#FFFDB7", // Light peach
    asteroid: "#FADBFF", // Pale yellow MASK
    dust: "#FFD5BE", // Very light reddish-orange
    gas: "#D4FDFF", // Light apricot / TEARS
    orb: "#EEF8AA", // Light lilac / SLIME
  },
  blueprintTypes: {
    government: "#588157", // slate
    private: "#073b4c", // brown
    rebel: "#eae2b7", // dark red
    alien: "#7400b8", // dark teal
  },
};

// Icon mappings (using emojis temporarily)
export const SPACE_MINERS_ICONS = {
  resourceTypes: {
    crystal: r1Img,
    gem: r2Img,
    asteroid: r3Img,
    dust: r4Img,
    gas: r5Img,
    orb: r6Img,
    shield: shieldImg,
  },
  blueprintTypes: {
    government: c1Img,
    private: c7Img,
    rebel: c13Img,
    alien: c19Img,
  },
  disaster: vpImg,
  coin: coinImg,
  reroll: rerollImg,
  shield: shieldImg,
};

// Add this near your other mappings
const COCKTAIL_IMAGES = {
  1: c1Img,
  2: c2Img,
  3: c3Img,
  4: c4Img,
  5: c5Img,
  6: c6Img,
  7: c7Img,
  8: c8Img,
  9: c9Img,
  10: c10Img,
  11: c11Img,
  12: c12Img,
  13: c13Img,
  14: c14Img,
  15: c15Img,
  16: c16Img,
  17: c17Img,
  18: c18Img,
  19: c19Img,
  20: c20Img,
  21: c21Img,
  22: c22Img,
  23: c23Img,
  24: c24Img,
};

// Core event cards that are always available
const coreEventCards = [
  {
    id: "core-event-1",
    card: "event",
    type: "event",
    rarity: "common",
    image: e1Img,
    text: "Tornado hits the Bar",
    description:
      "Anyone who has 6 or more unused ingredients must lose 2 of them.",
  },
  {
    id: "core-event-2",
    card: "event",
    type: "event",
    rarity: "common",
    image: e1Img,
    text: "Tornado hits the Bar",
    description:
      "Anyone who has 6 or more unused ingredients must lose 2 of them.",
  },
  {
    id: "core-event-3",
    card: "event",
    type: "event",
    rarity: "common",
    image: e4Img,
    text: "Help the Weak",
    description:
      "The player(s) with the least served cocktails may spend any 3 ingredients to serve a cocktail to any monster.",
  },
  {
    id: "core-event-4",
    card: "event",
    type: "event",
    rarity: "common",
    image: e4Img,
    text: "Help the Weak",
    description:
      "The player(s) with the least served cocktails may spend any 3 ingredients to serve a cocktail to any monster.",
  },
  {
    id: "core-event-5",
    card: "event",
    type: "event",
    rarity: "common",
    image: e3Img,
    text: "Happy Birthday!",
    description: "Gain any 1 ingredient of your choice.",
  },
  {
    id: "core-event-6",
    card: "event",
    type: "event",
    rarity: "common",
    image: e3Img,
    text: "Happy Birthday!",
    description: "Gain any 1 ingredient of your choice.",
  },
];

// Premium event cards that require the add-on
const addOnSets = {
  "mm-add-monsters-1": [
    {
      id: "premium-event-1",
      card: "event",
      type: "event",
      rarity: "special",
      image: e2Img,
      text: "Tax Collectors",
      description:
        "All players with 6 or more unused coins must lose half (rounded up).",
    },
    {
      id: "premium-event-2",
      card: "event",
      type: "event",
      rarity: "special",
      image: e6Img,
      text: "Pay Day",
      description:
        "All players may choose to gain either 1 shield or any 1 ingredient of their choice.",
    },
    {
      id: "premium-event-3",
      card: "event",
      type: "event",
      rarity: "special",
      image: e5Img,
      text: "Bartender of the day",
      description: "Any player that has exactly 4 served cokctails gains 🌕🌕.",
    },

    // ... your existing special event cards
  ],
  // Future add-ons can be added here
  "mm-add-monsters-2": [
    {
      id: "premium-event-7",
      card: "event",
      type: "event",
      rarity: "legendary",
      emoji: "🌈",
      text: "Rainbow Mix",
      description: "Create any resource of your choice",
    },
    // ... more cards for add-on 2
  ],
};

const SpaceMinerCard = ({
  item,
  isHighlighted,
  isSelected,
  selectionColor,
  recipeProgress,
  isFromModal,
}) => {
  const getCardBackground = () => {
    if (item.type === "boom") return SPACE_MINERS_COLORS.cardTypes.disaster;
    if (item.type === "event") return SPACE_MINERS_COLORS.cardTypes.event;
    if (item.card === "resource") return SPACE_MINERS_COLORS.cardTypes.resource;
    return SPACE_MINERS_COLORS.cardTypes[item.card];
  };

  const renderBonus = (type, value) => (
    <>
      {Array.from({ length: value }).map((_, index) => (
        <Image
          key={index}
          src={
            type === "coin"
              ? SPACE_MINERS_ICONS.coin
              : SPACE_MINERS_ICONS.reroll
          }
          alt={type}
          width={20}
          height={20}
        />
      ))}
    </>
  );

  return (
    <div
      className={`
        relative 
        sm:w-40 sm:h-56 
        w-24 h-32
        rounded-xl shadow-lg flex flex-col
        hover:z-10 transition-all duration-200
        ${isHighlighted ? "animate-highlight" : ""}
        ${isSelected ? "opacity-70" : "hover:scale-105"}
      `}
      style={{
        backgroundColor: getCardBackground(),
        ...(isHighlighted && {
          boxShadow: "0 0 0 4px #22c55e, 0 0 20px rgba(34, 197, 94, 0.5)",
          transform: "scale(1.1)",
          transition: "all 0.3s ease-in-out",
        }),
      }}
    >
      {/* Type Indicator */}
      {/* <div
        className="absolute -top-1 -left-1 w-8 h-8 rounded flex items-center justify-center border border-black"
        style={{ backgroundColor: getTypeColor() }}
      >
        {getTypeIcon()}
      </div> */}

      {/* Card Body */}
      <div className="flex-1 flex items-center justify-center border-2 border-gray-300 border-b-0 rounded-t-xl">
        {item.type === "boom" && (
          <div className="flex gap-1">
            <Image src={boomImg} alt={"boom img"} width={100} height={100} />
          </div>
        )}

        {item.card === "resource" && (
          <div
            className="w-22 h-22 sm:w-24 sm:h-24 rounded flex items-center justify-center border-2 border-black"
            style={{
              backgroundColor:
                SPACE_MINERS_COLORS.resourceTypes[item.type.toLowerCase()],
              borderColor:
                SPACE_MINERS_COLORS.resourceTypes[item.type.toLowerCase()],
            }}
          >
            <Image
              src={SPACE_MINERS_ICONS.resourceTypes[item.type.toLowerCase()]}
              alt={item.type}
              width={64}
              height={64}
            />
          </div>
        )}

        <div></div>

        {item.card === "blueprint" && (
          <div className="flex flex-col items-center">
            <div className="w-[52px] h-[52px] sm:w-24 sm:h-24 mb-2">
              <Image
                src={COCKTAIL_IMAGES[item.cocktailId]}
                alt="cocktail"
                width={112}
                height={112}
                className="w-[52px] h-[52px] sm:w-24 sm:h-24"
              />
            </div>

            {/* Top 2 resources */}
            <div className="flex gap-3">
              {item.randomResources.slice(0, 2).map((type, index) => (
                <div
                  key={index}
                  className="relative w-8 h-8 sm:w-11 sm:h-11 rounded flex items-center justify-center border-2"
                  style={{
                    backgroundColor: SPACE_MINERS_COLORS.resourceTypes[type],
                    borderColor: SPACE_MINERS_COLORS.resourceTypes[type],
                  }}
                >
                  <Image
                    src={SPACE_MINERS_ICONS.resourceTypes[type]}
                    alt={type}
                    width={32}
                    height={32}
                  />
                  {/* Add checkmark overlay if ingredient is selected */}
                  {pushLuckStore.isIngredientSelected(type) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-500/30">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Only show progress if we have ingredients */}
            {item.ingredients && recipeProgress && (
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                {recipeProgress.map((ingredient, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      ingredient.isSelected ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    {ingredient.isSelected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* New event card render */}
        {item.type === "event" && (
          <div className="flex flex-col items-center gap-2 p-2 text-center text-black">
            <Image src={item.image} alt={item.text} width={60} height={60} />
            <div className="text-4xl sm:text-5xl mb-2">{item.emoji}</div>
            <div className="text-sm font-medium">{item.text}</div>
            {!isFromModal && (
              <div className="text-xs text-gray-600 px-2">
                {item.description}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div
        className={`h-10 sm:h-12 ${item.card !== "blueprint" ? "border-t border-black/10" : ""} flex items-center justify-center border-2 border-gray-300 border-t-0 rounded-b-xl`}
      >
        {item.card === "blueprint" && (
          <>
            {/* Third resource in footer */}
            {item.randomResources.length > 2 && (
              <div
                className="mb-0 sm:mb-2 relative w-8 h-8 sm:w-11 sm:h-11 rounded flex items-center justify-center "
                style={{
                  backgroundColor:
                    SPACE_MINERS_COLORS.resourceTypes[item.randomResources[2]],
                }}
              >
                <Image
                  src={
                    SPACE_MINERS_ICONS.resourceTypes[item.randomResources[2]]
                  }
                  alt={item.randomResources[2]}
                  width={32}
                  height={32}
                />
                {/* Add checkmark overlay if ingredient is selected */}
                {pushLuckStore.isIngredientSelected(
                  item.randomResources[2]
                ) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/30">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {item.card === "resource" && item.rarity !== "common" && (
          <div className="flex gap-2 font-strike uppercase text-black">
            {renderBonus("coin", item.rarity === "ancient" ? 2 : 1)}
          </div>
        )}

        {item.type === "boom" && (
          <div className="flex gap-1">
            {Array.from({ length: item.threat || 1 }).map((_, i) => (
              <Image
                key={i}
                src={SPACE_MINERS_ICONS.resourceTypes.shield}
                alt="shield"
                width={24}
                height={24}
              />
            ))}
          </div>
        )}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div
          className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-2"
          style={{
            backgroundColor:
              selectionColor === "main" ? "#4A5568" : selectionColor,
          }}
        />
      )}
    </div>
  );
};

// Helper functions (at the top of the file)
const getRandomResources = () => {
  const resources = ["crystal", "gem", "gas", "asteroid", "dust", "orb"];
  const shuffled = [...resources].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

const getBlueprintRewards = () => {
  return {
    coins: Math.floor(Math.random() * 3),
    rerolls: 1,
  };
};

// Add a helper function to get the correct cocktail ID range
const getCocktailIdForBlueprintType = (type) => {
  const baseIds = {
    government: 1, // c1-c6
    private: 7, // c7-c12
    rebel: 13, // c13-c18
    alien: 19, // c19-c24
  };

  const baseId = baseIds[type];
  // Generate random number 0-5 and add to base to get one of six possible images
  return baseId + Math.floor(Math.random() * 6);
};

// Modify the enhancedDeck creation
const enhancedDeck = monstermixologyDeck.map((card) => {
  const enhancedCard = { ...card };

  if (card.card === "blueprint") {
    enhancedCard.randomResources = getRandomResources();
    enhancedCard.blueprintRewards = getBlueprintRewards();
    enhancedCard.cocktailId = getCocktailIdForBlueprintType(card.type);
    enhancedCard.ingredients = enhancedCard.randomResources;
  }

  return enhancedCard;
});

// Define special monster cards
const specialMonsterCards = [
  {
    id: "monster-1",
    card: "monster",
    type: "MONSTER",
    rarity: "special",
    icon: "👾",
    text: "Monster Card 1",
    // Add any other properties needed for monster cards
  },

  // Add other monster cards similarly
];

const Monstermixology = observer(() => {
  // Start with enhanced deck + core event cards
  const [availableCards, setAvailableCards] = useState([
    ...enhancedDeck,
    ...coreEventCards,
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [enabledAddons, setEnabledAddons] = useState({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("Auth state changed:", {
        hasUser: !!user,
        userFullyLoaded: MobxStore.userFullyLoaded,
        loadingUser: MobxStore.loadingUser,
      });

      if (user && !MobxStore.userFullyLoaded && !MobxStore.loadingUser) {
        try {
          setIsLoading(true);
          runInAction(() => {
            MobxStore.loadingUser = true;
          });

          const token = await user.getIdToken();
          const response = await fetch("/api/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const { user: userData } = await response.json();

          console.log("User rewards:", {
            rewards: userData.unlockedRewards,
            hasMonsterReward:
              userData.unlockedRewards?.includes("mm-add-monsters-1"),
          });

          runInAction(() => {
            MobxStore.updateUserProfile(userData);
            MobxStore.userFullyLoaded = true;
          });

          // Initialize enabled addons based on user's unlocked rewards
          const newEnabledAddons = {};
          Object.keys(addOnSets).forEach((addOnId) => {
            newEnabledAddons[addOnId] =
              userData.unlockedRewards?.includes(addOnId) || false;
          });
          setEnabledAddons(newEnabledAddons);

          // Update available cards with unlocked add-on cards
          let newDeck = [...enhancedDeck, ...coreEventCards];
          Object.entries(addOnSets).forEach(([addOnId, cards]) => {
            if (userData.unlockedRewards?.includes(addOnId)) {
              newDeck = [...newDeck, ...cards];
            }
          });
          setAvailableCards(newDeck);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
          runInAction(() => {
            MobxStore.loadingUser = false;
          });
        }
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  // Show loading state while checking auth or loading user data
  if (!authChecked || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Modify SpaceMinerCard to handle monster cards
  const SpaceMinerCardWithMonsters = (props) => {
    const { item, isFromModal } = props;

    if (item.card === "monster") {
      return (
        <div
          className={`
            relative 
            sm:w-40 sm:h-56 
            w-24 h-32
            rounded-xl shadow-lg flex flex-col
            bg-green-200
            ${props.isHighlighted ? "animate-highlight" : ""}
            ${props.isSelected ? "opacity-70" : "hover:scale-105"}
          `}
        >
          <div className="flex-1 flex items-center justify-center">
            <Image
              src={item.icon}
              alt={item.text}
              width={60}
              height={60}
              className="sm:w-24 sm:h-24"
            />
          </div>
          <div className="h-10 sm:h-12 border-t border-black/10 flex items-center justify-center">
            <span className="text-sm font-medium">{item.text}</span>
          </div>
        </div>
      );
    }

    return <SpaceMinerCard {...props} isFromModal={isFromModal} />;
  };

  const spaceMinerConfig = {
    initialItems: availableCards,
    buttons: {
      draw: <span className="flex items-center gap-2">Explore</span>,
      stop: "Collect",
    },
    addOns: {
      sets: addOnSets,
      enabled: enabledAddons,
      toggle: (addOnId) => {
        setEnabledAddons((prev) => {
          const newEnabled = { ...prev, [addOnId]: !prev[addOnId] };

          // Update available cards based on enabled state
          let newDeck = [...enhancedDeck, ...coreEventCards];
          Object.entries(addOnSets).forEach(([id, cards]) => {
            if (newEnabled[id]) {
              newDeck = [...newDeck, ...cards];
            }
          });
          setAvailableCards(newDeck);
          pushLuckStore.setConfig({
            ...spaceMinerConfig,
            initialItems: newDeck,
          });
          pushLuckStore.restartGame();

          return newEnabled;
        });
      },
    },
  };

  return (
    <div>
      <PushLuckEngine
        config={spaceMinerConfig}
        CardComponent={SpaceMinerCardWithMonsters}
        className="gap-4"
      />
    </div>
  );
});

// Wrap the main component with dynamic import
const ClientMonstermixologyEngine = dynamic(
  () => Promise.resolve(Monstermixology),
  { ssr: false }
);

export default ClientMonstermixologyEngine;
