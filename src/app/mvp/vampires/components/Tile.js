// Tile.js

import React from "react";

import { getIcon, renderIcons } from "./Icons";

const Tile = ({ cost, tileType, completionBonus, content, row }) => {
  return (
    <div className={`h-[110px] border rounded-md tile-${tileType} relative`}>
      <div className="pl-2 flex justify-between">
        <div className="flex gap-1 py-2">{renderIcons(cost)}</div>

        {/* Type Image */}
        <div className="type-image mb-2">{getIcon(tileType, 40)}</div>
      </div>

      {/* Content */}
      <div className="content-center mt-2 mb-4">
        {/* {renderContent(tileType, content)} */}
      </div>

      {/* Completion Bonus */}
      <div className="absolute bottom-2 left-2">
        {/* {getIcon(completionBonus, 30)} */}
      </div>
    </div>
  );
};

export default Tile;
