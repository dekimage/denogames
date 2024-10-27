"use client";

import { useState, useEffect } from "react";
import gameStore from "@/app/stores/gameStore";
import { observer } from "mobx-react-lite";
import { gameTypes } from "@/app/gameConfig";
import Die from "@/app/components/Die";
import Card from "@/app/components/Card";

const Home = observer(() => {
  const [selectedGameType, setSelectedGameType] = useState(
    gameStore.gameConfig.type
  );
  const [gameLevel, setGameLevel] = useState(1);
  const [playerCount, setPlayerCount] = useState(2);
  const [isRefill, setIsRefill] = useState(gameStore.isRefill);
  const [maxDraftingRounds, setMaxDraftingRounds] = useState(
    gameStore.maxDraftingRounds
  );

  useEffect(() => {
    gameStore.setGameLevel(gameLevel);
  }, [gameLevel]);

  useEffect(() => {
    if (gameLevel === 2) {
      gameStore.setPlayerCount(playerCount);
    }
  }, [gameLevel, playerCount]);

  useEffect(() => {
    gameStore.setIsRefill(isRefill);
  }, [isRefill]);

  useEffect(() => {
    gameStore.setMaxDraftingRounds(maxDraftingRounds);
  }, [maxDraftingRounds]);

  const handleGameTypeChange = (e) => {
    const newGameType = e.target.value;
    setSelectedGameType(newGameType);
    gameStore.setGameType(newGameType);
  };

  const handleDraftItem = (itemIndex) => {
    gameStore.draftItem(itemIndex);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Game Engine Test</h1>

      <div className="mb-4 flex items-center flex-wrap">
        <select
          value={selectedGameType}
          onChange={handleGameTypeChange}
          className="mr-2 p-2 border rounded"
        >
          <option value={gameTypes.SIMPLE_DICE}>Simple Dice</option>
          <option value={gameTypes.SIMPLE_CARDS}>Simple Cards</option>
          <option value={gameTypes.DICE_CARDS}>Dice Cards</option>
        </select>

        <select
          value={gameLevel}
          onChange={(e) => setGameLevel(Number(e.target.value))}
          className="mr-2 p-2 border rounded"
        >
          <option value={1}>Level 1</option>
          <option value={2}>Level 2</option>
        </select>

        {gameLevel === 2 && (
          <>
            <select
              value={playerCount}
              onChange={(e) => setPlayerCount(Number(e.target.value))}
              className="mr-2 p-2 border rounded"
            >
              {[2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} Players
                </option>
              ))}
            </select>

            <select
              value={maxDraftingRounds}
              onChange={(e) => setMaxDraftingRounds(Number(e.target.value))}
              className="mr-2 p-2 border rounded"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  Draft {num} {num === 1 ? "card/die" : "cards/dice"}
                </option>
              ))}
            </select>

            <label className="flex items-center mr-4">
              <input
                type="checkbox"
                checked={isRefill}
                onChange={(e) => setIsRefill(e.target.checked)}
                className="mr-2"
              />
              Refill after draft
            </label>
          </>
        )}

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => gameStore.drawItems()}
        >
          Draw Items
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => gameStore.nextTurn()}
        >
          Next Turn
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => gameStore.restartGame()}
        >
          Restart Game
        </button>
        <span className="ml-4 font-bold">Turn: {gameStore.currentTurn}</span>
      </div>

      <div className="border p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Central Board</h2>
        <div className="flex flex-wrap">
          {gameStore.centralBoard.map((item, index) => (
            <div key={item.id} className="m-1">
              <button
                onClick={() => handleDraftItem(index)}
                disabled={gameStore.activePlayerIndex === -1}
              >
                {gameStore.gameConfig.itemType === "die" ? (
                  <Die item={item} />
                ) : (
                  <Card item={item} />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {gameLevel === 2 && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {gameStore.players.map((player) => (
            <div key={player.id} className="border p-4">
              <h3 className="font-semibold mb-2">{player.name}</h3>
              <div className="flex flex-wrap">
                {player.hand.map((item) => (
                  <div key={item.id} className="m-1">
                    {gameStore.gameConfig.itemType === "die" ? (
                      <Die item={item} />
                    ) : (
                      <Card item={item} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <div className="border p-4 flex-1 mr-2">
          <h2 className="text-xl font-semibold mb-2">Deck/Dice Pool</h2>
          <p>{gameStore.items.length} items remaining</p>
        </div>
        <div className="border p-4 flex-1 ml-2">
          <h2 className="text-xl font-semibold mb-2">Discard Pile</h2>
          <p>{gameStore.discardPile.length} items discarded</p>
        </div>
      </div>

      {gameLevel === 2 &&
        gameStore.activePlayerIndex !== -1 &&
        gameStore.players.length > 0 && (
          <div className="mt-4 font-bold">
            Active Player:{" "}
            {gameStore.players[gameStore.activePlayerIndex]?.name || "Unknown"}
          </div>
        )}
    </div>
  );
});

export default Home;
