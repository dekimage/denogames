"use client";

import { observer } from "mobx-react-lite";
import { useState } from "react";
import { bazaarStore, PLAYER_COLORS } from "./bazaarStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PlayerSetupDialog = () => {
  const [playerName, setPlayerName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const handleAddPlayer = () => {
    if (playerName && selectedColor) {
      bazaarStore.addPlayer(playerName, selectedColor);
      setPlayerName("");
      setSelectedColor("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
        Add Player
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Player</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Player Name"
            className="w-full p-2 border rounded"
          />
          <div className="grid grid-cols-4 gap-2">
            {PLAYER_COLORS.map((color) => (
              <div
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full cursor-pointer ${
                  selectedColor === color ? "ring-2 ring-primary" : ""
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            onClick={handleAddPlayer}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Add Player
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PlayerStats = observer(() => {
  const { activePlayer } = bazaarStore;
  if (!activePlayer) return null;

  return (
    <div
      className="p-4 border rounded-lg"
      style={{ borderColor: activePlayer.color }}
    >
      <h2 className="text-xl font-bold">{activePlayer.name}</h2>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div>Gold: {activePlayer.gold}</div>
        <div>Income: {activePlayer.income}</div>
        <div>XP: {activePlayer.xp}</div>
        <div>Level: {activePlayer.level}</div>
      </div>
    </div>
  );
});

const PlayerList = observer(() => {
  return (
    <div className="space-y-2 mt-4">
      {bazaarStore.players.map((player, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 border rounded"
          style={{ borderColor: player.color }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: player.color }}
            />
            <span>{player.name}</span>
          </div>
          <button
            onClick={() => bazaarStore.removePlayer(index)}
            className="text-destructive hover:text-destructive/80"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
});

const SetupScreen = observer(() => {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-bold">Welcome to Bazaar</h1>
      <p>Add 1-4 players to start the game</p>
      <PlayerSetupDialog />
      <PlayerList />
      {bazaarStore.players.length > 0 && (
        <button
          onClick={() => bazaarStore.startGame()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Start Game
        </button>
      )}
    </div>
  );
});

const EncounterCard = ({ encounter, onClick }) => (
  <div
    onClick={onClick}
    className="border rounded-lg p-4 cursor-pointer hover:bg-accent"
  >
    <h3 className="font-bold">{encounter.name}</h3>
    <p className="text-sm text-muted-foreground">Type: {encounter.type}</p>
  </div>
);

const ItemCard = ({ item, onBuy }) => (
  <div className="border rounded-lg p-4">
    <h3 className="font-bold">{item.name}</h3>
    <p className="text-sm text-muted-foreground">Cost: {item.cost} gold</p>
    <button
      onClick={() => onBuy(item)}
      className="mt-2 px-3 py-1 bg-primary text-primary-foreground rounded-md"
    >
      Buy
    </button>
  </div>
);

const MonsterCard = ({ monster }) => (
  <div className="border rounded-lg p-4">
    <h3 className="font-bold">{monster.name}</h3>
    <p className="text-sm text-muted-foreground">
      Difficulty: {monster.difficulty}
    </p>
    <p className="text-sm text-muted-foreground">
      Reward: {monster.reward} gold
    </p>
  </div>
);

const EventCard = ({ event }) => (
  <div className="border rounded-lg p-4">
    <h3 className="font-bold">{event.name}</h3>
    <p className="text-sm text-muted-foreground">{event.description}</p>
    <p className="text-sm text-muted-foreground">Reward: {event.reward} gold</p>
  </div>
);

const GameContent = observer(() => {
  const handleEncounterClick = (encounter) => {
    bazaarStore.selectEncounter(encounter);
  };

  const handleBuyItem = (item) => {
    bazaarStore.buyItem(item);
  };

  return (
    <div className="space-y-4">
      {bazaarStore.currentPhase === "encounters" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Choose an Encounter</h2>
          <div className="grid grid-cols-3 gap-4">
            {bazaarStore.currentEncounters.map((encounter) => (
              <EncounterCard
                key={encounter.id}
                encounter={encounter}
                onClick={() => handleEncounterClick(encounter)}
              />
            ))}
          </div>
        </div>
      )}

      {bazaarStore.currentPhase === "items" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Available Items</h2>
          <div className="grid grid-cols-3 gap-4">
            {bazaarStore.currentOptions.map((item) => (
              <ItemCard key={item.id} item={item} onBuy={handleBuyItem} />
            ))}
          </div>
        </div>
      )}

      {bazaarStore.currentPhase === "monsters" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Monster Encounters</h2>
          <div className="grid grid-cols-3 gap-4">
            {bazaarStore.currentOptions.map((monster) => (
              <MonsterCard key={monster.id} monster={monster} />
            ))}
          </div>
        </div>
      )}

      {bazaarStore.currentPhase === "events" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Available Events</h2>
          <div className="grid grid-cols-3 gap-4">
            {bazaarStore.currentOptions.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

const BazaarGame = observer(() => {
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      {!bazaarStore.gameStarted ? (
        <SetupScreen />
      ) : (
        <div className="space-y-4">
          <PlayerStats />
          <div className="flex justify-between items-center">
            <div>Round: {bazaarStore.currentRound}</div>
            <button
              onClick={() => bazaarStore.nextTurn()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              End Turn
            </button>
          </div>
          <GameContent />
          <button
            onClick={() => bazaarStore.resetGame()}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md"
          >
            Reset Game
          </button>
        </div>
      )}
    </div>
  );
});

export default BazaarGame;
