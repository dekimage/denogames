import { makeAutoObservable } from "mobx";
import { Card, Die } from "../classes/Item";

class FlipStore {
  gameConfig = null;
  deck = [];
  centralBoard = [];
  discardPile = [];
  currentTurn = 1;
  customDrawCount = 3;

  constructor() {
    makeAutoObservable(this);
  }

  setConfig(config) {
    if (!config) return;
    this.gameConfig = config;
    this.initializeGame();
  }

  initializeGame() {
    if (!this.gameConfig) return;

    this.deck = this.createInitialDeck();
    this.centralBoard = [];
    this.discardPile = [];
    this.currentTurn = 1;

    if (this.deck) {
      this.shuffleDeck();
      this.drawItems();
    }
  }

  createInitialDeck() {
    if (
      !this.gameConfig?.initialItems ||
      !Array.isArray(this.gameConfig.initialItems)
    ) {
      console.error("Invalid or missing items configuration");
      return [];
    }

    return this.gameConfig.initialItems.map((item) => {
      if (item instanceof Card || item instanceof Die) {
        return item;
      }
      return this.gameConfig.itemType === "die"
        ? new Die(item.id, item.sides, item.color)
        : new Card(item.id, item.value, item.color);
    });
  }

  drawItems() {
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
  }

  nextTurn() {
    this.discardPile.push(...this.centralBoard);
    this.centralBoard = [];
    this.currentTurn++;
    this.checkTurnEvents();
    this.drawItems();
  }

  restartGame() {
    this.initializeGame();
  }

  checkTurnEvents() {
    const event = this.gameConfig.turnEvents?.find(
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

  shuffleDeck() {
    this.deck = this.shuffleArray([...this.deck]);
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

const flipStore = new FlipStore();
export default flipStore;
