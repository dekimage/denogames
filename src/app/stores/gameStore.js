import { makeAutoObservable } from "mobx";
import { Player } from "../classes/Player";
import { Card, Die } from "../classes/Item";
import {
  gameTypes,
  simpleCardsConfig,
  simpleDiceConfig,
  diceCardsConfig,
  level3Config,
} from "../gameConfig";

class GameStore {
  gameConfig = simpleCardsConfig;
  deck = [];
  centralBoard = [];
  discardPile = [];
  players = [];
  currentTurn = 1;
  activePlayerIndex = -1;
  gameLevel = 1;
  isRefill = true;
  maxDraftingRounds = 1;
  draftingRound = 0;
  customDrawCount = 3;
  customNewItemsInterval = 3;
  customNewItemsCount = 2;
  marketplaceDeck = [];
  marketplaceDisplay = [];
  isMarketplaceActive = false;
  marketplacePurchasesThisTurn = 0;

  constructor() {
    makeAutoObservable(this);
    this.setGameType(gameTypes.SIMPLE_CARDS);
  }

  setGameLevel(level) {
    this.gameLevel = level;

    // Set a default game type based on the level
    let defaultGameType;
    if (level === 3) {
      defaultGameType = gameTypes.SIMPLE_CARDS;
      this.gameConfig = level3Config[defaultGameType];
    } else {
      defaultGameType = gameTypes.SIMPLE_CARDS;
      this.gameConfig = simpleCardsConfig;
    }

    this.setGameType(defaultGameType);
  }

  setPlayerCount(count) {
    this.players = Array(count)
      .fill()
      .map((_, i) => new Player(i + 1, `Player ${i + 1}`));
    this.initializeGame();
  }

  setGameType(type) {
    let newConfig;
    switch (type) {
      case gameTypes.SIMPLE_DICE:
        newConfig =
          this.gameLevel === 3
            ? level3Config[gameTypes.SIMPLE_DICE]
            : simpleDiceConfig;
        break;
      case gameTypes.SIMPLE_CARDS:
        newConfig =
          this.gameLevel === 3
            ? level3Config[gameTypes.SIMPLE_CARDS]
            : simpleCardsConfig;
        break;
      case gameTypes.DICE_CARDS:
        newConfig =
          this.gameLevel === 3
            ? level3Config[gameTypes.DICE_CARDS]
            : diceCardsConfig;
        break;
      default:
        throw new Error(`Unknown game type: ${type}`);
    }

    if (!newConfig) {
      console.error(
        `Invalid configuration for game type: ${type} and level: ${this.gameLevel}`
      );
      return;
    }

    this.gameConfig = newConfig;
    this.initializeGame();
  }

  initializeGame() {
    this.deck = this.createInitialDeck();
    this.centralBoard = [];
    this.discardPile = [];
    this.currentTurn = 1;
    this.activePlayerIndex = -1;
    this.draftingRound = 0;
    this.shuffleDeck();

    if (this.gameLevel === 2) {
      this.drawItems(); // This will also start the drafting process
    } else if (this.gameLevel === 3) {
      this.initializeLevel3Game();
    } else {
      this.drawItems();
    }

    this.players.forEach((player) => {
      player.hand = [];
    });
  }

  initializeLevel3Game() {
    if (this.players.length === 0) {
      console.error("No players initialized. Setting default player count.");
      this.setPlayerCount(2);
      this.initializeGame();
      return;
    }

    this.players.forEach((player) => {
      player.personalDeck = this.createInitialDeck();
      player.shufflePersonalDeck();
      player.personalDiscardPile = [];
      player.personalCentralBoard = [];
    });
    this.activePlayerIndex = 0;
    this.initializeMarketplace();
    this.startPlayerTurn();
  }

  initializeMarketplace() {
    this.marketplaceDeck = [...this.gameConfig.marketplaceItems];
    this.shuffleArray(this.marketplaceDeck);
    this.marketplaceDisplay = this.drawFromMarketplaceDeck(
      this.gameConfig.marketplaceDisplaySize
    );
    this.marketplacePurchasesThisTurn = 0;
  }

