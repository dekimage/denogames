const bonusCards = [
  {
    id: "card_1",
    name: "Starting Bonus #1",
    description: "This is starting bonus card #1.",
    effect: ["gold", "speed", "speed"],
    imageUrl: "/path/to/sample-card1-image.png",
    type: "bonus",
  },
  {
    id: "card_2",
    name: "Starting Bonus #2",
    description: "This is starting bonus card #2.",
    effect: ["initiative", "draw_1_card"],
    imageUrl: "/path/to/sample-card2-image.png",
    type: "bonus",
  },
  {
    id: "card_3",
    name: "Starting Bonus #3",
    description: "This is starting bonus card #3.",
    effect: ["speed", "speed", "ticket", "speed"],
    imageUrl: "/path/to/sample-card3-image.png",
    type: "bonus",
  },
  {
    id: "card_4",
    name: "Starting Bonus #4",
    description: "This is starting bonus card #4.",
    effect: ["initiative", "ticket", "coin"],
    imageUrl: "/path/to/sample-card4-image.png",
    type: "bonus",
  },
  {
    id: "card_5",
    name: "Starting Bonus #5",
    description: "This is starting bonus card #5.",
    effect: ["ticket", "initiative", "coin"],
    imageUrl: "/path/to/sample-card5-image.png",
    type: "bonus",
  },
  {
    id: "card_6",
    name: "Starting Bonus #6",
    description: "This is starting bonus card #6.",
    effect: ["guild", "coin"],
    imageUrl: "/path/to/sample-card6-image.png",
    type: "bonus",
  },
  {
    id: "card_7",
    name: "Starting Bonus #7",
    description: "This is starting bonus card #7.",
    effect: ["draw_1_card", "speed", "coin"],
    imageUrl: "/path/to/sample-card7-image.png",
    type: "bonus",
  },
  {
    id: "card_8",
    name: "Starting Bonus #8",
    description: "This is starting bonus card #8.",
    effect: ["initiative", "initiative", "coin"],
    imageUrl: "/path/to/sample-card8-image.png",
    type: "bonus",
  },
  {
    id: "card_9",
    name: "Starting Bonus #9",
    description: "This is starting bonus card #9.",
    effect: ["speed", "initiative", "ticket"],
    imageUrl: "/path/to/sample-card9-image.png",
    type: "bonus",
  },
  {
    id: "card_10",
    name: "Starting Bonus #10",
    description: "This is starting bonus card #10.",
    effect: ["ticket", "draw_1_card"],
    imageUrl: "/path/to/sample-card10-image.png",
    type: "bonus",
  },
  {
    id: "card_11",
    name: "Starting Bonus #11",
    description: "This is starting bonus card #11.",
    effect: ["speed", "draw_1_card", "coin"],
    imageUrl: "/path/to/sample-card11-image.png",
    type: "bonus",
  },
  {
    id: "card_12",
    name: "Starting Bonus #12",
    description: "This is starting bonus card #12.",
    effect: ["dungeon", "coin"],
    imageUrl: "/path/to/sample-card12-image.png",
    type: "bonus",
  },
  {
    id: "card_13",
    name: "Starting Bonus #13",
    description: "This is starting bonus card #13.",
    effect: ["gold", "initiative"],
    imageUrl: "/path/to/sample-card13-image.png",
    type: "bonus",
  },
  {
    id: "card_14",
    name: "Starting Bonus #14",
    description: "This is starting bonus card #14.",
    effect: ["draw_1_epic"],
    imageUrl: "/path/to/sample-card14-image.png",
    type: "bonus",
  },
  {
    id: "card_15",
    name: "Starting Bonus #15",
    description: "This is starting bonus card #15.",
    effect: ["speed", "initiative", "coin_2"],
    imageUrl: "/path/to/sample-card15-image.png",
    type: "bonus",
  },
  {
    id: "card_16",
    name: "Starting Bonus #16",
    description: "This is starting bonus card #16.",
    effect: ["ticket", "draw_1_card"],
    imageUrl: "/path/to/sample-card16-image.png",
    type: "bonus",
  },
  {
    id: "card_17",
    name: "Starting Bonus #17",
    description: "This is starting bonus card #17.",
    effect: ["guild", "speed"],
    imageUrl: "/path/to/sample-card17-image.png",
    type: "bonus",
  },
  {
    id: "card_18",
    name: "Starting Bonus #18",
    description: "This is starting bonus card #18.",
    effect: ["ticket", "coin", "ticket"],
    imageUrl: "/path/to/sample-card18-image.png",
    type: "bonus",
  },
  {
    id: "card_19",
    name: "Starting Bonus #19",
    description: "This is starting bonus card #19.",
    effect: ["gold", "coin_2"],
    imageUrl: "/path/to/sample-card19-image.png",
    type: "bonus",
  },
  {
    id: "card_20",
    name: "Starting Bonus #20",
    description: "This is starting bonus card #20.",
    effect: ["draw_1_card", "coin_2"],
    imageUrl: "/path/to/sample-card20-image.png",
    type: "bonus",
  },
  {
    id: "card_21",
    name: "Starting Bonus #21",
    description: "This is starting bonus card #21.",
    effect: ["draw_1_epic"],
    imageUrl: "/path/to/sample-card21-image.png",
    type: "bonus",
  },
  {
    id: "card_22",
    name: "Starting Bonus #22",
    description: "This is starting bonus card #22.",
    effect: ["initiative", "gold"],
    imageUrl: "/path/to/sample-card22-image.png",
    type: "bonus",
  },
  {
    id: "card_23",
    name: "Starting Bonus #23",
    description: "This is starting bonus card #23.",
    effect: ["ticket", "speed", "coin_2"],
    imageUrl: "/path/to/sample-card23-image.png",
    type: "bonus",
  },
  {
    id: "card_24",
    name: "Starting Bonus #24",
    description: "This is starting bonus card #24.",
    effect: ["ticket", "speed", "coin_2"],
    imageUrl: "/path/to/sample-card24-image.png",
    type: "bonus",
  },
];

