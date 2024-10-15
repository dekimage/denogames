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

const oldDarkmoonCards = [
  // {
  //   id: "card_114",
  //   name: "Darkmoon #1",
  //   effect:
  //     "Choose 2 markets to [upgrade] by 1 without paying cost. For each that you can't (because it's maximum level): [coin_2].",
  //   type: "darkmoon",
  // },
  // {
  //   id: "card_115",
  //   name: "Darkmoon #2",
  //   effect:
  //     "Teleport to any location, do that location's Main actions three times. ",
  //   type: "darkmoon",
  // },
  // {
  //   id: "card_116",
  //   name: "Darkmoon #3",
  //   effect:
  //     "Lose all [speed] [->] Gain [coin] for each. Gain [gold] [draw_1_card] If you lost 3 or more [speed] this way also gain [ticket]",
  //   type: "darkmoon",
  // },
  // {
  //   id: "card_118",
  //   name: "Darkmoon #5",
  //   effect:
  //     "Draw and activate 3 hero powers. (those that have instant effects) For each that you can't activate: [coin_2].",
  //   type: "darkmoon",
  // },
  // {
  //   id: "card_124",
  //   name: "Darkmoon #11",
  //   effect:
  //     "Pick a player and teleport to their location. If you have more [initiative] than them: Gain [coin_3]. Otherwise, gain [initiative]. Then, perform the location's actions as usual.",
  //   type: "darkmoon",
  // },
  // {
  //   id: "card_119",
  //   name: "Darkmoon #6",
  //   effect:
  //     "Draw 1 starting bonus and gain it. You may reroll up to 2 times for free.",
  //   type: "darkmoon",
  // },
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
  // {
  //   id: "card_125",
  //   name: "Darkmoon #12",
  //   effect:
  //     "All players that have equal or more [initiative] than you give you [coin_3]. If they have less, they give as much as they can. Then in a 2/3/4 player game: lose nothing/[vp_1]/[vp_2] respectively.",
  //   type: "darkmoon",
  // },
  // {
  //   id: "card_120",
  //   name: "Darkmoon #7",
  //   effect: "Gain [coin_2] Then, [upgrade] [upgrade]",
  //   type: "darkmoon",
  // },
];

const dungeonGameConfig = {
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

const oldEpicCards = [
  {
    id: "card_105",
    name: "Epic Card #4",
    effect: "[vp_1] / [ticket] [speed] [initiative] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_106",
    name: "Epic Card #5",
    effect: "[vp_1] / [ticket] [coin] [initiative] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_107",
    name: "Epic Card #6",
    effect: "[vp_1] / [coin_3] [ticket] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_107",
    name: "Epic Card #6",
    effect: "[vp_1] / [coin_3] [initiative] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_107",
    name: "Epic Card #6",
    effect: "[vp_1] / [coin_2] [gold] [->] [vp_3]",
    type: "epiccard",
  },
  {
    id: "card_107",
    name: "Epic Card #6",
    effect: "[vp_1] / [speed] [speed] [gold] [->] [vp_3]",
    type: "epiccard",
  },

  {
    id: "card_108",
    name: "Epic Card #7",
    effect: "[vp_1] / [initiative] [ticket] [coin_3] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_109",
    name: "Epic Card #8",
    effect: "[vp_1] / [ticket] [ticket] [speed] [speed] [speed] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_110",
    name: "Epic Card #9",
    effect: "[vp_1] / [gold] [gold] [coin_3] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_111",
    name: "Epic Card #10",
    effect: "[vp_1] / [gold] [ticket] [initiative] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_112",
    name: "Epic Card #11",
    effect: "[vp_1] / [coin_3] [gold] [speed] [->] [vp_4]",
    type: "epiccard",
  },
  {
    id: "card_113",
    name: "Epic Card #12",
    effect: "[vp_1] / [ticket] [gold] [speed] [speed] [->] [vp_4]",
    type: "epiccard",
  },
];
