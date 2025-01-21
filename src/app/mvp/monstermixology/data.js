// buildingCards data...
// export const buildingCards = [
//   {
//     id: 1,
//     number: 1,
//     name: "Mining Station",
//     vp: 3,
//     imageUrl: "/buildings/mining-station.png",
//     effect: "Gain 2 crystal ingredients when activated",
//     uses: 2,
//   },
//   {
//     id: 2,
//     number: 2,
//     name: "Research Lab",
//     vp: 2,
//     imageUrl: "/buildings/research-lab.png",
//     effect: "Draw 1 extra card when mining",
//     uses: 1,
//   },
//   {
//     id: 3,
//     number: 3,
//     name: "Defense Tower",
//     vp: 4,
//     imageUrl: "/buildings/defense-tower.png",
//     effect: "Prevent 1 disaster per activation",
//     uses: 3,
//   },
//   {
//     id: 4,
//     number: 4,
//     name: "Alien Embassy",
//     vp: 5,
//     imageUrl: "/buildings/alien-embassy.png",
//     effect: "Trade with aliens for better ingredients",
//     uses: 2,
//   },
//   {
//     id: 5,
//     number: 5,
//     name: "Power Plant",
//     vp: 3,
//     imageUrl: "/buildings/power-plant.png",
//     effect: "Generate 2 energy per turn",
//     uses: 1,
//   },
//   {
//     id: 6,
//     number: 6,
//     name: "Storage Facility",
//     vp: 2,
//     imageUrl: "/buildings/storage.png",
//     effect: "Store up to 3 extra ingredients",
//     uses: 2,
//   },
//   {
//     id: 7,
//     number: 7,
//     name: "Trading Post",
//     vp: 3,
//     imageUrl: "/buildings/trading-post.png",
//     effect: "Exchange ingredients at better rates",
//     uses: 2,
//   },
//   {
//     id: 8,
//     number: 8,
//     name: "Shield Generator",
//     vp: 4,
//     imageUrl: "/buildings/shield-gen.png",
//     effect: "Protect against 2 disasters",
//     uses: 3,
//   },
//   {
//     id: 9,
//     number: 9,
//     name: "Recycling Center",
//     vp: 3,
//     imageUrl: "/buildings/recycling.png",
//     effect: "Convert waste into ingredients",
//     uses: 1,
//   },
//   {
//     id: 10,
//     number: 10,
//     name: "Observatory",
//     vp: 2,
//     imageUrl: "/buildings/observatory.png",
//     effect: "Peek at upcoming disasters",
//     uses: 2,
//   },
//   {
//     id: 11,
//     number: 11,
//     name: "Teleporter",
//     vp: 5,
//     imageUrl: "/buildings/teleporter.png",
//     effect: "Move ingredients between stations",
//     uses: 3,
//   },
//   {
//     id: 12,
//     number: 12,
//     name: "Repair Bay",
//     vp: 3,
//     imageUrl: "/buildings/repair-bay.png",
//     effect: "Fix damaged equipment",
//     uses: 2,
//   },
//   {
//     id: 13,
//     number: 13,
//     name: "Command Center",
//     vp: 4,
//     imageUrl: "/buildings/command.png",
//     effect: "Coordinate multiple actions",
//     uses: 2,
//   },
//   {
//     id: 14,
//     number: 14,
//     name: "ingredient Converter",
//     vp: 3,
//     imageUrl: "/buildings/converter.png",
//     effect: "Transform ingredients freely",
//     uses: 1,
//   },
//   {
//     id: 15,
//     number: 15,
//     name: "Scanner Array",
//     vp: 2,
//     imageUrl: "/buildings/scanner.png",
//     effect: "Locate specific ingredients",
//     uses: 1,
//   },
//   {
//     id: 16,
//     number: 16,
//     name: "Quantum Lab",
//     vp: 5,
//     imageUrl: "/buildings/quantum-lab.png",
//     effect: "Double ingredient production",
//     uses: 3,
//   },
// ];

