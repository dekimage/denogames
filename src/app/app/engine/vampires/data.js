const conditions = [
  "emblem_1",
  "emblem_2",
  "emblem_3",
  "emblem_4",
  "house_1",
  "house_2",
  "house_3",
  "house_4",
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
  { layer1: "[1, 3]" },
  { layer1: "[4, 6]" },
  { layer1: "[2, 5]" },
  { layer1: "[1, 6]" },
  { layer1: "[2, 4]" },
  { layer1: "[3, 4]" },
  { layer1: "[5, 6]" },
  { layer1: "[3, 6]" },
  { layer1: "[4, 5]" },
  { layer1: "[1, 2]" },
];

// Age 1 - Layer 2 Deck
export const age1Layer2Deck = [
  { layer2: "[2, garlic]" },
  { layer2: "[1, silver]" },
  { layer2: "[3, cross]" },
  { layer2: "[4, silver]" },
  { layer2: "[5, 1]" },
  { layer2: "[6, silver]" },
  { layer2: "[1, garlic]" },
  { layer2: "[2, silver]" },
  { layer2: "[3, 6]" },
  { layer2: "[5, cross]" },
];

// Age 1 - Layer 3 Deck
export const age1Layer3Deck = [
  { layer3: "[5, silver]", condition: "emblem_1" },
  { layer3: "[3, garlic]", condition: "emblem_2" },
  { layer3: "[6]", condition: "emblem_3" },
  { layer3: "[garlic]", condition: "emblem_4" },
  { layer3: "[cross, garlic]", condition: "house_1" },
  { layer3: "[2, cross]", condition: "house_2" },
  { layer3: "[4]", condition: "house_3" },
  { layer3: "[1, garlic]", condition: "house_4" },
  { layer3: "[silver]", condition: "power_3" },
  { layer3: "[3, silver]", condition: "artifact_3" },
];

// Age 2 - Layer 1 Deck
export const age2Layer1Deck = [
  { layer1: "[2, 4, 6]" },
  { layer1: "[3, 5]" },
  { layer1: "[1, 3, 6]" },
  { layer1: "[4, 5]" },
  { layer1: "[2, 6]" },
  { layer1: "[1, 2, 3]" },
  { layer1: "[5, 6]" },
  { layer1: "[3, 4]" },
  { layer1: "[2, 5, 1]" },
  { layer1: "[6, 4]" },
];

// Age 2 - Layer 2 Deck
export const age2Layer2Deck = [
  { layer2: "[5, garlic]" },
  { layer2: "[2, silver, garlic]" },
  { layer2: "[4, garlic]" },
  { layer2: "[3, cross, silver]" },
  { layer2: "[1, garlic, silver]" },
  { layer2: "[4, garlic, cross]" },
  { layer2: "[3, silver, garlic]" },
  { layer2: "[6, garlic, cross]" },
  { layer2: "[garlic, silver, cross]" },
  { layer2: "[5, silver]" },
];

// Age 2 - Layer 3 Deck
export const age2Layer3Deck = [
  { layer3: "[fragment_emerald_1]", condition: "emblem_1" },
  { layer3: "[cross]", condition: "emblem_2" },
  { layer3: "[2, fragment_crimson_2]", condition: "emblem_3" },
  { layer3: "[fragment_granite_1]", condition: "emblem_4" },
  { layer3: "[5, fragment_ebony_2]", condition: "house_1" },
  { layer3: "[silver, fragment_crimson_3]", condition: "house_2" },
  { layer3: "[fragment_granite_2]", condition: "house_3" },
  { layer3: "[2, fragment_emerald_3]", condition: "house_4" },
  { layer3: "[fragment_ebony_1]", condition: "power_5" },
  { layer3: "[fragment_crimson_1]", condition: "artifact_5" },
];

// Age 3 - Layer 1 Deck
export const age3Layer1Deck = [
  { layer1: "[4, 5, 6]" },
  { layer1: "[1, 3, 6]" },
  { layer1: "[2, 6, 5]" },
  { layer1: "[3, 4, 1]" },
  { layer1: "[5, 2]" },
  { layer1: "[1, 4, 2]" },
  { layer1: "[2, 6]" },
  { layer1: "[3, 5, 1]" },
  { layer1: "[1, 2, 4]" },
  { layer1: "[6, 5, 3]" },
];

// Age 3 - Layer 2 Deck
export const age3Layer2Deck = [
  { layer2: "[2, garlic, silver]" },
  { layer2: "[4, cross, garlic]" },
  { layer2: "[3, silver, garlic]" },
  { layer2: "[5, garlic, cross]" },
  { layer2: "[1, garlic, fragment_emerald_1]" },
  { layer2: "[6, silver, garlic]" },
  { layer2: "[3, garlic, silver]" },
  { layer2: "[4, silver, cross]" },
  { layer2: "[3, garlic, fragment_emerald_3]" },
  { layer2: "[2, silver, cross]" },
];

// Age 3 - Layer 3 Deck
export const age3Layer3Deck = [
  { layer3: "[fragment_emerald_2]", condition: "emblem_1" },
  { layer3: "[fragment_crimson_3]", condition: "emblem_2" },
  { layer3: "[fragment_ebony_3]", condition: "emblem_3" },
  { layer3: "[fragment_granite_3]", condition: "emblem_4" },
  { layer3: "[fragment_crimson_1]", condition: "house_1" },
  { layer3: "[fragment_ebony_2]", condition: "house_2" },
  { layer3: "[fragment_granite_2]", condition: "house_3" },
  { layer3: "[fragment_crimson_2]", condition: "house_4" },
  { layer3: "[fragment_granite_1]", condition: "power_7" },
  { layer3: "[fragment_ebony_3]", condition: "artifact_7" },
];
