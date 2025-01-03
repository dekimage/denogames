import { makeAutoObservable } from "mobx";
import { Card, Die } from "../classes/Item";

class Player {
  id;
  name;
  color;
  personalDeck = [];
  personalDiscardPile = [];
  personalCentralBoard = [];

  constructor(id, name, color) {
    this.id = id;
    this.name = name;
    this.color = color;
    makeAutoObservable(this);
  }

  drawCards(count) {
    const drawnCards = [];
    for (let i = 0; i < count; i++) {
      if (this.personalDeck.length === 0) {
        this.reshuffleDiscardPile();
        if (this.personalDeck.length === 0) break;
      }
      const card = this.personalDeck.pop();
      if (card.type === "die") {
        card.roll();
      }
      drawnCards.push(card);
    }
    this.personalCentralBoard.push(...drawnCards);
  }

  reshuffleDiscardPile() {
    this.personalDeck = this.shuffleArray([...this.personalDiscardPile]);
    this.personalDiscardPile = [];
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  upgradeItem(itemId) {
    const locations = [
      this.personalDeck,
      this.personalCentralBoard,
      this.personalDiscardPile,
    ];

    for (const location of locations) {
      const itemIndex = location.findIndex((item) => item.id === itemId);
      if (itemIndex !== -1) {
        const item = location[itemIndex];
        if (item.type === "die") {
          item.sides = item.sides.map((side) => side + 1);
        } else {
          item.value += 1;
        }
        break;
      }
    }
  }
}

class DeckBuilderStore {
  gameConfig = null;
  players = [];
  currentTurn = 1;
  activePlayerIndex = -1;
  playerCount = 2;
  marketplaceDeck = [];
  marketplaceDisplay = [];
  isMarketplaceActive = false;
  marketplacePurchasesThisTurn = 0;
  maxMarketplacePurchases = 1;
  isChoicePhaseActive = false;
  isUpgradePhaseActive = false;
  upgradeVirtualView = [];
  selectedUpgradeItem = null;

  constructor() {
    makeAutoObservable(this);
  }

  setConfig(config) {
    if (!config) return;
    this.gameConfig = config;
    this.maxMarketplacePurchases = config.maxMarketplacePurchases || 1;
    this.playerCount = config.playerCount || 2;
    this.initializeGame();
  }

  setPlayerCount(count, colors) {
    if (!colors) return;

    this.playerCount = count;

    const existingSettings = this.players.map((p) => ({
      name: p.name,
      color: p.color,
    }));

    this.players = Array.from(
      { length: count },
      (_, i) =>
        new Player(
          i + 1,
          existingSettings[i]?.name || `Player ${i + 1}`,
          existingSettings[i]?.color ||
            Object.values(colors)[i % Object.keys(colors).length]
        )
    );

    this.initializeGame();
  }

  updatePlayerSettings(settings) {
    this.players = this.players.map((player, i) => {
      player.name = settings[i].name;
      player.color = settings[i].color;
      return player;
    });
  }

  initializeGame() {
    if (!this.gameConfig) return;

    this.currentTurn = 1;
    this.activePlayerIndex = -1;
    this.isChoicePhaseActive = false;
    this.isMarketplaceActive = false;
    this.isUpgradePhaseActive = false;
    this.upgradeVirtualView = [];
    this.selectedUpgradeItem = null;
    this.marketplacePurchasesThisTurn = 0;

    this.initializePlayers();
    this.initializeMarketplace();
    this.startPlayerTurn();
  }

  initializePlayers() {
    const existingSettings = this.players.map((p) => ({
      name: p.name,
      color: p.color,
    }));

    this.players = Array.from(
      { length: this.playerCount },
      (_, i) =>
        new Player(
          i + 1,
          existingSettings[i]?.name || `Player ${i + 1}`,
          existingSettings[i]?.color || "#3B82F6"
        )
    );

    this.players.forEach((player, playerIndex) => {
      player.personalDeck = this.gameConfig.playerStartingDeck.map((item) => {
        const uniqueId = `p${playerIndex + 1}_${item.id}`;
        if (item.type === "die") {
          return new Die(uniqueId, [...item.sides], item.color);
        } else {
          return new Card(uniqueId, item.value, item.color);
        }
      });
      player.shuffleArray(player.personalDeck);
    });
  }

  initializeMarketplace() {
    this.marketplaceDeck = this.gameConfig.marketplaceItems.map((item) => {
      const uniqueId = `m_${item.id}`;
      if (item.type === "die") {
        return new Die(uniqueId, [...item.sides], item.color);
      } else {
        return new Card(uniqueId, item.value, item.color);
      }
    });
    this.shuffleArray(this.marketplaceDeck);
    this.refillMarketplace();
  }

