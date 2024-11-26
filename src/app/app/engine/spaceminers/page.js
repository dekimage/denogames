"use client";
import { useState } from "react";
import PushLuckEngine from "../engines/PushLuckEngine";
import { spaceMinersDeck } from "./data";

const PickAxeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-pickaxe"
  >
    <path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912" />
    <path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393" />
    <path d="M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z" />
    <path d="M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319" />
  </svg>
);

// Color mappings using hex codes (pastel palette)
export const SPACE_MINERS_COLORS = {
  cardTypes: {
    resource: "#FFE5CC", // soft yellow
    blueprint: "#CCE5FF", // soft blue
    disaster: "#FFCCD4", // soft red
  },
  resourceTypes: {
    crystal: "#E6E6FA", // soft lavender
    gem: "#FFB3B3", // soft pink
    asteroid: "#D4D4D4", // soft gray
    dust: "#FFE4B5", // soft orange
    gas: "#B3E6FF", // soft cyan
    orb: "#DDA0DD", // soft purple
  },
  blueprintTypes: {
    government: "#4A5568", // slate
    private: "#744210", // brown
    rebel: "#742A2A", // dark red
    alien: "#234E52", // dark teal
  },
};

// Icon mappings (using emojis temporarily)
export const SPACE_MINERS_ICONS = {
  resourceTypes: {
    crystal: "💎",
    gem: "💍",
    asteroid: "🌑",
    dust: "✨",
    gas: "💨",
    orb: "🔮",
  },
  blueprintTypes: {
    government: "👑",
    private: "💼",
    rebel: "⚔️",
    alien: "👽",
  },
  disaster: "☠️",
  coin: "🌕",
  reroll: "♻",
  shield: "🛡️",
  star: "⭐",
};

const SpaceMinerCard = ({
  item,
  isHighlighted,
  isSelected,
  selectionColor,
}) => {
  const getResourceBonus = (rarity) => {
    switch (rarity) {
      case "rare":
        return `1 ${SPACE_MINERS_ICONS.coin}`;
      case "ancient":
        return `2 ${SPACE_MINERS_ICONS.coin}`;
      default:
        return "/";
    }
  };

  const getCardBackground = () => {
    if (item.type === "boom") return SPACE_MINERS_COLORS.cardTypes.disaster;
    return SPACE_MINERS_COLORS.cardTypes[item.card];
  };

  const getTypeColor = () => {
    if (item.type === "boom") return "#FF4D4D";
    if (item.card === "blueprint")
      return SPACE_MINERS_COLORS.blueprintTypes[item.type];
    return SPACE_MINERS_COLORS.resourceTypes[item.type.toLowerCase()];
  };

  const getTypeIcon = () => {
    if (item.type === "boom") return SPACE_MINERS_ICONS.disaster;
    if (item.card === "blueprint")
      return SPACE_MINERS_ICONS.blueprintTypes[item.type];
    return SPACE_MINERS_ICONS.resourceTypes[item.type.toLowerCase()];
  };

  const renderBonus = (type, value) => (
    <div className="flex items-center gap-1">
      <div
        className={`
        w-4 h-4 rounded-full flex items-center justify-center border border-black
        ${type === "coin" ? "bg-amber-300" : "bg-emerald-400"}
      `}
      >
        <span className="text-xl">
          {type === "coin"
            ? SPACE_MINERS_ICONS.coin
            : SPACE_MINERS_ICONS.reroll}
        </span>
      </div>
      <span className="text-lg">{value}</span>
    </div>
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
      <div
        className="absolute -top-1 -left-1 w-8 h-8 rounded flex items-center justify-center border border-black"
        style={{ backgroundColor: getTypeColor() }}
      >
        <span className="text-base">{getTypeIcon()}</span>
      </div>

      {/* Card Body */}
      <div className="flex-1 flex items-center justify-center">
        {item.type === "boom" && (
          <div className="flex gap-1">
            {Array.from({ length: item.threat || 1 }).map((_, i) => (
              <span key={i} className="text-2xl">
                {SPACE_MINERS_ICONS.shield}
              </span>
            ))}
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
            <span className="text-3xl sm:text-4xl">
              {SPACE_MINERS_ICONS.resourceTypes[item.type.toLowerCase()]}
            </span>
          </div>
        )}

        {item.card === "blueprint" && (
          <div className="flex flex-wrap gap-1 sm:gap-2 justify-start mt-6 mx-2">
            {item.randomResources.map((type, index) => (
              <div
                key={index}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center border border-black"
                style={{
                  backgroundColor: SPACE_MINERS_COLORS.resourceTypes[type],
                }}
              >
                <span className="text-xs sm:text-sm">
                  {SPACE_MINERS_ICONS.resourceTypes[type]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="h-10 sm:h-12 border-t border-black/10 flex items-center justify-center">
        {item.card === "blueprint" && (
          <div className="flex gap-2 font-strike uppercase text-black">
            {item.blueprintRewards.coins > 0 &&
              renderBonus("coin", item.blueprintRewards.coins)}
            {item.blueprintRewards.rerolls > 0 &&
              renderBonus("reroll", item.blueprintRewards.rerolls)}
          </div>
        )}

        {item.card === "resource" && item.rarity !== "common" && (
          <div className="flex gap-2 font-strike uppercase text-black">
            {renderBonus("coin", item.rarity === "ancient" ? 2 : 1)}
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
    coins: Math.floor(Math.random() * 3), // 0-2 coins
    rerolls: Math.floor(Math.random() * 3), // 0-2 rerolls
  };
};

// Enhance the deck with static random values
const enhancedDeck = spaceMinersDeck.map((card) => {
  const enhancedCard = { ...card };

  if (card.card === "blueprint") {
    enhancedCard.randomResources = getRandomResources();
    enhancedCard.blueprintRewards = getBlueprintRewards();
  }

  return enhancedCard;
});

// Sample game configuration
const spaceMinerConfig = {
  initialItems: enhancedDeck,
  buttons: {
    draw: (
      <span className="flex items-center gap-2">
        Mine <PickAxeIcon />
      </span>
    ),
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
