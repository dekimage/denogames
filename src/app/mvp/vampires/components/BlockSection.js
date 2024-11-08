// BlocksPage.js

"use client";

import React, { useEffect, useState } from "react";

import { blocksDeck } from "../data";
import { drawRandomItems, drawSpecificCards } from "../utils";
import { getIcon, renderIcons } from "./Icons";

// Block Component
const Block = ({ name, symbol, resources }) => {
  const isEmblem = symbol.startsWith("emblem");
  return (
    <div className="relative flex items-center p-2 border border-gray-200 rounded-md h-[80px] ">
      {/* BLURRED GLASS -> backdrop-blur-sm bg-white/30 border-white/40 */}

      <div className="absolute top-[0px] left-[55px] text-xs text-gray-500 font-semibold border bg-white rounded-[5px] px-2 border-t-0  flex justify-center">
        {name}
      </div>

      <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mr-4">
        {getIcon(symbol, isEmblem ? 70 : 60)}
      </div>

      <div className="flex items-center space-x-2">
        {renderIcons(resources)}

        {/* <div className="w-6 h-6 border-2 border-dashed border-gray-400 rounded" /> */}
      </div>
    </div>
  );
};

const criteriaConfigs = [
  {
    key: "symbol",
    matchValue: "emblem",
    count: 2,
    positions: [0, 3],
  },
];

// Layout Component for rendering 6 blocks in 2 rows
const BlocksLayout = () => {
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  // Select 6 random blocks from the deck

  useEffect(() => {
    // Perform random drawing only on the client side
    const blocks = drawSpecificCards(blocksDeck, criteriaConfigs, 6);
    setSelectedBlocks(blocks);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-2 my-2">
      {selectedBlocks.map((block, index) => (
        <Block
          key={index}
          symbol={block.symbol}
          name={block.name}
          resources={block.resources}
        />
      ))}
    </div>
  );
};

export default BlocksLayout;
