import { makeAutoObservable } from "mobx";
import { createAgeDeck } from "../app/engine/vampires/page";

class DraftStore {
  gameConfig = null;
  deck = [];
  centralBoard = [];
  discardPile = [];
  players = [];
  currentTurn = 1;
  activePlayerIndex = -1;
  draftingRound = 0;
  maxDraftingRounds = 1;
  isRefill = true;
  customDrawCount = 3;
  playerCount = 2;
  currentAge = 1;
  ageDecks = null;
  ageConfig = null;

  constructor() {
    makeAutoObservable(this);
  }

  setConfig(config) {
    if (!config) return;
    this.gameConfig = config;
    this.maxDraftingRounds = config.maxDraftingRounds || 1;
    this.isRefill = config.isRefill ?? true;
    this.customDrawCount = config.drawCount || 3;
    this.playerCount = config.playerCount || 2;

    if (config.multipleDecks) {
      this.ageDecks = config.ageDecks;
      this.ageConfig = config.ageConfig;
      this.currentAge = 1;
    }

    this.initializeGame();
  }

  initializeGame() {
    if (!this.gameConfig) return;

    this.deck = this.createInitialDeck();
    this.centralBoard = [];
    this.discardPile = [];
    this.currentTurn = 1;
    this.draftingRound = 0;
    this.initializePlayers();

    if (this.deck) {
      this.shuffleDeck();
      this.drawItems();
    }
  }

  initializePlayers() {
    this.players = Array.from({ length: this.playerCount }, (_, i) => ({
      id: i + 1,
      name: `Player ${i + 1}`,
      hand: [],
      clearHand: function () {
        const discarded = [...this.hand];
        this.hand = [];
        return discarded;
      },
      addToHand: function (item) {
        this.hand.push(item);
      },
    }));
  }

  createInitialDeck() {
    if (this.gameConfig.multiLayer) {
      const currentAgeConfig = this.gameConfig.ageConfig.find(
        (age) => age.age === this.currentAge
      );
      if (currentAgeConfig) {
        const ageLayerDecks =
          this.gameConfig[`age${this.currentAge}LayerDecks`];
        if (ageLayerDecks) {
          // Pass the current age as the last parameter
          return this.gameConfig.createDeckFunction(
            ageLayerDecks.layer1,
            ageLayerDecks.layer2,
            ageLayerDecks.layer3,
            currentAgeConfig.deckCount,
            this.currentAge // Add the age here
          );
        }
      }
      return [];
    } else if (this.gameConfig?.multipleDecks && this.gameConfig.ageDecks) {
      return [...(this.gameConfig.ageDecks[this.currentAge] || [])];
    }
    return [...(this.gameConfig.initialItems || [])];
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
    this.startDrafting();
  }

  startDrafting() {
    this.activePlayerIndex = 0;
    this.draftingRound = 0;
  }

  draftItem(itemIndex) {
    if (this.centralBoard.length === 0 || this.activePlayerIndex === -1) return;

    const activePlayer = this.players[this.activePlayerIndex];
    if (!activePlayer) return;

    const [draftedItem] = this.centralBoard.splice(itemIndex, 1);
    activePlayer.addToHand(draftedItem);

    if (this.isRefill) {
      this.refillCentralBoard();
    }

    const isLastPlayer = this.activePlayerIndex === this.players.length - 1;
    const isLastRound =
      this.draftingRound + (isLastPlayer ? 1 : 0) >= this.maxDraftingRounds;

    if (isLastPlayer && isLastRound) {
      this.activePlayerIndex = -1;
      this.draftingRound = this.maxDraftingRounds;
      return;
    }

    this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
    if (this.activePlayerIndex === 0) {
      this.draftingRound++;
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

  nextTurn() {
    this.players.forEach((player) => {
      this.discardPile.push(...player.clearHand());
    });
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
    if (this.gameConfig?.multipleDecks) {
      const nextAge = this.ageConfig.find(
        (age) => this.currentTurn === age.startTurn
      );

      if (nextAge) {
        this.transitionToNewAge(nextAge.age);
        return;
      }
    }

    const event = this.gameConfig.turnEvents?.find(
      (e) => e.turn === this.currentTurn
    );
    if (event) {
      this.addNewItems(event.newItems);
    }
  }

  transitionToNewAge(newAge) {
    this.currentAge = newAge;

    this.discardPile = [];
    this.centralBoard = [];
    this.players.forEach((player) => player.clearHand());

    this.deck = this.createInitialDeck();
    this.shuffleDeck();
    this.drawItems();
  }

  addNewItems(newItems) {
    this.deck.push(...newItems);
    this.shuffleDeck();
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

  setPlayerCount(count, colors) {
    if (!colors) return;

    this.playerCount = count;

    const existingSettings = this.players.map((p) => ({
      name: p.name,
      color: p.color,
      hand: p.hand || [],
    }));

    this.players = Array(count)
      .fill()
      .map((_, i) => ({
        id: i + 1,
        name: existingSettings[i]?.name || `Player ${i + 1}`,
        color:
          existingSettings[i]?.color ||
          Object.values(colors)[i % Object.keys(colors).length],
        hand: [],
        clearHand: function () {
          const discarded = [...this.hand];
          this.hand = [];
          return discarded;
        },
        addToHand: function (item) {
          this.hand.push(item);
        },
      }));

    this.initializeGame();
  }

  updatePlayerSettings(settings) {
    this.players = this.players.map((player, i) => ({
      ...player,
      name: settings[i].name,
      color: settings[i].color,
      hand: player.hand,
      clearHand: player.clearHand,
      addToHand: player.addToHand,
    }));
  }

  continueDrafting() {
    this.players.forEach((player) => {
      this.discardPile.push(...player.clearHand());
    });

    this.activePlayerIndex = 0;
    this.draftingRound = 0;
    this.currentTurn++;
    this.checkTurnEvents();
  }
}

export default new DraftStore();
