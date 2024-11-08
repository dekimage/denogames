// data.js
const houses = ["housePurple", "houseBrown", "houseRed", "houseGreen"];
const artifacts = [
  "artifact_1",
  "artifact_2",
  "artifact_3",
  "artifact_4",
  "artifact_5",
  "artifact_6",
  "artifact_7",
];
const bonuses = [
  "draw_card",
  // unofficial
  "draw_card_age_1",
  "discoverCard_3_age_1",
  "draw_card_age_2",
  "discoverCard_3_age_2",
  "draw_card_age_3",
  "discoverCard_3_age_3",
  "random_fragment",
  "discover_fragment",
  "random_dice",
  "discoverDice_3",
  "random_resource",
  "refresh",
  "refresh",
];

const completionBonusesRow1 = ["refresh", "dice"];
const completionBonusesRow2 = ["dice", "random_resource"];
const completionBonusesRow3 = ["dice_any", "discover_fragment"];
const completionBonusesRow4 = ["discover_fragment", "dice_any", "draw_card"];

// Military condition array
const militaryConditions = [
  { condition: "engines_2", advancedBonus: "+2" },
  { condition: "farms_2", advancedBonus: "+2" },
  { condition: "military_3", advancedBonus: "+2" },
  { condition: "emblem_2", advancedBonus: "+2" },
];

const row1Deck = [
  {
    cost: "[3, 4, 5]",
    tileType: "farming",

    content: {
      resources: "[?, +, ?]",
    },
  },
  {
    cost: "[1, 2, 6]",
    tileType: "engine",

    content: {
      effect: "[1, ->, 2, ->, 3]",
    },
  },
  {
    cost: "[4, 3, 1]",
    tileType: "prestige",

    content: {
      vpCondition: "vp_3",
    },
  },
  {
    cost: "[2, 5, 3]",
    tileType: "military",

    content: {
      power: 4,
      advancedPower: 6,
      condition: militaryConditions[0],
    },
  },
];

const row2Deck = [
  {
    cost: "[4, 5, 2, 3]",
    tileType: "artifact",

    content: {
      artifacts: "[artifact_1, artifact_2]",
    },
  },
  {
    cost: "[2, 2, 5, 6]",
    tileType: "military",

    content: {
      power: 3,
      advancedPower: 5,
      condition: militaryConditions[1],
    },
  },
  {
    cost: "[3, 3, 4, 6]",
    tileType: "engine",

    content: {
      uses: 2,
      effect: "[6, ->, 1, /, 5, ->, 2]",
    },
  },
  {
    cost: "[1, 4, 4, 5]",
    tileType: "prestige",

    content: {
      vpCondition: "vp_3",
    },
  },
  {
    cost: "[2, 3, 5, 6]",
    tileType: "farming",

    content: {
      resources: "[?, -, ?]",
    },
  },
];

const row3Deck = [
  {
    cost: "[4, 5, 2, garlic]",
    tileType: "artifact",

    content: {
      artifacts: "[artifact_3, artifact_4]",
    },
  },
  {
    cost: "[2, 5, 3, silver]",
    tileType: "military",

    content: {
      power: 4,
      advancedPower: 6,
      condition: militaryConditions[0],
    },
  },
  {
    cost: "[3, 1, 5, cross]",
    tileType: "farming",

    content: {
      resources: "[1, 4, 6]",
    },
  },
  {
    cost: "[2, 3, 6, garlic]",
    tileType: "engine",

    content: {
      effect: "[4, /, 5, ->, 6]",
    },
  },
];

const row4Deck = [
  {
    cost: "[4, 5, 2, 3, cross]",
    tileType: "artifact",

    content: {
      artifacts: "[artifact_5, artifact_6]",
    },
  },
  {
    cost: "[2, 2, 5, 6, silver]",
    tileType: "military",

    content: {
      power: 5,
      advancedPower: 7,
      condition: militaryConditions[1],
    },
  },
  {
    cost: "[3, 2, 4, 4, garlic]",
    tileType: "farming",

    content: {
      resources: "[1, silver]",
    },
  },
  {
    cost: "[1, 4, 5, 6, cross]",
    tileType: "prestige",

    content: {
      vpCondition: "vp_4",
    },
  },
];

