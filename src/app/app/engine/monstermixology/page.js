"use client";
import PushLuckEngine from "../engines/PushLuckEngine";
import { spaceMinersDeck } from "./data";

import Image from "next/image";

import r1Img from "../../../../../public/spaceminers/ingridients/r1.png";
import r2Img from "../../../../../public/spaceminers/ingridients/r2.png";
import r3Img from "../../../../../public/spaceminers/ingridients/r3.png";
import r4Img from "../../../../../public/spaceminers/ingridients/r4.png";
import r5Img from "../../../../../public/spaceminers/ingridients/r5.png";
import r6Img from "../../../../../public/spaceminers/ingridients/r6.png";
import shieldImg from "../../../../../public/spaceminers/ingridients/shield.png";
import coinImg from "../../../../../public/spaceminers/ingridients/coin.png";
import boomImg from "../../../../../public/spaceminers/boom.png";

import vpImg from "../../../../../public/spaceminers/vp.png";
import shield3Img from "../../../../../public/spaceminers/ingridients/shield3.png";
import rerollImg from "../../../../../public/spaceminers/ingridients/reroll.png";

import c1Img from "../../../../../public/spaceminers/coctails/c1.png";
import c2Img from "../../../../../public/spaceminers/coctails/c2.png";
import c3Img from "../../../../../public/spaceminers/coctails/c3.png";
import c4Img from "../../../../../public/spaceminers/coctails/c4.png";
import c5Img from "../../../../../public/spaceminers/coctails/c5.png";
import c6Img from "../../../../../public/spaceminers/coctails/c6.png";
import c7Img from "../../../../../public/spaceminers/coctails/c7.png";
import c8Img from "../../../../../public/spaceminers/coctails/c8.png";
import c9Img from "../../../../../public/spaceminers/coctails/c9.png";
import c10Img from "../../../../../public/spaceminers/coctails/c10.png";
import c11Img from "../../../../../public/spaceminers/coctails/c11.png";
import c12Img from "../../../../../public/spaceminers/coctails/c12.png";
import c13Img from "../../../../../public/spaceminers/coctails/c13.png";
import c14Img from "../../../../../public/spaceminers/coctails/c14.png";
import c15Img from "../../../../../public/spaceminers/coctails/c15.png";
import c16Img from "../../../../../public/spaceminers/coctails/c16.png";
import c17Img from "../../../../../public/spaceminers/coctails/c17.png";
import c18Img from "../../../../../public/spaceminers/coctails/c18.png";
import c19Img from "../../../../../public/spaceminers/coctails/c19.png";
import c20Img from "../../../../../public/spaceminers/coctails/c20.png";
import c21Img from "../../../../../public/spaceminers/coctails/c21.png";
import c22Img from "../../../../../public/spaceminers/coctails/c22.png";
import c23Img from "../../../../../public/spaceminers/coctails/c23.png";
import c24Img from "../../../../../public/spaceminers/coctails/c24.png";
import pushLuckStore from "@/app/stores/pushLuckStore";

// Color mappings using hex codes (pastel palette)
export const SPACE_MINERS_COLORS = {
  cardTypes: {
    resource: "#FFE5CC", // soft yellow
    blueprint: "#CCE5FF", // soft blue
    disaster: "#FFCCD4", // soft red
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

const SpaceMinerCard = ({
  item,
  isHighlighted,
  isSelected,
  selectionColor,
  recipeProgress,
}) => {
  const getCardBackground = () => {
    if (item.type === "boom") return SPACE_MINERS_COLORS.cardTypes.disaster;
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
      <div className="flex-1 flex items-center justify-center">
        {item.type === "boom" && (
          <div className="flex gap-1">
            <Image src={boomImg} alt={"boom img"} width={50} height={50} />
          </div>
        )}

        {item.card === "resource" && (
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded flex items-center justify-center border border-black"
            style={{
              backgroundColor:
                SPACE_MINERS_COLORS.resourceTypes[item.type.toLowerCase()],
            }}
          >
            <Image
              src={SPACE_MINERS_ICONS.resourceTypes[item.type.toLowerCase()]}
              alt={item.type}
              width={32}
              height={32}
            />
          </div>
        )}

        <div></div>

        {item.card === "blueprint" && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-[60px] h-[60px] sm:w-24 sm:h-24">
              <Image
                src={COCKTAIL_IMAGES[item.cocktailId]}
                alt="cocktail"
                width={96}
                height={96}
                className="w-[60px] h-[60px] sm:w-24 sm:h-24"
              />
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
      </div>

      {/* Card Footer */}
      <div className="h-10 sm:h-12 border-t border-black/10 flex items-center justify-center">
        {item.card === "blueprint" && (
          <>
            <div className="flex gap-1">
              {item.randomResources.map((type, index) => (
                <div
                  key={index}
                  className="relative w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center border border-black"
                  style={{
                    backgroundColor: SPACE_MINERS_COLORS.resourceTypes[type],
                  }}
                >
                  <Image
                    src={SPACE_MINERS_ICONS.resourceTypes[type]}
                    alt={type}
                    width={24}
                    height={24}
                  />
                  {/* Add checkmark overlay if ingredient is selected */}

                  {pushLuckStore.isIngredientSelected(type) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-500/30">
                      <svg
                        className="w-4 h-4 text-white"
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
            {/* <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 flex flex-col gap-1">
              {item.blueprintRewards.coins > 0 &&
                renderBonus("coin", item.blueprintRewards.coins)}
              {item.blueprintRewards.rerolls > 0 &&
                renderBonus("reroll", item.blueprintRewards.rerolls)}
            </div> */}
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
const enhancedDeck = spaceMinersDeck.map((card) => {
  const enhancedCard = { ...card };

  if (card.card === "blueprint") {
    enhancedCard.randomResources = getRandomResources();
    enhancedCard.blueprintRewards = getBlueprintRewards();
    enhancedCard.cocktailId = getCocktailIdForBlueprintType(card.type);
    enhancedCard.ingredients = enhancedCard.randomResources;
  }

  return enhancedCard;
});

// Sample game configuration
const spaceMinerConfig = {
  initialItems: enhancedDeck,
  buttons: {
    draw: <span className="flex items-center gap-2">Explore</span>,
    stop: "Collect",
  },
};

const SpaceMiners = () => {
  return (
    <div>
      <PushLuckEngine
        config={spaceMinerConfig}
        CardComponent={SpaceMinerCard}
        className="gap-4" // Add gap between cards
      />
    </div>
  );
};

export default SpaceMiners;
