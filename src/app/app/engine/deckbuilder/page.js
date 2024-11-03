"use client";
import DeckBuilderEngine from "../engines/DeckBuilderEngine";
import { Card, Die } from "@/app/classes/Item";

const colors = {
  red: "#EF4444",
  blue: "#3B82F6",
  green: "#10B981",
  yellow: "#F59E0B",
  purple: "#8B5CF6",
  pink: "#EC4899",
  indigo: "#6366F1",
  gray: "#6B7280",
  orange: "#F97316",
  teal: "#14B8A6",
};

const marketplaceColors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F06292",
  "#AED581",
  "#FFD54F",
  "#4DB6AC",
  "#7986CB",
];

const deckBuilderConfig = {
  playerCount: 2,
  drawCount: 3,
  marketplaceDisplaySize: 5,
  maxMarketplacePurchases: 1,
  diceConfigs: {
    standard: { sides: [1, 2, 3, 4, 5, 6] },
    enhanced: { sides: [2, 3, 4, 5, 6, 7] },
    advanced: { sides: [3, 4, 5, 6, 7, 8] },
  },
  cardUpgradePaths: {
    1: 3, // Card value 1 upgrades to 3
    2: 4, // Card value 2 upgrades to 4
    3: 5, // etc.
    4: 6,
    5: 7,
    6: 8,
    7: 9,
    8: 10,
    9: 11,
    10: 12,
  },
  playerStartingDeck: [
    new Card(1, 1, colors.red),
    new Card(2, 2, colors.blue),
    new Die(3, [1, 2, 3, 4, 5, 6], colors.green),
    new Die(4, [1, 2, 3, 4, 5, 6], colors.yellow),
    new Card(5, 5, colors.purple),
  ],
  marketplaceItems: [
    // Higher value cards
    new Card(10, 10, marketplaceColors[0]),
    new Card(11, 11, marketplaceColors[1]),
    new Card(12, 12, marketplaceColors[2]),
    // Enhanced dice
    new Die(13, [2, 3, 4, 5, 6, 7], marketplaceColors[3]),
    new Die(14, [3, 4, 5, 6, 7, 8], marketplaceColors[4]),
    new Die(15, [4, 5, 6, 7, 8, 9], marketplaceColors[5]),
    // More cards
    new Card(16, 8, marketplaceColors[6]),
    new Card(17, 9, marketplaceColors[7]),
    // More enhanced dice
    new Die(18, [2, 3, 4, 5, 6, 7], marketplaceColors[8]),
    new Die(19, [3, 4, 5, 6, 7, 8], marketplaceColors[9]),
  ],
};

const DeckBuilderPage = () => {
  return <DeckBuilderEngine config={deckBuilderConfig} />;
};

export default DeckBuilderPage;