const blocksDeck = [
  {
    name: "Emblem of Charisma",
    symbol: "emblem_1",
    resources: "[1, 1, 3, garlic, garlic]",
  },
  {
    name: "Emblem of Fear",
    symbol: "emblem_2",
    resources: "[2, 3, 5, silver, silver]",
  },
  {
    name: "Emblem of Lust",
    symbol: "emblem_3",
    resources: "[4, 2, 2, cross, cross]",
  },
  {
    name: "Emblem of Envy",
    symbol: "emblem_4",
    resources: "[3, 6, 1, garlic, cross]",
  },
  {
    name: "Fighting Prowess",

    symbol: "p1",
    resources: "[5, 3, 3, silver, garlic]",
  },
  {
    name: "The Silver Cross",

    symbol: "p2",
    resources: "[6, 6, 4, silver, cross]",
  },
  {
    name: "Rewinder",

    symbol: "p3",
    resources: "[1, 5, 2, garlic, silver]",
  },
  {
    name: "Attuned to All",

    symbol: "p4",
    resources: "[2, 4, 6, garlic, cross]",
  },
  {
    name: "Family Ties",

    symbol: "p5",
    resources: "[5, 5, 3, silver, cross]",
  },
  {
    name: "Engineer",

    symbol: "p6",
    resources: "[3, 1, 4, cross, cross]",
  },
  {
    name: "Archeologist",

    symbol: "p7",
    resources: "[6, 2, 2, silver, silver]",
  },
  {
    name: "Royalty",

    symbol: "p8",
    resources: "[4, 4, 1, garlic, garlic]",
  },
  // {
  //   name: "Blood Alchemist",
  //   // symbol: "block_engineer",
  //   symbol: "p9",
  //   resources: "[1, 3, 6, garlic, silver]",
  // },
  // {
  //   name: "Selective Hunter",
  //   // symbol: "block_rewinder",
  //   symbol: "p10",
  //   resources: "[2, 4, cross, silver]",
  // },
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
    startingBonuses: "[1, 2, silver, refresh, refresh]",
  },
  {
    image: "/images/vampire2.png",
    name: "Lady Nocturna",
    startingBonuses: "[3, 5, garlic, random_fragment, random_fragment]",
  },
  {
    image: "/images/vampire3.png",
    name: "The Shadow",
    startingBonuses: "[2, 4, 6, cross, refresh, random_fragment]",
  },
  {
    image: "/images/vampire4.png",
    name: "Dark Mistress",
    startingBonuses: "[1, 3, 5, garlic, refresh, random_fragment]",
  },
  {
    image: "/images/vampire5.png",
    name: "Baron Von Bite",
    startingBonuses: "[1, garlic, silver, power_1]",
  },
  {
    image: "/images/vampire6.png",
    name: "Elder Fang",
    startingBonuses: "[4, cross, silver, artifact_4]",
  },
];

