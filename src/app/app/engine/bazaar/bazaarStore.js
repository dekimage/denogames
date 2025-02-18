import { makeAutoObservable, runInAction, computed } from "mobx";
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
  rerolls: 0, // Add this line
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
  isLevelUpModalOpen = false;
  levelUpRewards = [];
  newlyUnlockedTier = null;

  constructor() {
    makeAutoObservable(this, {
      activePlayer: computed,
    });
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
      const player = this.activePlayer;
      if (player) {
        player.xp += 1;
        this.showToast("Gained 1 XP for exploring! 📊");

        // Check for level up with new XP requirement
        if (player.xp >= this.getRequiredXPForLevel(player.level)) {
          this.triggerLevelUp();
          return;
        }
      }

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
    runInAction(() => {
      switch (encounter.type) {
        case "market":
          this.selectMarketEncounter(encounter);
          break;
        case "event":
          // Set the choices as current options
          this.currentOptions = encounter.choices;
          this.currentPhase = "events";
          break;
        case "monster":
          this.currentOptions = getRandomMonsters();
          this.currentPhase = "monsters";
          break;
      }
    });
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
    if (!this.players || this.activePlayerIndex >= this.players.length) {
      return null;
    }
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
      case "current_tier":
        availableItems = items.filter(item => item.tier === player.tier);
        break;
      case "duplicates":
        // Get items that player has at least one copy of
        const itemCounts = player.inventory.reduce((acc, id) => {
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {});

        availableItems = items.filter(item =>
          itemCounts[item.id] && itemCounts[item.id] < 3
        );

        // If we have less than 3 items, return all we have
        return availableItems.length <= 3
          ? availableItems
          : getRandomElements(availableItems, 3);
      case "triples":
        // Get items that player has exactly 2 copies of
        const itemCountsForTriples = player.inventory.reduce((acc, id) => {
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {});

        availableItems = items.filter(item =>
          itemCountsForTriples[item.id] === 2
        );

        // If we have less than 3 items eligible for triples, return all we have
        return availableItems.length <= 3
          ? availableItems
          : getRandomElements(availableItems, 3);
      default:
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
      if (!player) return false;

      // Check if player has rerolls first
      if (player.rerolls > 0) {
        player.rerolls -= 1;
        this.currentOptions = this.getMarketItems();
        this.showToast(`Used 1 reroll! ${player.rerolls} remaining 🎲`, 'info');
        return true;
      }

      // If no rerolls, use gold as before
      if (player.gold < 1) return false;

      player.gold -= 1;
      this.currentOptions = this.getMarketItems();
      this.showToast(`Spent 1 gold to reroll! 🪙`, 'info');
      return true;
    });
  }

  // Update player tier when leveling up
  levelUp() {
    const player = this.activePlayer;
    if (!player) return;

    player.level += 1;
    player.xp -= (player.level - 1) * 10; // Subtract the XP needed for this level

    // Update tier based on level
    if (player.level % 2 === 0) { // Every 2 levels, increase tier
      player.tier = Math.min(5, player.tier + 1); // Max tier is 5
    }
  }

  selectEventChoice(choice) {
    runInAction(() => {
      const player = this.activePlayer;
      if (!player || !choice.reward) return;

      const reward = choice.reward;
      let rewardMessage = '';

      switch (reward.type) {
        case 'gold':
          player.gold += reward.amount;
          rewardMessage = `Gained ${reward.amount} gold! 🪙`;
          break;

        case 'xp':
          player.xp += reward.amount;
          rewardMessage = `Gained ${reward.amount} XP! ⭐`;
          // Check for level ups
          while (player.xp >= (player.level * 10)) {
            this.levelUp();
            rewardMessage += ' LEVEL UP! 🎉';
          }
          break;

        case 'income':
          player.income += reward.amount;
          rewardMessage = `Income increased by ${reward.amount}! 💰`;
          break;

        case 'tier':
          if (player.tier < 5) { // Max tier is 5
            player.tier += reward.amount;
            rewardMessage = `Tier increased to ${player.tier}! 📈`;
          } else {
            rewardMessage = `Already at max tier! 🔝`;
          }
          break;

        case 'rerolls':
          player.rerolls += reward.amount;
          rewardMessage = `Gained ${reward.amount} rerolls! 🎲`;
          break;

        case 'influence':
          // These are handled outside the app
          rewardMessage = `Gained ${reward.element} influence! 🌟`;
          break;

        case 'symbol':
          // These are handled outside the app
          rewardMessage = `Gained ${reward.amount} symbol ${reward.symbolType}! 📜`;
          break;

        default:
          console.warn('Unknown reward type:', reward.type);
          break;
      }

      // Show toast notification
      if (rewardMessage) {
        this.showToast(rewardMessage, 'success');
      }

      // Clear the event and move to next turn
      this.currentOptions = [];
      this.currentPhase = "encounters";
      this.nextTurn();
    });
  }

  showToast(message, type = 'success') {
    runInAction(() => {
      this.toastMessage = message;
      this.toastType = type;
      // Auto-clear toast after 3 seconds
      setTimeout(() => {
        runInAction(() => {
          this.toastMessage = null;
          this.toastType = null;
        });
      }, 3000);
    });
  }

  incrementStat(stat) {
    runInAction(() => {
      const player = this.activePlayer;
      if (!player) return;

      switch (stat) {
        case "gold":
          player.gold += 1;
          this.showToast("Gold +1 🪙");
          break;
        case "income":
          player.income += 1;
          this.showToast("Income +1 💰");
          break;
        case "rerolls":
          player.rerolls += 1;
          this.showToast("Rerolls +1 🎲");
          break;
        case "level":
          player.level += 1;
          this.showToast("Level up! ⭐");
          break;
        case "xp":
          player.xp += 1;
          // Check for level up
          while (player.xp >= (player.level * 10)) {
            this.levelUp();
          }
          this.showToast("XP +1 📊");
          break;
        case "tier":
          if (player.tier < 5) {
            player.tier += 1;
            this.showToast("Tier up! 📈");
          } else {
            this.showToast("Max tier reached! 🔝", "warning");
          }
          break;
        default:
          console.warn('Unknown stat:', stat);
      }
    });
  }

  // New method to handle level up
  triggerLevelUp() {
    runInAction(() => {
      const player = this.activePlayer;
      if (!player) return;

      // Calculate new tier
      const newTier = Math.min(5, player.tier + 1);
      this.newlyUnlockedTier = newTier;

      // Generate level up rewards
      this.levelUpRewards = this.generateLevelUpRewards(newTier);

      // Open the modal
      this.isLevelUpModalOpen = true;
    });
  }

  generateLevelUpRewards(newTier) {
    const tierItem = this.getRandomItemOfTier(newTier);

    return [
      {
        id: 'tier_item',
        type: 'item',
        item: tierItem,
        displayText: tierItem ? `${tierItem.name} (Tier ${newTier})` : 'Random Tier Item',
        emoji: '🎁'
      },
      {
        id: 'xp_boost',
        type: 'xp',
        amount: 1,
        displayText: '+1 XP',
        emoji: '⭐'
      },
      {
        id: 'gold_boost',
        type: 'gold',
        amount: 4,
        displayText: '+4 Gold',
        emoji: '🪙'
      }
    ];
  }

  getRandomItemOfTier(tier) {
    const tierItems = items.filter(item => item.tier === tier);
    if (tierItems.length === 0) {
      console.warn(`No items found for tier ${tier}`);
      return null;
    }
    return tierItems[Math.floor(Math.random() * tierItems.length)];
  }

  selectLevelUpReward = (rewardId) => {
    runInAction(() => {
      const player = this.activePlayer;
      if (!player) {
        console.warn('No active player found');
        return;
      }

      const reward = this.levelUpRewards.find(r => r.id === rewardId);
      if (!reward) {
        console.warn('Invalid reward ID:', rewardId);
        return;
      }

      // Apply the reward
      switch (reward.type) {
        case 'item':
          if (reward.item) {
            player.inventory.push(reward.item.id);
            this.showToast(`Gained ${reward.item.name}! 🎁`);
          }
          break;
        case 'xp':
          player.xp += reward.amount;
          this.showToast(`Gained ${reward.amount} XP! ⭐`);
          break;
        case 'gold':
          player.gold += reward.amount;
          this.showToast(`Gained ${reward.amount} gold! 🪙`);
          break;
        default:
          console.warn('Unknown reward type:', reward.type);
          return;
      }

      // Complete the level up process
      const usedXP = this.getRequiredXPForLevel(player.level);
      player.level += 1;
      player.xp -= usedXP; // Subtract the XP needed for this level
      player.tier = this.newlyUnlockedTier;

      // Reset level up state
      this.isLevelUpModalOpen = false;
      this.levelUpRewards = [];
      this.newlyUnlockedTier = null;

      // Continue with next turn
      this.nextTurn();
    });
  }

  getRequiredXPForLevel(level) {
    // Starting at 5 XP, increasing by 2 each level
    return 3 + (level * 2);
  }
}

export const bazaarStore = new BazaarStore();
export { PLAYER_COLORS };
