const tradeCards = [
  {
    id: "card_45",
    name: "Trade #1",
    effect: "Gain [coin_2]",
    type: "trade",
    subtype: "gain",
  },
  {
    id: "card_46",
    name: "Trade #2",
    effect: "Gain [coin_1] [speed]",
    type: "trade",
    subtype: "gain",
  },
  {
    id: "card_47",
    name: "Trade #3",
    effect: "Gain [speed] [speed]",
    type: "trade",
    subtype: "gain",
  },
  {
    id: "card_48",
    name: "Trade #4",
    effect: "[coin_1] [->] [gold]",
    type: "trade",
    subtype: "gain",
  },
  {
    id: "card_49",
    name: "Trade #5",
    effect: "Gain [ticket]",
    type: "trade",
    subtype: "gain",
  },
  {
    id: "card_50",
    name: "Trade #6",
    effect: "[coin] [->] [ticket] [speed]",
    type: "trade",
    subtype: "gain",
  },
  {
    id: "card_51",
    name: "Trade #7",
    effect: "[speed] [->] [initiative] [coin]",
    type: "trade",
    subtype: "gain",
  },
  {
    id: "card_52",
    name: "Trade #8",
    effect: "Gain [initiative]",
    type: "trade",
    subtype: "gain",
  },
  {
    id: "card_53",
    name: "Trade #9",
    effect: "[coin] [->] [dungeon]",
    type: "trade",
    subtype: "gain",
  },
  {
    id: "card_54",
    name: "Trade #10",
    effect: "[coin] [->] [guild]",
    type: "trade",
    subtype: "gain",
  },
  {
    id: "card_55",
    name: "Trade #11",
    effect: "Gain [coin], If you have 4+ [initiative]: [dungeon]",
    type: "trade",
    subtype: "gain",
  },
  {
    id: "card_56",
    name: "Trade #12",
    effect: "Gain [speed], If you have 3+ [guild]: [initiative]",
    type: "trade",
    subtype: "gain",
  },
  {
    id: "card_57",
    name: "Trade #13",
    effect: "Gain [coin], If you have 3+ [dungeon]: [guild]",
    type: "trade",
    subtype: "gain",
  },
  {
    id: "card_58",
    name: "Trade #14",
    effect: "Gain [speed], If you have level 3 market: [gold]",
    type: "trade",
    subtype: "gain",
  },
  {
    id: "card_59",
    name: "Trade #15",
    effect: "Gain [coin], If you have 4+ [ticket]: [dungeon]",
    type: "trade",
    subtype: "gain",
  },
  {
    id: "card_60",
    name: "Trade #16",
    effect: "Gain [coin]/[speed], If you have 2+ [gold]: [speed] [speed]",
    type: "trade",
    subtype: "gain",
  },
  {
    id: "card_61",
    name: "Trade #17",
    effect: "Gain [coin]/[speed], If you have 2+ [gold]: ticket",
    type: "trade",
    subtype: "gain",
  },
  {
    id: "card_62",
    name: "Trade #18",
    effect:
      "Gain [coin]/[speed], If you have 4+ [initiative]: [guild]/[dungeon]",
    type: "trade",
    subtype: "gain",
  },
  {
    id: "card_63",
    name: "Trade #19",
    effect: "[coin_1] [->] [ticket] [speed]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_64",
    name: "Trade #20",
    effect: "[speed] [->] [ticket] [coin]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_65",
    name: "Trade #21",
    effect: "[coin_1] [->] [gold]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_66",
    name: "Trade #22",
    effect: "[coin_1] [->] [dungeon]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_67",
    name: "Trade #23",
    effect: "[coin_1] [->] [guild]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_68",
    name: "Trade #24",
    effect: "[coin_2] [->] [dungeon] [speed]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_69",
    name: "Trade #25",
    effect: "[coin_2] [->] [guild] [speed]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_70",
    name: "Trade #26",
    effect: "[speed] [speed] [->] [ticket] [initiative]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_71",
    name: "Trade #27",
    effect: "[speed] [->] [ticket] [coin]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_72",
    name: "Trade #28",
    effect: "[speed] [coin] [->] [initiative] [initiative]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_73",
    name: "Trade #29",
    effect: "[speed] [->] [gold]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_74",
    name: "Trade #30",
    effect: "[speed] [->] [guild]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_75",
    name: "Trade #31",
    effect: "[speed] [->] [dungeon]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_76",
    name: "Trade #32",
    effect: "[coin_3] [->] [gold] [ticket] [speed]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_77",
    name: "Trade #33",
    effect: "[coin_3] [->] [ticket] [initiative] [speed] [speed]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_78",
    name: "Trade #34",
    effect: "[coin_3] [->] [guild] [initiative]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_79",
    name: "Trade #35",
    effect: "[coin_3] [->] [dungeon] [ticket]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_80",
    name: "Trade #36",
    effect: "[coin_3] [->] [guild] [ticket]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_81",
    name: "Trade #37",
    effect: "[coin_3] [->] [dungeon] [initiative]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_82",
    name: "Trade #38",
    effect: "[coin_2] [->] [guild] [speed]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_83",
    name: "Trade #39",
    effect: "[coin_2] [->] [dungeon] [coin]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_84",
    name: "Trade #40",
    effect: "[coin_2] [->] [ticket] [initiative]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_85",
    name: "Trade #41",
    effect: "[ticket] [->] [guild]/[dungeon]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_86",
    name: "Trade #42",
    effect: "[initiative] [->] [guild]/[dungeon]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_87",
    name: "Trade #43",
    effect: "[ticket] [->] [speed] [speed] [coin_2]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_88",
    name: "Trade #44",
    effect: "[initiative] [->] [coin_2] [speed] [speed]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_89",
    name: "Trade #45",
    effect:
      "[coin_2] [->] [gold] [speed], If you have 3+ [initiative]: [dungeon]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_90",
    name: "Trade #46",
    effect: "[coin_2] [->] [gold] [speed], If you have 3+ [ticket]: [guild]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_91",
    name: "Trade #47",
    effect: "[coin_2] [->] [gold] [speed], If you have 5+ [dungeon]: [guild]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_92",
    name: "Trade #48",
    effect:
      "[speed] [speed] [speed] [->] [gold] [gold], If you have 2+ [upgraded markets]: [draw_1_card]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_93",
    name: "Trade #49",
    effect:
      "[gold] [->] [dungeon] [speed], If you have 2+ markets of any level: [initiative]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_94",
    name: "Trade #50",
    effect:
      "[gold] [->] [guild] [coin], If you have 2+ markets of any level: [ticket]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_95",
    name: "Trade #51",
    effect:
      "[gold] [->] [coin_3] [ticket], If you have 1st place in the dungeon: [guild]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_96",
    name: "Trade #52",
    effect:
      "[gold] [->] [coin_3] [initiative], If you have 1st place in the haunted mansion: [dungeon]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_97",
    name: "Trade #53",
    effect: "[vp_1] [->] [gold] [ticket]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_98",
    name: "Trade #54",
    effect: "[vp_1] [->] [gold] [initiative]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_99",
    name: "Trade #55",
    effect: "[vp_1] [->] [dungeon] [coin]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_100",
    name: "Trade #56",
    effect: "[vp_1] [->] [guild] [speed]",
    type: "trade",
    subtype: "convert",
  },
  {
    id: "card_101",
    name: "Trade #57",
    effect: "[vp_1] [->] [dungeon] / [guild]",
    type: "trade",
    subtype: "convert",
  },
];

