"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { mediumBuildCards, largeBuildCards } from "@/data/farming";
import { Grain } from "../map/page";
import {
  FaCrown,
  FaPlus,
  FaMinus,
  FaQuestion,
  FaArrowRight,
} from "react-icons/fa";
import { iconMapping } from "../../builders-town/test/page";
import Image from "next/image";

const effectIcons = {
  "[mp]": FaArrowRight,
  "[+]": FaPlus,
  "[-]": FaMinus,
  "[?]": FaQuestion,
  "": null,
};

const getRandomCards = (cards, count) => {
  const shuffled = [...cards].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const FarmingCards = () => {
  const [selectedCards, setSelectedCards] = useState([]);

  const generateRandomCards = () => {
    const mediumCards = getRandomCards(mediumBuildCards, 12);
    const largeCards = getRandomCards(largeBuildCards, 12);
    const randomCards = [...mediumCards, ...largeCards];
    setSelectedCards(randomCards);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderCard = (card) => (
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
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <Image
              width={24}
              height={24}
              src={`/${iconMapping[card.type]}`}
              alt={card.type}
              className="w-6 h-6 object-contain"
            />
          </div>
          <span className="text-xl font-bold text-black bg-cream rounded-full border border-black p-1 w-8 h-8 flex items-center justify-center">
            {card.vp}
          </span>
        </div>
        <div className="mt-1 border bg-yellow-100 h-[40px] flex items-center justify-center">
          <div className="flex justify-center flex-wrap">
            {card.cost.match(/\[([^\]]+)\]/g).map((item, index) => {
              const resource = item.replace(/\[|\]/g, "");
              return (
                <div key={index} className="mx-0.5 mb-0.5">
                  <Grain type={resource} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-1 border bg-cream h-[40px] flex items-center justify-center">
          {card.effect && effectIcons[card.effect] && (
            <div className="w-8 h-8 flex items-center justify-center">
              {React.createElement(effectIcons[card.effect], { size: 24 })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <Button
        variant="reverse"
        className="mb-4 print:hidden mr-2"
        onClick={generateRandomCards}
      >
        Generate Cards
      </Button>

      {selectedCards.length > 0 && (
        <Button
          variant="reverse"
          className="mb-4 print:hidden mr-2"
          onClick={handlePrint}
        >
          Print Cards
        </Button>
      )}

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
        {selectedCards.map(renderCard)}
      </div>

      <style jsx>{`
        @media print {
          button {
            display: none;
          }
          body {
            margin: 0;
            padding: 0;
          }
          #cards-container {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default FarmingCards;
