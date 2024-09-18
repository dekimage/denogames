"use client";

import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import static data
import { staticGames } from "@/dungeon"; // Adjust the path as needed
import { BonusCard } from "../CardComponents/BonusCard";

const getImageFromType = (type) => {
  const imageMap = {
    "type-bonus": "dungeoneers/cover-ai-images/startingbonus.png",
    "type-passive": "dungeoneers/cover-ai-images/passive.png",
    "type-heropower": "dungeoneers/cover-ai-images/heropower.png",
    "type-trade": "dungeoneers/cover-ai-images/trade.png",
    "type-dungeonreward": "dungeoneers/cover-ai-images/dungeonreward.png",
    "type-darkmoon": "dungeoneers/cover-ai-images/darkmoon.png",
  };

  return imageMap[type] || "assets/placeholder.png";
};

const filterCardsByMethod = (
  game,
  methodName,
  selectedCardHistory,
  sessionOpen
) => {
  // Existing filter logic
  const [action, ...criteria] = methodName.split("_");
  let filteredCards = game.cards;

  criteria.forEach((criterion) => {
    const [property, value] = criterion.split("-");
    filteredCards = filteredCards.filter((card) => card[property] === value);
  });

  if (action === "draw" && sessionOpen) {
    const usedCardIds = new Set(selectedCardHistory.map((card) => card.id));
    filteredCards = filteredCards.filter((card) => !usedCardIds.has(card.id));
  }

  if (filteredCards.length === 0) {
    const originalFilteredCards = game.cards.filter((card) =>
      criteria.every((criterion) => {
        const [property, value] = criterion.split("-");
        return card[property] === value;
      })
    );

    if (sessionOpen && originalFilteredCards.length > 0) {
      return "All used";
    } else {
      return "No card exists matching that criteria";
    }
  }

  if (action === "random" || action === "draw") {
    return filteredCards[Math.floor(Math.random() * filteredCards.length)];
  }

  return null;
};

const generateActionLabel = (action) => {
  if (!action.length) return "";

  const [actionType, ...criteria] = action.split("_");
  let label = actionType.charAt(0).toUpperCase() + actionType.slice(1);

  criteria.forEach((criterion) => {
    const [property, value] = criterion.split("-");
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    label += ` ${capitalizedValue}`;
  });

  return label;
};