// export const monuments = [
//   {
//     id: 4,
//     name: "Dagoony",
//     vp: 4,

//     imageUrl: "/monuments/lunar-beacon.png",
//     uses: 1,
//     effect:
//       "Gain +1/2/4/7 VP for 1/2/3/4 different monuments and +0/2/4 VP for owning 1/2/3 of the same monument.",
//   },
// ];

// export const battleShips = [
//   {
//     id: 6,
//     name: "Deniosal",
//     vp: 4,
//     imageUrl: "/ships/dreadnought-sentinel.png",
//     uses: 1,
//     effect:
//       "Until your next turn, opponents cannot perform any actions during other players' turns.",
//   },
// ];

// export const miningEquipment = [
//   {
//     id: 8,
//     name: "Quizzaf",
//     vp: 3,
//     imageUrl: "/equipment/constructor-unit.png",
//     uses: 2,
//     effect: "+1 blueprint action during your turn.",
//   },
// ];

// export const ingredientManagement = [
//   {
//     id: 10,
//     name: "Rawrd Gnawler",
//     vp: 2,
//     imageUrl: "/stations/asteroid-trading.png",
//     uses: 2,
//     effect: "Trade 1 🌑 for 2 ✨",
//   },
//   // {
//   //   id: 12,
//   //   name: "Lunar Trade Hub",
//   //   vp: 2,
//   //   imageUrl: "/stations/lunar-trade.png",
//   //   uses: 3,
//   //   effect: "Trade 1 crystal for 2 energy or 1 asteroid for 2 gems.",
//   // },
// ];

// export const shieldGenerators = [
//   {
//     id: 12,
//     name: "Grenar",
//     vp: 2,
//     imageUrl: "/defense/nova-barrier.png",
//     uses: 3,
//     effect: "Block a disaster that requires 1 🛡️ only.",
//   },
// ];

// export const surveillanceCards = [
//   {
//     id: 12,
//     name: "Buskio",
//     vp: 1,
//     imageUrl: "/scouting/deep-space-scanner.png",
//     uses: 2,
//     effect:
//       "Draw 5 cards. Disasters cost -1 🛡️ to avoid, and gain 1 🌕 for each blueprint revealed.",
//   },
// ];

