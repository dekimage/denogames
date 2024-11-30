"use client";
import React from "react";
import { A4_DIMENSIONS } from "./utils";
import { buildingCards } from "./data";
import Image from "next/image";
import {
  SPACE_MINERS_COLORS,
  SPACE_MINERS_ICONS,
} from "@/app/app/engine/spaceminers/page";

import templateImg from "../../../../public/spaceminers/test.png";

const ResourceTracker = ({ type }) => {
  return (
    <div className="flex flex-col border-2 border-black rounded-lg p-1 w-[120px] relative">
      {/* Resource Header - positioned absolutely */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xl border-2 border-black"
          style={{ backgroundColor: SPACE_MINERS_COLORS.resourceTypes[type] }}
        >
          {SPACE_MINERS_ICONS.resourceTypes[type]}
        </div>
      </div>

      {/* Tracker Grid - 4 columns */}
      <div className="flex justify-between gap-1 mt-4">
        {[0, 1, 2, 3].map((col) => (
          <div key={col} className="flex flex-col gap-1">
            {Array.from({ length: 4 }).map((_, row) => (
              <div
                key={row}
                className="w-6 h-6 rounded-full border border-dashed border-gray-400"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
export const BuildingCard = ({ card }) => {
  return (
    <div className="relative">
      <Image
        src={templateImg}
        alt={card.name}
        height={1400}
        width={1100}
        className="w-[200px] h-[240px] rounded-[10px]"
      />

      {/* Overlaid text elements */}
      <div className="absolute top-2 left-3 text-sm font-bold">
        {card.number}
      </div>

      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-sm font-bold uppercase">
        {card.name}
      </div>

      <div className="absolute top-2 right-3 text-sm font-bold">
        {card.vp}VP
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[180px] text-center text-xs">
        {card.effect}
      </div>
    </div>
  );
};
const TrackerComponent = ({ icon, bgColor, children }) => {
  return (
    <div className="flex flex-col border-b border-l border-r border-black rounded-lg p-1 w-full relative">
      <div
        className="w-8 h-8 absolute left-[10px] top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg flex items-center justify-center text-md border-2 border-black"
        style={{ backgroundColor: bgColor }}
      >
        {icon}
      </div>

      {children}
    </div>
  );
};
const DisasterTracker = () => {
  const disasterSymbolMap = {
    1: "coin",
    2: "shield",
    3: "star",
  };

  const disasterSequence = [
    1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 3, 1, 2, 2, 3, 1, 2, 2, 1, 3, 2,
    1, 2, 2, 3, 2, 2, 1, 3, 2, 1, 2, 3, 1, 2, 3,
  ];

  return (
    <TrackerComponent icon="☠️" bgColor="#FEE2E2">
      {/* red-200 */}
      <div className="flex flex-col gap-2 pl-6">
        {[0, 1].map((row) => (
          <div key={row} className="flex justify-center gap-2">
            {Array.from({ length: 20 }).map((_, col) => (
              <div
                key={col}
                className="w-8 h-8 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center"
              >
                {
                  SPACE_MINERS_ICONS[
                    disasterSymbolMap[disasterSequence[row * 20 + col]] ||
                      "coin"
                  ]
                }
              </div>
            ))}
          </div>
        ))}
      </div>
    </TrackerComponent>
  );
};
const CoinTracker = () => {
  return (
    <TrackerComponent icon="🌕" bgColor="#FEF9C3">
      <div className="flex flex-col gap-2 pl-6">
        {[0].map((row) => (
          <div key={row} className="flex justify-center gap-2">
            {Array.from({ length: 20 }).map((_, col) => (
              <div
                key={col}
                className={`w-8 h-8 rounded-full border-2 ${
                  col < 3 ? "border-black" : "border-dashed border-gray-400"
                } flex items-center justify-center`}
              >
                🌕
              </div>
            ))}
          </div>
        ))}
      </div>
    </TrackerComponent>
  );
};
const ShieldsTracker = () => {
  return (
    <TrackerComponent icon="🛡️" bgColor="#E0F2E9">
      <div className="flex flex-col gap-2 pl-6">
        {[0].map((row) => (
          <div key={row} className="flex justify-center gap-2">
            {Array.from({ length: 20 }).map((_, col) => (
              <div
                key={col}
                className={`w-8 h-8 rounded-full border-2 ${
                  col < 2 ? "border-black" : "border-dashed border-gray-400"
                } flex items-center justify-center`}
              >
                🛡️
              </div>
            ))}
          </div>
        ))}
      </div>
    </TrackerComponent>
  );
};
const BlueprintTracker = () => {
  return (
    <TrackerComponent icon="📋" bgColor="#BFDBFE">
      <div className="flex justify-between items-center pl-6 pr-2">
        <div className="flex gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-lg border-2 border-black bg-white flex items-center justify-center font-bold relative shadow-inner"
            >
              <div className="absolute -top-2 -left-2 w-5 h-5 bg-blue-100 rounded-full border-2 border-black flex items-center justify-center text-xs">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-[1px] bg-black"></div>
          <div className="font-bold text-xs uppercase tracking-wider bg-blue-100 px-2 py-1 rounded-lg border-2 border-black">
            End Game
          </div>
        </div>
      </div>
    </TrackerComponent>
  );
};
const ScoringTable = () => {
  const categories = [
    { label: "Blueprints", icon: "📋" },
    { label: "Monument Bonuses", icon: "🏛️" },
    { label: "Resources (+1VP/3)", icon: "📦" },
    { label: "Total", icon: "⭐" },
  ];

  return (
    <TrackerComponent icon="🏆" bgColor="#FEF3C7">
      <div className="flex items-center justify-between pl-6 pr-2 py-1">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                <span className="text-xs uppercase font-bold tracking-wider">
                  {category.label}
                </span>
                <span className="text-lg">{category.icon}</span>
              </div>
              {index === categories.length - 1 && (
                <div className="text-[10px] text-gray-600 italic">
                  Final Score
                </div>
              )}
            </div>
            <div
              className={`w-8 h-8 border-2 border-black bg-white flex items-center justify-center
                ${
                  index === categories.length - 1
                    ? "bg-yellow-50 shadow-inner"
                    : "shadow-inner"
                }
                ${index === categories.length - 1 ? "rounded-lg" : "rounded-md"}
              `}
            />
            {index < categories.length - 1 && (
              <div className="h-8 w-[1px] bg-black mx-2" />
            )}
          </div>
        ))}
      </div>
    </TrackerComponent>
  );
};
const PrintableSheet = () => {
  // Add this function to randomly shuffle and select 12 cards
  const getRandomCards = (cards, count) => {
    return [...cards].sort(() => Math.random() - 0.5).slice(0, count);
  };

  // Get 12 random cards
  const randomBuildingCards = getRandomCards(buildingCards, 12);

  return (
    <div
      className="bg-white"
      style={{
        width: `${A4_DIMENSIONS.width}px`,
        height: `${A4_DIMENSIONS.height}px`,
        padding: "12px",
      }}
    >
      {/* Building Cards Grid - now using randomBuildingCards */}
      <div className="grid grid-cols-4 gap-1 mb-4">
        {randomBuildingCards.map((card, i) => (
          <BuildingCard key={card.id} card={card} index={i} />
        ))}
      </div>

      {/* Resource Trackers in one row */}
      <div className="flex justify-between">
        {Object.keys(SPACE_MINERS_COLORS.resourceTypes).map((type) => (
          <ResourceTracker key={type} type={type} />
        ))}
      </div>

      {/* Full-width Disaster Tracker */}
      <DisasterTracker />

      {/* Full-width Coin Tracker */}
      <CoinTracker />

      {/* Full-width Shields Tracker */}
      <ShieldsTracker />

      {/* Full-width Blueprint Tracker */}
      <BlueprintTracker />

      {/* Scoring Table */}
      <ScoringTable />

      {/* Logo */}
      {/* <div className="flex justify-center mt-1">
        <Image
          src="/spaceminers/spaceminers-logo.png"
          alt="Space Miners Logo"
          width={1000}
          height={1000}
          className="h-16 w-16"
        />
      </div> */}
    </div>
  );
};
export default PrintableSheet;
