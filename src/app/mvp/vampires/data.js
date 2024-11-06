// data.js
const houses = ["house_1", "house_2", "house_3", "house_4"];
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
  "discover_card_age_1",
  "draw_card_age_2",
  "discover_card_age_2",
  "draw_card_age_3",
  "discover_card_age_3",
  "random_fragment",
  "discover_fragment",
  "random_dice",
  "discover_dice",
  "random_resource",
  "refresh",
  "refresh_all",
];

const completionBonusesRow1 = ["house_1", "refresh_all"];
const completionBonusesRow2 = ["house_2", "discover_fragment"];
const completionBonusesRow3 = ["house_3", "draw_card"];
const completionBonusesRow4 = ["house_4", "random_resource", "random_resource"];

// Military condition array
const militaryConditions = [
  { condition: "engines_2", advancedBonus: "+2" },
  { condition: "farms_2", advancedBonus: "+2" },
  { condition: "military_3", advancedBonus: "+2" },
  { condition: "emblem_2", advancedBonus: "+2" },
];

const row1Deck = [
  {
    cost: "[3, 3, 4, 5]",
    tileType: "farming",
    completionBonus: null,
    content: {
      resources: "[1, 2, 3]",
    },
  },
  {
    cost: "[1, 2, 6, 6]",
    tileType: "engine",
    completionBonus: null,
    content: {
      uses: 3,
      effect: "Convert dice 3 -> dice 5",
    },
  },
  {
    cost: "[4, 4, 3, 1]",
    tileType: "prestige",
    completionBonus: null,
    content: {
      vpCondition: "vp_3",
    },
  },
  {
    cost: "[2, 5, 3, 4]",
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
    cost: "[4, 5, 2, 3]",
    tileType: "artifact",
    completionBonus: null,
    content: {
      artifacts: "[artifact_1, artifact_2]",
    },
  },
  {
    cost: "[2, 2, 5, 6]",
    tileType: "military",
    completionBonus: null,
    content: {
      power: 3,
      advancedPower: 5,
      condition: militaryConditions[1],
    },
  },
  {
    cost: "[3, 3, 4, 6]",
    tileType: "engine",
    completionBonus: null,
    content: {
      uses: 2,
      effect: "Convert dice 4 -> dice 6",
    },
  },
  {
    cost: "[1, 4, 4, 5]",
    tileType: "prestige",
    completionBonus: null,
    content: {
      vpCondition: "vp_3",
    },
  },
];

