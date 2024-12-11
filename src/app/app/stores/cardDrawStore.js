import { makeAutoObservable } from "mobx";

class CardDrawStore {
  gameConfig = null;
  activePlayer = null;
  player1Combinations = new Set();
  player2Combinations = new Set();
  activeCards = [];
  rows = 3;
  cols = 3;
  cardsToDraw = 3;
  gameState = "initial"; // 'initial', 'playing'
  extraActiveCards = new Set();

  constructor() {
    makeAutoObservable(this);
  }

  setConfig(config) {
    this.gameConfig = config;
    this.rows = config.rows || 3;
    this.cols = config.cols || 4;
    this.cardsToDraw = config.cardsToDraw || 3;
    this.initializeGame();
  }

  get totalCards() {
    return this.rows * this.cols;
  }

  initializeGame() {
    this.activePlayer = null;
    this.player1Combinations.clear();
    this.player2Combinations.clear();
    this.activeCards = [];
    this.gameState = "initial";
  }

  handleButtonClick() {
    if (this.gameState === "initial") {
      this.startGame();
    } else {
      this.endTurn();
    }
  }

  startGame() {
    this.gameState = "playing";
    this.activePlayer = Math.random() < 0.5 ? 1 : 2;
    this.drawNewCards();
  }

  getCombinationKey(cards) {
    return cards.sort((a, b) => a - b).join(",");
  }

  getAllPossibleCombinations() {
    const combinations = [];
    const generateCombination = (current, start, remaining) => {
      if (remaining === 0) {
        combinations.push([...current]);
        return;
      }

      for (let i = start; i <= this.totalCards - remaining + 1; i++) {
        current.push(i);
        generateCombination(current, i + 1, remaining - 1);
        current.pop();
      }
    };

    generateCombination([], 1, this.cardsToDraw);
    return combinations;
  }

  drawNewCards() {
    const currentCombinations =
      this.activePlayer === 1
        ? this.player1Combinations
        : this.player2Combinations;

    const allCombinations = this.getAllPossibleCombinations();
    const availableCombinations = allCombinations.filter(
      (combo) => !currentCombinations.has(this.getCombinationKey(combo))
    );

    if (availableCombinations.length === 0) {
      // All combinations used, reset for this player
      currentCombinations.clear();
      this.drawNewCards();
      return;
    }

    const randomIndex = Math.floor(
      Math.random() * availableCombinations.length
    );
    const selectedCombo = availableCombinations[randomIndex];

    const comboKey = this.getCombinationKey(selectedCombo);
    currentCombinations.add(comboKey);
    this.activeCards = selectedCombo;
  }

  drawExtraCard() {
    const availableCards = Array.from(
      { length: this.totalCards },
      (_, i) => i + 1
    ).filter(
      (num) =>
        !this.activeCards.includes(num) && !this.extraActiveCards.has(num)
    );

    if (availableCards.length === 0) return;

    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const selectedCard = availableCards[randomIndex];

    this.extraActiveCards.add(selectedCard);
  }

  endTurn() {
    this.activePlayer = this.activePlayer === 1 ? 2 : 1;
    this.extraActiveCards.clear();
    this.drawNewCards();
  }
}

const cardDrawStore = new CardDrawStore();
export default cardDrawStore;
