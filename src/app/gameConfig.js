import { Card, Die } from "./classes/Item";

export const gameTypes = {
  SIMPLE_DICE: "simple_dice",
  SIMPLE_CARDS: "simple_cards",
  DICE_CARDS: "dice_cards",
};

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
  cyan: "#06B6D4",
  lime: "#84CC16",
  emerald: "#10B981",
  fuchsia: "#D946EF",
  rose: "#F43F5E",
  amber: "#F59E0B",
};

export const turnEvents = {
  [gameTypes.SIMPLE_CARDS]: [
    { turn: 3, newItems: [11, 12, 13] },
    { turn: 6, newItems: [14, 15, 16] },
  ],
  [gameTypes.DICE_CARDS]: [
    { turn: 3, newItems: [11, 12, 13] },
    { turn: 6, newItems: [14, 15, 16] },
  ],
};

export const diceConfigs = {
  standard: { sides: [1, 2, 3, 4, 5, 6] },
  enhanced: { sides: [2, 3, 4, 5, 6, 7] },
  advanced: { sides: [3, 4, 5, 6, 7, 8] },
};

export const initialGameState = {
  [gameTypes.SIMPLE_DICE]: {
    diceCount: 5,
    diceConfig: diceConfigs.standard,
  },
  [gameTypes.SIMPLE_CARDS]: {
    cardCount: 10,
  },
  [gameTypes.DICE_CARDS]: {
    diceCount: 10,
    diceConfig: diceConfigs.standard,
    enhancedDiceConfig: diceConfigs.enhanced,
    advancedDiceConfig: diceConfigs.advanced,
  },
};

export const simpleDiceConfig = {
  type: gameTypes.SIMPLE_DICE,
  itemType: "die",
  initialItems: [
    new Die(1, [1, 2, 3, 4, 5, 6], colors.red),
    new Die(2, [1, 2, 3, 4, 5, 6], colors.blue),
    new Die(3, [1, 2, 3, 4, 5, 6], colors.green),
    new Die(4, [1, 2, 3, 4, 5, 6], colors.yellow),
    new Die(5, [1, 2, 3, 4, 5, 6], colors.purple),
  ],
  turnEvents: [],
  drawCount: 3,
};

export const simpleCardsConfig = {
  type: gameTypes.SIMPLE_CARDS,
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
        new Card(11, 11, colors.cyan),
        new Card(12, 12, colors.lime),
        new Card(13, 13, colors.emerald),
      ],
    },
    {
      turn: 6,
      newItems: [
        new Card(14, 14, colors.fuchsia),
        new Card(15, 15, colors.rose),
        new Card(16, 16, colors.amber),
      ],
    },
  ],
  drawCount: 3,
};

export const diceCardsConfig = {
  type: gameTypes.DICE_CARDS,
  itemType: "die",
  initialItems: [
    new Die(1, [1, 2, 3, 4, 5, 6], colors.red),
    new Die(2, [1, 2, 3, 4, 5, 6], colors.blue),
    new Die(3, [1, 2, 3, 4, 5, 6], colors.green),
    new Die(4, [1, 2, 3, 4, 5, 6], colors.yellow),
    new Die(5, [1, 2, 3, 4, 5, 6], colors.purple),
    new Die(6, [1, 2, 3, 4, 5, 6], colors.pink),
    new Die(7, [1, 2, 3, 4, 5, 6], colors.indigo),
    new Die(8, [1, 2, 3, 4, 5, 6], colors.gray),
    new Die(9, [1, 2, 3, 4, 5, 6], colors.orange),
    new Die(10, [1, 2, 3, 4, 5, 6], colors.teal),
  ],
  turnEvents: [
    {
      turn: 3,
      newItems: [
        new Die(11, [2, 3, 4, 5, 6, 7], colors.cyan),
        new Die(12, [2, 3, 4, 5, 6, 7], colors.lime),
        new Die(13, [2, 3, 4, 5, 6, 7], colors.emerald),
      ],
    },
    {
      turn: 6,
      newItems: [
        new Die(14, [3, 4, 5, 6, 7, 8], colors.fuchsia),
        new Die(15, [3, 4, 5, 6, 7, 8], colors.rose),
        new Die(16, [3, 4, 5, 6, 7, 8], colors.amber),
      ],
    },
  ],
  drawCount: 3,
};

export const level3Config = {
  [gameTypes.SIMPLE_CARDS]: {
    type: gameTypes.SIMPLE_CARDS,
    itemType: "card",
    playerStartingDeck: [
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
    drawCount: 3,
    turnEvents: [],
  },
  [gameTypes.SIMPLE_DICE]: {
    type: gameTypes.SIMPLE_DICE,
    itemType: "die",
    playerStartingDeck: [
      new Die(1, [1, 2, 3, 4, 5, 6], colors.red),
      new Die(2, [1, 2, 3, 4, 5, 6], colors.blue),
      new Die(3, [1, 2, 3, 4, 5, 6], colors.green),
      new Die(4, [1, 2, 3, 4, 5, 6], colors.yellow),
      new Die(5, [1, 2, 3, 4, 5, 6], colors.purple),
      new Die(6, [1, 2, 3, 4, 5, 6], colors.pink),
      new Die(7, [1, 2, 3, 4, 5, 6], colors.indigo),
      new Die(8, [1, 2, 3, 4, 5, 6], colors.gray),
      new Die(9, [1, 2, 3, 4, 5, 6], colors.orange),
      new Die(10, [1, 2, 3, 4, 5, 6], colors.teal),
    ],
    drawCount: 3,
    turnEvents: [],
  },
  [gameTypes.DICE_CARDS]: {
    type: gameTypes.DICE_CARDS,
    itemType: "mixed",
    playerStartingDeck: [
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
    drawCount: 3,
    turnEvents: [],
  },
};