  refillMarketplace() {
    while (
      this.marketplaceDisplay.length < this.gameConfig.marketplaceDisplaySize &&
      this.marketplaceDeck.length > 0
    ) {
      this.marketplaceDisplay.push(this.marketplaceDeck.pop());
    }
  }

  startPlayerTurn() {
    this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
    if (this.activePlayerIndex === 0) {
      this.currentTurn++;
    }

    const activePlayer = this.players[this.activePlayerIndex];
    activePlayer.drawCards(this.gameConfig.drawCount);
    this.marketplacePurchasesThisTurn = 0;
    this.isChoicePhaseActive = true;
  }

  chooseAction(action) {
    this.isChoicePhaseActive = false;
    if (action === "upgrade") {
      this.startUpgradePhase();
    } else if (action === "marketplace") {
      this.isMarketplaceActive = true;
    }
  }

  startUpgradePhase() {
    this.isUpgradePhaseActive = true;
    const activePlayer = this.players[this.activePlayerIndex];
    this.upgradeVirtualView = [
      ...activePlayer.personalDeck,
      ...activePlayer.personalCentralBoard,
      ...activePlayer.personalDiscardPile,
    ];
  }

  purchaseMarketplaceItem(index) {
    if (
      this.marketplacePurchasesThisTurn >= this.maxMarketplacePurchases ||
      index >= this.marketplaceDisplay.length
    )
      return;

    const activePlayer = this.players[this.activePlayerIndex];
    const [purchasedItem] = this.marketplaceDisplay.splice(index, 1);
    activePlayer.personalDiscardPile.push(purchasedItem);
    this.marketplacePurchasesThisTurn++;
    this.refillMarketplace();

    if (this.marketplacePurchasesThisTurn >= this.maxMarketplacePurchases) {
      this.endTurn();
    }
  }

  selectUpgradeItem(item) {
    this.selectedUpgradeItem = item;
    const activePlayer = this.players[this.activePlayerIndex];
    activePlayer.upgradeItem(item.id);
    this.endTurn();
  }

  endTurn() {
    const activePlayer = this.players[this.activePlayerIndex];
    activePlayer.personalDiscardPile.push(...activePlayer.personalCentralBoard);
    activePlayer.personalCentralBoard = [];

    this.isMarketplaceActive = false;
    this.isUpgradePhaseActive = false;
    this.isChoicePhaseActive = false;
    this.upgradeVirtualView = [];
    this.selectedUpgradeItem = null;

    this.startPlayerTurn();
  }

  nextTurn() {
    this.endTurn();
  }

  restartGame() {
    this.initializeGame();
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  backToChoicePhase() {
    this.isUpgradePhaseActive = false;
    this.isMarketplaceActive = false;
    this.isChoicePhaseActive = true;
    this.upgradeVirtualView = [];
    this.selectedUpgradeItem = null;
  }

  cancelMarketplace() {
    this.isMarketplaceActive = false;
    this.isChoicePhaseActive = true;
  }

  upgradeItem(itemId) {
    const activePlayer = this.players[this.activePlayerIndex];
    const locations = [
      activePlayer.personalDeck,
      activePlayer.personalCentralBoard,
      activePlayer.personalDiscardPile,
    ];

    for (const location of locations) {
      const itemIndex = location.findIndex((item) => item.id === itemId);
      if (itemIndex !== -1) {
        const item = location[itemIndex];
        if (item.type === "die") {
          const currentConfig = this.findDiceConfig(item.sides);
          const nextConfig = this.getNextDiceConfig(currentConfig);
          if (nextConfig) {
            item.sides = [...nextConfig.sides];
          }
        } else {
          const nextValue = this.getNextCardValue(item.value);
          if (nextValue) {
            item.value = nextValue;
          }
        }
        break;
      }
    }
  }

  findDiceConfig(sides) {
    const { diceConfigs } = this.gameConfig;
    return Object.values(diceConfigs).find(
      (config) => JSON.stringify(config.sides) === JSON.stringify(sides)
    );
  }

  getNextDiceConfig(currentConfig) {
    const { diceConfigs } = this.gameConfig;
    const configs = Object.values(diceConfigs);
    const currentIndex = configs.indexOf(currentConfig);
    return configs[currentIndex + 1];
  }

  getNextCardValue(currentValue) {
    const { cardUpgradePaths } = this.gameConfig;
    return cardUpgradePaths[currentValue] || currentValue + 1;
  }
}

const deckBuilderStore = new DeckBuilderStore();
export default deckBuilderStore;
