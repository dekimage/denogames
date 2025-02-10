import { makeAutoObservable } from "mobx";
import {
  getRandomEncounters,
  getRandomItems,
  getRandomMonsters,
  getRandomEvents,
} from "./bazaarDB";

const DEFAULT_PLAYER_STATE = {
  name: "",
  color: "",
  gold: 6, // Updated starting gold
  income: 1,
  xp: 0,
  level: 1,
  relics: [],
  upgrades: [],
};

const PLAYER_COLORS = [
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#FFA500", // Orange
  "#800080", // Purple
  "#008000", // Dark Green
  "#000080", // Navy
  "#800000", // Maroon
  "#808080", // Gray
];

class BazaarStore {
  players = [];
  activePlayerIndex = 0;
  currentRound = 1;
  currentEncounters = [];
  gameStarted = false;
  currentOptions = []; // For items/monsters/events based on encounter choice
  currentPhase = "encounters"; // encounters, items, monsters, or events

  constructor() {
    makeAutoObservable(this);
    this.loadFromLocalStorage();
  }

  // Player Management
  addPlayer(name, color) {
    if (this.players.length >= 4) return false;
    if (this.players.some((p) => p.color === color)) return false;

    this.players.push({
      ...DEFAULT_PLAYER_STATE,
      name,
      color,
    });
    this.saveToLocalStorage();
    return true;
  }

  removePlayer(index) {
    this.players.splice(index, 1);
    this.saveToLocalStorage();
  }

  // Turn Management
  startTurn() {
    // Give player their income at start of turn
    const player = this.activePlayer;
    if (player) {
      player.gold += player.income;
      this.currentPhase = "encounters";
      this.drawNewEncounters();
    }
  }

  nextTurn() {
    this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
    if (this.activePlayerIndex === 0) {
      this.currentRound++;
    }
    this.startTurn();
    this.saveToLocalStorage();
  }

  // Encounter Management
  drawNewEncounters() {
    this.currentEncounters = getRandomEncounters();
    this.currentOptions = [];
    this.currentPhase = "encounters";
  }

  selectEncounter(encounter) {
    switch (encounter.type) {
      case "vendor":
        this.currentOptions = getRandomItems();
        this.currentPhase = "items";
        break;
      case "monster":
        this.currentOptions = getRandomMonsters();
        this.currentPhase = "monsters";
        break;
      case "event":
        this.currentOptions = getRandomEvents();
        this.currentPhase = "events";
        break;
    }
  }

  buyItem(item) {
    const player = this.activePlayer;
    if (player && player.gold >= item.cost) {
      player.gold -= item.cost;
      // Add item to player's inventory (implement this later)
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  // Local Storage
  saveToLocalStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "bazaarGameState",
        JSON.stringify({
          players: this.players,
          activePlayerIndex: this.activePlayerIndex,
          currentRound: this.currentRound,
          currentEncounters: this.currentEncounters,
        })
      );
    }
  }

  loadFromLocalStorage() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bazaarGameState");
      if (saved) {
        const state = JSON.parse(saved);
        this.players = state.players;
        this.activePlayerIndex = state.activePlayerIndex;
        this.currentRound = state.currentRound;
        this.currentEncounters = state.currentEncounters;
      }
    }
  }

  startGame() {
    if (this.players.length > 0) {
      this.gameStarted = true;
      this.drawNewEncounters();
      this.saveToLocalStorage();
    }
  }

  resetGame() {
    this.players = [];
    this.activePlayerIndex = 0;
    this.currentRound = 1;
    this.currentEncounters = [];
    this.gameStarted = false;
    localStorage.removeItem("bazaarGameState");
  }

  // Getter for active player
  get activePlayer() {
    return this.players[this.activePlayerIndex];
  }
}

export const bazaarStore = new BazaarStore();
export { PLAYER_COLORS };
