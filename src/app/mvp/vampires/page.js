// GamePage.js

"use client";

import React from "react";
import BlocksLayout from "./components/BlockSection";
import VampireCardDisplay from "./components/VampireCard";
import TombsSection from "./components/TombsSection";
import TilesSection from "./components/TilesSection";

// import vampireMap from "../../../../public/vampires/vampire-map.png";

const GamePage = () => {
  return (
    <div
      className="flex flex-col justify-start items-start p-[20px]"
      // className="flex flex-col justify-start items-start p-[20px] bg-cover bg-center bg-no-repeat min-h-screen"
      // style={{
      //   backgroundImage: `url(${vampireMap.src})`,
      // }}
    >
      <TilesSection />

      <BlocksLayout />

      <div className="flex gap-2">
        <VampireCardDisplay />
        <TombsSection />
      </div>
    </div>
  );
};

export default GamePage;
