// TilesSection.js

"use client";

import React, { useState, useEffect } from "react";
import Tile from "./Tile";
import {
  row1Deck,
  row2Deck,
  row3Deck,
  row4Deck,
  completionBonusesRow1,
  completionBonusesRow2,
  completionBonusesRow3,
  completionBonusesRow4,
} from "../data";
import { Heart } from "lucide-react";
import { renderIcons } from "./Icons";

// Helper function to randomly select n items from an array
const getRandomTiles = (deck, bonuses, numTiles = 4) => {
  const shuffledDeck = [...deck]
    .sort(() => 0.5 - Math.random())
    .slice(0, numTiles);
  return shuffledDeck.map((tile, index) => ({
    ...tile,
    completionBonus: bonuses[index % bonuses.length],
  }));
};

// BonusTile Component
const BonusTile = ({ symbols, isVertical }) => {
  return (
    <div
      className={`${
        isVertical ? "w-10 h-full flex-col" : "h-10 w-full flex-row"
      } bg-white border border-gray-300 flex items-center justify-center`}
    >
      {renderIcons(symbols, 35)}
    </div>
  );
};

// TilesSection Component
const TilesSection = () => {
  const [tiles, setTiles] = useState([]);

  useEffect(() => {
    // Draw 4 random tiles per row with completion bonuses
    const row1Tiles = getRandomTiles(row1Deck, completionBonusesRow1);
    const row2Tiles = getRandomTiles(row2Deck, completionBonusesRow2);
    const row3Tiles = getRandomTiles(row3Deck, completionBonusesRow3);
    const row4Tiles = getRandomTiles(row4Deck, completionBonusesRow4);

    // Combine all rows into a single array
    setTiles([row1Tiles, row2Tiles, row3Tiles, row4Tiles]);
  }, []);

  return (
    <div
      className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] grid-rows-[1fr_1fr_1fr_1fr_auto] gap-2"
      style={{ width: "fit-content", height: "fit-content" }}
    >
      {/* Main 4x4 Tile Grid */}
      {tiles.map((row, rowIndex) =>
        row.map((tile, tileIndex) => (
          <Tile
            key={`${rowIndex}-${tileIndex}`}
            cost={tile.cost}
            tileType={tile.tileType}
            completionBonus={tile.completionBonus}
            content={tile.content}
            className="w-full h-full"
          />
        ))
      )}

      {Array.from({ length: 4 }).map((_, index) => {
        const horizontalSymbols = [
          "[house_1, refresh]",
          "[house_2, refresh_all]",
          "[house_3, discover_fragment]",
          "[house_4, draw_card]",
        ];

        return (
          <div
            key={`horizontal-${index}`}
            className="flex items-center justify-center"
            style={{ gridRow: 5, gridColumn: index + 1 }}
          >
            <BonusTile symbols={horizontalSymbols[index]} isVertical={false} />
          </div>
        );
      })}

      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`vertical-${index}`}
          className="flex items-center justify-center"
          style={{ gridRow: index + 1, gridColumn: 5 }}
        >
          <BonusTile symbols="[vp_3]" isVertical />
        </div>
      ))}
    </div>
  );
};

export default TilesSection;