export const tombsDeck = [
  {
    name: "Ancient Crypt",
    nextScoring: "[garlic, silver, cross]",
    cost: "[1, 2, 3, 4]",
    vp: 3,
    powerVp: 5,
    condition: "[farm_completed, ->, 2, max_3]", // for each farm completed + 2vp max 3
  },
  {
    name: "Forgotten Mausoleum",
    nextScoring: "[silver, garlic, cross]",
    cost: "[2, 3, 5, 6]",
    vp: 4,
    powerVp: 6,
    condition: "[blocks_completed, ->, 1]", // for each block completed + 1vp
  },
  {
    name: "Cursed Catacomb",
    nextScoring: "[cross, silver, garlic]",
    cost: "[1, 3, 4, 6]",
    vp: 5,
    powerVp: 7,
    condition: "[unque_artifact, ->, 1, max_6]", // at 7 unique artifacts + 3vp, at 10 + 7vp
  },
  {
    name: "Sacred Burial",
    nextScoring: "[silver, cross, garlic]",
    cost: "[2, 3, 4, 5]",
    vp: 2,
    powerVp: 4,
    condition: "[power_6, ->, 3, power_10, ->, 5]", // at 6 power + 3vp, at 10 power + 5vp
  },
  {
    name: "Hallowed Chamber",
    nextScoring: "[garlic, garlic, silver]",
    cost: "[1, 2, 5, 6]",
    vp: 3,
    powerVp: 6,
    condition: "Complete 4 tombs", // fill all 4 tombs (resources not fragments) + 8vp
  },
  {
    name: "Lost Vault",
    nextScoring: "[cross, silver, silver]",
    cost: "[1, 3, 5, 6]",
    vp: 4,
    powerVp: 8,
    condition: "[row, ->, 2]",
  },
  {
    name: "Dark Passage",
    nextScoring: "[garlic, cross, silver]",
    cost: "[2, 3, 4, 6]",
    vp: 3,
    powerVp: 5,
    condition: "[column, ->, 2]",
  },
  {
    name: "Shadowed Lair",
    nextScoring: "[silver, garlic, cross]",
    cost: "[1, 2, 4, 5]",
    vp: 2,
    powerVp: 6,
    condition: "[unused_fragment, ->, 1, max_6]",
  },
  {
    name: "Sanctified Grave",
    nextScoring: "[cross, garlic, garlic]",
    cost: "[2, 3, 5, 6]",
    vp: 4,
    powerVp: 7,
    condition: "[engine_completed, ->, 2, max_3]",
  },
  {
    name: "Haunted Resting Place",
    nextScoring: "[silver, cross, garlic]",
    cost: "[1, 3, 4, 5]",
    vp: 3,
    powerVp: 5,
    condition: "[prestige_completed, ->, 2, max_3]",
  },
  // in future add here expansions where conditions are like monsters slain, gifts recieved, donations gained, events captured etc... from event cards in deck that memorize in history at end of game you view statas and calculate
];

// FLIP CARDS FOR THE ENGINE
const conditions = [
  "emblem_1",
  "emblem_2",
  "emblem_3",
  "emblem_4",
  "housePurple",
  "houseBrown",
  "houseRed",
  "houseGreen",
  "tablet_1",
  "tablet_2",
  "tablet_3",
  "tablet_4",
  "tablet_any",
  "power_3",
  "power_5",
  "power_7",
  "artifact_3",
  "artifact_5",
  "artifact_7",
];

// Age 1 - Layer 1 Deck
export const age1Layer1Deck = [
  { layer1: "[1, 2]" },
  { layer1: "[2, 3]" },
  { layer1: "[3, 4]" },
  { layer1: "[4, 5]" },
  { layer1: "[5, 6]" },
  { layer1: "[1, 3]" },
  { layer1: "[1, 4]" },
  { layer1: "[1, 5]" },
  { layer1: "[2, 4]" },
  { layer1: "[2, 6]" },
  { layer1: "[3, 5]" },
  { layer1: "[4, 6]" },
  { layer1: "[1, 1]" },
  { layer1: "[3, 3]" },
  { layer1: "[5, 5]" },

  { layer1: "[artifact_1]" },
  { layer1: "[artifact_2]" },
  { layer1: "[artifact_3]" },

  { layer1: "[fragment_granite_1]" },
  { layer1: "[fragment_crimson_1]" },
  { layer1: "[fragment_ebony_1]" },
  { layer1: "[fragment_emerald_1]" },
];

// Age 1 - Layer 2 Deck
export const age1Layer2Deck = [
  { layer2: "[1, /, garlic]" },
  { layer2: "[2, /, silver]" },
  { layer2: "[3, /, cross]" },
  { layer2: "[4, /, silver]" },
  { layer2: "[5, /, garlic]" },
  { layer2: "[6, /, cross]" },
  { layer2: "[garlic]" },
  { layer2: "[silver]" },
  { layer2: "[cross]" },
  { layer2: "[garlic]" },
  { layer2: "[silver]" },
  { layer2: "[cross]" },
  { layer2: "[1, /, 2]" },
  { layer2: "[2, /, 3]" },
  { layer2: "[3, /, 4]" },
  { layer2: "[4, /, 5]" },
  { layer2: "[5, /, 6]" },
  { layer2: "[6, /, 1]" },
];

