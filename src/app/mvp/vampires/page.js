// GamePage.js

"use client";

import React from "react";
import BlocksLayout from "./components/BlockSection";
import VampireCardDisplay from "./components/VampireCard";
import TombsSection from "./components/TombsSection";
import TilesSection from "./components/TilesSection"; // Import the new TilesSection component

const GamePage = () => {
  return (
    <div className="flex flex-col justify-start items-start p-[20px]">
      {/* Tiles Section */}
      <TilesSection />

      {/* BLOCKS SECTION */}
      <BlocksLayout />

      {/* Vampire Card and Tombs Section */}
      <div className="flex gap-2">
        <VampireCardDisplay />
        <TombsSection />
      </div>
    </div>
  );
};

export default GamePage;
