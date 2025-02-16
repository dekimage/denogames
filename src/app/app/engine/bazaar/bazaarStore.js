import { makeAutoObservable, runInAction } from "mobx";
import {
  getRandomEncounters,
  getRandomItems,
  getRandomMonsters,
  getRandomEvents,
  getRandomEncounterOfType,
  getRandomElements,
  items,
} from "./bazaarDB";

const DEFAULT_PLAYER_STATE = {
  name: "",
  color: "",
  gold: 6, // Updated starting gold
  income: 1,
  xp: 0,
  level: 1,
  tier: 1, // Added tier property
  relics: [],
  upgrades: [],
  inventory: [], // Added inventory for purchased items
};

const PLAYER_COLORS = [
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#FFA500", // Orange
  "#800080", // Purple
  "#008000", // Dark Green
  "#000080", // Navy
  "#800000", // Maroon
  "#808080", // Gray
];

// Define the age/round structure
const AGE_STRUCTURE = {
  1: {
    rounds: {
      1: [
        { type: "market", count: 2 },
        { type: "event", count: 1 }
      ],
      2: [
        { type: "market", count: 1 },
        { type: "event", count: 1 },
        { type: "monster", count: 1 }
      ],
      3: [
        { type: "market", count: 3 }
      ],
      4: [
        { type: "monster", count: 3 }
      ]
    },
    maxRounds: 4
  },
  2: {
    rounds: {
      1: [
        { type: "market", count: 2 },
        { type: "event", count: 1 }
      ],
      2: [
        { type: "monster", count: 1 },
        { type: "market", count: 1 },
        { type: "event", count: 1 }
      ],
      3: [
        { type: "market", count: 2 },
        { type: "event", count: 1 }
      ],
      4: [
        { type: "monster", count: 3 }
      ]
    },
    maxRounds: 4
  },
  3: {
    rounds: {
      1: [
        { type: "market", count: 2 },
        { type: "monster", count: 1 }
      ],
      2: [
        { type: "event", count: 2 },
        { type: "monster", count: 1 }
      ],
      3: [
        { type: "market", count: 2 },
        { type: "monster", count: 1 }
      ],
      4: [
        { type: "monster", count: 2 },
        { type: "event", count: 1 }
      ]
    },
    maxRounds: 4
  },
  4: {
    rounds: {
      1: [
        { type: "market", count: 2 },
        { type: "monster", count: 1 }
      ],
      2: [
        { type: "monster", count: 2 },
        { type: "event", count: 1 }
      ],
      3: [
        { type: "market", count: 1 },
        { type: "monster", count: 2 }
      ],
      4: [
        { type: "monster", count: 2 },
        { type: "event", count: 1 }
      ]
    },
    maxRounds: 4
  },
  5: {
    rounds: {
      1: [
        { type: "monster", count: 2 },
        { type: "event", count: 1 }
      ],
      2: [
        { type: "market", count: 1 },
        { type: "monster", count: 2 }
      ],
      3: [
        { type: "monster", count: 2 },
        { type: "event", count: 1 }
      ],
      4: [
        { type: "monster", count: 3 }
      ]
    },
    maxRounds: 4
  },
  6: {
    rounds: {
      1: [
        { type: "monster", count: 2 },
        { type: "event", count: 1 }
      ],
      2: [
        { type: "monster", count: 2 },
        { type: "market", count: 1 }
      ],
      3: [
        { type: "monster", count: 2 },
        { type: "event", count: 1 }
      ],
      4: [
        { type: "monster", count: 3 }
      ]
    },
    maxRounds: 4
  }
};

class BazaarStore {
  players = [];
  activePlayerIndex = 0;
  currentRound = 1;
  currentAge = 1;
  currentEncounters = [];
  gameStarted = false;
  currentOptions = [];
  currentPhase = "encounters";
  currentMarketVariant = null;

  constructor() {
    makeAutoObservable(this);
    // Commenting out localStorage load on construction
    // this.loadFromLocalStorage();
  }

  addPlayer(name, color) {
    if (this.players.length >= 4) return false;
    if (this.players.some((p) => p.color === color)) return false;

    this.players.push({
      ...DEFAULT_PLAYER_STATE,
      name,
      color,
    });
    // this.saveToLocalStorage();
    return true;
  }

  removePlayer(index) {
    this.players.splice(index, 1);
    // this.saveToLocalStorage();
  }

  startTurn() {
    // Clear previous encounters before starting new turn
    this.currentEncounters = [];
    this.currentOptions = [];
    this.currentPhase = "encounters";

    // Give player their income at start of turn
    const player = this.activePlayer;
    if (player) {
      player.gold += player.income;
      this.drawNewEncounters();
    }
  }

  nextTurn() {
    runInAction(() => {
      // Clear ALL state
      this.currentEncounters = [];
      this.currentOptions = [];
      this.currentPhase = "encounters";

      this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;

      if (this.activePlayerIndex === 0) {
        this.currentRound++;

        if (!AGE_STRUCTURE[this.currentAge]?.rounds[this.currentRound]) {
          this.currentAge++;
          this.currentRound = 1;

          if (!AGE_STRUCTURE[this.currentAge]) {
            console.log("Game Over!");
            this.gameStarted = false;
            return;
          }
        }
      }

      this.currentMarketVariant = null;
      this.startTurn();
    });
  }