// Age 1 - Layer 3 Deck
export const age1Layer3Deck = [
  { layer3: "[1, silver]", condition: "emblem_1" },
  { layer3: "[2, garlic]", condition: "emblem_2" },
  { layer3: "[3, cross]", condition: "emblem_3" },
  { layer3: "[4, silver]", condition: "emblem_4" },
  { layer3: "[5, garlic]", condition: "emblem_1" },
  { layer3: "[6, cross]", condition: "emblem_2" },
  { layer3: "[5, silver]", condition: "emblem_3" },
  { layer3: "[6, garlic]", condition: "emblem_4" },

  { layer3: "[1]", condition: "housePurple_1" },
  { layer3: "[2]", condition: "houseBrown_1" },
  { layer3: "[3]", condition: "houseRed_1" },
  { layer3: "[4]", condition: "houseGreen_1" },
  { layer3: "[3]", condition: "housePurple_1" },
  { layer3: "[4]", condition: "houseBrown_1" },
  { layer3: "[5]", condition: "houseRed_1" },
  { layer3: "[6]", condition: "houseGreen_1" },
];

// Age 2 - Layer 1 Deck
export const age2Layer1Deck = [
  { layer1: "[2, 4, 6]" },
  { layer1: "[1, 3, 5]" },
  { layer1: "[1, 3, 6]" },
  { layer1: "[4, 5, 6]" },
  { layer1: "[2, 5, 6]" },
  { layer1: "[1, 2, 3]" },
  { layer1: "[3, 4, 5]" },
  { layer1: "[1, 2, 5]" },
  { layer1: "[2, 4, 5]" },
  { layer1: "[3, 4, 6]" },
  { layer1: "[1, 2, 4]" },
  { layer1: "[1, 2, 6]" },
  { layer1: "[1, 4, 5]" },
  { layer1: "[1, 4, 6]" },
  { layer1: "[1, 5, 6]" },

  { layer1: "1, [artifact_4]" },
  { layer1: "2, [artifact_5]" },
  { layer1: "3, [artifact_6]" },

  { layer1: "4, [fragment_granite_2]" },
  { layer1: "5, [fragment_crimson_2]" },
  { layer1: "6, [fragment_ebony_2]" },
  { layer1: "1, [fragment_emerald_2]" },

  // { layer1: "[3, /, 4, 6, /, 1]" },
];

// Age 2 - Layer 2 Deck
export const age2Layer2Deck = [
  { layer2: "[garlic, /, artifact_1]" },
  { layer2: "[silver, /,  artifact_2]" },
  { layer2: "[cross, /, artifact_3]" },
  { layer2: "[garlic, /, fragment_granite_1]" },
  { layer2: "[silver, /, fragment_crimson_1]" },
  { layer2: "[cross, /, fragment_ebony_1]" },
  { layer2: "[silver, /, fragment_emerald_1]" },

  { layer2: "[1, /, garlic]" },
  { layer2: "[2, /, silver]" },
  { layer2: "[3, /, cross]" },
  { layer2: "[4, /, silver]" },
  { layer2: "[5, /, garlic]" },
  { layer2: "[6, /, cross]" },

  { layer2: "[1, /, 3]" },
  { layer2: "[2, /, 4]" },
  { layer2: "[3, /, 5]" },
  { layer2: "[4, /, 6]" },
  { layer2: "[1, /, 5]" },
  { layer2: "[3, /, 4]" },
  { layer2: "[2, /, 6]" },
];

