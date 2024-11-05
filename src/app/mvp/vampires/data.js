// data.js

// Completion bonus arrays for each row
const completionBonusesRow1 = ["symbol1", "symbol2", "symbol3", "symbol4"];
const completionBonusesRow2 = ["symbol5", "symbol6", "symbol7", "symbol8"];
const completionBonusesRow3 = ["symbol9", "symbol10", "symbol11", "symbol12"];
const completionBonusesRow4 = ["symbol13", "symbol14", "symbol15", "symbol16"];

// Military condition array
const militaryConditions = [
  { condition: "if you have 2 military tiles", advancedBonus: "power +2" },
  { condition: "if you have 3 prestige tiles", advancedBonus: "power +3" },
];

// Row-specific tile decks
const row1Deck = [
  {
    cost: [3, 3, 4, 5],
    tileType: "farming",
    completionBonus: null,
    content: {
      resources: ["wheat", "water"],
    },
  },
  {
    cost: [1, 2, 6, 6],
    tileType: "engine",
    completionBonus: null,
    content: {
      uses: 3,
      effect: "Convert dice 3 -> dice 5",
    },
  },
  {
    cost: [4, 4, 3, 1],
    tileType: "prestige",
    completionBonus: null,
    content: {
      vpCondition: "2 VP per farming tile",
    },
  },
  {
    cost: [2, 5, 3, 4],
    tileType: "military",
    completionBonus: null,
    content: {
      power: 4,
      advancedPower: 6,
      condition: militaryConditions[0],
    },
  },
];

const row2Deck = [
  {
    cost: [4, 5, 2, 3],
    tileType: "artifact",
    completionBonus: null,
    content: {
      artifacts: ["symbolA", "symbolB"],
    },
  },
  {
    cost: [2, 2, 5, 6],
    tileType: "military",
    completionBonus: null,
    content: {
      power: 3,
      advancedPower: 5,
      condition: militaryConditions[1],
    },
  },
  {
    cost: [3, 3, 4, 6],
    tileType: "engine",
    completionBonus: null,
    content: {
      uses: 2,
      effect: "Convert dice 4 -> dice 6",
    },
  },
  {
    cost: [1, 4, 4, 5],
    tileType: "prestige",
    completionBonus: null,
    content: {
      vpCondition: "3 VP per military tile",
    },
  },
];

const row3Deck = [
  {
    cost: [4, 5, 2, 3],
    tileType: "artifact",
    completionBonus: null,
    content: {
      artifacts: ["symbolC", "symbolD"],
    },
  },
  {
    cost: [2, 2, 5, 6],
    tileType: "military",
    completionBonus: null,
    content: {
      power: 4,
      advancedPower: 6,
      condition: militaryConditions[0],
    },
  },
  {
    cost: [3, 1, 5, 5],
    tileType: "farming",
    completionBonus: null,
    content: {
      resources: ["fish", "fruit"],
    },
  },
  {
    cost: [2, 3, 6, 6],
    tileType: "engine",
    completionBonus: null,
    content: {
      uses: 4,
      effect: "Convert dice 5 -> dice 6",
    },
  },
];

const row4Deck = [
  {
    cost: [4, 5, 2, 3],
    tileType: "artifact",
    completionBonus: null,
    content: {
      artifacts: ["symbolE", "symbolF"],
    },
  },
  {
    cost: [2, 2, 5, 6],
    tileType: "military",
    completionBonus: null,
    content: {
      power: 5,
      advancedPower: 7,
      condition: militaryConditions[1],
    },
  },
  {
    cost: [3, 2, 4, 4],
    tileType: "farming",
    completionBonus: null,
    content: {
      resources: ["wood", "meat"],
    },
  },
  {
    cost: [1, 4, 5, 6],
    tileType: "prestige",
    completionBonus: null,
    content: {
      vpCondition: "5 VP if all farming tiles are completed",
    },
  },
];

// blocksData.js

const blocksDeck = [
  {
    name: "Block A",
    resources: "[1, 1, 3, garlic, garlic]",
  },
  {
    name: "Block B",
    resources: "[2, 3, 5, silver, cross]",
  },
  {
    name: "Block C",
    resources: "[4, 2, 2, silver, silver, cross]",
  },
  {
    name: "Block D",
    resources: "[3, 6, 1, garlic, cross, silver]",
  },
  {
    name: "Block E",
    resources: "[5, 3, 3, cross, garlic]",
  },
  {
    name: "Block F",
    resources: "[6, 6, 4, garlic, silver, cross]",
  },
  {
    name: "Block G",
    resources: "[1, 5, 2, garlic, cross, silver]",
  },
  {
    name: "Block H",
    resources: "[2, 4, 6, garlic, silver]",
  },
  {
    name: "Block I",
    resources: "[5, 5, 3, silver, garlic, garlic]",
  },
  {
    name: "Block J",
    resources: "[3, 1, 4, cross, garlic, silver]",
  },
  {
    name: "Block K",
    resources: "[6, 2, 2, cross, silver, garlic]",
  },
  {
    name: "Block L",
    resources: "[4, 4, 1, garlic, cross, cross]",
  },
];

