// Tile.js

import React from "react";
import { getIcon, renderIcons } from "./Icons";
import { renderContent } from "./TileContent";

const darkenColor = (hex, percent) => {
  const num = parseInt(hex.slice(1), 16); // Remove `#` and parse
  const amt = Math.round(2.55 * percent); // Calculate the adjustment amount
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  // Ensure values are within 0-255
  const newR = Math.max(Math.min(255, R), 0);
  const newG = Math.max(Math.min(255, G), 0);
  const newB = Math.max(Math.min(255, B), 0);

  // Return the new hex color
  return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB)
    .toString(16)
    .slice(1)}`;
};

const getColorByTileType = (tileType) => {
  if (tileType === "prestige") return "#e9e9eb"; // Gray
  if (tileType === "military") return "#f8d7da"; // Light Red
  if (tileType === "farming") return "#f2e6f7"; // Light Green
  if (tileType === "engine") return "#dbe4f7"; // Light Blue
  if (tileType === "artifact") return "#f1e4d3"; // Light Purple
};

const getHouseByColumn = (column) => {
  if (column === 1) return "housePurple";
  if (column === 2) return "houseBrown";
  if (column === 3) return "houseRed";
  if (column === 4) return "houseGreen";
};

const Tile = ({ cost, tileType, completionBonus, content, column, row }) => {
  const tileColor = getColorByTileType(tileType);
  const darkerTileColor = darkenColor(tileColor, -20);
  // const tileColor = "#fff";
  // const darkerTileColor = "#ddd";

  return (
    <div
      className="relative h-[110px] border rounded-md shadow-sm"
      style={{
        backgroundColor: tileColor,
      }}
    >
      <div className="flex justify-between items-center">
        {/* Cost */}
        <div className="w-full border-b">
          <div
            className="flex gap-1 pl-2 py-2 border-r"
            style={{ backgroundColor: darkerTileColor }} // Use darker color
          >
            {renderIcons(cost)}
          </div>
        </div>

        {/* Tile Icon */}
        <div
          className="px-1"
          style={{
            backgroundColor: tileColor,
          }}
        >
          {getIcon(tileType, 40)}
        </div>
      </div>

      {/* Content */}
      <div className="flex mt-4 justify-center items-center">
        {renderContent(tileType, content)}
      </div>

      {/* Completion Bonus */}
      <div className="absolute top-[32px] left-[-2px]">
        {completionBonus && getIcon(getHouseByColumn(column), 30)}
      </div>

      <div className="absolute bottom-[-3px] right-[-2px]">
        {completionBonus && getIcon(completionBonus, 30)}
      </div>
    </div>
  );
};

export default Tile;
