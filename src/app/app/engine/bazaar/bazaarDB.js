export const items = [
  {
    id: 1,
    type: "item",
    name: "Magic Sword",
    cost: 3,
    encounters: [
      { id: 1, type: "vendor", name: "Wandering Merchant" },
      { id: 2, type: "vendor", name: "Village Market" },
    ],
  },
  {
    id: 2,
    type: "item",
    name: "Healing Potion",
    cost: 2,
    encounters: [
      { id: 3, type: "vendor", name: "Alchemist Shop" },
      { id: 4, type: "vendor", name: "Traveling Healer" },
    ],
  },
  {
    id: 3,
    type: "item",
    name: "Shield of Protection",
    cost: 4,
    encounters: [
      { id: 5, type: "vendor", name: "Blacksmith" },
      { id: 1, type: "vendor", name: "Wandering Merchant" },
    ],
  },
  // ... more items with similar structure
];

export const encounters = [
  { id: 1, type: "vendor", name: "Wandering Merchant" },
  { id: 2, type: "vendor", name: "Village Market" },
  { id: 3, type: "vendor", name: "Alchemist Shop" },
  { id: 4, type: "event", name: "Lost Traveler" },
  { id: 5, type: "event", name: "Ancient Ruins" },
  { id: 6, type: "event", name: "Mysterious Shrine" },
  { id: 7, type: "monster", name: "Forest Bandits" },
  { id: 8, type: "monster", name: "Cave Troll" },
  { id: 9, type: "monster", name: "Dark Wizard" },
  { id: 10, type: "monster", name: "Giant Spider" },
  { id: 11, type: "monster", name: "Undead Warriors" },
  { id: 12, type: "monster", name: "Dragon Wyrmling" },
];

export const monsters = [
  {
    id: 1,
    type: "monster",
    name: "Forest Bandits",
    difficulty: 2,
    reward: 3,
  },
  {
    id: 2,
    type: "monster",
    name: "Cave Troll",
    difficulty: 3,
    reward: 4,
  },
  // ... more monsters
];

export const events = [
  {
    id: 1,
    type: "event",
    name: "Lost Traveler",
    description: "Help a lost traveler find their way",
    reward: 2,
  },
  {
    id: 2,
    type: "event",
    name: "Ancient Ruins",
    description: "Explore mysterious ruins",
    reward: 3,
  },
  // ... more events
];

// Helper functions for random selection
export const getRandomElements = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getRandomEncounters = () => getRandomElements(encounters, 3);
export const getRandomItems = () => getRandomElements(items, 3);
export const getRandomMonsters = () => getRandomElements(monsters, 3);
export const getRandomEvents = () => getRandomElements(events, 3);
