// VampireCard.js

import React, { useEffect } from "react";

import { renderIcons } from "./Icons";
import { vampireDeck } from "../data";
import { useState } from "react";
import { drawRandomItems } from "../utils";

import vampireImage from "../../../../../public/vampires/vampires/vampire-art.png";
import Image from "next/image";

// VampireCard Component
const VampireCard = ({ image, name, startingBonuses, passive, uses }) => {
  return (
    <div className="border border-gray-300 rounded-lg w-[150px] h-[270px] flex flex-col items-center bg-white">
      {/* Image Section */}
      <div className="w-[150px] h-[150px]">
        <Image
          src={image}
          alt={name}
          width={150}
          height={150}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name Section */}
      <h2 className="text-center font-bold text-sm mt-2">{name}</h2>

      {/* Starting Bonuses */}
      <div className="flex justify-center mt-2">
        {renderIcons(startingBonuses)}
      </div>

      {/* Passive Section */}
      {/* <div className="flex justify-center mt-2">{renderIcons(passive)}</div> */}

      {/* Uses Section (Dashed Squares) */}
      {/* <div className="flex justify-center mt-2 space-x-1">
        {Array.from({ length: uses }).map((_, index) => (
          <div
            key={index}
            className="w-4 h-4 border-2 border-dashed border-gray-400"
          />
        ))}
      </div> */}
    </div>
  );
};

const VampireCardDisplay = () => {
  const [vampire, setVampire] = useState(null);

  useEffect(() => {
    // Draw a single random vampire from the deck
    const [randomVampire] = drawRandomItems(vampireDeck, 1);
    setVampire(randomVampire);
  }, []);

  // Display loading state while vampire is being drawn
  if (!vampire) return <div>Loading...</div>;

  return (
    <VampireCard
      // image={vampire.image}
      image={vampireImage}
      name={vampire.name}
      startingBonuses={vampire.startingBonuses}
      passive={vampire.passive}
      uses={vampire.uses}
    />
  );
};

export default VampireCardDisplay;