  drawFromMarketplaceDeck(count) {
    return this.marketplaceDeck.splice(0, count);
  }

  refillMarketplaceDisplay() {
    const missingCount =
      this.gameConfig.marketplaceDisplaySize - this.marketplaceDisplay.length;
    if (missingCount > 0) {
      const newItems = this.drawFromMarketplaceDeck(missingCount);
      this.marketplaceDisplay.push(...newItems);
    }
  }

  selectMarketplaceItem(index) {
    if (
      index >= 0 &&
      index < this.marketplaceDisplay.length &&
      this.marketplacePurchasesThisTurn <
        this.gameConfig.maxMarketplacePurchases
    ) {
      const selectedItem = this.marketplaceDisplay.splice(index, 1)[0];
      const activePlayer = this.players[this.activePlayerIndex];
      activePlayer.addMarketplaceItemToDiscardPile(selectedItem);
      this.refillMarketplaceDisplay();
      this.marketplacePurchasesThisTurn++;

      if (
        this.marketplacePurchasesThisTurn >=
        this.gameConfig.maxMarketplacePurchases
      ) {
        this.moveToNextPlayer();
      }
    }
  }

  nextTurn() {
    if (this.gameLevel === 3) {
      if (this.isMarketplaceActive) {
        // If in marketplace phase, move to next player
        this.moveToNextPlayer();
      } else {
        this.discardActivePlayerCards();
        if (this.isMarketplaceEmpty()) {
          this.moveToNextPlayer();
        } else {
          this.isMarketplaceActive = true;
          this.marketplacePurchasesThisTurn = 0;
        }
      }
    } else {
      this.nextTurnLevelOther();
    }
  }

  discardActivePlayerCards() {
    const activePlayer = this.players[this.activePlayerIndex];
    activePlayer.discardCentralBoard();
  }

  isMarketplaceEmpty() {
    return (
      this.marketplaceDisplay.length === 0 && this.marketplaceDeck.length === 0
    );
  }

  moveToNextPlayer() {
    this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
    if (this.activePlayerIndex === 0) {
      this.currentTurn++;
    }
    this.isMarketplaceActive = false;
    this.marketplacePurchasesThisTurn = 0;
    this.startPlayerTurn();
  }

  createInitialDeck() {
    const items =
      this.gameLevel === 3
        ? this.gameConfig.playerStartingDeck
        : this.gameConfig.initialItems;

    if (!items || !Array.isArray(items)) {
      console.error("Invalid or missing items configuration");
      return [];
    }

    return items.map((item) => {
      if (item instanceof Card || item instanceof Die) {
        return item;
      }
      return this.gameConfig.itemType === "die"
        ? new Die(item.id, item.sides, item.color)
        : new Card(item.id, item.value, item.color);
    });
  }

  shuffleDeck() {
    this.deck = this.shuffleArray([...this.deck]);
  }

  drawItems() {
    if (this.gameLevel === 3) {
      this.drawItemsLevel3();
    } else {
      this.drawItemsLevelOther();
    }
  }

  drawItemsLevel3() {
    if (this.activePlayerIndex !== -1 && this.players[this.activePlayerIndex]) {
      const activePlayer = this.players[this.activePlayerIndex];
      const drawnItems = activePlayer.drawItems(this.gameConfig.drawCount);

      if (Array.isArray(drawnItems)) {
        drawnItems.forEach((item) => {
          if (item.type === "die") {
            item.roll();
          }
        });
      } else {
        console.error("drawItems did not return an array as expected");
      }
    }
  }

  drawItemsLevelOther() {
    const count = this.customDrawCount;
    let drawnItems = [];

    for (let i = 0; i < count; i++) {
      if (this.deck.length === 0) {
        this.reshuffleDiscardPile();
        if (this.deck.length === 0) break;
      }
      const item = this.deck.pop();
      if (item.type === "die") {
        item.roll();
      }
      drawnItems.push(item);
    }

    this.centralBoard.push(...drawnItems);

    if (this.gameLevel === 2) {
      this.startDrafting();
    }
  }

