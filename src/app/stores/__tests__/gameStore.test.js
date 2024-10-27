import GameStore from "../gameStore";
import { gameTypes } from "../../gameConfig";

function generateRandomConfig() {
  const initialDeckSize = Math.floor(Math.random() * (50 - 10 + 1)) + 10; // 10 to 50 cards
  return {
    initialItems: Array.from({ length: initialDeckSize }, (_, i) => ({
      id: i + 1,
      value: Math.floor(Math.random() * 10) + 1, // Random value between 1 and 10
      color: "#" + Math.floor(Math.random() * 16777215).toString(16), // Random color
    })),
    drawCount: Math.floor(Math.random() * 5) + 1, // 1 to 5 cards
    expansionInterval: Math.floor(Math.random() * 5) + 1, // Add cards every 1 to 5 turns
    expansionSize: Math.floor(Math.random() * 5) + 1, // Add 1 to 5 cards per expansion
    totalExpansions: Math.floor(Math.random() * 3) + 1, // 1 to 3 expansions
    itemType: "card", // Assuming we're testing card games
    turnEvents: [],
  };
}

describe("GameStore", () => {
  let gameStore;
  let config;

  beforeAll(() => {
    config = generateRandomConfig();
    console.log({
      initialDeckSize: config.initialItems.length,
      drawCount: config.drawCount,
      expansionInterval: config.expansionInterval,
      expansionSize: config.expansionSize,
      totalExpansions: config.totalExpansions,
    });
  });

  beforeEach(() => {
    gameStore = new GameStore();
    gameStore.setGameType(gameTypes.SIMPLE_CARDS);
    gameStore.setTestConfiguration(config);
  });

  function logGameState(turn = gameStore.currentTurn) {
    console.log({
      turn,
      deckSize: gameStore.items.length,
      centralBoardSize: gameStore.centralBoard.length,
      discardPileSize: gameStore.discardPile.length,
    });
  }

  test("initial state", () => {
    logGameState();
    expect(gameStore.items.length).toBe(config.initialItems.length);
    expect(gameStore.centralBoard.length).toBe(0);
    expect(gameStore.discardPile.length).toBe(0);
    expect(gameStore.currentTurn).toBe(1);
  });

  test("draw items", () => {
    gameStore.drawItems();
    logGameState();
    expect(gameStore.centralBoard.length).toBe(config.drawCount);
    expect(gameStore.items.length).toBe(
      config.initialItems.length - config.drawCount
    );
    expect(gameStore.discardPile.length).toBe(0);
  });

  test("next turn", () => {
    gameStore.drawItems();
    gameStore.nextTurn();
    gameStore.drawItems();
    logGameState();
    expect(gameStore.centralBoard.length).toBe(config.drawCount);
    expect(gameStore.discardPile.length).toBe(config.drawCount);
    expect(gameStore.currentTurn).toBe(2);
    expect(gameStore.items.length).toBe(
      config.initialItems.length - 2 * config.drawCount
    );
  });

  test("expansions added correctly", () => {
    const totalTurns = config.expansionInterval * config.totalExpansions + 1;
    for (let i = 0; i < totalTurns; i++) {
      gameStore.drawItems();
      gameStore.nextTurn();
      logGameState();
    }
    gameStore.drawItems();

    const expectedTotalCards =
      config.initialItems.length +
      config.expansionSize * config.totalExpansions;
    const totalCardsInPlay =
      gameStore.items.length +
      gameStore.centralBoard.length +
      gameStore.discardPile.length;

    logGameState();
    expect(totalCardsInPlay).toBe(expectedTotalCards);
    expect(gameStore.currentTurn).toBe(totalTurns + 1);
    expect(gameStore.centralBoard.length).toBe(config.drawCount);
  });

  test("full game cycle", () => {
    const totalCards =
      config.initialItems.length +
      config.expansionSize * config.totalExpansions;
    const cycleCount = Math.ceil(totalCards / config.drawCount);

    for (let i = 0; i < cycleCount; i++) {
      gameStore.drawItems();
      gameStore.nextTurn();
      logGameState();
    }
    gameStore.drawItems();

    const totalCardsInPlay =
      gameStore.items.length +
      gameStore.centralBoard.length +
      gameStore.discardPile.length;

    logGameState();
    expect(totalCardsInPlay).toBe(totalCards);
    expect(gameStore.centralBoard.length).toBe(config.drawCount);
    expect(gameStore.items.length + gameStore.discardPile.length).toBe(
      totalCards - config.drawCount
    );
  });
});