const GameDetails = observer(({ params }) => {
  const { slug } = params;

  const [selectedType, setSelectedType] = useState(null);
  const [selectedCardHistory, setSelectedCardHistory] = useState([]);
  const [isCardView, setIsCardView] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(true);
  const [lastCardMessage, setLastCardMessage] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  // Use static data instead of MobX store
  const games = staticGames;
  const game = games.find((g) => g.slug === slug);

  useEffect(() => {
    // No Firebase fetching needed; we're using static data
  }, [games, game]);

  if (!game) {
    return <p>Loading game data...</p>;
  }

  const filteredMethods = selectedType
    ? game.methodsConfig.filter((method) => method.type === selectedType)
    : [];

  const handleMethodClick = (method) => {
    const result = filterCardsByMethod(
      game,
      method.method,
      selectedCardHistory,
      sessionOpen
    );

    if (typeof result === "string") {
      setLastCardMessage(result);
      setSelectedCardHistory([...selectedCardHistory]);
      setIsCardView(true);
    } else if (result) {
      setLastCardMessage("");
      setSelectedCardHistory([
        ...selectedCardHistory,
        { ...result, method: method.method },
      ]);
      setIsCardView(true);
    }
  };

  const handleBackToMethods = () => {
    setIsCardView(false);
  };

  const handleRefreshMethod = () => {
    if (selectedCardHistory.length > 0) {
      const lastCard = selectedCardHistory[selectedCardHistory.length - 1];
      handleMethodClick({ method: lastCard.method });
    }
  };

  const lastCard = selectedCardHistory[selectedCardHistory.length - 1];

  return (
    <div className="p-4 flex flex-col items-center">
      {!isCardView ? (
        // Methods and types view
        <>
          <Link
            className="text-gray-500 underline flex items-center"
            href="/app"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Games
          </Link>
          <h1 className="text-3xl font-bold mb-4">{game.name}</h1>
          <p className="text-gray-700 mb-6">{game.description}</p>

          <Button
            className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition mb-4"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? "Hide History" : "View History"}
          </Button>

          {showHistory && (
            <div className="w-full overflow-x-scroll flex space-x-4 py-4 hide-scrollbar mb-8">
              {selectedCardHistory.map((card, index) => (
                <div
                  key={index}
                  className="min-w-[150px] p-2 border border-gray-300 rounded-lg flex-shrink-0"
                >
                  <Image
                    src={card.imageUrl}
                    alt={card.name}
                    width={100}
                    height={100}
                    className="w-24 h-24 object-cover rounded-md mb-2"
                  />
                  <h3 className="text-sm font-semibold">{card.name}</h3>
                </div>
              ))}
            </div>
          )}

          {/* Card Types */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {Object.entries(game.types).map(([key, value], i) => (
              <div
                key={key}
                className={`w-full max-w-[350px] border flex justify-center flex-col items-center p-4 rounded-lg cursor-pointer ${
                  selectedType === key
                    ? "bg-blue-300 border-blue-500"
                    : "hover:bg-gray-100"
                } transition`}
                onClick={() => setSelectedType(key)}
              >
                <h2 className="text-xl font-semibold mb-2">{value.name}</h2>

                <Image
                  src={`http://localhost:3000/${getImageFromType(key)}`}
                  alt={value.name}
                  width={250}
                  height={250}
                  className="w-[100px] h-[100px] object-cover rounded-md"
                />
              </div>
            ))}
          </div>

          {selectedType && (
            <div className="mb-4 gap-2 flex">
              <Button variant="outline">What are {selectedType}?</Button>
              <Button variant="outline">View All</Button>
            </div>
          )}

          {/* Methods for the Selected Type */}
          {selectedType && (
            <div className="flex flex-wrap gap-4 mb-6">
              {filteredMethods.map((method, i) => (
                <div
                  key={method.method}
                  className="flex justify-between border w-full p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition flex items-center"
                  onClick={() => handleMethodClick(method)}
                >
                  <div className="mr-4">
                    <h3 className="text-lg font-semibold">{method.name}</h3>
                  </div>
                  <Image
                    src={`http://localhost:3000/${getImageFromType(
                      selectedType
                    )}`}
                    alt={method.name}
                    width={200}
                    height={200}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </>
      ) : // Card view
      lastCardMessage ? (
        <div className="w-full mt-6 border border-gray-300 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-2">{lastCardMessage}</h2>
          <button
            className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
            onClick={handleBackToMethods}
          >
            ⬅ Back
          </button>
        </div>
      ) : (
        lastCard && (
          <div className="mt-6 p-4 border border-gray-300 rounded-lg text-center">
            <h2 className="text-2xl font-semibold mb-2">{lastCard.name}</h2>
            <p className="text-gray-700 mb-4">{lastCard.description}</p>

            {lastCard.type !== "newtype" ? (
              // Render the CardEffect component for "bonus" cards
              <BonusCard effect={lastCard.effect} />
            ) : (
              // Default rendering for non-bonus cards
              <Image
                src={lastCard.imageUrl}
                alt={lastCard.name}
                width={200}
                height={200}
                className="w-48 h-48 object-cover rounded-md mt-4 mx-auto"
              />
            )}

            {/* Action Buttons for the Card */}
            {lastCard.actions && lastCard.actions.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {lastCard.actions.map((action, index) => (
                  <button
                    key={index}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => handleMethodClick({ method: action })}
                  >
                    {generateActionLabel(action)}
                  </button>
                ))}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
                onClick={handleBackToMethods}
              >
                ⬅ Back
              </button>
              <button
                className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
                onClick={handleRefreshMethod}
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
});

export default GameDetails;