const row3Deck = [
  {
    cost: "[4, 5, 2, 3]",
    tileType: "artifact",
    completionBonus: null,
    content: {
      artifacts: "[artifact_3, artifact_4]",
    },
  },
  {
    cost: "[2, 2, 5, 6]",
    tileType: "military",
    completionBonus: null,
    content: {
      power: 4,
      advancedPower: 6,
      condition: militaryConditions[0],
    },
  },
  {
    cost: "[3, 1, 5, 5]",
    tileType: "farming",
    completionBonus: null,
    content: {
      resources: "[1, 4, 6]",
    },
  },
  {
    cost: "[2, 3, 6, 6]",
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
    cost: "[4, 5, 2, 3]",
    tileType: "artifact",
    completionBonus: null,
    content: {
      artifacts: "[artifact_5, artifact_6]",
    },
  },
  {
    cost: "[2, 2, 5, 6]",
    tileType: "military",
    completionBonus: null,
    content: {
      power: 5,
      advancedPower: 7,
      condition: militaryConditions[1],
    },
  },
  {
    cost: "[3, 2, 4, 4]",
    tileType: "farming",
    completionBonus: null,
    content: {
      resources: "[1, silver]",
    },
  },
  {
    cost: "[1, 4, 5, 6]",
    tileType: "prestige",
    completionBonus: null,
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
    name: "Emblem of Charm",
    symbol: "emblem_2",
    resources: "[2, 3, 5, silver, cross]",
  },
  {
    name: "Emblem of Satisfaction",
    symbol: "emblem_3",
    resources: "[4, 2, 2, silver, silver, cross]",
  },
  {
    name: "Emblem of Power",
    symbol: "emblem_4",
    resources: "[3, 6, 1, garlic, cross, silver]",
  },
  {
    name: "Fighting Prowess",
    symbol: "block_fighting_prowess",
    resources: "[5, 3, 3, cross, garlic]",
  },
  {
    name: "The Silver Cross",
    symbol: "block_silver_cross",
    resources: "[6, 6, 4, garlic, silver, cross]",
  },
  {
    name: "Selective Hunter",
    symbol: "block_selective_hunter",
    resources: "[1, 5, 2, garlic, cross, silver]",
  },
  {
    name: "Blood Alchemist",
    symbol: "block_blood_alchemist",
    resources: "[2, 4, 6, garlic, silver]",
  },
  {
    name: "Resource Hoarder",
    symbol: "block_resource_hoarder",
    resources: "[5, 5, 3, silver, garlic, garlic]",
  },
  {
    name: "Attuned to All",
    symbol: "block_attuned_to_all",
    resources: "[3, 1, 4, cross, garlic, silver]",
  },
  {
    name: "Family Ties",
    symbol: "block_family_ties",
    resources: "[6, 2, 2, cross, silver, garlic]",
  },
  {
    name: "Artificer",
    symbol: "block_artificer",
    resources: "[4, 4, 1, garlic, cross, cross]",
  },
  {
    name: "Engineer",
    symbol: "block_engineer",
    resources: "[1, 3, 6, garlic, silver, cross]",
  },
  {
    name: "Rewinder",
    symbol: "block_rewinder",
    resources: "[2, 4, cross]",
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
    startingBonuses: "[1, 2, silver, refresh, refresh_all]",
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
    startingBonuses: "[1, 3, 5, garlic, refresh_all, random_fragment]",
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
    nextScoring: "[2, 4, garlic, cross, silver]", // Symbols array for scoring conditions
    cost: "[1, 3, 5, garlic, cross, silver]", // Cost array with dice and resources
    vp: 3,
    powerVp: 5,
    condition: "[farm_completed, ->, 2, max_3]", // for each farm completed + 2vp max 3
  },
  {
    name: "Forgotten Mausoleum",
    nextScoring: "[1, silver, garlic, cross]",
    cost: "[2, 4, 6, silver, cross, garlic]",
    vp: 4,
    powerVp: 6,
    condition: "[blocks_completed, ->, 1]", // for each block completed + 1vp
  },
  {
    name: "Cursed Catacomb",
    nextScoring: "[3, cross, silver, silver]",
    cost: "[3, 5, 2, garlic, silver, cross]",
    vp: 5,
    powerVp: 7,
    condition: "[unque_artifact, ->, 1, max_6]", // at 7 unique artifacts + 3vp, at 10 + 7vp
  },
  {
    name: "Sacred Burial",
    nextScoring: "[4, garlic, cross, silver]",
    cost: "[1, 3, 6, silver, garlic]",
    vp: 2,
    powerVp: 4,
    condition: "[power_6, ->, 3, power_10, ->, 5]", // at 6 power + 3vp, at 10 power + 5vp
  },
  {
    name: "Hallowed Chamber",
    nextScoring: "[5, cross, cross, silver]",
    cost: "[2, 2, 5, garlic, cross, silver]",
    vp: 3,
    powerVp: 6,
    condition: "Complete 4 tombs", // fill all 4 tombs (resources not fragments) + 8vp
  },
  {
    name: "Lost Vault",
    nextScoring: "[6, silver, garlic]",
    cost: "[4, 4, 6, garlic, silver]",
    vp: 4,
    powerVp: 8,
    condition: "[row, ->, 2]",
  },
  {
    name: "Dark Passage",
    nextScoring: "[1, garlic, cross, cross]",
    cost: "[5, 6, 3, silver, garlic]",
    vp: 3,
    powerVp: 5,
    condition: "[column, ->, 2]",
  },
  {
    name: "Shadowed Lair",
    nextScoring: "[2, silver, silver, cross]",
    cost: "[1, 1, 4, garlic, cross, silver]",
    vp: 2,
    powerVp: 6,
    condition: "[unused_fragment, ->, 1, max_6]",
  },
  {
    name: "Sanctified Grave",
    nextScoring: "[3, 3, garlic, silver]",
    cost: "[2, 6, 4, cross, silver, garlic]",
    vp: 4,
    powerVp: 7,
    condition: "[engine_completed, ->, 2, max_3]",
  },
  {
    name: "Haunted Resting Place",
    nextScoring: "[4, silver, garlic, garlic]",
    cost: "[5, 5, 2, cross, silver]",
    vp: 3,
    powerVp: 5,
    condition: "[prestige_completed, ->, 2, max_3]",
  },
  // in future add here expansions where conditions are like monsters slain, gifts recieved, donations gained, events captured etc... from event cards in deck that memorize in history at end of game you view statas and calculate
];