const passiveCards = [
  {
    id: "card_25",
    name: "Golden Gamble",
    effect:
      "If you gain 3x [ticket] in a single turn, gain [gold]. If you gain 4x [ticket] in a single turn, gain 2x [gold]. Only one can be activated.",
    type: "passive",
  },
  {
    id: "card_26",
    name: "Guild Shortcut",
    effect:
      "Once per turn when you move in [dungeon], you may pay [coin_3] to move in [guild].",
    type: "passive",
  },
  {
    id: "card_27",
    name: "Stealth Tactics",
    effect:
      "You don't pay to players if you have lower [initiative] when you step on their location.",
    type: "passive",
  },
  {
    id: "card_28",
    name: "Swift Explorer",
    effect:
      "Once per turn, if you moved 3 or more spaces in any [dungeon]/[guild], gain [vp_2].",
    type: "passive",
  },
  {
    id: "card_29",
    name: "Master Adventurer",
    effect:
      "If you finish both [dungeon] and [guild] in the same turn, gain [ticket] [ticket] [gold].",
    type: "passive",
  },
  {
    id: "card_30",
    name: "Golden Rush",
    effect:
      "Whenever you use [gold] [gold], gain [speed] [speed] for the next turn.",
    type: "passive",
  },
  {
    id: "card_31",
    name: "Lap of Glory",
    effect:
      "Whenever you make a full circle and pass the 1st location, gain [coin] [speed].",
    type: "passive",
  },
  {
    id: "card_32",
    name: "Speed Burst",
    effect:
      "Once per turn, if you used more than 4 [speed] in the same turn, gain [initiative].",
    type: "passive",
  },
  {
    id: "card_33",
    name: "High Status",
    effect:
      "If a player gains [initiative] and had the same as you, gain [coin_3].",
    type: "passive",
  },
  {
    id: "card_34",
    name: "Master Builder",
    effect:
      "Whenever you [build] 2 times in a turn, gain [initiative] [speed] [coin].",
    type: "passive",
  },
  {
    id: "card_35",
    name: "Wealth Accumulation",
    effect:
      "At the end of your turn if you have 7 or more [coin], gain [ticket].",
    type: "passive",
  },
  {
    id: "card_36",
    name: "Epic Trade",
    effect:
      "Whenever you [draw_1_epic], you may pay [ticket] [ticket] to gain [gold] [coin_3].",
    type: "passive",
  },
];

