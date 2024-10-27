import { makeAutoObservable } from "mobx";

import {
  diceCardsConfig,
  gameTypes,
  simpleCardsConfig,
  simpleDiceConfig,
} from "../gameConfig";

class GameStore {
  gameConfig = simpleCardsConfig;
  items = [];
  centralBoard = [];
  discardPile = [];
  currentTurn = 1;
  customDrawCount = 3;
  customNewItemsInterval = 3;
  customNewItemsCount = 2;
  gameLevel = 1;
  players = [];
  activePlayerIndex = 0;
  draftingRound = 0;
  maxDraftingRounds = 1;
  isRefill = true;

  constructor() {
    makeAutoObservable(this);
    this.setGameType(gameTypes.SIMPLE_CARDS);
  }

  setGameLevel(level) {
    this.gameLevel = level;
    this.initializeGame();
  }

  setPlayerCount(count) {
    this.players = Array(count)
      .fill()
      .map((_, i) => ({
        id: i + 1,
        name: `Player ${i + 1}`,
        hand: [],
      }));
    this.initializeGame();
  }

  setGameType(type) {
    switch (type) {
      case gameTypes.SIMPLE_DICE:
        this.gameConfig = simpleDiceConfig;
        break;
      case gameTypes.SIMPLE_CARDS:
        this.gameConfig = simpleCardsConfig;
        break;
      case gameTypes.DICE_CARDS:
        this.gameConfig = diceCardsConfig;
        break;
      default:
        throw new Error(`Unknown game type: ${type}`);
    }
    this.initializeGame();
  }

  initializeGame() {
    this.items = [...this.gameConfig.initialItems];
    this.currentTurn = 1;
    this.centralBoard = [];
    this.discardPile = [];
    this.shuffleItems();
    this.activePlayerIndex = 0;
    this.draftingRound = 0;
    this.players.forEach((player) => (player.hand = []));
  }

  shuffleItems() {
    this.items = this.shuffleArray([...this.items]);
  }

  drawItems() {
    const count = this.gameConfig.drawCount;
    let drawnItems = [];
    let remainingCount = count;

    while (
      remainingCount > 0 &&
      (this.items.length > 0 || this.discardPile.length > 0)
    ) {
      if (this.items.length === 0) {
        this.reshuffleDiscardPile();
        if (this.items.length === 0) break;
      }
      const itemsToDraw = Math.min(remainingCount, this.items.length);
      const newItems = this.items.splice(0, itemsToDraw);
      drawnItems = [...drawnItems, ...newItems];
      remainingCount -= itemsToDraw;
    }

    if (this.gameConfig.itemType === "die") {
      drawnItems = drawnItems.map((item) => ({
        ...item,
        value: item.sides[Math.floor(Math.random() * item.sides.length)],
      }));
    }

    this.centralBoard = [...this.centralBoard, ...drawnItems];
    if (this.gameLevel === 2) {
      this.startDrafting();
    }
  }

  startDrafting() {
    this.activePlayerIndex = 0;
    this.draftingRound = 0;
  }

  draftItem(itemIndex) {
    if (this.gameLevel !== 2 || this.centralBoard.length === 0) return;

    const activePlayer = this.players[this.activePlayerIndex];
    const [draftedItem] = this.centralBoard.splice(itemIndex, 1);
    activePlayer.hand.push(draftedItem);

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
    if (this.items.length === 0) {
      this.reshuffleDiscardPile();
    }

    if (this.items.length > 0) {
      let newItem = this.items.pop();

      // If the item is a die, roll it
      if (this.gameConfig.itemType === "die") {
        newItem = {
          ...newItem,
          value:
            newItem.sides[Math.floor(Math.random() * newItem.sides.length)],
        };
      }

      this.centralBoard.push(newItem);
    }
  }

  endDrafting() {
    this.activePlayerIndex = -1;
    this.draftingRound = 0;
  }

  nextTurn() {
    if (this.gameLevel === 2) {
      this.players.forEach((player) => {
        this.discardPile.push(...player.hand);
        player.hand = [];
      });
    }
    this.discardPile = [...this.discardPile, ...this.centralBoard];
    this.centralBoard = [];
    this.currentTurn++;
    this.checkTurnEvents();
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
    this.items = [...this.items, ...newItems];
    this.shuffleItems();
  }

  restartGame() {
    this.initializeGame();
  }

  reshuffleDiscardPile() {
    this.items = this.discardPile.sort(() => Math.random() - 0.5);
    this.discardPile = [];
  }

  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
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
    this.draftingRound = 0; // Reset the drafting round when changing this value
  }
}

export default new GameStore(); // Create and export a single instance
