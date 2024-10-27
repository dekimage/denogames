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
    { id: 1, sides: [1, 2, 3, 4, 5, 6], color: colors.red },
    { id: 2, sides: [1, 2, 3, 4, 5, 6], color: colors.blue },
    { id: 3, sides: [1, 2, 3, 4, 5, 6], color: colors.green },
    { id: 4, sides: [1, 2, 3, 4, 5, 6], color: colors.yellow },
    { id: 5, sides: [1, 2, 3, 4, 5, 6], color: colors.purple },
  ],
  turnEvents: [],
  drawCount: 3,
};

export const simpleCardsConfig = {
  type: gameTypes.SIMPLE_CARDS,
  itemType: "card",
  initialItems: [
    { id: 1, value: 1, color: colors.red },
    { id: 2, value: 2, color: colors.blue },
    { id: 3, value: 3, color: colors.green },
    { id: 4, value: 4, color: colors.yellow },
    { id: 5, value: 5, color: colors.purple },
    { id: 6, value: 6, color: colors.pink },
    { id: 7, value: 7, color: colors.indigo },
    { id: 8, value: 8, color: colors.gray },
    { id: 9, value: 9, color: colors.orange },
    { id: 10, value: 10, color: colors.teal },
  ],
  turnEvents: [
    {
      turn: 3,
      newItems: [
        { id: 11, value: 11, color: colors.cyan },
        { id: 12, value: 12, color: colors.lime },
        { id: 13, value: 13, color: colors.emerald },
      ],
    },
    {
      turn: 6,
      newItems: [
        { id: 14, value: 14, color: colors.fuchsia },
        { id: 15, value: 15, color: colors.rose },
        { id: 16, value: 16, color: colors.amber },
      ],
    },
  ],
  drawCount: 3,
};

export const diceCardsConfig = {
  type: gameTypes.DICE_CARDS,
  itemType: "die",
  initialItems: [
    { id: 1, sides: [1, 2, 3, 4, 5, 6], color: colors.red },
    { id: 2, sides: [1, 2, 3, 4, 5, 6], color: colors.blue },
    { id: 3, sides: [1, 2, 3, 4, 5, 6], color: colors.green },
    { id: 4, sides: [1, 2, 3, 4, 5, 6], color: colors.yellow },
    { id: 5, sides: [1, 2, 3, 4, 5, 6], color: colors.purple },
    { id: 6, sides: [1, 2, 3, 4, 5, 6], color: colors.pink },
    { id: 7, sides: [1, 2, 3, 4, 5, 6], color: colors.indigo },
    { id: 8, sides: [1, 2, 3, 4, 5, 6], color: colors.gray },
    { id: 9, sides: [1, 2, 3, 4, 5, 6], color: colors.orange },
    { id: 10, sides: [1, 2, 3, 4, 5, 6], color: colors.teal },
  ],
  turnEvents: [
    {
      turn: 3,
      newItems: [
        { id: 11, sides: [2, 3, 4, 5, 6, 7], color: colors.cyan },
        { id: 12, sides: [2, 3, 4, 5, 6, 7], color: colors.lime },
        { id: 13, sides: [2, 3, 4, 5, 6, 7], color: colors.emerald },
      ],
    },
    {
      turn: 6,
      newItems: [
        { id: 14, sides: [3, 4, 5, 6, 7, 8], color: colors.fuchsia },
        { id: 15, sides: [3, 4, 5, 6, 7, 8], color: colors.rose },
        { id: 16, sides: [3, 4, 5, 6, 7, 8], color: colors.amber },
      ],
    },
  ],
  drawCount: 3,
};