const heroPowers = [
  {
    id: "card_37",
    name: "Busy Banker",
    effect: "Once per turn: [ticket] [->] [coin_4].",
    type: "heropower",
    uses: 5,
    hero: "Magnus The Coin Magician",
  },
  {
    id: "card_38",
    name: "The Visions Call You",
    effect: "Activate when you draw [draw_1_epic], gain [ticket] [ticket].",
    type: "heropower",
    uses: 4,
    hero: "Madame Zelda, The Fortune Teller",
  },
  {
    id: "card_39",
    name: "Airborne Exploration",
    effect:
      "Activate when you use a parachute to take altered route. Gain [dungeon] [dungeon].",
    type: "heropower",
    uses: 2,
    hero: "Racer Ricky, The Speedster",
  },
  {
    id: "card_40",
    name: "Read The Cards",
    effect:
      "Once per turn: [draw_1_card] you may use up to 3 [reroll] for free.",
    type: "heropower",
    uses: 3,
    hero: "Mystic Luna, The Tarot Reader",
  },
  {
    id: "card_41",
    name: "Shiny Gold Digging",
    effect: "If you collect 5 or more [coin] in a turn, gain [gold]",
    type: "heropower",
    uses: 4,
    hero: "Goldie, The Golden Collector",
  },
  {
    id: "card_42",
    name: "Punch Ticket",
    effect: "Whenever you use 2 or more [ticket], gain [initiative] [coin_2]",
    type: "heropower",
    uses: 3,
    hero: "Sammy, The Ticket Scalper",
  },
  {
    id: "card_43",
    name: "Peek Into The Other Side",
    effect: "Whenever you complete a [dungeon] / [guild]: [darkmoon]",
    type: "heropower",
    uses: 2,
    hero: "Spooky Jack, The Haunted One",
  },
  {
    id: "card_44",
    name: "Double or Nothing",
    effect:
      "Once per turn: double all effects gained from a location's public action. Costs are also paid twice.",
    type: "heropower",
    uses: 4,
    hero: "Benny, The Bouncer",
  },
];

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
    effect: "[coin_3] [->] [vp_2]",
    type: "epiccard",
  },
  {
    id: "card_103",
    name: "Epic Card #2",
    effect: "[speed] [speed] [speed] [->] [vp_2]",
    type: "epiccard",
  },
  {
    id: "card_104",
    name: "Epic Card #3",
    effect: "[ticket] [coin] [->] [vp_2]",
    type: "epiccard",
  },
  {
    id: "card_125",
    name: "Epic Card #13",
    effect: "[initative] [coin] [->] [vp_2]",
    type: "epiccard",
  },
  {
    id: "card_105",
    name: "Epic Card #4",
    effect: "[ticket] [speed] [initiative] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_106",
    name: "Epic Card #5",
    effect: "[ticket] [coin] [initiative] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_107",
    name: "Epic Card #6",
    effect: "[coin_3] [ticket] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_107",
    name: "Epic Card #6",
    effect: "[coin_3] [initiative] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_107",
    name: "Epic Card #6",
    effect: "[coin_2] [gold] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_107",
    name: "Epic Card #6",
    effect: "[speed] [speed] [gold] [->] [vp_3]",
    type: "epiccard",
  },

  // fix car numbers above
  {
    id: "card_108",
    name: "Epic Card #7",
    effect: "[initiative] [ticket] [coin_3] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_109",
    name: "Epic Card #8",
    effect: "[ticket] [ticket] [speed] [speed] [speed] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_110",
    name: "Epic Card #9",
    effect: "[gold] [gold] [coin_3] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_111",
    name: "Epic Card #10",
    effect: "[gold] [ticket] [initiative] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_112",
    name: "Epic Card #11",
    effect: "[coin_3] [gold] [speed] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_113",
    name: "Epic Card #12",
    effect: "[ticket] [gold] [speed] [speed] [->] [vp_4]",
    type: "epiccard",
  },
];

