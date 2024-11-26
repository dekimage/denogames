// Helper function to expand deck cards
export const expandDeckWithCopies = (cards) => {
  return cards.reduce((acc, card) => {
    const copies = Array.from({ length: card.count || 1 }, (_, index) => ({
      ...card,
      id: parseInt(`${card.id}${index + 1}`),
      count: 1,
    }));
    return [...acc, ...copies];
  }, []);
};

const resources = [
  // Common (6)
  {
    id: 1,
    card: "resource",
    type: "Crystal",
    rarity: "common",
    count: 6,
  },
  {
    id: 2,
    card: "resource",
    type: "Gem",
    rarity: "common",
    count: 6,
  },
  {
    id: 3,
    card: "resource",
    type: "Asteroid",
    rarity: "common",
    count: 6,
  },
  {
    id: 4,
    card: "resource",
    type: "Dust",
    rarity: "common",
    count: 6,
  },
  {
    id: 5,
    card: "resource",
    type: "Gas",
    rarity: "common",
    count: 6,
  },
  {
    id: 6,
    card: "resource",
    type: "Orb",
    rarity: "common",
    count: 6,
  },

  // Rare (4)
  {
    id: 7,
    card: "resource",
    type: "Crystal",
    rarity: "rare",
    count: 4,
  },
  {
    id: 8,
    card: "resource",
    type: "Gem",
    rarity: "rare",
    count: 4,
  },
  {
    id: 9,
    card: "resource",
    type: "Gas",
    rarity: "rare",
    count: 4,
  },

  {
    id: 10,
    card: "resource",
    type: "Orb",
    rarity: "rare",
    count: 4,
  },

  // Ancient (2)
  {
    id: 11,
    card: "resource",
    type: "Crystal",
    rarity: "ancient",
    count: 2,
  },
  {
    id: 12,
    card: "resource",
    type: "Asteroid",
    rarity: "ancient",
    count: 2,
  },
];

// const scraps = [
//   { id: 13, card: "scraps", type: "Wrench", name: "Rusty Wrench", count: 4 },
//   { id: 14, card: "scraps", type: "Cog", name: "Titanium Cog", count: 4 },
//   { id: 15, card: "scraps", type: "Gear", name: "Mystic Gear", count: 4 },
// ];

const blueprints = [
  // Government Blueprints (1-6)
  { id: 25, card: "blueprint", type: "government", count: 6 },
  { id: 26, card: "blueprint", type: "private", count: 6 },
  { id: 27, card: "blueprint", type: "rebel", count: 6 },
  { id: 28, card: "blueprint", type: "alien", count: 6 },

  // { id: 25, card: "blueprint", type: "government" },
  // { id: 26, card: "blueprint", type: "government" },
  // { id: 27, card: "blueprint", type: "government" },
  // { id: 28, card: "blueprint", type: "government" },
  // { id: 29, card: "blueprint", type: "government" },
  // { id: 30, card: "blueprint", type: "government" },

  // // Private Sector Blueprints (7-12)
  // { id: 31, card: "blueprint", type: "private" },
  // { id: 32, card: "blueprint", type: "private" },
  // { id: 33, card: "blueprint", type: "private" },
  // { id: 34, card: "blueprint", type: "private" },
  // { id: 35, card: "blueprint", type: "private" },
  // { id: 36, card: "blueprint", type: "private" },

  // // Rebel Blueprints (13-18)
  // { id: 37, card: "blueprint", type: "rebel" },
  // { id: 38, card: "blueprint", type: "rebel" },
  // { id: 39, card: "blueprint", type: "rebel" },
  // { id: 40, card: "blueprint", type: "rebel" },
  // { id: 41, card: "blueprint", type: "rebel" },
  // { id: 42, card: "blueprint", type: "rebel" },

  // // alien Blueprints (19-24)
  // { id: 43, card: "blueprint", type: "alien" },
  // { id: 44, card: "blueprint", type: "alien" },
  // { id: 45, card: "blueprint", type: "alien" },
  // { id: 46, card: "blueprint", type: "alien" },
  // { id: 47, card: "blueprint", type: "alien" },
  // { id: 48, card: "blueprint", type: "alien" },
];

const disasters = [
  {
    id: 49,
    type: "boom",
    name: "Asteroid Collision",
    effect: "Massive damage to structures.",
    threat: 1,
    count: 3,
  },
  {
    id: 50,
    type: "boom",
    name: "Nebula Eruption",
    effect: "Random resource loss.",
    threat: 1,
    count: 3,
  },
  {
    id: 51,
    type: "boom",
    name: "Sudden Blackhole",
    effect: "Discard half your cards.",
    threat: 2,
    count: 3,
  },
  {
    id: 52,
    type: "boom",
    name: "Cosmic Plague",
    effect: "Lose 1 turn.",
    threat: 2,
    count: 3,
  },
  {
    id: 53,
    type: "boom",
    name: "Intense Solar Flare",
    effect: "Disable all resources for 1 turn.",
    count: 3,
  },
  {
    id: 54,
    type: "boom",
    name: "Cosmic Quake",
    effect: "Destroy all scraps.",
    count: 3,
  },
];

export const spaceMinersDeck = expandDeckWithCopies([
  ...resources,
  // ...scraps,
  ...blueprints,
  ...disasters,
]);
