// /components/Engine.js

"use client";

import { useState, useEffect, useMemo } from "react";
import gameStore from "@/app/stores/gameStore";
import { observer } from "mobx-react-lite";
import { gameTypes } from "@/app/gameConfig";
import DieComponent from "@/app/components/Die";
import CardComponent from "@/app/components/Card";
import { Die, Card } from "@/app/classes/Item";
import { toJS } from "mobx";

const Engine = observer(({ config = {} }) => {
  useEffect(() => {
    gameStore.reset(config);
  }, [config]);

  console.log(toJS(gameStore.gameConfig));

  const [selectedGameType, setSelectedGameType] = useState(
    config.gameType || gameStore.gameConfig.type
  );
  const [gameLevel, setGameLevel] = useState(
    config.gameLevel || gameStore.gameLevel
  );
  const [playerCount, setPlayerCount] = useState(config.playerCount || 2);
  const [maxDraftingRounds, setMaxDraftingRounds] = useState(
    config.maxDraftingRounds || 1
  );
  const [isRefill, setIsRefill] = useState(config.isRefill ?? true);
  const [marketplaceDisplaySize, setMarketplaceDisplaySize] = useState(
    config.marketplaceDisplaySize || gameStore.gameConfig.marketplaceDisplaySize
  );
  const [maxMarketplacePurchases, setMaxMarketplacePurchases] = useState(
    config.maxMarketplacePurchases ||
      gameStore.gameConfig.maxMarketplacePurchases
  );

  useEffect(() => {
    gameStore.setGameLevel(gameLevel);
    setSelectedGameType(gameStore.gameConfig.type);
  }, [gameLevel]);

  useEffect(() => {
    if (gameLevel === 2 || gameLevel === 3) {
      gameStore.setPlayerCount(playerCount);
    }
  }, [gameLevel, playerCount]);

  // Handle state changes with the ability to lock based on config
  const handleGameLevelChange = (e) => {
    if (config.gameLevel) return;
    const newLevel = Number(e.target.value);
    setGameLevel(newLevel);
  };

  const handleGameTypeChange = (e) => {
    if (config.gameType) return;
    const newGameType = e.target.value;
    setSelectedGameType(newGameType);
    gameStore.setGameType(newGameType);
  };

  const handleDrawItems = () => {
    gameStore.drawItems();
  };

  const handleNextTurn = () => {
    gameStore.nextTurn();
  };

  const handleRestartGame = () => {
    gameStore.restartGame();
  };

  const handleItemClick = (index) => {
    if (gameStore.gameLevel === 2 && gameStore.activePlayerIndex !== -1) {
      gameStore.draftItem(index);
    }
  };

  const activePlayer = gameStore.players[gameStore.activePlayerIndex];

  const handleMaxDraftingRoundsChange = (e) => {
    if (config.maxDraftingRounds) return;
    const value = Number(e.target.value);
    setMaxDraftingRounds(value);
    gameStore.setMaxDraftingRounds(value);
  };

  const handleIsRefillChange = (e) => {
    if (config.isRefill !== undefined) return;
    const value = e.target.checked;
    setIsRefill(value);
    gameStore.setIsRefill(value);
  };

  const handleMarketplaceItemSelect = (index) => {
    gameStore.selectMarketplaceItem(index);
  };

  const handleMarketplaceDisplaySizeChange = (e) => {
    if (config.marketplaceDisplaySize) return;
    const newSize = Number(e.target.value);
    setMarketplaceDisplaySize(newSize);
    gameStore.setMarketplaceDisplaySize(newSize);
  };

  const handleMaxMarketplacePurchasesChange = (e) => {
    if (config.maxMarketplacePurchases) return;
    const newMax = Number(e.target.value);
    setMaxMarketplacePurchases(newMax);
    gameStore.setMaxMarketplacePurchases(newMax);
  };

  const handleChoiceAction = (action) => {
    gameStore.chooseAction(action);
  };

  const handleUpgradeItemSelect = (item) => {
    gameStore.selectUpgradeItem(item);
  };

  const handleUpgrade = () => {
    gameStore.upgradeItem();
  };

  const handleCancelUpgrade = () => {
    gameStore.cancelUpgrade();
  };

  const handleBackToChoicePhase = () => {
    gameStore.backToChoicePhase();
  };

  const renderItem = (item) => {
    const levelIndicator = (
      <span className="absolute top-0 right-0 bg-yellow-500 text-white rounded-full px-2 py-1 text-xs">
        Lvl {item.level}
      </span>
    );

    if (item.type === "die") {
      return (
        <div className="relative">
          <Die item={item} />
          {levelIndicator}
        </div>
      );
    } else {
      return (
        <div className="relative">
          <Card item={item} />
          {levelIndicator}
        </div>
      );
    }
  };

  const renderPlayers = () => (
    <div className="grid grid-cols-2 gap-4 mb-4">
      {gameStore.players.map((player, index) => (
        <div
          key={player.id}
          className={`border p-4 ${
            index === gameStore.activePlayerIndex ? "bg-yellow-100" : ""
          }`}
        >
          <h3 className="font-semibold mb-2">
            {player.name}{" "}
            {index === gameStore.activePlayerIndex ? "(Active)" : ""}
          </h3>
          <p>Deck: {player.personalDeck.length} items</p>
          <p>Discard: {player.personalDiscardPile.length} items</p>
          <div className="mt-2">
            <h4 className="font-semibold">Central Board:</h4>
            <div className="flex flex-wrap">
              {player.personalCentralBoard.map((item) => (
                <div key={item.id} className="m-1">
                  {renderItem(item)}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLevel3UI = () => (
    <>
      {gameStore.isChoicePhaseActive && renderChoicePhase()}
      {gameStore.isUpgradePhaseActive &&
        !gameStore.selectedUpgradeItem &&
        renderUpgradeVirtualView()}
      {gameStore.isUpgradePhaseActive &&
        gameStore.selectedUpgradeItem &&
        renderUpgradeDifferenceView()}
      {gameStore.isMarketplaceActive && renderMarketplace()}
      {renderPlayers()}
      <button
        onClick={handleNextTurn}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Next Turn
      </button>
    </>
  );

  const renderLevel1And2UI = () => (
    <>
      <div className="border p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Central Board</h2>
        <div className="flex flex-wrap">
          {gameStore.centralBoard.map((item, index) => (
            <div
              key={item.id}
              className={`m-1 ${
                gameStore.gameLevel === 2 && gameStore.activePlayerIndex !== -1
                  ? "cursor-pointer"
                  : ""
              }`}
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

      {gameLevel === 2 && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {gameStore.players.map((player) => (
            <div key={player.id} className="border p-4">
              <h3 className="font-semibold mb-2">{player.name}</h3>
              <div className="flex flex-wrap">
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
      )}

      <div className="flex justify-between">
        <div className="border p-4 flex-1 mr-2">
          <h2 className="text-xl font-semibold mb-2">Deck/Dice Pool</h2>
          <p>{gameStore.deck.length} items remaining</p>
        </div>
        <div className="border p-4 flex-1 ml-2">
          <h2 className="text-xl font-semibold mb-2">Discard Pile</h2>
          <p>{gameStore.discardPile.length} items discarded</p>
        </div>
      </div>
    </>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{"Game Engine"}</h1>

      {/* Conditionally render controls based on config */}
      <div className="mb-4 flex items-center flex-wrap">
        {!config.type && (
          <select
            value={selectedGameType}
            onChange={handleGameTypeChange}
            className="mr-2 p-2 border rounded"
          >
            <option value={gameTypes.SIMPLE_DICE}>Simple Dice</option>
            <option value={gameTypes.SIMPLE_CARDS}>Simple Cards</option>
            <option value={gameTypes.DICE_CARDS}>Dice Cards</option>
          </select>
        )}

        {!config.gameLevel && (
          <select
            value={gameLevel}
            onChange={handleGameLevelChange}
            className="mr-2 p-2 border rounded"
          >
            <option value={1}>Level 1</option>
            <option value={2}>Level 2</option>
            <option value={3}>Level 3</option>
          </select>
        )}

        {(gameLevel === 2 || gameLevel === 3) && (
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
        )}

        {gameLevel === 2 && !config.maxDraftingRounds && (
          <select
            value={maxDraftingRounds}
            onChange={handleMaxDraftingRoundsChange}
            className="mr-2 p-2 border rounded"
          >
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                Draft {num} {num === 1 ? "Card/Die" : "Cards/Dice"}
              </option>
            ))}
          </select>
        )}

        {gameLevel === 2 && !config.isRefill && (
          <label className="mr-2">
            <input
              type="checkbox"
              checked={isRefill}
              onChange={handleIsRefillChange}
              className="mr-1"
            />
            Refill after each draft
          </label>
        )}

        {gameLevel === 1 && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={handleDrawItems}
          >
            Draw Items
          </button>
        )}

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
        <span className="ml-4 font-bold">Turn: {gameStore.currentTurn}</span>
      </div>

      {/* Render different UIs based on game level */}
      {gameLevel === 3 ? renderLevel3UI() : renderLevel1And2UI()}

      {gameStore.activePlayerIndex !== -1 && (
        <div className="mt-4 font-bold">
          Active Player:{" "}
          {gameStore.players[gameStore.activePlayerIndex]?.name || "Unknown"}
        </div>
      )}
    </div>
  );
});

export default Engine;
