"use client";

import { useState, useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import MobxStore from "@/mobx";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const filterCardsByMethod = (
  game,
  methodName,
  selectedCardHistory,
  sessionOpen
) => {
  const [action, ...criteria] = methodName.split("_");

  // Initialize filteredCards with all cards in the game
  let filteredCards = game.cards;

  // Apply filters based on each criterion (e.g., 'type-relic', 'rarity-epic')
  criteria.forEach((criterion) => {
    const [property, value] = criterion.split("-");
    filteredCards = filteredCards.filter((card) => card[property] === value);
  });

  // If action is "draw" and sessionOpen is true, exclude cards already in the history
  if (action === "draw" && sessionOpen) {
    const usedCardIds = new Set(selectedCardHistory.map((card) => card.id)); // Assuming each card has a unique 'id'
    filteredCards = filteredCards.filter((card) => !usedCardIds.has(card.id));
  }

  // Check if there are no matching cards left
  if (filteredCards.length === 0) {
    // Check if sessionOpen and if cards of that type existed in the history
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

  // Perform the action (random selection or draw)
  if (action === "random" || action === "draw") {
    return filteredCards[Math.floor(Math.random() * filteredCards.length)];
  }

  return null; // Return null if no valid action was found
};
const generateActionLabel = (action) => {
  if (!action.length) return "";

  const [actionType, ...criteria] = action.split("_");

  // Capitalize the action type (e.g., "draw" -> "Draw")
  let label = actionType.charAt(0).toUpperCase() + actionType.slice(1);

  // Loop through criteria and construct a readable label
  criteria.forEach((criterion) => {
    const [property, value] = criterion.split("-");

    if (property && value) {
      // Capitalize the value (e.g., "relic" -> "Relic")
      const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);

      // Use the property to provide context, e.g., "Type: Relic"
      label += ` ${capitalizedValue}`;
    }
  });

  return label;
};

const GameDetails = observer(({ params }) => {
  const { slug } = params;

  // Declare hooks at the top of the component
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCardHistory, setSelectedCardHistory] = useState([]);
  const [isCardView, setIsCardView] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(true); // State to control session behavior
  const [lastCardMessage, setLastCardMessage] = useState(""); // State to store messages
  const [showHistory, setShowHistory] = useState(false);
  // Move games declaration into useMemo
  const games = useMemo(() => MobxStore.app.games || [], []);
  const game = useMemo(() => 
    games.length > 0 ? games.find((g) => g.slug === slug) : null,
    [games, slug]
  );

  useEffect(() => {
    // Fetch the game summaries if not already fetched
    if (MobxStore.app.games.length === 0) {
      MobxStore.fetchGamesSummaryFromFirestore();
    }

    // Fetch cards and expansions for this specific game if they haven't been fetched yet
    if (game && game.cards === null && game.expansions === null) {
      MobxStore.fetchGameDetailsFromFirestore(game.id);
    }
  }, [games, game]);

  // Handle cases where the game data is still loading or missing
  if (!game) {
    return <p>Loading game data...</p>;
  }

  if (game.cards === null || game.expansions === null) {
    return <p>Loading game details...</p>;
  }
  // State to store messages
  const filteredMethods = selectedType
    ? game.methodsConfig.filter((method) => method.type === selectedType)
    : [];

  // Handler for method click
  const handleMethodClick = (method) => {
    const result = filterCardsByMethod(
      game,
      method.method,
      selectedCardHistory,
      sessionOpen
    );

    if (typeof result === "string") {
      // It's a message ('All used' or 'No card exists...')
      setLastCardMessage(result);
      setSelectedCardHistory([...selectedCardHistory]); // Maintain the current history
      setIsCardView(true); // Switch to card view to show the message
    } else if (result) {
      // It's a card object
      setLastCardMessage(""); // Clear any previous message
      setSelectedCardHistory([
        ...selectedCardHistory,
        { ...result, method: method.method },
      ]);
      setIsCardView(true); // Switch to card view
    }
  };

  // Handler to show methods again
  const handleBackToMethods = () => {
    setIsCardView(false);
  };

  // Handler to re-call the current method
  const handleRefreshMethod = () => {
    if (selectedCardHistory.length > 0) {
      const lastCard = selectedCardHistory[selectedCardHistory.length - 1];
      handleMethodClick({ method: lastCard.method });
    }
  };

  // Get the last card in the history
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
          <div className="flex flex-wrap gap-4 mb-6">
            {Object.entries(game.types).map(([key, value], i) => (
              <div
                key={key}
                className={`border flex justify-center flex-col items-center p-4 rounded-lg cursor-pointer ${
                  selectedType === key
                    ? "bg-blue-300 border-blue-500"
                    : "hover:bg-gray-100"
                } transition`}
                onClick={() => setSelectedType(key)}
              >
                <h2 className="text-xl font-semibold mb-2">{value.name}</h2>
                <Image
                  src={`https://picsum.photos/id/${10 + i}/200/200`}
                  alt={value.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-md"
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
                    src={`https://picsum.photos/id/${120 + i}/200/200`}
                    alt={method.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </>
      ) : // Card view
      lastCardMessage ? (
        <div className="mt-6 p-4 border border-gray-300 rounded-lg text-center">
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
            <Image
              src={lastCard.imageUrl}
              alt={lastCard.name}
              width={200}
              height={200}
              className="w-48 h-48 object-cover rounded-md mt-4 mx-auto"
            />

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
