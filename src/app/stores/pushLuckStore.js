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
  selectedIngredients = new Set();
  isRedCardsDisabled = false;

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
    let initialItems = [...this.gameConfig.initialItems];

    if (this.isRedCardsDisabled) {
      initialItems = initialItems.filter((card) => card.type !== "boom");
    }

    this.deck = initialItems;
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

    if (typeCount === 2 && this.actions < 4) {
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
    if (this.selectedCards.has(cardId)) {
      return true;
    }

    if (this.isOtherPlayersPhase) {
      return true;
    }

    if (this.actions > 0 || this.selectedCards.size === 0) {
      return true;
    }

    return false;
  }

  handleMainPlayerSelection(cardId) {
    const card = this.centralBoard.find((c) => c.id === cardId);

    if (this.selectedCards.has(cardId)) {
      this.selectedCards.delete(cardId);
      this.actions++;
      if (card.card === "resource") {
        this.selectedIngredients.delete(card.type.toLowerCase());
      }
    } else if (this.actions > 0) {
      this.selectedCards.set(cardId, "main");
      this.actions--;
      if (card.card === "resource") {
        this.selectedIngredients.add(card.type.toLowerCase());
      }
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
    this.selectedIngredients.clear();
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

  setCanDraw = (value) => {
    this.canDraw = value;
  };

  addAction = () => {
    this.actions += 1;
  };

  isIngredientSelected(type) {
    return Array.from(this.selectedIngredients).some(
      (ingredient) => ingredient.toLowerCase() === type.toLowerCase()
    );
  }

  toggleRedCards = () => {
    this.isRedCardsDisabled = !this.isRedCardsDisabled;
    this.restartGame();
  };
}

const pushLuckStore = new PushLuckStore();
export default pushLuckStore;
