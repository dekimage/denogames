"use client";

import { useState } from "react";
import gameStore from "@/app/stores/gameStore";
import { observer } from "mobx-react-lite";
import { gameTypes } from "@/app/gameConfig";
import Die from "@/app/components/Die";
import Card from "@/app/components/Card";

const Home = observer(() => {
  const [selectedGameType, setSelectedGameType] = useState(
    gameStore.gameConfig.type
  );

  const handleGameTypeChange = (e) => {
    const newGameType = e.target.value;
    setSelectedGameType(newGameType);
    gameStore.setGameType(newGameType);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Game Engine Test</h1>

      <div className="mb-4">
        <select
          value={selectedGameType}
          onChange={handleGameTypeChange}
          className="mr-2 p-2 border rounded"
        >
          <option value={gameTypes.SIMPLE_DICE}>Simple Dice</option>
          <option value={gameTypes.SIMPLE_CARDS}>Simple Cards</option>
          <option value={gameTypes.DICE_CARDS}>Dice Cards</option>
        </select>

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
          {gameStore.centralBoard.map((item) => (
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
    </div>
  );
});

export default Home;
