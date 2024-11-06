// Tile.js

import React from "react";

import { getIcon, renderIcons } from "./Icons";
import { renderContent } from "./TileContent";

const Tile = ({ cost, tileType, completionBonus, content, row }) => {
  return (
    <div className={`h-[110px] border rounded-md tile-${tileType} relative`}>
      <div className="pl-2 flex justify-between items-center border-b">
        <div className="flex gap-1 py-2">{renderIcons(cost)}</div>

        <div className="">{getIcon(tileType, 40)}</div>
      </div>

      {/* Content */}
      <div className="flex mt-4 justify-center items-center">
        {renderContent(tileType, content)}
      </div>

      {/* Completion Bonus */}
      <div className="absolute bottom-2 left-2">
        {/* {getIcon(completionBonus, 30)} */}
      </div>
    </div>
  );
};

export default Tile;