export {
  row1Deck,
  row2Deck,
  row3Deck,
  row4Deck,
  completionBonusesRow1,
  completionBonusesRow2,
  completionBonusesRow3,
  completionBonusesRow4,
  militaryConditions,
  blocksDeck,
};

export const vampireDeck = [
  {
    image: "/images/vampire1.png", // Example path, replace with actual image paths
    name: "Count Bloodlust",
    startingBonuses: "[1, 2, silver, draw, cross]",
    passive: "[3, ->, 1, /, 2, ->, 5]",
    uses: 4,
  },
  {
    image: "/images/vampire2.png",
    name: "Lady Nocturna",
    startingBonuses: "[3, 5, garlic, fragment, silver]",
    passive: "[1, ->, 4, ->, 6]",
    uses: 3,
  },
  {
    image: "/images/vampire3.png",
    name: "The Shadow",
    startingBonuses: "[2, 6, cross, reroll, draw]",
    passive: "[4, /, 2, ->, 1]",
    uses: 5,
  },
  {
    image: "/images/vampire4.png",
    name: "Dark Mistress",
    startingBonuses: "[5, fragment, silver, 3, garlic]",
    passive: "[5, ->, 2, ->, 4]",
    uses: 2,
  },
  {
    image: "/images/vampire5.png",
    name: "Baron Von Bite",
    startingBonuses: "[6, garlic, draw, 1, reroll]",
    passive: "[2, /, 6, ->, 3]",
    uses: 6,
  },
  {
    image: "/images/vampire6.png",
    name: "Elder Fang",
    startingBonuses: "[4, cross, fragment, silver, 2]",
    passive: "[3, ->, 5, ->, 1, /, 4]",
    uses: 3,
  },
];

export const tombsDeck = [
  {
    name: "Ancient Crypt",
    nextScoring: "[2, 4, garlic, cross, silver]", // Symbols array for scoring conditions
    cost: "[1, 3, 5, garlic, cross, silver]", // Cost array with dice and resources
    vp: 3,
    powerVp: 5,
    condition: "Complete 3 farms",
  },
  {
    name: "Forgotten Mausoleum",
    nextScoring: "[1, silver, garlic, cross]",
    cost: "[2, 4, 6, silver, cross, garlic]",
    vp: 4,
    powerVp: 6,
    condition: "Have 2 blocks",
  },
  {
    name: "Cursed Catacomb",
    nextScoring: "[3, cross, silver, silver]",
    cost: "[3, 5, 2, garlic, silver, cross]",
    vp: 5,
    powerVp: 7,
    condition: "Complete 2 artifacts",
  },
  {
    name: "Sacred Burial",
    nextScoring: "[4, garlic, cross, silver]",
    cost: "[1, 3, 6, silver, garlic]",
    vp: 2,
    powerVp: 4,
    condition: "Own 1 vampire",
  },
  {
    name: "Hallowed Chamber",
    nextScoring: "[5, cross, cross, silver]",
    cost: "[2, 2, 5, garlic, cross, silver]",
    vp: 3,
    powerVp: 6,
    condition: "Complete 4 tombs",
  },
  {
    name: "Lost Vault",
    nextScoring: "[6, silver, garlic]",
    cost: "[4, 4, 6, garlic, silver]",
    vp: 4,
    powerVp: 8,
    condition: "Have 2 silver resources",
  },
  {
    name: "Dark Passage",
    nextScoring: "[1, garlic, cross, cross]",
    cost: "[5, 6, 3, silver, garlic]",
    vp: 3,
    powerVp: 5,
    condition: "Have 3 garlic resources",
  },
  {
    name: "Shadowed Lair",
    nextScoring: "[2, silver, silver, cross]",
    cost: "[1, 1, 4, garlic, cross, silver]",
    vp: 2,
    powerVp: 6,
    condition: "Complete 2 blocks",
  },
  {
    name: "Sanctified Grave",
    nextScoring: "[3, 3, garlic, silver]",
    cost: "[2, 6, 4, cross, silver, garlic]",
    vp: 4,
    powerVp: 7,
    condition: "Own 1 farm",
  },
  {
    name: "Haunted Resting Place",
    nextScoring: "[4, silver, garlic, garlic]",
    cost: "[5, 5, 2, cross, silver]",
    vp: 3,
    powerVp: 5,
    condition: "Complete 1 ritual",
  },
];