// Age 2 - Layer 3 Deck
export const age2Layer3Deck = [
  { layer3: "[1, /, garlic]", condition: "emblem_1" },
  { layer3: "[2, /, cross]", condition: "emblem_2" },
  { layer3: "[3, /,silver]", condition: "emblem_3" },
  { layer3: "[4, /, garlic]", condition: "emblem_4" },
  { layer3: "[5, 6]", condition: "emblem_1" },
  { layer3: "[3, 5]", condition: "emblem_2" },
  { layer3: "[2, 4]", condition: "emblem_3" },
  { layer3: "[1, 6]", condition: "emblem_4" },

  { layer3: "[2, /, 5]", condition: "housePurple_2" },
  { layer3: "[3, /, 6]", condition: "houseBrown_2" },
  { layer3: "[1, /, 4]", condition: "houseRed_2" },
  { layer3: "[1, /, 3]", condition: "houseGreen_2" },
  { layer3: "[4, /, 5]", condition: "housePurple_2" },
  { layer3: "[5, /, 6]", condition: "houseBrown_2" },
  { layer3: "[3, /, 4]", condition: "houseRed_2" },
  { layer3: "[2, /, 3]", condition: "houseGreen_2" },
];

// Age 3 - Layer 1 Deck
export const age3Layer1Deck = [
  { layer1: "[1, 2, 2]" },
  { layer1: "[1, 3, 5]" },
  { layer1: "[1, 4, 6]" },
  { layer1: "[1, 1, 5]" },
  { layer1: "[1, 4, 6]" },
  { layer1: "[2, 4, 5]" },
  { layer1: "[2, 2, 3]" },
  { layer1: "[2, 5, 5]" },
  { layer1: "[2, 3, 4]" },
  { layer1: "[3, 3, 4]" },
  { layer1: "[3, 5, 6]" },
  { layer1: "[3, 4, 5]" },
  { layer1: "[4, 4, 6]" },
  { layer1: "[4, 5, 6]" },
  { layer1: "[4, 5, 5]" },

  { layer1: "[artifact_4, /, artifact_7]" },
  { layer1: "[artifact_5, /, artifact_7]" },
  { layer1: "[artifact_6, /, artifact_7]" },

  { layer1: "[2, /, fragment_granite_3]" },
  { layer1: "[3, /, fragment_crimson_3]" },
  { layer1: "[4, /, fragment_ebony_3]" },
  { layer1: "[5, /, fragment_emerald_3]" },
];

// Age 3 - Layer 2 Deck
export const age3Layer2Deck = [
  { layer2: "[1, garlic, /, artifact_1]" },
  { layer2: "[2, silver, /, artifact_2]" },
  { layer2: "[3, cross, /, artifact_3]" },
  { layer2: "[3, garlic, /, artifact_4]" },
  { layer2: "[5, silver, /, artifact_5]" },
  { layer2: "[6, cross, /, artifact_6]" },

  { layer2: "[4, garlic, /, fragment_granite_2]" },
  { layer2: "[5, silver, /, fragment_crimson_2]" },
  { layer2: "[6, cross, /, fragment_ebony_2]" },
  { layer2: "[1, silver, /, fragment_emerald_2]" },
];

// Age 3 - Layer 3 Deck
export const age3Layer3Deck = [
  { layer3: "[1, 2, /, fragment_emerald_3]", condition: "emblem_1" },
  { layer3: "[2, 3, /, fragment_crimson_3]", condition: "emblem_2" },
  { layer3: "[3, 4, /, fragment_ebony_3]", condition: "emblem_3" },
  { layer3: "[4, 5, /, fragment_granite_3]", condition: "emblem_4" },

  { layer3: "[1, 3, /, artifact_1]", condition: "emblem_1" },
  { layer3: "[2, 4, /, artifact_2]", condition: "emblem_2" },
  { layer3: "[3, 5, /, artifact_3]", condition: "emblem_3" },
  { layer3: "[4, 6, /, artifact_4]", condition: "emblem_4" },

  { layer3: "[1, 2]", condition: "housePurple_3" },
  { layer3: "[2, 3]", condition: "houseBrown_3" },
  { layer3: "[3, 4]", condition: "houseRed_3" },
  { layer3: "[4, 5]", condition: "houseGreen_3" },

  { layer3: "[3, /, garlic]", condition: "housePurple_3" },
  { layer3: "[4, /, silver]", condition: "houseBrown_3" },
  { layer3: "[5, /, cross]", condition: "houseRed_3" },
  { layer3: "[6, /, cross]", condition: "houseGreen_3" },
];