  drawNewEncounters() {
    runInAction(() => {
      if (!AGE_STRUCTURE[this.currentAge]) {
        console.log("Game Over - Age out of bounds");
        return;
      }

      const ageStructure = AGE_STRUCTURE[this.currentAge];
      if (!ageStructure.rounds[this.currentRound]) {
        console.log("Invalid round for current age");
        return;
      }

      const roundStructure = ageStructure.rounds[this.currentRound];
      let encounters = [];
      const usedEncounterIds = new Set(); // Track used encounter IDs

      roundStructure.forEach(({ type, count }) => {
        let attempts = 0;
        const maxAttempts = 10; // Prevent infinite loops

        for (let i = 0; i < count; i++) {
          let encounter;

          // Keep trying to get a unique encounter
          while (attempts < maxAttempts) {
            encounter = getRandomEncounterOfType(type, this.currentAge);

            if (encounter && !usedEncounterIds.has(encounter.id)) {
              encounters.push(encounter);
              usedEncounterIds.add(encounter.id);
              break;
            }
            attempts++;
          }

          if (!encounter || attempts >= maxAttempts) {
            console.warn(`Could not find unique ${type} encounter for age ${this.currentAge}`);
          }
        }
      });

      // Take only the first 3 encounters if we somehow got more
      this.currentEncounters = encounters.slice(0, 3);
      this.currentOptions = [];
      this.currentPhase = "encounters";
    });
  }

  selectEncounter(encounter) {
    this.currentEncounters = [];

    switch (encounter.type) {
      case "market":
        this.selectMarketEncounter(encounter);
        break;
      case "monster":
        this.currentOptions = getRandomMonsters();
        this.currentPhase = "monsters";
        break;
      case "event":
        this.currentOptions = getRandomEvents();
        this.currentPhase = "events";
        break;
    }
  }

  buyItem(item) {
    const player = this.activePlayer;
    const ITEM_COST = 3; // Fixed cost for all items
    if (player && player.gold >= ITEM_COST) {
      player.gold -= ITEM_COST;
      // Add item to player's inventory (implement this later)
      // this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  startGame() {
    if (this.players.length > 0) {
      this.gameStarted = true;
      this.currentAge = 1;
      this.currentRound = 1;
      this.activePlayerIndex = 0;
      this.currentEncounters = [];
      this.currentOptions = [];
      this.currentPhase = "encounters";
      this.startTurn();
      // this.saveToLocalStorage();
    }
  }

  resetGame() {
    this.clearGameState();
  }

  // Getter for active player
  get activePlayer() {
    return this.players[this.activePlayerIndex];
  }

  // Add method to clear local storage and reset game state
  clearGameState() {
    this.players = [];
    this.activePlayerIndex = 0;
    this.currentRound = 1;
    this.currentAge = 1;
    this.currentEncounters = [];
    this.gameStarted = false;
    this.currentOptions = [];
    this.currentPhase = "encounters";
    this.currentMarketVariant = null;
    // localStorage.removeItem("bazaarGameState");
  }

  // Helper method to get random encounter of specific type
  getRandomEncounterOfType(type) {
    return getRandomEncounterOfType(type);
  }

  // Function to get items based on player's tier and market variant
  getMarketItems() {
    const player = this.activePlayer;
    if (!player || !this.currentMarketVariant) return [];

    let availableItems = items.filter(item => item.tier <= player.tier);

    switch (this.currentMarketVariant) {
      case "regular":
        break;
      case "water":
        availableItems = availableItems.filter(item => item.power?.water);
        break;
      case "fire":
        availableItems = availableItems.filter(item => item.power?.fire);
        break;
      case "earth":
        availableItems = availableItems.filter(item => item.power?.earth);
        break;
      case "air":
        availableItems = availableItems.filter(item => item.power?.air);
        break;
      case "water_fire":
        availableItems = availableItems.filter(item => item.power?.water || item.power?.fire);
        break;
      case "earth_water":
        availableItems = availableItems.filter(item => item.power?.earth || item.power?.water);
        break;
      case "earth_air":
        availableItems = availableItems.filter(item => item.power?.earth || item.power?.air);
      case "fire_earth":
        availableItems = availableItems.filter(item => item.power?.fire || item.power?.earth);
        break;
      case "water_air":
        availableItems = availableItems.filter(item => item.power?.water || item.power?.air);
        break;
      case "all_elements":
        // Keep all elemental items
        availableItems = availableItems.filter(item =>
          item.power?.water || item.power?.fire || item.power?.earth || item.power?.air
        );
        break;
      case "tier_3":
        availableItems = availableItems.filter(item => item.tier === 3);
        break;
      case "tier_4":
        availableItems = availableItems.filter(item => item.tier === 4);
        break;
      case "tier_5":
        availableItems = availableItems.filter(item => item.tier === 5);
        break;
    }

    return getRandomElements(availableItems, 3);
  }

  // Handle market encounter selection
  selectMarketEncounter(market) {
    runInAction(() => {
      this.currentMarketVariant = market.variant;
      this.currentOptions = this.getMarketItems();
      this.currentPhase = "market";
    });
  }

  // Handle item purchase
  purchaseItem(itemId) {
    const player = this.activePlayer;
    if (!player) return false;

    if (player.gold >= 3) {
      player.gold -= 3;
      player.inventory.push(itemId);
      this.currentOptions = this.currentOptions.filter(item => item.id !== itemId);
      return true;
    }
    return false;
  }

  // Handle market reroll
  rerollMarketItems() {
    runInAction(() => {
      const player = this.activePlayer;
      if (!player || player.gold < 1) return false;

      player.gold -= 1;
      this.currentOptions = this.getMarketItems();
      return true;
    });
  }

  // Update player tier when leveling up
  levelUp() {
    const player = this.activePlayer;
    if (!player) return;

    player.level += 1;
    // Update tier based on level
    if (player.level % 2 === 0) { // Every 2 levels, increase tier
      player.tier = Math.min(5, player.tier + 1); // Max tier is 5
    }
  }
}

export const bazaarStore = new BazaarStore();
export { PLAYER_COLORS };
