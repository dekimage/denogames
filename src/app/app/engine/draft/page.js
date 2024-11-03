"use client";
import DraftEngine from "../engines/DraftEngine";
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

const draftConfig = {
  itemType: "mixed",
  playerCount: 3,
  maxDraftingRounds: 2,
  isRefill: true,
  drawCount: 4,
  initialItems: [
    new Card(1, 1, colors.red),
    new Die(2, [1, 2, 3, 4, 5, 6], colors.blue),
    new Card(3, 3, colors.green),
    new Die(4, [1, 2, 3, 4, 5, 6], colors.yellow),
    new Card(5, 5, colors.purple),
    new Die(6, [1, 2, 3, 4, 5, 6], colors.pink),
    new Card(7, 7, colors.indigo),
    new Die(8, [1, 2, 3, 4, 5, 6], colors.gray),
    new Card(9, 9, colors.orange),
    new Die(10, [1, 2, 3, 4, 5, 6], colors.teal),
  ],
  turnEvents: [
    {
      turn: 3,
      newItems: [
        new Card(11, 11, colors.red),
        new Die(12, [2, 3, 4, 5, 6, 7], colors.blue),
        new Card(13, 13, colors.green),
      ],
    },
  ],
};

const DraftPage = () => {
  return <DraftEngine config={draftConfig} />;
};

export default DraftPage;
