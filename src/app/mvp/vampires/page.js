// GamePage.js

"use client";

import React from "react";
import BlocksLayout from "./components/BlockSection";
import VampireCardDisplay from "./components/VampireCard";
import TombsSection from "./components/TombsSection";
import TilesSection from "./components/TilesSection";
import QRCodeComponent from "@/utils/qr";

// import vampireMap from "../../../../public/vampires/vampire-map.png";

const GameFooter = () => {
  return (
    <div className="flex justify-between items-center bg-white w-[90%]">
      <div>DenoGames Copyright 2024</div>
      <QRCodeComponent url="https://denogames.com/app/engine/vampires" />
    </div>
  );
};

const GamePage = () => {
  return (
    <div
      className="flex flex-col justify-start items-start p-[10px]"
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
      <GameFooter />
    </div>
  );
};

export default GamePage;
