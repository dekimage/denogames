"use client";


import market1Img from "../../../../assets/bazaar/markets/market1.png";
import market2Img from "../../../../assets/bazaar/markets/market2.png";
import market3Img from "../../../../assets/bazaar/markets/market3.png";
import market4Img from "../../../../assets/bazaar/markets/market4.png";
import market5Img from "../../../../assets/bazaar/markets/market5.png";
import market6Img from "../../../../assets/bazaar/markets/market6.png";
import market7Img from "../../../../assets/bazaar/markets/market7.png";
import market8Img from "../../../../assets/bazaar/markets/market8.png";
import market9Img from "../../../../assets/bazaar/markets/market9.png";
import market10Img from "../../../../assets/bazaar/markets/market10.png";
import market11Img from "../../../../assets/bazaar/markets/market11.png";
import market12Img from "../../../../assets/bazaar/markets/market12.png";
import market13Img from "../../../../assets/bazaar/markets/market13.png";
import market14Img from "../../../../assets/bazaar/markets/market14.png";
import market15Img from "../../../../assets/bazaar/markets/market15.png";
import market16Img from "../../../../assets/bazaar/markets/market16.png";
import market17Img from "../../../../assets/bazaar/markets/market17.png";


import monster1Img from "../../../../assets/bazaar/monsters/monster1.png";
import monster2Img from "../../../../assets/bazaar/monsters/monster2.png";
import monster3Img from "../../../../assets/bazaar/monsters/monster3.png";
import monster4Img from "../../../../assets/bazaar/monsters/monster4.png";
import monster5Img from "../../../../assets/bazaar/monsters/monster5.png";
import monster6Img from "../../../../assets/bazaar/monsters/monster6.png";
import monster7Img from "../../../../assets/bazaar/monsters/monster7.png";
import monster8Img from "../../../../assets/bazaar/monsters/monster8.png";
import monster9Img from "../../../../assets/bazaar/monsters/monster9.png";
import monster10Img from "../../../../assets/bazaar/monsters/monster10.png";
import monster11Img from "../../../../assets/bazaar/monsters/monster11.png";
import monster12Img from "../../../../assets/bazaar/monsters/monster12.png";
import monster13Img from "../../../../assets/bazaar/monsters/monster13.png";
import monster14Img from "../../../../assets/bazaar/monsters/monster14.png";
import monster15Img from "../../../../assets/bazaar/monsters/monster15.png";
import monster16Img from "../../../../assets/bazaar/monsters/monster16.png";
import monster17Img from "../../../../assets/bazaar/monsters/monster17.png";
import monster18Img from "../../../../assets/bazaar/monsters/monster18.png";


import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { bazaarStore, PLAYER_COLORS } from "./bazaarStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { IoReload } from "react-icons/io5";