export const heroesCards = [
  {
    id: 1,
    name: "Bro Hawky",
    vp: 3,
    uses: 1,
    uniqueNumber: 3,
    trigger: "end",
    effect:
      "Hawky is worth 4VP if you served Gawky or Lawky a coctail. And 5VP if you served both.",
  },
  {
    id: 2,
    name: "Bro Gawky",
    vp: 3,
    uses: 1,
    uniqueNumber: 3,
    trigger: "end",
    effect:
      "Gawky is worth 4VP if you served Hawky or Lawky a coctail. And 5VP if you served both.",
  },
  {
    id: 3,
    name: "Bro Lawky",
    vp: 3,
    uses: 1,
    uniqueNumber: 3,
    trigger: "end",
    effect:
      "Lawky is worth 4VP if you served Hawky or Gawky a coctail. And 5VP if you served both.",
  },
  {
    id: 8,
    name: "Speedo",
    vp: 2,
    uses: 3,
    trigger: "other",
    effect: "Pay 🌕 to gain 1 ingredient of your choice.",
  },

  {
    id: 11,
    name: "Scytzer",
    vp: 3,
    uses: 3,
    trigger: "other",
    effect: "Gain 1 Action.",
  },
  {
    id: 6,
    name: "Inspector Deni",
    vp: 2,
    uses: 2,
    trigger: "self",
    effect: "Draw 4 cards. Ignore any disasters.",
  },
  {
    id: 7,
    name: "Bouncer Windz",
    vp: 4,
    uses: 1,
    trigger: "self",
    effect: "Until your next turn, opponents cannot serve coctails.",
  },
  {
    id: 12,
    name: "Spooky Jo",
    vp: 4,
    uses: 2,
    trigger: "self",
    effect:
      "Until your next turn, opponents have 1 less Action on their turn. (Can be 0)",
  },
  {
    id: 9,
    name: "Heiden-Ran",
    vp: 3,
    uses: 3,
    trigger: "other",
    effect:
      "When making a coctail, treat 1 ingredient as any other ingredient.",
  },
  {
    id: 10,
    name: "Protector Nako",
    vp: 3,
    uses: 2,
    trigger: "self",
    effect: "Avoid a disaster.",
  },
  {
    id: 5,
    name: "El Padre",
    vp: 4,
    uses: 1,
    // effect: "Gain +1/+2 VP if you serve him 2/3 coctails.",
    trigger: "end",
    effect:
      "El Padre is worth 5VP if you serve him 2 coctails or 6VP at 3 coctails.",
  },
  {
    id: 4,
    name: "Dragoonovic",
    vp: 3,
    uses: 1,
    trigger: "other",
    effect: "Pay 🌕🌕🌕🌕 instead of ingredients when you serve a cocktail. (You still must spend 1 Action to serve)",
  },
  {
    id: 13,
    name: "Hoarder Pazzie",
    vp: 3,
    uses: 2,
    trigger: "other",
    effect:
      "Gain any 2 ingredients if an opponent has served 5 or more drinks this game. And you have served less than 4.",
  },
  {
    id: 14,
    name: "Assasin Stefan",
    vp: 3,
    uses: 3,
    trigger: "other",
    effect:
      "You may spend 1 shield as any 1 ingredient when making a cocktail.",
  },
  {
    id: 15,
    name: "Frosty Bosko",
    vp: 1,
    uses: 3,
    trigger: "self",
    effect: "All actions require 2 actions to perform until your next turn.",
  },
  {
    id: 16,
    name: "Dr. Muddle",
    vp: 4,
    uses: 2,
    trigger: "self",
    effect: "If you performed 3 or more actions this turn, gain shield.",
  },
  {
    id: 17,
    name: "Prince Alin",
    vp: 1,
    uses: 2,
    trigger: "self",
    effect:
      "Draw 6 cards. Gain 🌕 for each recipe card you reveal. Ignore any disasters.",
  },
  {
    id: 18,
    name: "Aqua Bella",
    vp: 3,
    uses: 3,
    trigger: "self",
    effect:
      "When you serve a cocktail using ingredients you just gained from the board, you may gain any 1 ingredient.",
  },
  {
    id: 19,
    name: "Justice Bringer",
    vp: 3,
    uses: 2,
    trigger: "unique",
    effect:
      "Activate this effect when an opponent gains the 4th action. You may pay 🌕🌕 to reduce their actions to 2.",
  },
  {
    id: 20,
    name: "Royal Mistress",
    vp: 2,
    uses: 1,
    trigger: "self",
    effect:
      "If you served 2 cocktails this turn, you may use this ability to gain 4 ingredients of your choice.",
  },
  {
    id: 21,
    name: "VIP Peky",
    vp: 2,
    uses: 2,
    trigger: "self",
    effect:
      "Spend 3 actions to serve a cocktail without paying any ingredients.",
  },
  {
    id: 22,
    name: "King Mral",
    vp: 1,
    uses: 1,
    trigger: "end",
    effect: "King Mral is worth 6VP if you triggered the end game.",
  },
  {
    id: 23,
    name: "Deno the Jester",
    vp: 2,
    uses: 2,
    trigger: "self",
    effect:
      "Steal 1 ingredient from all players that have served more cocktails than you. Pay 🌕 to each player you stole from. ",
  },

  {
    id: 24,
    name: "Hugger Smiki",
    vp: 4,
    uses: 2,
    trigger: "other",
    effect:
      "Gain any 1 ingredient. All other players also gain that ingredient.",
  },
  {
    id: 25,
    name: "Woodcracko",
    vp: 2,
    uses: 2,
    trigger: "self",
    effect: "Steal 1 ingredient from another player.",
  },
];
