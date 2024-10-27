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

  constructor() {
    makeAutoObservable(this);
    this.setGameType(gameTypes.SIMPLE_CARDS);
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
  }

  nextTurn() {
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
    this.items = this.shuffleArray([...this.discardPile]);
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
}

export default new GameStore(); // Create and export a single instance