const darkmoonCards = [
  {
    id: "card_114",
    name: "Darkmoon #1",
    effect:
      "Choose 2 markets to [upgrade] by 1 without paying cost. For each that you can't (because it's maximum level): [coin_2].",
    type: "darkmoon",
  },
  {
    id: "card_115",
    name: "Darkmoon #2",
    effect:
      "Teleport to any location, do that location's Main actions three times. ",
    type: "darkmoon",
  },
  // {
  //   id: "card_116",
  //   name: "Darkmoon #3",
  //   effect:
  //     "Lose all [speed] [->] Gain [coin] for each. Gain [gold] [draw_1_card] If you lost 3 or more [speed] this way also gain [ticket]",
  //   type: "darkmoon",
  // },
  {
    id: "card_116",
    name: "Darkmoon #3",
    effect: "Choose 1: [draw_1_epic] / [coin_4] [initiative]",
    type: "darkmoon",
  },
  {
    id: "card_117",
    name: "Darkmoon #4",
    effect: "Move in any [dungeon]/[guild] 2 times.",
    type: "darkmoon",
  },
  // {
  //   id: "card_118",
  //   name: "Darkmoon #5",
  //   effect:
  //     "Draw and activate 3 hero powers. (those that have instant effects) For each that you can't activate: [coin_2].",
  //   type: "darkmoon",
  // },
  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: "Choose 1: [draw_1_epic] / [gold] [gold]",
    type: "darkmoon",
  },

  {
    id: "card_119",
    name: "Darkmoon #6",
    effect:
      "Draw 1 starting bonus and gain it. You may reroll up to 2 times for free.",
    type: "darkmoon",
  },
  {
    id: "card_120",
    name: "Darkmoon #7",
    effect: "Gain [coin_2] Then, [upgrade] [upgrade]",
    type: "darkmoon",
  },
  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: "Choose 1: [draw_1_epic] / [initiative] [speed] [coin_3]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: "Choose 1: [draw_1_epic] / [gold] [coin_2] [speed]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: "Choose 1: [draw_1_epic] / [speed] [speed] [coin_2] [ticket]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: "Choose 1: [draw_1_epic] / [speed] [gold] [coin_2]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: "Choose 1: [draw_1_epic] / [ticket] [dungeon]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: "Choose 1: [draw_1_epic] / [initiative] [guild]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: "Choose 1: [draw_1_epic] / [dungeon] [coin_3]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: "Choose 1: [draw_1_epic] / [guild] [coin_3]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: "Choose 1: [vp_2] / [guild] [speed] [speed]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: "Choose 1: [vp_2] / [dungeon] [speed] [speed]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: "Choose 1: [vp_2] / [dungeon] [speed] [coin]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: "Choose 1: [vp_2] / [guild] [speed] [coin]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: "Choose 1: [vp_2] / [ticket] [initiative] [coin_2]",
    type: "darkmoon",
  },

  {
    id: "card_118",
    name: "Darkmoon #5",
    effect: "Choose 1: [vp_2] / [gold] [initiative] [speed]",
    type: "darkmoon",
  },

  // {
  //   id: "card_121",
  //   name: "Darkmoon #8",
  //   effect:
  //     "[draw_1_card] [draw_1_card]. You may reroll each up to 2 times. If you are on the same location with another player: Steal 1 [initiative] from one of them.",
  //   type: "darkmoon",
  // },
  // {
  //   id: "card_122",
  //   name: "Darkmoon #9",
  //   effect:
  //     "[coin] [speed] [->] [gold] [vp_1]. You may repeat this process 3 times. For each that you can't, gain a [coin].",
  //   type: "darkmoon",
  // },
  // {
  //   id: "card_123",
  //   name: "Darkmoon #10",
  //   effect:
  //     "Move in [dungeon] 1 space diagonally and gain [initiative]. If you can't (because you are at the entrance or not in a dungeon): [dungeon] [dungeon].",
  //   type: "darkmoon",
  // },
  {
    id: "card_124",
    name: "Darkmoon #11",
    effect:
      "Pick a player and teleport to their location. If you have more [initiative] than them: Gain [coin_3]. Otherwise, gain [initiative]. Then, perform the location's actions as usual.",
    type: "darkmoon",
  },
  // {
  //   id: "card_125",
  //   name: "Darkmoon #12",
  //   effect:
  //     "All players that have equal or more [initiative] than you give you [coin_3]. If they have less, they give as much as they can. Then in a 2/3/4 player game: lose nothing/[vp_1]/[vp_2] respectively.",
  //   type: "darkmoon",
  // },
];

const dungeonGame = {
  id: "game1",
  slug: "the-last-faire",
  name: "The Last Faire",
  // description:
  //   "An adventurous journey through wild dungeons, filled with thrilling encounters and challenges.",
  cards: [
    // ...bonusCards,
    // ...passiveCards,
    // ...heroPowers,
    ...tradeCards,
    ...epicCards,
    ...darkmoonCards,
  ],
  expansions: [],
  types: {
    // "type-bonus": { name: "Starting Bonus" },
    // "type-passive": { name: "Passive" },
    // "type-heropower": { name: "Hero Power" },
    "type-trade": { name: "Trade Card" },
    "type-epiccard": { name: "Epic Card" },
    "type-darkmoon": { name: "Fortune Card" },
  },
  methodsConfig: [
    // {
    //   method: "draw_type-bonus",
    //   name: "Draw Starting Bonus",
    //   type: "type-bonus",
    // },
    // {
    //   method: "draw_type-passive",
    //   name: "Draw Passive Card",
    //   type: "type-passive",
    // },
    // {
    //   method: "draw_type-heropower",
    //   name: "Draw Passive Card",
    //   type: "type-heropower",
    // },
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
