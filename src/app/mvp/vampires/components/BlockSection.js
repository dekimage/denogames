// BlocksPage.js

"use client";

import React, { useEffect, useState } from "react";

import { blocksDeck } from "../data";
import { drawRandomItems } from "../utils";
import { getIcon, renderIcons } from "./Icons";

// Block Component
const Block = ({ name, resources }) => {
  return (
    <div className="relative flex items-center p-2 border border-gray-200 rounded-md h-[80px]">
      {/* Block name (absolutely positioned above) */}
      <div className="absolute -top-3 left-2 text-xs text-gray-500 font-semibold">
        {name}
      </div>

      {/* Icon on the left side, based on block name */}
      <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mr-4">
        {/* <img src={iconMap[name]} alt={name} className="w-12 h-12" /> */}
      </div>

      {/* Resources/Dice on the right */}
      <div className="flex items-center space-x-2">
        {renderIcons(resources)}

        {/* Completion checkbox at the end */}
        <div className="w-6 h-6 border-2 border-dashed border-gray-400 rounded" />
      </div>
    </div>
  );
};

// Layout Component for rendering 6 blocks in 2 rows
const BlocksLayout = () => {
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  // Select 6 random blocks from the deck

  useEffect(() => {
    // Perform random drawing only on the client side
    const blocks = drawRandomItems(blocksDeck, 6);
    setSelectedBlocks(blocks);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-2 my-6">
      {selectedBlocks.map((block, index) => (
        <Block key={index} name={block.name} resources={block.resources} />
      ))}
    </div>
  );
};

export default BlocksLayout;
