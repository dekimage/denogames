"use client";
import FlipEngine from "../engines/FlipEngine";
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

const level1Config = {
  itemType: "card",
  initialItems: [
    new Card(1, 1, colors.red),
    new Card(2, 2, colors.blue),
    new Card(3, 3, colors.green),
    new Card(4, 4, colors.yellow),
    new Card(5, 5, colors.purple),
    new Card(6, 6, colors.pink),
    new Card(7, 7, colors.indigo),
    new Card(8, 8, colors.gray),
    new Card(9, 9, colors.orange),
    new Card(10, 10, colors.teal),
  ],
  turnEvents: [
    {
      turn: 3,
      newItems: [
        new Card(11, 11, colors.red),
        new Card(12, 12, colors.blue),
        new Card(13, 13, colors.green),
      ],
    },
    {
      turn: 6,
      newItems: [
        new Card(14, 14, colors.yellow),
        new Card(15, 15, colors.purple),
        new Card(16, 16, colors.pink),
      ],
    },
  ],
  drawCount: 3,
};

const FlipPage = () => {
  return <FlipEngine config={level1Config} />;
};

export default FlipPage;
