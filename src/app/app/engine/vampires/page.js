"use client";
import DraftEngine from "../engines/DraftEngine";
import { Card } from "@/app/classes/Item";

const colors = {
  red: "#EF4444",
  purple: "#8B5CF6",
  blue: "#3B82F6",
};

// Vampire-specific card component
export const VampireCard = ({ item }) => (
  <div
    className="w-32 h-48 border-2 rounded-lg flex items-center justify-center shadow-md"
    style={{
      backgroundColor: item.color,
      borderColor: "rgba(0,0,0,0.2)",
    }}
  >
    <div className="text-white text-center">
      <div className="text-2xl font-bold">Power</div>
      <div className="text-4xl">{item.value}</div>
    </div>
  </div>
);

// Create age-specific decks
const createVampireDeck = (startId, count, age) => {
  return Array.from({ length: count }, (_, i) => {
    const id = startId + i;
    const value = age * 10 + (i + 1);
    return new Card(id, value, colors.purple);
  });
};

const vampiresConfig = {
  multipleDecks: true, // Enable multiple decks feature
  maxDraftingRounds: 1, // Only one card per player
  isRefill: true,
  drawCount: 3,
  playerCount: 3,

  // Define decks for each age
  ageDecks: {
    1: createVampireDeck(1, 15, 1), // Age 1 deck
    2: createVampireDeck(16, 12, 2), // Age 2 deck
    3: createVampireDeck(28, 10, 3), // Age 3 deck
  },

  // Configure age transitions
  ageConfig: [
    { age: 1, startTurn: 1 },
    { age: 2, startTurn: 11 },
    { age: 3, startTurn: 19 },
  ],

  // Game ends after turn 26
  maxTurns: 26,
};

const VampiresGame = () => {
  return <DraftEngine config={vampiresConfig} CardComponent={VampireCard} />;
};

export default VampiresGame;
