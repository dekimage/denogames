import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import DieComponent from "@/app/components/Die";
import CardComponent from "@/app/components/Card";
import draftStore from "@/app/stores/draftStore";
import PlayerSetup from "@/app/components/PlayerSetup";

const DraftEngine = observer(({ config }) => {
  useEffect(() => {
    draftStore.setConfig(config);
  }, [config]);

  const handleDrawItems = () => {
    draftStore.drawItems();
  };

  const handleNextTurn = () => {
    draftStore.nextTurn();
  };

  const handleRestartGame = () => {
    draftStore.restartGame();
  };

  const handleItemClick = (index) => {
    if (draftStore.activePlayerIndex !== -1) {
      draftStore.draftItem(index);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Draft Engine</h1>

      <div className="mb-4 flex items-center gap-2">
        <PlayerSetup store={draftStore} />

        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleNextTurn}
        >
          Next Turn
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleRestartGame}
        >
          Restart Game
        </button>
        <span className="ml-4 font-bold">Turn: {draftStore.currentTurn}</span>
      </div>

      <div className="border p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Central Board</h2>
        <div className="flex flex-wrap gap-2">
          {draftStore.centralBoard.map((item, index) => (
            <div
              key={item.id}
              className="cursor-pointer"
              onClick={() => handleItemClick(index)}
            >
              {item.type === "die" ? (
                <DieComponent item={item} />
              ) : (
                <CardComponent item={item} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {draftStore.players.map((player, index) => (
          <div
            key={player.id}
            className={`border p-4 ${
              index === draftStore.activePlayerIndex ? "bg-yellow-100" : ""
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: player.color }}
              />
              <h3 className="font-semibold">
                {player.name}
                {index === draftStore.activePlayerIndex ? " (Active)" : ""}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {player.hand.map((item) => (
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
        ))}
      </div>

      <div className="flex justify-between">
        <div className="border p-4 flex-1 mr-2">
          <h2 className="text-xl font-semibold mb-2">Deck/Dice Pool</h2>
          <p>{draftStore.deck.length} items remaining</p>
        </div>
        <div className="border p-4 flex-1 ml-2">
          <h2 className="text-xl font-semibold mb-2">Discard Pile</h2>
          <p>{draftStore.discardPile.length} items discarded</p>
        </div>
      </div>
    </div>
  );
});

export default DraftEngine;
