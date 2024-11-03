import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import DieComponent from "@/app/components/Die";
import CardComponent from "@/app/components/Card";
import deckBuilderStore from "@/app/stores/deckBuilderStore";

const DeckBuilderEngine = observer(({ config }) => {
  useEffect(() => {
    deckBuilderStore.setConfig(config);
  }, [config]);

  const renderMarketplace = () => (
    <div className="border p-4 mb-4">
      <h2 className="text-xl font-semibold mb-2">Marketplace</h2>
      <div className="flex flex-wrap">
        {deckBuilderStore.marketplaceDisplay.map((item, index) => (
          <div
            key={item.id}
            className="m-1 cursor-pointer"
            onClick={() => deckBuilderStore.purchaseMarketplaceItem(index)}
          >
            {item.type === "die" ? (
              <DieComponent item={item} />
            ) : (
              <CardComponent item={item} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="mb-2">
          Purchases this turn: {deckBuilderStore.marketplacePurchasesThisTurn} /{" "}
          {deckBuilderStore.maxMarketplacePurchases}
        </p>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => deckBuilderStore.cancelMarketplace()}
        >
          Back
        </button>
      </div>
    </div>
  );

  const renderChoicePhase = () => (
    <div className="border p-4 mb-4">
      <h2 className="text-xl font-semibold mb-2">Choose Action</h2>
      <div className="flex gap-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => deckBuilderStore.chooseAction("marketplace")}
        >
          Visit Marketplace
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => deckBuilderStore.chooseAction("upgrade")}
        >
          Upgrade Item
        </button>
      </div>
    </div>
  );

  const renderUpgradePhase = () => (
    <div className="border p-4 mb-4">
      <h2 className="text-xl font-semibold mb-2">Upgrade Item</h2>
      <div className="flex flex-wrap gap-2">
        {deckBuilderStore.upgradeVirtualView.map((item) => (
          <div
            key={item.id}
            className="cursor-pointer"
            onClick={() => deckBuilderStore.selectUpgradeItem(item)}
          >
            {item.type === "die" ? (
              <DieComponent item={item} />
            ) : (
              <CardComponent item={item} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => deckBuilderStore.backToChoicePhase()}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const renderPlayerBoards = () => (
    <div className="grid grid-cols-2 gap-4 mb-4">
      {deckBuilderStore.players.map((player, index) => (
        <div
          key={player.id}
          className={`border p-4 ${
            index === deckBuilderStore.activePlayerIndex ? "bg-yellow-100" : ""
          }`}
        >
          <h3 className="font-semibold mb-2">
            {player.name}
            {index === deckBuilderStore.activePlayerIndex ? " (Active)" : ""}
          </h3>
          <div className="mb-2">
            <h4 className="font-semibold">
              Deck: {player.personalDeck.length}
            </h4>
            <h4 className="font-semibold">
              Discard: {player.personalDiscardPile.length}
            </h4>
          </div>
          <div className="mt-2">
            <h4 className="font-semibold">Play Area:</h4>
            <div className="flex flex-wrap">
              {player.personalCentralBoard.map((item) => (
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
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Deck Builder Engine</h1>

      <div className="mb-4 flex items-center">
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => deckBuilderStore.nextTurn()}
        >
          End Turn
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => deckBuilderStore.restartGame()}
        >
          Restart Game
        </button>
        <span className="ml-4 font-bold">
          Turn: {deckBuilderStore.currentTurn}
        </span>
      </div>

      {deckBuilderStore.isChoicePhaseActive && renderChoicePhase()}
      {deckBuilderStore.isMarketplaceActive && renderMarketplace()}
      {deckBuilderStore.isUpgradePhaseActive && renderUpgradePhase()}
      {renderPlayerBoards()}
    </div>
  );
});

export default DeckBuilderEngine;
