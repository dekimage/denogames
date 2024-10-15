"use client";
import { Button } from "@/components/ui/button";
import {
  smallTradeCards,
  mediumTradeCards,
  largeTradeCards,
  buildingCards,
  smallBuildCards,
  mediumBuildCards,
  largeBuildCards,
} from "@/data/builders-town";
import React, { useState } from "react";

// Icon mapping for resources and card types
export const iconMapping = {
  wheat: "builders-town/wheat.jpeg",
  water: "builders-town/water.jpeg",
  fish: "builders-town/fish.jpeg",
  meat: "builders-town/meat.jpeg",
  wood: "builders-town/wood.jpeg",
  steel: "builders-town/steel.jpeg",
  bricks: "builders-town/bricks.jpeg",
  1: "builders-town/red.jpeg",
  2: "builders-town/blue.jpeg",
  3: "builders-town/purple.jpeg",
  4: "builders-town/yellow.jpeg",
  production: "builders-town/production.png",
  engine: "builders-town/engine.png",
  prestige: "builders-town/prestige.png",
  wargear: "builders-town/wargear.jpeg",
  gold: "builders-town/gold.png",
  "=>": "builders-town/arrow.jpeg",
};

// New color mapping for resources
export const resourceColorMapping = {
  wheat: "bg-yellow-200",
  water: "bg-blue-200",
  fish: "bg-cyan-200",
  meat: "bg-red-200",
  wood: "bg-amber-200",
  steel: "bg-gray-300",
  bricks: "bg-orange-200",
  gold: "bg-green-200",
};