  startPlayerTurn() {
    if (this.players.length === 0) {
      console.error("No players in the game.");
      return;
    }

    if (
      this.activePlayerIndex < 0 ||
      this.activePlayerIndex >= this.players.length
    ) {
      console.error("Invalid active player index.");
      this.activePlayerIndex = 0; // Reset to the first player
    }

    const activePlayer = this.players[this.activePlayerIndex];
    if (!activePlayer) {
      console.error("Active player is undefined.");
      return;
    }

    const drawnItems = activePlayer.drawItems(this.gameConfig.drawCount);
    drawnItems.forEach((item) => {
      if (item.type === "die") {
        item.roll();
      }
    });
  }

  nextTurnLevel3() {
    if (this.activePlayerIndex !== -1 && this.players[this.activePlayerIndex]) {
      const activePlayer = this.players[this.activePlayerIndex];
      activePlayer.discardCentralBoard();
      this.activePlayerIndex =
        (this.activePlayerIndex + 1) % this.players.length;
      if (this.activePlayerIndex === 0) {
        this.currentTurn++;
      }
      this.startPlayerTurn();
    }
  }

  nextTurnLevelOther() {
    if (this.gameLevel === 2) {
      this.players.forEach((player) => {
        this.discardPile.push(...player.clearHand());
      });
    }
    this.discardPile.push(...this.centralBoard);
    this.centralBoard = [];
    this.currentTurn++;
    this.checkTurnEvents();
    this.drawItems();
  }

  restartGame() {
    this.initializeGame();
  }

  startDrafting() {
    this.activePlayerIndex = 0;
    this.draftingRound = 0;
  }

  draftItem(itemIndex) {
    if (
      this.gameLevel !== 2 ||
      this.centralBoard.length === 0 ||
      this.activePlayerIndex === -1
    )
      return;

    const activePlayer = this.players[this.activePlayerIndex];
    if (!activePlayer) return;

    const [draftedItem] = this.centralBoard.splice(itemIndex, 1);
    activePlayer.addToHand(draftedItem);

    if (this.isRefill) {
      this.refillCentralBoard();
    }

    this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
    if (this.activePlayerIndex === 0) {
      this.draftingRound++;
    }

    if (
      this.draftingRound >= this.maxDraftingRounds ||
      this.centralBoard.length === 0
    ) {
      this.endDrafting();
    }
  }

  refillCentralBoard() {
    if (this.deck.length === 0) {
      this.reshuffleDiscardPile();
    }

    if (this.deck.length > 0) {
      const newItem = this.deck.pop();
      if (newItem.type === "die") {
        newItem.roll();
      }
      this.centralBoard.push(newItem);
    }
  }

  endDrafting() {
    this.activePlayerIndex = -1;
    this.draftingRound = 0;
  }

  checkTurnEvents() {
    const event = this.gameConfig.turnEvents.find(
      (e) => e.turn === this.currentTurn
    );
    if (event) {
      this.addNewItems(event.newItems);
    }
  }

  addNewItems(newItems) {
    const createdItems = newItems.map((item) =>
      this.gameConfig.itemType === "die"
        ? new Die(item.id, item.sides, item.color)
        : new Card(item.id, item.value, item.color)
    );
    this.deck.push(...createdItems);
    this.shuffleDeck();
  }

  reshuffleDiscardPile() {
    this.deck = this.shuffleArray([...this.discardPile]);
    this.discardPile = [];
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  setTestConfiguration(config) {
    this.gameConfig = { ...config };
    this.initializeGame();
  }

  setIsRefill(value) {
    this.isRefill = value;
  }

  setMaxDraftingRounds(value) {
    this.maxDraftingRounds = value;
    this.draftingRound = 0;
  }

  setCustomDrawCount(count) {
    this.customDrawCount = count;
  }

  setCustomNewItemsInterval(interval) {
    this.customNewItemsInterval = interval;
  }

  setCustomNewItemsCount(count) {
    this.customNewItemsCount = count;
  }

  setMaxMarketplacePurchases(max) {
    this.gameConfig.maxMarketplacePurchases = max;
  }
}

export default new GameStore();
