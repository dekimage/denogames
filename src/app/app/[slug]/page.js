"use client";

import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import static data
import { staticGames } from "@/dungeon"; // Adjust the path as needed
import { BonusCard } from "../CardComponents/BonusCard";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const getImageFromType = (type) => {
  const imageMap = {
    "type-bonus": "dungeoneers/cover-ai-images/startingbonus.png",
    "type-passive": "dungeoneers/cover-ai-images/passive.png",
    "type-heropower": "dungeoneers/cover-ai-images/heropower.png",
    "type-trade": "dungeoneers/draw_1_card.png",
    "type-epiccard": "dungeoneers/draw_1_epic.png",
    "type-darkmoon": "dungeoneers/fortune-card.png",
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

  // Function to reroll card without adding to history
  const handleRerollMethod = () => {
    if (selectedCardHistory.length > 0) {
      const lastCard = selectedCardHistory[selectedCardHistory.length - 1];
      // Draw a new card based on the last method used, but don't use history
      const result = filterCardsByMethod(
        game,
        lastCard.method,
        [],
        sessionOpen
      );
      if (typeof result === "string") {
        setLastCardMessage(result);
      } else if (result) {
        setLastCardMessage("");
        // Display the rerolled card but don't add it to history
        setSelectedCardHistory([
          ...selectedCardHistory.slice(0, -1),
          { ...result, method: lastCard.method },
        ]);
      }
    }
  };

  // Function to draw a card and add it to the history
  const handleDrawMethod = () => {
    console.log("handleDrawMethod called");

    if (selectedCardHistory.length > 0) {
      const lastCard = selectedCardHistory[selectedCardHistory.length - 1];
      console.log("Last card in history: ", lastCard);

      // Draw a new card based on the last method
      const result = filterCardsByMethod(
        game,
        lastCard.method,
        selectedCardHistory,
        sessionOpen
      );

      console.log("Result from filterCardsByMethod: ", result);

      if (typeof result === "string") {
        setLastCardMessage(result);
      } else if (result) {
        setLastCardMessage("");

        // Check if the card is already in history
        const isCardAlreadyInHistory = selectedCardHistory.some(
          (card) => card.id === result.id
        );

        console.log("Is card already in history?", isCardAlreadyInHistory);

        if (!isCardAlreadyInHistory) {
          console.log("Adding card to history...");

          // Clear the previous state and then add the card cleanly
          setSelectedCardHistory((prevHistory) => {
            const updatedHistory = [
              ...prevHistory,
              { ...result, method: lastCard.method },
            ];
            console.log("Updated card history: ", updatedHistory);
            return updatedHistory;
          });

          // Ensure the view goes back to methods after drawing
          setIsCardView(false);
        }
      }
    } else {
      console.log("No cards in history to draw from.");
    }
  };

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
    setShowHistory(false);
  };

  const handleRefreshMethod = () => {
    if (selectedCardHistory.length > 0) {
      const lastCard = selectedCardHistory[selectedCardHistory.length - 1];
      handleMethodClick({ method: lastCard.method });
    }
  };

  const lastCard = selectedCardHistory[selectedCardHistory.length - 1];

  return (
    <div className="p-4 flex flex-col items-center h-full h-screen">
      {!isCardView ? (
        // Methods and types view
        <>
          {/* <Link
            className="text-gray-500 underline flex items-center"
            href="/app"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Games
          </Link> */}
          <h1 className="text-3xl font-strike uppercase mb-4">{game.name}</h1>
          <p className="text-gray-700 mb-6">{game.description}</p>
          <Button
            className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition mb-4"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? "Hide History" : "View History"}
          </Button>
          {showHistory && (
            <div className="w-full overflow-x-scroll flex space-x-4 py-4 hide-scrollbar mb-8 min-h-[300px]">
              {selectedCardHistory.map((card, index) => (
                <div
                  key={index}
                  className="min-w-[150px] p-2 rounded-lg flex-shrink-0"
                >
                  {/* <Image
                    src={card.imageUrl}
                    alt={card.name}
                    width={100}
                    height={100}
                    className="w-24 h-24 object-cover rounded-md mb-2"
                  />
                  <h3 className="text-sm font-semibold">{card.name}</h3> */}
                  <BonusCard isHistory effect={card.effect} type={card.type} />
                </div>
              ))}
            </div>
          )}
          {/* Card Types */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {selectedType ? (
              // Show a "Back to All Types" button when a type is selected s
              <Button variant="reverse" onClick={() => setSelectedType(null)}>
                <ChevronLeft className="mr-1" /> Back
              </Button>
            ) : (
              // Show the types when no type is selected
              Object.entries(game.types).map(([key, value], i) => (
                <div className="box-inner" key={key}>
                  <div
                    className={`box-broken max-w-[350px] border flex justify-center flex-col items-center p-4 rounded-lg cursor-pointer ${
                      selectedType === key
                        ? "bg-blue-300 border-blue-500"
                        : "hover:bg-gray-100"
                    } transition`}
                    onClick={() => setSelectedType(key)}
                  >
                    <h2 className="text-xl font-strike uppercase mb-2">
                      {value.name}
                    </h2>
                    <Image
                      // src={`${baseUrl}/${getImageFromType(key)}`}
                      src={`/${getImageFromType(key)}`}
                      alt={value.name}
                      width={250}
                      height={250}
                      className="w-[125px] h-[125px] object-cover rounded-md"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* {selectedType && (
            <div className="mb-4 gap-2 flex">
              <Button variant="outline">What are {selectedType}?</Button>
              <Button variant="outline">View All</Button>
            </div>
          )} */}
          {/* Methods for the Selected Type */}
          {selectedType && (
            <div className="flex flex-wrap gap-4 mb-6 h-full w-full">
              {filteredMethods.map((method, i) => (
                <>
                  <div
                    key={method.method}
                    className="flex flex-col justify-start items-center  w-full h-1/2 p-4  "
                    // onClick={() => handleMethodClick(method)}
                  >
                    <div className="mr-4">
                      <div className="text-2xl font-strike uppercase">
                        {method.name}
                      </div>
                    </div>
                    <Image
                      // src={`${baseUrl}/${getImageFromType(selectedType)}`}
                      src={`/${getImageFromType(method.type)}`}
                      alt={method.name}
                      width={200}
                      height={200}
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  </div>
                  <Button
                    className="w-full h-1/2 text-[60px] p-12 bg-green-500"
                    onClick={() => handleMethodClick(method)}
                  >
                    Draw
                  </Button>
                </>
              ))}
            </div>
          )}
        </>
      ) : // Card view
      lastCardMessage ? (
        <div className="w-full mt-6 border border-gray-300 rounded-lg text-center">
          <h2 className="text-2xl font-strike uppercase mb-2">
            {lastCardMessage}
          </h2>
          <button
            className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
            onClick={handleBackToMethods}
          >
            ⬅ Back
          </button>
        </div>
      ) : (
        lastCard && (
          <div className="w-full max-w-[600px] h-full flex flex-col justify-between   text-center items-center">
            <h2 className="text-2xl font-strike uppercase mb-2">
              {lastCard.name}
            </h2>
            {/* <p className="text-gray-700 mb-4">{lastCard.description}</p> */}

            {lastCard.type !== "newtype" ? (
              // Render the CardEffect component for "bonus" cards
              <BonusCard effect={lastCard.effect} type={lastCard.type} />
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
            <div className="flex justify-between mt-6 mb-10 gap-6">
              <Button variant="reverse" onClick={handleBackToMethods}>
                <ChevronLeft className="mr-1" /> Back
              </Button>
              <Button variant="reverse" onClick={handleRerollMethod}>
                <RefreshCcw className="mr-1" /> Reroll
              </Button>
              <Button variant="reverse" onClick={handleDrawMethod}>
                Draw
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  );
});

export default GameDetails;