const getRandomCards = (cards, count) => {
  const shuffled = [...cards].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const PrintCards = () => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedBuildingCards, setSelectedBuildingCards] = useState([]);

  // Function to generate 28 random Trade Cards according to the new rules
  const generateRandomTradeCards = () => {
    const smallCards = getRandomCards(smallTradeCards, 8);
    const mediumCards = getRandomCards(mediumTradeCards, 8);
    const largeCards = getRandomCards(largeTradeCards, 12);

    const randomCards = [...smallCards, ...mediumCards, ...largeCards];
    setSelectedCards(randomCards);
  };

  // Function to generate 24 Building Cards
  const generateBuildingCards = () => {
    const smallCards = getRandomCards(smallBuildCards, 8);
    const mediumCards = getRandomCards(mediumBuildCards, 8);
    const largeCards = getRandomCards(largeBuildCards, 8);

    const randomCards = [...smallCards, ...mediumCards, ...largeCards];
    setSelectedBuildingCards(randomCards);
  };

  // Function to trigger the print dialog
  const handlePrint = () => {
    window.print();
  };

  const renderResourceIcon = (resource) => (
    <div
      className={`w-7 h-7 rounded-full ${resourceColorMapping[resource]} flex items-center justify-center p-0.5`}
    >
      <img
        src={`/${iconMapping[resource]}`}
        alt={resource}
        className="w-5 h-5 object-contain"
      />
    </div>
  );

  // Configuration for card type colors
  const cardTypeColorConfig = {
    production: "bg-green-200",
    engine: "bg-blue-200",
    wargear: "bg-red-200",
    prestige: "bg-purple-200",
  };

  // Add this new function to render the card type icon
  const renderCardTypeIcon = (type) => (
    <div
      className={`w-8 h-8 rounded-full ${
        cardTypeColorConfig[type] || "bg-gray-200"
      } flex items-center justify-center`}
    >
      <img
        src={`/${iconMapping[type]}`}
        alt={type}
        className="w-6 h-6 object-contain"
      />
    </div>
  );

  return (
    <div className="p-4">
      {/* Button to generate 28 random trade cards */}
      <Button
        variant="reverse"
        className="mb-4 print:hidden mr-2"
        onClick={generateRandomTradeCards}
      >
        Generate Trade Cards
      </Button>

      {/* Button to print the Trade cards */}
      {selectedCards.length > 0 && (
        <Button
          variant="reverse"
          className="mb-4 print:hidden mr-2"
          onClick={handlePrint}
        >
          Print Trade Cards
        </Button>
      )}

      {/* Display the trade cards */}
      <div
        id="cards-container"
        className="grid grid-cols-4 gap-x-1 gap-y-2 print:grid-cols-4 print:gap-x-1 print:gap-y-2 print:m-1"
        style={{
          maxWidth: "210mm",
          maxHeight: "297mm",
          pageBreakInside: "avoid",
          pageBreakAfter: "always",
          padding: "4mm 0",
        }}
      >
        {selectedCards.map((card) => (
          <div className="box-inner" key={card.id}>
            <div
              className="border border-gray-200 rounded-lg p-1  print:border-gray-200 box-broken"
              style={{
                backgroundColor: "#a5a58d",
                border: "1px solid #bc6c25",
                pageBreakInside: "avoid",
                width: "46mm",
                height: "34mm",
              }}
            >
              <div className="flex justify-center items-center mb-1">
                <img
                  src={`/${iconMapping[card.faction]}`}
                  alt={card.faction}
                  className="w-6 h-6"
                />
                {/* <img
                src={`/builders-town/goods.png`}
                alt="goods"
                className="w-6 h-6"
              /> */}
              </div>
              <div className="mt-1 border bg-red-100 h-[40px] flex items-center justify-center rounded-[20px] mx-2">
                <div className="flex justify-center flex-wrap">
                  {card.cost.match(/\[([^\]]+)\]/g).map((item, index) => {
                    const resource = item.replace(/\[|\]/g, "");
                    return (
                      <div key={index} className="mx-0.5 mb-0.5">
                        {renderResourceIcon(resource)}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-1 border bg-green-100 h-[40px] flex items-center justify-center rounded-[20px] mx-2">
                <div className="flex justify-center flex-wrap">
                  {card.gain.match(/\[([^\]]+)\]/g).map((item, index) => {
                    const resource = item.replace(/\[|\]/g, "");
                    return (
                      <div key={index} className="mx-0.5 mb-0.5">
                        {renderResourceIcon(resource)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Button to generate Building Cards */}
      <Button
        variant="reverse"
        className="mb-4 print:hidden mr-2"
        onClick={generateBuildingCards}
      >
        Generate Building Cards
      </Button>

      {/* Button to print the Building cards */}
      {selectedBuildingCards.length > 0 && (
        <Button
          variant="reverse"
          className="mb-4 print:hidden mr-2"
          onClick={handlePrint}
        >
          Print Building Cards
        </Button>
      )}

      {/* Display the building cards */}
      <div
        id="building-cards-container"
        className="grid grid-cols-4 gap-x-1 gap-y-2 print:grid-cols-4 print:gap-x-1 print:gap-y-2 print:m-1"
        style={{
          maxWidth: "210mm",
          maxHeight: "297mm",
          pageBreakInside: "avoid",
          pageBreakAfter: "always",
          padding: "4mm 0",
        }}
      >
        {selectedBuildingCards.map((card) => (
          <div className="box-inner" key={card.id}>
            <div
              className="box-broken border border-gray-200 rounded-lg p-1 bg-white print:border-gray-200"
              style={{
                backgroundColor: "#d4a373",
                border: "1px solid #bc6c25",
                pageBreakInside: "avoid",
                width: "46mm",
                height: "34mm",
              }}
            >
              <div className="flex justify-between items-center mb-1">
                {renderCardTypeIcon(card.type)}
                <div
                  className="w-8 h-8 rounded-full border border-dashed border-gray-400"
                  style={{ backgroundColor: "#fefae0" }}
                ></div>
                <span className="text-xl font-bold text-black bg-cream rounded-full border border-black p-1 w-8 h-8 flex items-center justify-center">
                  {card.vp}
                </span>
              </div>
              <div
                className="mt-1 border bg-green-100 h-[40px] flex items-center justify-center"
                style={{
                  backgroundColor: "#fefae0",
                }}
              >
                <div className="flex justify-center flex-wrap">
                  {card.cost.match(/\[([^\]]+)\]/g).map((item, index) => {
                    const resource = item.replace(/\[|\]/g, "");
                    return (
                      <div key={index} className="mx-0.5 mb-0.5">
                        {renderResourceIcon(resource)}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-1 border bg-green-100 h-[40px] flex items-center justify-center">
                <div className="flex justify-center flex-wrap">
                  {card.effect && card.effect.match(/\[([^\]]+)\]/g)
                    ? card.effect.match(/\[([^\]]+)\]/g).map((item, index) => {
                        const resource = item.replace(/\[|\]/g, "");
                        return (
                          <div key={index} className="mx-0.5 mb-0.5">
                            {resource === "=>" ? (
                              <img
                                src={`/${iconMapping[resource]}`}
                                alt={resource}
                                className="w-5 h-5"
                              />
                            ) : (
                              renderResourceIcon(resource)
                            )}
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CSS to handle printing */}
      <style jsx>{`
        @media print {
          button {
            display: none; /* Hide buttons when printing */
          }
          body {
            margin: 0;
            padding: 0;
          }
          #cards-container,
          #building-cards-container {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintCards;
