// buildingCards data...
// export const buildingCards = [
//   {
//     id: 1,
//     number: 1,
//     name: "Mining Station",
//     vp: 3,
//     imageUrl: "/buildings/mining-station.png",
//     effect: "Gain 2 crystal resources when activated",
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
//     effect: "Trade with aliens for better resources",
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
//     effect: "Store up to 3 extra resources",
//     uses: 2,
//   },
//   {
//     id: 7,
//     number: 7,
//     name: "Trading Post",
//     vp: 3,
//     imageUrl: "/buildings/trading-post.png",
//     effect: "Exchange resources at better rates",
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
//     effect: "Convert waste into resources",
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
//     effect: "Move resources between stations",
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
//     name: "Resource Converter",
//     vp: 3,
//     imageUrl: "/buildings/converter.png",
//     effect: "Transform resources freely",
//     uses: 1,
//   },
//   {
//     id: 15,
//     number: 15,
//     name: "Scanner Array",
//     vp: 2,
//     imageUrl: "/buildings/scanner.png",
//     effect: "Locate specific resources",
//     uses: 1,
//   },
//   {
//     id: 16,
//     number: 16,
//     name: "Quantum Lab",
//     vp: 5,
//     imageUrl: "/buildings/quantum-lab.png",
//     effect: "Double resource production",
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

// export const resourceManagement = [
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
    effect: "+1 VP if you have  GAWKY or LAWKY. +2 VP if you have both.",
  },
  {
    id: 2,
    name: "Bro Gawky",
    vp: 3,
    uses: 1,
    effect: "+1 VP if you have  HAWKY or LAWKY. +2 VP if you have both.",
  },
  {
    id: 3,
    name: "Bro Lawky",
    vp: 3,
    uses: 1,
    effect: "+1 VP if you have  HAWKY or GAWKY. +2 VP if you have both.",
  },
  {
    id: 8,
    name: "Speedo",
    vp: 2,
    uses: 3,
    effect: " Pay 🌕 to gain 1 resource of your choice.",
  },

  {
    id: 11,
    name: "Scytzer",
    vp: 2,
    uses: 3,
    effect: "Gain 1 Action.",
  },
  {
    id: 6,
    // name: "Denino",
    name: "Inspector Denino",
    vp: 2,
    uses: 2,
    effect: "Draw 3 cards. Ignore any disasters.",
  },
  {
    id: 7,
    // name: "Windsor",
    name: "Bouncer Windz",
    vp: 4,
    uses: 1,
    effect: "Until your next turn, opponents cannot serve coctails.",
  },
  {
    id: 12,
    name: "Spooky Jo",
    vp: 3,
    uses: 2,
    effect:
      "Until your next turn, opponents cannot gain more than 1 resource. ",
  },
  {
    id: 9,
    name: "Heiden-Ran",
    vp: 3,
    uses: 3,
    effect: " When making a coctail, treat 1 resource as any other resource.",
  },
  {
    id: 10,
    name: "Protector Nako",
    vp: 2,
    uses: 2,
    effect: "Avoid a disaster regardless of 🛡️ cost.",
  },
  {
    id: 5,
    name: "El Padre",
    vp: 5,
    uses: 1,
    effect: "Gain +1/+2 VP if you serve him 2/3 coctails.",
  },
  {
    id: 4,
    name: "Dragoonovic",
    vp: 4,
    uses: 1,
    effect: "Pay 🌕🌕🌕🌕 to serve a coctail for free.",
  },
];
