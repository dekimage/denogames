// GamePage.js

"use client";

import React from "react";
import BlocksLayout from "./components/BlockSection";
import VampireCardDisplay from "./components/VampireCard";
import TombsSection from "./components/TombsSection";
import TilesSection from "./components/TilesSection";

const VampirePalette = () => {
  const colors = [
    { name: "Twilight Purple", shades: ["#CAB8DD", "#9D78C0", "#7045A4"] },
    { name: "Blood Crimson", shades: ["#F2B6C4", "#D96B84", "#A5405E"] },
    { name: "Graveyard Gray", shades: ["#D7D1D9", "#A7A1A9", "#6F6A71"] },
    { name: "Coffin Brown", shades: ["#D8C0A8", "#B89576", "#8F6B4E"] },
    { name: "Mist Blue", shades: ["#C4D4E2", "#90AAC0", "#5A7A8A"] },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {colors.map((color) => (
        <div key={color.name} className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{color.name}</h3>
          <div className="flex space-x-2">
            {color.shades.map((shade, index) => (
              <div
                key={index}
                className="w-16 h-16 rounded-lg"
                style={{ backgroundColor: shade }}
                title={shade}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const GamePage = () => {
  return (
    <div className="flex flex-col justify-start items-start p-[20px]">
      {/* Tiles Section */}
      <TilesSection />

      {/* BLOCKS SECTION */}
      <BlocksLayout />

      {/* Vampire Card and Tombs Section */}
      <VampirePalette />
      <div className="flex gap-2">
        <VampireCardDisplay />
        <TombsSection />
      </div>
    </div>
  );
};

export default GamePage;
