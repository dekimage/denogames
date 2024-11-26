"use client";
import React from "react";
import { A4_DIMENSIONS } from "./utils";
import { buildingCards } from "./data";
import Image from "next/image";
import {
  SPACE_MINERS_COLORS,
  SPACE_MINERS_ICONS,
} from "@/app/app/engine/spaceminers/page";
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
            {Array.from({ length: 5 }).map((_, row) => (
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
export const BuildingCard = ({ card, index }) => {
  return (
    <div className=" border border-black border-2 flex flex-col w-[200px] h-[150px]">
      <div className="flex justify-between items-center border-b-2 border-black text-xs font-strike uppercase bg-yellow-300 px-1">
        <div>{card.number}</div>
        <div>{card.name}</div>
        <div>{card.vp}vp</div>
      </div>
      <div className="h-32 bg-gray-100 relative">
        <Image
          src={`/spaceminers/a${Math.floor(Math.random() * 5) + 1}.png`}
          alt="Asteroid"
          fill
          className="w-24 h-24"
        />
      </div>
      <div className="text-xs h-12 flex items-center bg-cream">
        {card.effect}
      </div>
      <div className="flex justify-between bg-yellow-300 border-t-2 border-black p-[2px]">
        {[0, 1, 2].map((squareIndex) => (
          <div key={squareIndex} className="flex items-center">
            <div className="w-3 h-3 border border-black mr-1 bg-white" />
            {Array.from({ length: card.uses }).map((_, circleIndex) => (
              <div
                key={circleIndex}
                className="w-3 h-3 rounded-full border border-dashed border-black mr-1 bg-white"
              />
            ))}
          </div>
        ))}
      </div>
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
    1, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 1, 3, 1, 1, 2, 1, 3, 3, 3, 1, 1, 2, 2, 2,
    3, 3, 3, 1, 1, 2, 2, 2, 3, 3, 2, 2, 3, 3, 3,
  ];

  return (
    <div className="flex flex-col border-2 border-black rounded-lg p-2 w-full mt-4 relative">
      <div className="flex items-center justify-center mb-3">
        <div className="w-8 h-8 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg flex items-center justify-center text-md border-2 border-black bg-red-200">
          ☠️
        </div>
      </div>

      <div className="flex flex-col gap-3">
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
    </div>
  );
};
const PrintableSheet = () => {
  return (
    <div
      className="bg-white"
      style={{
        width: `${A4_DIMENSIONS.width}px`,
        height: `${A4_DIMENSIONS.height}px`,
        padding: "12px",
      }}
    >
      {/* Building Cards Grid */}
      <div className="grid grid-cols-4 gap-1 mb-4">
        {buildingCards.map((card, i) => (
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
    </div>
  );
};
export default PrintableSheet;
