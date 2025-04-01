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

  isEventTriggered = false;
  eventCard = null;

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
    this.isEventTriggered = false;
    this.eventCard = null;

    this.shuffleDeck();
  }
  drawCard() {
    console.log("Drawing card...");
    if (!this.canDraw) {
      console.log("Can't draw card");
      return;
    }

    if (this.deck.length === 0) {
      console.log("Reshuffling discard pile");
      this.reshuffleDiscardPile();
    }

    const card = this.deck.pop();
    console.log("Card drawn:", card);
    this.centralBoard.push(card);

    // Check for event card first
    if (card.type === "event") {
      console.log("EVENT CARD DETECTED:", card);
      this.isEventTriggered = true;
      this.eventCard = card;
      console.log("isEventTriggered set to:", this.isEventTriggered);
      return;
    }

    // Existing boom card logic
    if (card.type === "boom" && this.centralBoard.length > 1) {
      console.log("BOOM CARD DETECTED");
      this.isExploding = true;
      return;
    }

    // Existing action logic
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

  handleEventCard = () => {
    console.log("Handling event card...");
    this.isEventTriggered = false;

    // Find and remove the event card from centralBoard and add to discardPile
    if (this.eventCard) {
      console.log("Event card exists:", this.eventCard);
      const eventIndex = this.centralBoard.findIndex(
        (card) => card.id === this.eventCard.id
      );
      console.log("Event card index in centralBoard:", eventIndex);

      if (eventIndex !== -1) {
        const [removedCard] = this.centralBoard.splice(eventIndex, 1);
        console.log("Removed card:", removedCard);
        this.discardPile.push(removedCard);
        console.log("Card added to discard pile");
      }
      this.eventCard = null;
      console.log("Event card reference cleared");
    }
  };

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
