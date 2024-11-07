"use client";
import { toJS } from "mobx";
import DraftEngine from "../engines/DraftEngine";
import {
  age1Layer1Deck,
  age1Layer2Deck,
  age1Layer3Deck,
  age2Layer1Deck,
  age2Layer2Deck,
  age2Layer3Deck,
  age3Layer1Deck,
  age3Layer2Deck,
  age3Layer3Deck,
} from "@/app/mvp/vampires/data";
import { getIcon, renderIcons } from "@/app/mvp/vampires/components/Icons";

//TODO: MOVE THHIS TO UTILS
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
export const createAgeDeck = (
  layer1Deck,
  layer2Deck,
  layer3Deck,
  count,
  age
) => {
  // Shuffle each layer deck to ensure random order
  const shuffledLayer1 = shuffleArray([...layer1Deck]);
  const shuffledLayer2 = shuffleArray([...layer2Deck]);
  const shuffledLayer3 = shuffleArray([...layer3Deck]);

  const ageDeck = [];

  // Construct final deck with one unique card from each layer
  for (let i = 0; i < count; i++) {
    if (
      i >= shuffledLayer1.length ||
      i >= shuffledLayer2.length ||
      i >= shuffledLayer3.length
    ) {
      break; // Avoids going out of bounds if count exceeds layer deck sizes
    }

    ageDeck.push({
      ...shuffledLayer1[i],
      ...shuffledLayer2[i],
      ...shuffledLayer3[i],
      age: age, // Add the age property here
    });
  }

  return shuffleArray(ageDeck); // Final shuffle for additional randomness
};

const VampireCard = ({ item }) => {
  const { age } = item;
  const ageColors = {
    1: "bg-blue-400", // Age 1 color
    2: "bg-red-400", // Age 2 color
    3: "bg-green-400", // Age 3 color
  };

  // Define text for each age (I, II, III)
  const ageText = {
    1: "I",
    2: "II",
    3: "III",
  };

  return (
    <div className="relative w-32 h-48 border-2 rounded-[12px] flex flex-col justify-between p-2">
      {/* Age Indicator Badge */}
      <div
        className={`absolute top-[-5px] left-[-5px] font-strike uppercase px-2 py-1 text-xs  text-white rounded ${ageColors[age]}`}
      >
        {ageText[age]}
      </div>

      {/* Layer 1 */}
      <div className="flex-1 flex items-center justify-center border-b">
        <div className="flex gap-2">{renderIcons(item.layer1)}</div>
      </div>

      {/* Layer 2 */}
      <div className="flex-1 flex items-center justify-center border-b">
        <div className="flex gap-2">{renderIcons(item.layer2)}</div>
      </div>

      {/* Layer 3 */}
      <div className="flex justify-between mt-2 items-center">
        <div className="flex items-center justify-center">
          {/* Left box */}
          {item.condition && (
            <span className="bg-gray-100 rounded w-[45px] h-[45px] border border-gray-300 flex items-center justify-center">
              {getIcon(item.condition, 40)}
            </span>
          )}
        </div>
        <div className="flex gap-2">{renderIcons(item.layer3)}</div>
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
  multiLayer: true,

  createDeckFunction: createAgeDeck,

  // Define separate layer decks for each age
  age1LayerDecks: {
    layer1: age1Layer1Deck,
    layer2: age1Layer2Deck,
    layer3: age1Layer3Deck,
  },
  age2LayerDecks: {
    layer1: age2Layer1Deck,
    layer2: age2Layer2Deck,
    layer3: age2Layer3Deck,
  },
  age3LayerDecks: {
    layer1: age3Layer1Deck,
    layer2: age3Layer2Deck,
    layer3: age3Layer3Deck,
  },

  // Configure age transitions
  ageConfig: [
    { age: 1, startTurn: 1, deckCount: 30 }, // Age 1 has 30 cards total
    { age: 2, startTurn: 4, deckCount: 25 }, // Age 2 has 25 cards total
    { age: 3, startTurn: 8, deckCount: 20 }, // Age 3 has 20 cards total
  ],

  maxTurns: 26,
};

const VampiresGame = () => {
  return <DraftEngine config={vampiresConfig} CardComponent={VampireCard} />;
};

//can be delete later
const VampirePalette = () => {
  const colors = [
    { name: "Twilight Purple", shades: ["#CAB8DD", "#9D78C0", "#7045A4"] },
    { name: "Blood Crimson", shades: ["#F2B6C4", "#D96B84", "#A5405E"] },
    { name: "Graveyard Gray", shades: ["#D7D1D9", "#A7A1A9", "#6F6A71"] },
    { name: "Coffin Brown", shades: ["#D8C0A8", "#B89576", "#8F6B4E"] },
    { name: "Mist Blue", shades: ["#C4D4E2", "#90AAC0", "#5A7A8A"] },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {colors.map((color) => (
        <div key={color.name} className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{color.name}</h3>
          <div className="flex space-x-2">
            {color.shades.map((shade, index) => (
              <div
                key={index}
                className="w-16 h-16 rounded-lg"
                style={{ backgroundColor: shade }}
                title={shade}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VampiresGame;
