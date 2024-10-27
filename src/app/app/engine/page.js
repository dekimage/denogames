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
  const [gameLevel, setGameLevel] = useState(gameStore.gameLevel);
  const [playerCount, setPlayerCount] = useState(2);
  const [maxDraftingRounds, setMaxDraftingRounds] = useState(1);
  const [isRefill, setIsRefill] = useState(true);

  useEffect(() => {
    gameStore.setGameLevel(gameLevel);
    setSelectedGameType(gameStore.gameConfig.type);
  }, [gameLevel]);

  useEffect(() => {
    if (gameLevel === 2 || gameLevel === 3) {
      gameStore.setPlayerCount(playerCount);
    }
  }, [gameLevel, playerCount]);

  const handleGameLevelChange = (e) => {
    const newLevel = Number(e.target.value);
    setGameLevel(newLevel);
  };

  const handleGameTypeChange = (e) => {
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
    const value = Number(e.target.value);
    setMaxDraftingRounds(value);
    gameStore.setMaxDraftingRounds(value);
  };

  const handleIsRefillChange = (e) => {
    const value = e.target.checked;
    setIsRefill(value);
    gameStore.setIsRefill(value);
  };

  const handleMarketplaceItemSelect = (index) => {
    gameStore.selectMarketplaceItem(index);
  };

  const renderItem = (item) => {
    return item.type === "die" ? <Die item={item} /> : <Card item={item} />;
  };

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
              {item.type === "die" ? <Die item={item} /> : <Card item={item} />}
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
          <p>{gameStore.deck.length} items remaining</p>
        </div>
        <div className="border p-4 flex-1 ml-2">
          <h2 className="text-xl font-semibold mb-2">Discard Pile</h2>
          <p>{gameStore.discardPile.length} items discarded</p>
        </div>
      </div>
    </>
  );

  const renderMarketplace = () => (
    <div className="border p-4 mb-4">
      <h2 className="text-xl font-semibold mb-2">Marketplace</h2>
      <div className="flex flex-wrap">
        {gameStore.marketplaceDisplay.map((item, index) => (
          <div
            key={item.id}
            className="m-1 cursor-pointer"
            onClick={() => handleMarketplaceItemSelect(index)}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
      <p>
        Marketplace Deck: {gameStore.marketplaceDeck.length} items remaining
      </p>
      <p>
        Purchases this turn: {gameStore.marketplacePurchasesThisTurn} /{" "}
        {gameStore.gameConfig.maxMarketplacePurchases}
      </p>
      <p>Click Next Turn to end your marketplace phase early</p>
    </div>
  );

  const renderLevel3UI = () => (
    <>
      {gameStore.isMarketplaceActive &&
        !gameStore.isMarketplaceEmpty() &&
        renderMarketplace()}
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
    </>
  );

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
          onChange={handleGameLevelChange}
          className="mr-2 p-2 border rounded"
        >
          <option value={1}>Level 1</option>
          <option value={2}>Level 2</option>
          <option value={3}>Level 3</option>
        </select>

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

        {gameLevel === 2 && (
          <>
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
            <label className="mr-2">
              <input
                type="checkbox"
                checked={isRefill}
                onChange={handleIsRefillChange}
                className="mr-1"
              />
              Refill after each draft
            </label>
          </>
        )}

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
        <span className="ml-4 font-bold">Turn: {gameStore.currentTurn}</span>
      </div>

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

export default Home;
