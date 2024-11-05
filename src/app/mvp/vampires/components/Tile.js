// Tile.js

import React from "react";
import {
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Gavel,
  Hammer,
  Shield,
} from "lucide-react"; // Placeholder icons

import { renderContent } from "./TileContent";
import Image from "next/image";

// Row-specific icon mapping
const rowIcons = {
  1: <Gavel size={24} className="text-blue-500" />,
  2: <Hammer size={24} className="text-red-500" />,
  3: <Shield size={24} className="text-green-500" />,
  4: <Dice6 size={24} className="text-yellow-500" />,
};

// Type-specific image mapping (use paths to public folder images)
const typeImages = {
  farming: "/images/farming.png",
  military: "/images/military.png",
  artifact: "/images/artifact.png",
  engine: "/images/engine.png",
  prestige: "/images/prestige.png",
};

// Dice icons for cost display
const diceIcons = {
  1: <Dice1 className="bg-blue-100" />,
  2: <Dice2 className="bg-purple-200" />,
  3: <Dice3 className="bg-green-300" />,
  4: <Dice4 className="bg-red-400" />,
  5: <Dice5 className="bg-yellow-500" />,
  6: <Dice6 className="bg-orange-600" />,
};

const Tile = ({ cost, tileType, completionBonus, content, row }) => {
  return (
    <div className={`h-[110px] border rounded-md tile-${tileType} relative`}>
      {/* Row Icon */}
      <div className="absolute top-2 right-2">{rowIcons[row]}</div>

      <div className="pl-2 flex justify-between">
        <div className="flex gap-1 py-2">
          {cost.map((die, index) => (
            <div key={index} className="dice-icon">
              {diceIcons[die]}
            </div>
          ))}
        </div>

        {/* Type Image */}
        <div className="type-image mb-2">
          <Image
            src={typeImages[tileType]}
            alt={`${tileType} icon`}
            width={24}
            height={24}
            className="w-[40px] h-[40px] bg-red-400"
          />
        </div>
      </div>

      {/* Content */}
      <div className="content-center mt-2 mb-4">
        {renderContent(tileType, content)}
      </div>

      {/* Completion Bonus */}
      <div className="absolute bottom-2 left-2">
        <img
          src={`/images/bonuses/${completionBonus}.png`}
          alt="Completion bonus"
          className="w-5 h-5"
        />
      </div>
    </div>
  );
};

export default Tile;