const epicCards = [
  {
    id: "card_102",
    name: "Epic Card #1",
    effect:
      "[vp_1] / [coin_3] [->] [vp_2] / [ticket] [speed] [initiative] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_102",
    name: "Epic Card #1",
    effect:
      "[vp_1] / [coin_3] [->] [vp_2] / [ticket] [coin] [initiative] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_102",
    name: "Epic Card #1",
    effect: "[vp_1] / [coin_3] [->] [vp_2] / [coin_3] [ticket] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_102",
    name: "Epic Card #1",
    effect: "[vp_1] / [coin_3] [->] [vp_2] / [coin_3] [initiative] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_102",
    name: "Epic Card #1",
    effect:
      "[vp_1] / [coin_3] [->] [vp_2] / [initiative] [ticket] [coin_3] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_102",
    name: "Epic Card #1",
    effect:
      "[vp_1] / [coin_3] [->] [vp_2] / [ticket] [ticket] [speed] [speed] [speed] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_102",
    name: "Epic Card #1",
    effect:
      "[vp_1] / [coin_3] [->] [vp_2] / [gold] [gold] [coin_3] [->] [vp_4]",
    type: "epiccard",
  },

  {
    id: "card_103",
    name: "Epic Card #2",
    effect:
      "[vp_1] / [speed] [speed] [speed] [->] [vp_2] / [speed] [speed] [gold] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_103",
    name: "Epic Card #2",
    effect:
      "[vp_1] / [speed] [speed] [speed] [->] [vp_2] / [coin_2] [gold] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_103",
    name: "Epic Card #2",
    effect:
      "[vp_1] / [speed] [speed] [speed] [->] [vp_2] / [coin_3] [initiative] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_103",
    name: "Epic Card #2",
    effect:
      "[vp_1] / [speed] [speed] [speed] [->] [vp_2] / [ticket] [gold] [speed] [speed] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_103",
    name: "Epic Card #2",
    effect:
      "[vp_1] / [speed] [speed] [speed] [->] [vp_2] / [coin_3] [gold] [speed] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_103",
    name: "Epic Card #2",
    effect:
      "[vp_1] / [speed] [speed] [speed] [->] [vp_2] / [gold] [ticket] [initiative] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_103",
    name: "Epic Card #2",
    effect:
      "[vp_1] / [speed] [speed] [speed] [->] [vp_2] / [gold] [gold] [coin_3] [->] [vp_4]",
    type: "epiccard",
  },

  {
    id: "card_104",
    name: "Epic Card #3",
    effect:
      "[vp_1] / [ticket] [coin] [->] [vp_2] / [ticket] [speed] [initiative] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_104",
    name: "Epic Card #3",
    effect:
      "[vp_1] / [ticket] [coin] [->] [vp_2] / [coin_3] [ticket] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_104",
    name: "Epic Card #3",
    effect:
      "[vp_1] / [ticket] [coin] [->] [vp_2] / [coin_2] [gold] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_104",
    name: "Epic Card #3",
    effect:
      "[vp_1] / [ticket] [coin] [->] [vp_2] [initiative] [ticket] [coin_3] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_104",
    name: "Epic Card #3",
    effect:
      "[vp_1] / [ticket] [coin] [->] [vp_2] / [gold] [gold] [coin_3] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_104",
    name: "Epic Card #3",
    effect:
      "[vp_1] / [ticket] [coin] [->] [vp_2] / [coin_3] [gold] [speed] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_104",
    name: "Epic Card #3",
    effect:
      "[vp_1] / [ticket] [coin] [->] [vp_2] / [ticket] [coin] [initiative] [->] [vp_3]",
    type: "epiccard",
  },

  {
    id: "card_125",
    name: "Epic Card #13",
    effect:
      "[vp_1] / [initiative] [coin] [->] [vp_2] / [coin_3] [gold] [speed] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_125",
    name: "Epic Card #13",
    effect:
      "[vp_1] / [initiative] [coin] [->] [vp_2] / [ticket] [gold] [speed] [speed] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_125",
    name: "Epic Card #13",
    effect:
      "[vp_1] / [initiative] [coin] [->] [vp_2] / [gold] [ticket] [initiative] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_125",
    name: "Epic Card #13",
    effect:
      "[vp_1] / [initiative] [coin] [->] [vp_2] / [ticket] [ticket] [speed] [speed] [speed] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_125",
    name: "Epic Card #13",
    effect:
      "[vp_1] / [initiative] [coin] [->] [vp_2] / [speed] [speed] [gold] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_125",
    name: "Epic Card #13",
    effect:
      "[vp_1] / [initiative] [coin] [->] [vp_2] [vp_1] / [coin_3] [initiative] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_125",
    name: "Epic Card #13",
    effect:
      "[vp_1] / [initiative] [coin] [->] [vp_2] / [ticket] [coin] [initiative] [->] [vp_3]",
    type: "epiccard",
  },
];