const TEST_MODE = true;

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
                className={`w-8 h-8 rounded-full cursor-pointer ${selectedColor === color ? "ring-2 ring-primary" : ""
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

  const handleIncrement = (stat) => {
    if (!activePlayer) return;

    switch (stat) {
      case 'gold':
        activePlayer.gold += 1;
        break;
      case 'income':
        activePlayer.income += 1;
        break;
      case 'xp':
        activePlayer.xp += 1;
        break;
      case 'level':
        activePlayer.level += 1;
        break;
      case 'tier':
        activePlayer.tier = Math.min(5, activePlayer.tier + 1);
        break;
    }
  };

  return (
    <div
      className="p-4 border rounded-lg"
      style={{ borderColor: activePlayer.color }}
    >
      <h2 className="text-xl font-bold">{activePlayer.name}</h2>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="flex items-center gap-2">
          <span>Gold: {activePlayer.gold}</span>
          <button
            onClick={() => handleIncrement('gold')}
            className="px-2 py-1 bg-green-500 text-white rounded-md text-sm"
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span>Income: {activePlayer.income}</span>
          <button
            onClick={() => handleIncrement('income')}
            className="px-2 py-1 bg-green-500 text-white rounded-md text-sm"
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span>XP: {activePlayer.xp}</span>
          <button
            onClick={() => handleIncrement('xp')}
            className="px-2 py-1 bg-green-500 text-white rounded-md text-sm"
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span>Level: {activePlayer.level}</span>
          <button
            onClick={() => handleIncrement('level')}
            className="px-2 py-1 bg-green-500 text-white rounded-md text-sm"
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span>Tier: {activePlayer.tier}</span>
          <button
            onClick={() => handleIncrement('tier')}
            className="px-2 py-1 bg-green-500 text-white rounded-md text-sm"
          >
            +
          </button>
        </div>
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

const getRomanNumeral = (num) => {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V'];
  return romanNumerals[num - 1];
};

// Image mapping object
const IMAGE_MAP = {
  // Market Images
  market1: market1Img,
  market2: market2Img,
  market3: market3Img,
  market4: market4Img,
  market5: market5Img,
  market6: market6Img,
  market7: market7Img,
  market8: market8Img,
  market9: market9Img,
  market10: market10Img,
  market11: market11Img,
  market12: market12Img,
  market13: market13Img,
  market14: market14Img,
  market15: market15Img,
  market16: market16Img,
  market17: market17Img,

  // Monster Images
  monster1: monster1Img,
  monster2: monster2Img,
  monster3: monster3Img,
  monster4: monster4Img,
  monster5: monster5Img,
  monster6: monster6Img,
  monster7: monster7Img,
  monster8: monster8Img,
  monster9: monster9Img,
  monster10: monster10Img,
  monster11: monster11Img,
  monster12: monster12Img,
  monster13: monster13Img,
  monster14: monster14Img,
  monster15: monster15Img,
  monster16: monster16Img,
  monster17: monster17Img,
  monster18: monster18Img,
};

const MarketCard = ({ encounter, onClick }) => (
  <div
    onClick={() => onClick(encounter)}
    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer bg-yellow-300"
  >
    <div className="aspect-square flex flex-col">
      <div className="w-full h-32 relative mb-2">
        <Image
          src={IMAGE_MAP[encounter.img]}
          alt={encounter.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-lg">{encounter.name}</h3>
        <p className="text-sm text-muted-foreground">{encounter.description}</p>
        <div className="text-xs text-muted-foreground">
          {encounter.variant} Market
        </div>
      </div>
    </div>
  </div>
);

const EventCard = ({ encounter, onClick }) => (
  <div
    onClick={() => onClick?.(encounter)}
    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer bg-blue-300"
  >
    <div className="aspect-square flex flex-col">
      <div className="w-full h-32 relative mb-2">
        <Image
          src={IMAGE_MAP[encounter.img]}
          alt={encounter.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-lg">{encounter.name}</h3>
        <p className="text-sm text-muted-foreground">{encounter.description}</p>
      </div>
    </div>
  </div>
);

const MonsterCard = ({ encounter, onClick }) => (
  <div
    onClick={() => onClick?.(encounter)}
    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer bg-red-300"
  >
    <div className="aspect-square flex flex-col">
      <div className="w-full h-32 relative mb-2">
        <Image
          src={IMAGE_MAP[encounter.img]}
          alt={encounter.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-lg">{encounter.name}</h3>
        <p className="text-sm text-muted-foreground">{encounter.description}</p>
      </div>
    </div>
  </div>
);

const EncounterCard = ({ encounter, onClick }) => {
  const handleClick = () => onClick(encounter);

  switch (encounter.type) {
    case "market":
      return <MarketCard encounter={encounter} onClick={handleClick} />;
    case "event":
      return <EventCard encounter={encounter} onClick={handleClick} />;
    case "monster":
      return <MonsterCard encounter={encounter} onClick={handleClick} />;
    default:
      return null;
  }
};

const DuplicateCounter = ({ count }) => (
  <div className={`
    absolute -top-2 -right-2 
    ${count >= 4 ? 'bg-red-500' : count >= 3 ? 'bg-purple-500' : 'bg-green-500'} 
    text-white font-bold 
    rounded-full w-8 h-8 
    flex items-center justify-center 
    shadow-lg 
    text-sm
    border-2 border-white
    z-10
  `}>
    {count >= 4 ? 'MAX' : `x${count}`}
  </div>
);


const FloatingArrows = ({ isTriplicate = false }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none flex justify-center">
    <style>{`
      @keyframes floatingArrows {
        0% {
          transform: translateY(100%);
          opacity: 0;
        }
        20% {
          opacity: 1;
        }
        80% {
          opacity: 1;
        }
        100% {
          transform: translateY(-100%);
          opacity: 0;
        }
      }
    `}</style>
    <div className="relative w-full h-full">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <div
          key={index}
          className={`${isTriplicate ? 'text-purple-500' : 'text-green-500 text-2xl'}`}
          style={{
            animation: `floatingArrows 2s infinite ${index * 0.3}s`,
            position: 'absolute',
            fontSize: isTriplicate ? '48px' : '24px',
          }}
        >
          ▲
        </div>
      ))}
    </div>
  </div>
);

const ItemCard = observer(({ item, onBuy, disabled }) => {
  const player = bazaarStore.activePlayer;
  const itemCount = player?.inventory.filter(id => id === item.id).length || 0;
  const hasItem = itemCount > 0;
  const isTriplicate = itemCount >= 2;
  const isOutOfStock = itemCount >= 3;

  return (
    <div className="flex flex-col gap-2">
      <div className={`
        border rounded-lg p-4 
        ${isOutOfStock ? 'bg-gray-200 opacity-60' : 'bg-card hover:bg-accent/50'} 
        transition-colors relative
      `}>
        {hasItem && (
          <>
            {!isOutOfStock && <FloatingArrows isTriplicate={isTriplicate} />}
            <DuplicateCounter count={itemCount + 1} />
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-red-500 text-white px-4 py-2 rounded-md font-bold transform -rotate-12">
                  OUT OF STOCK
                </div>
              </div>
            )}
          </>
        )}
        <div className={`aspect-square flex flex-col ${isOutOfStock ? 'pointer-events-none' : ''}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 border-2 rounded-lg flex items-center justify-center text-2xl bg-background">
                {item.img}
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {getRomanNumeral(item.tier)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {Object.entries(item.power).map(([type, value]) => (
                <div key={type} className="flex items-center">
                  <span className="text-lg mr-1">
                    {type === 'fire' && '🔥'}
                    {type === 'water' && '💧'}
                    {type === 'earth' && '🌍'}
                    {type === 'air' && '💨'}
                  </span>
                  <span className="text-2xl font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm font-medium mb-4 text-center">
            {item.name}
          </div>

          <div className="mt-auto">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={`square-${i}`}
                  className="w-8 h-8 border-2 rounded-md flex items-center justify-center"
                />
              ))}
            </div>
            <div className="flex justify-between">
              {[1, 2, 3].map((i) => (
                <div
                  key={`circle-${i}`}
                  className="w-4 h-4 border-2 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onBuy(item)}
        disabled={disabled || isOutOfStock}
        className={`w-full px-3 py-1 bg-primary text-primary-foreground rounded-md 
          flex items-center justify-center gap-2
          ${(disabled || isOutOfStock) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span>3</span>
        <span>🪙</span>
      </button>
    </div>
  );
});

const MarketView = observer(({ marketVariant }) => {
  const handleBuyItem = (item) => {
    bazaarStore.purchaseItem(item.id);
  };

  const handleReroll = () => {
    bazaarStore.rerollMarketItems(marketVariant);
  };

  const player = bazaarStore.activePlayer;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Market Items</h2>
        <button
          onClick={handleReroll}
          disabled={!player || player.gold < 1}
          className={`p-2 rounded-full hover:bg-accent/50 transition-colors
            ${(!player || player.gold < 1) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          title="Reroll (1 Gold)"
        >
          <IoReload className="w-6 h-6" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {bazaarStore.currentOptions.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onBuy={handleBuyItem}
            disabled={!player || player.gold < 3}
          />
        ))}
      </div>
    </div>
  );
});

const GameContent = observer(() => {
  const handleEncounterClick = (encounter) => {
    bazaarStore.selectEncounter(encounter);
  };

  return (
    <div className="space-y-4">
      {bazaarStore.currentPhase === "encounters" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Choose an Encounter</h2>
          <div className="grid grid-cols-3 gap-4">
            {bazaarStore.currentEncounters.map((encounter) => {
              switch (encounter.type) {
                case "market":
                  return (
                    <MarketCard
                      key={encounter.id}
                      encounter={encounter}
                      onClick={handleEncounterClick}
                    />
                  );
                case "monster":
                  return (
                    <MonsterCard
                      key={encounter.id}
                      encounter={encounter}
                      onClick={handleEncounterClick}
                    />
                  );
                case "event":
                  return (
                    <EventCard
                      key={encounter.id}
                      encounter={encounter}
                      onClick={handleEncounterClick}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      )}

      {bazaarStore.currentPhase === "market" && (
        <MarketView marketVariant={bazaarStore.selectedMarket?.variant} />
      )}

      {bazaarStore.currentPhase === "items" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Available Items</h2>
          <div className="grid grid-cols-3 gap-4">
            {bazaarStore.currentOptions.map((item) => (
              <ItemCard key={item.id} item={item} onBuy={handleEncounterClick} />
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

const setupTestMode = () => {
  if (TEST_MODE && bazaarStore.players.length === 0) {
    bazaarStore.addPlayer("Deno", "#FF0000");
    bazaarStore.startGame();
  }
};

const BazaarGame = observer(() => {
  useEffect(() => {
    setupTestMode();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      {!bazaarStore.gameStarted ? (
        <SetupScreen />
      ) : (
        <div className="space-y-4">
          <PlayerStats />
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div>Age: {bazaarStore.currentAge}</div>
              <div>Round: {bazaarStore.currentRound}</div>
            </div>
            <button
              onClick={() => bazaarStore.nextTurn()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              End Turn
            </button>
          </div>
          <GameContent />
          <button
            onClick={() => {
              bazaarStore.resetGame();
              setupTestMode();
            }}
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
