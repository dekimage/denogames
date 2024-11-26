import { makeAutoObservable } from "mobx";

class PushLuckStore {
  gameConfig = null;
  deck = [];
  centralBoard = [];
  discardPile = [];
  currentTurn = 1;
  actions = 1;
  isExploding = false;
  canDraw = true;
  selectedCards = new Map();
  availableColors = ["yellow", "red", "green", "blue", "purple"];
  isOtherPlayersPhase = false;
  currentColorIndex = 0;
  isSelectingMode = false;

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
    this.deck = [...this.gameConfig.initialItems];
    this.centralBoard = [];
    this.discardPile = [];
    this.currentTurn = 1;
    this.actions = 1;
    this.isExploding = false;
    this.canDraw = true;
    this.isSelectingMode = false;
    this.shuffleDeck();
  }

  drawCard() {
    if (!this.canDraw) return;

    if (this.deck.length === 0) {
      this.reshuffleDiscardPile();
    }

    const card = this.deck.pop();
    this.centralBoard.push(card);

    if (card.type === "boom" && this.centralBoard.length > 1) {
      this.isExploding = true;
      return;
    }

    const typeCount = this.centralBoard.filter(
      (c) => c.type === card.type
    ).length;
    if (typeCount >= 2) {
      this.actions++;
    }
  }

  toggleCardSelection(cardId) {
    if (!this.canSelectCard(cardId)) return;

    if (this.isOtherPlayersPhase) {
      this.handleOtherPlayerSelection(cardId);
    } else {
      this.handleMainPlayerSelection(cardId);
    }
  }

  canSelectCard(cardId) {
    if (!this.isSelectingMode && !this.isOtherPlayersPhase) {
      return false;
    }

    if (this.selectedCards.has(cardId)) {
      return true;
    }

    if (this.isSelectingMode && !this.isOtherPlayersPhase) {
      return this.actions > 0;
    }

    if (this.isOtherPlayersPhase) {
      return true;
    }

    return false;
  }

  handleMainPlayerSelection(cardId) {
    if (this.selectedCards.has(cardId)) {
      this.selectedCards.delete(cardId);
      this.actions++;
    } else if (this.actions > 0) {
      this.selectedCards.set(cardId, "main");
      this.actions--;
    }
  }

  handleOtherPlayerSelection(cardId) {
    if (this.selectedCards.has(cardId)) {
      const color = this.selectedCards.get(cardId);
      if (color !== "main") {
        this.selectedCards.delete(cardId);
        this.currentColorIndex = this.availableColors.indexOf(color);
      }
    } else {
      const currentColor = this.availableColors[this.currentColorIndex];
      this.selectedCards.set(cardId, currentColor);
      this.currentColorIndex =
        (this.currentColorIndex + 1) % this.availableColors.length;
    }
  }

  startOtherPlayersPhase() {
    this.isOtherPlayersPhase = true;
    this.isSelectingMode = false;
  }

  nextTurn() {
    this.discardPile.push(...this.centralBoard);
    this.centralBoard = [];
    this.currentTurn++;
    this.actions = 1;
    this.isExploding = false;
    this.canDraw = true;
    this.selectedCards.clear();
    this.isOtherPlayersPhase = false;
    this.isSelectingMode = false;
    this.currentColorIndex = 0;
  }

  diffuseBomb() {
    this.isExploding = false;
  }

  reshuffleDiscardPile() {
    if (this.discardPile.length === 0) return;
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

  restartGame() {
    this.initializeGame();
    this.isSelectingMode = false;
  }

  stopTurn() {
    this.canDraw = false;
    this.isSelectingMode = true;
  }
}

export default new PushLuckStore();