const darkmoonCards = [
  {
    id: "card_116",
    name: "Darkmoon #3",
    effect: " [draw_1_epic] / [coin_4] [initiative]",
    type: "darkmoon",
  },

  {
    id: "card_117",
    name: "Darkmoon #4",
    effect: "Move in any [dungeon]/[guild] 2 times.",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: " [draw_1_epic] / [gold] [gold]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: " [draw_1_epic] / [initiative] [speed] [coin_3]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: " [draw_1_epic] / [gold] [coin_2] [speed]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: " [draw_1_epic] / [speed] [speed] [coin_2] [ticket]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: " [draw_1_epic] / [speed] [gold] [coin_2]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: " [draw_1_epic] / [ticket] [dungeon]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: " [draw_1_epic] / [initiative] [guild]",
    type: "darkmoon",
  },
  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: " [draw_1_epic] / [dungeon] [coin_3]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: " [draw_1_epic] / [guild] [coin_3]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: " [vp_2] / [guild] [speed] [speed]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: " [vp_2] / [dungeon] [speed] [speed]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: " [vp_2] / [dungeon] [speed] [coin]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: " [vp_2] / [guild] [speed] [coin]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: " [vp_2] / [ticket] [initiative] [coin_2]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: " [vp_2] / [gold] [initiative] [speed]",
    type: "darkmoon",
  },
];

const dungeonGame = {
  id: "game1",
  slug: "the-last-faire",
  name: "The Last Faire",
  cards: [...tradeCards, ...epicCards, ...darkmoonCards],
  expansions: [],
  types: {
    "type-trade": { name: "Trade Card" },
    "type-epiccard": { name: "Epic Card" },
    "type-darkmoon": { name: "Fortune Card" },
  },
  methodsConfig: [
    {
      method: "draw_type-trade",
      name: "Draw Trade Card",
      type: "type-trade",
    },
    {
      method: "draw_type-epiccard",
      name: "Draw Epic Card",
      type: "type-epiccard",
    },
    {
      method: "draw_type-darkmoon",
      name: "Draw Darkmoon Card",
      type: "type-darkmoon",
    },
  ],
};
export const staticGames = [dungeonGame];
