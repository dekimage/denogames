import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import DieComponent from "@/app/components/Die";
import CardComponent from "@/app/components/Card";
import flipStore from "@/app/stores/flipStore";

const FlipEngine = observer(({ config }) => {
  useEffect(() => {
    flipStore.setConfig(config);
  }, [config]);

  const handleDrawItems = () => {
    flipStore.drawItems();
  };

  const handleNextTurn = () => {
    flipStore.nextTurn();
  };

  const handleRestartGame = () => {
    flipStore.restartGame();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Flip Engine</h1>

      <div className="mb-4 flex items-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={handleDrawItems}
        >
          Draw Items
        </button>

        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={handleNextTurn}
        >
          Next Turn
        </button>

        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={handleRestartGame}
        >
          Restart Game
        </button>

        <span className="ml-4 font-bold">Turn: {flipStore.currentTurn}</span>
      </div>

      <div className="border p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Central Board</h2>
        <div className="flex flex-wrap">
          {flipStore.centralBoard.map((item) => (
            <div key={item.id} className="m-1">
              {item.type === "die" ? (
                <DieComponent item={item} />
              ) : (
                <CardComponent item={item} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="border p-4 flex-1 mr-2">
          <h2 className="text-xl font-semibold mb-2">Deck/Dice Pool</h2>
          <p>{flipStore.deck.length} items remaining</p>
        </div>
        <div className="border p-4 flex-1 ml-2">
          <h2 className="text-xl font-semibold mb-2">Discard Pile</h2>
          <p>{flipStore.discardPile.length} items discarded</p>
        </div>
      </div>
    </div>
  );
});

export default FlipEngine;
