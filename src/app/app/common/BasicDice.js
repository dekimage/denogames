import React from "react";

// Dot positions for each dice value
const dots = {
  1: [[1, 1]], // Center
  2: [
    [0, 0], // Top-left
    [2, 2], // Bottom-right
  ],
  3: [
    [0, 0], // Top-left
    [1, 1], // Center
    [2, 2], // Bottom-right
  ],
  4: [
    [0, 0], // Top-left
    [0, 2], // Top-right
    [2, 0], // Bottom-left
    [2, 2], // Bottom-right
  ],
  5: [
    [0, 0], // Top-left
    [0, 2], // Top-right
    [1, 1], // Center
    [2, 0], // Bottom-left
    [2, 2], // Bottom-right
  ],
  6: [
    [0, 0], // Top-left
    [1, 0], // Middle-left
    [2, 0], // Bottom-left
    [0, 2], // Top-right
    [1, 2], // Middle-right
    [2, 2], // Bottom-right
  ],
};

// Default hex color palette for each dice value in vampire-inspired pastel shades
const defaultColors = {
  1: "#b2a4c6", // Twilight Purple
  2: "#d17a7a", // Blood Crimson
  3: "#c4c4c4", // Graveyard Gray
  4: "#8faacb", // Dark Blue
  5: "#c8a085", // Coffin Brown
  6: "#e2b8b8", // Pale Rose
};

const BasicDice = ({
  value,
  color = defaultColors[value],
  id = false,
  min = false,
  max = false,
}) => (
  <div
    className="relative w-6 h-6 border-2 border-black rounded-[20%] grid grid-rows-3 grid-cols-3 p-1"
    style={{ backgroundColor: color }}
  >
    {/* Dice ID in top-left */}
    {id && <div className="absolute top-1 left-1 text-xs font-bold">{id}</div>}

    {/* Dice pips */}
    {Array.from({ length: 3 }).map((_, row) =>
      Array.from({ length: 3 }).map((_, col) => (
        <div key={`${row}-${col}`} className="flex items-center justify-center">
          {dots[value].some(([r, c]) => r === row && c === col) && (
            <div className="w-[2px] h-[2px] bg-black rounded-full"></div>
          )}
        </div>
      ))
    )}

    {/* Range in bottom-right */}
    {min && max && (
      <div className="absolute bottom-1 right-1 text-xs">
        {min}-{max}
      </div>
    )}
  </div>
);

export default BasicDice;
