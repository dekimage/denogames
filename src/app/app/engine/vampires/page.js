"use client";
import DraftEngine from "../engines/DraftEngine";
import { age1Deck, age2Deck, age3Deck } from "./data";
import { renderIcons } from "@/app/mvp/vampires/components/Icons";

// Vampire-specific card component
const VampireCard = ({ item }) => {
  return (
    <div className="w-32 h-48 border-2 rounded-lg flex flex-col justify-between shadow-md p-2">
      {/* Layer 1 */}
      <div className="flex-1 flex items-center justify-center border-b">
        <div className="flex gap-2">{renderIcons(item.layer1)}</div>
      </div>

      {/* Layer 2 */}
      <div className="flex-1 flex items-center justify-center border-b">
        <div className="flex gap-2">{renderIcons(item.layer2)}</div>
      </div>

      {/* Layer 3 */}
      <div className="flex-1 flex items-center">
        <div className="w-1/4 flex items-center justify-center">
          {/* Left box */}
          {item.layer3.includes("fragment") && (
            <span className="w-6 h-6 bg-gray-700 text-white text-xs font-bold rounded flex items-center justify-center">
              F
            </span>
          )}
        </div>
        <div className="flex-1 flex gap-2">{renderIcons(item.layer3)}</div>
      </div>
    </div>
  );
};

const vampiresConfig = {
  multipleDecks: true,
  maxDraftingRounds: 1,
  isRefill: true,
  drawCount: 3,
  playerCount: 3,

  ageDecks: {
    1: age1Deck,
    2: age2Deck,
    3: age3Deck,
  },

  ageConfig: [
    { age: 1, startTurn: 1 },
    { age: 2, startTurn: 11 },
    { age: 3, startTurn: 19 },
  ],

  maxTurns: 26,
};

const VampiresGame = () => {
  return <DraftEngine config={vampiresConfig} CardComponent={VampireCard} />;
};

export default VampiresGame;
