"use client";
import React, { useState, useEffect } from "react";
import {
  FaCrown,
  FaPlus,
  FaMinus,
  FaQuestion,
  FaArrowRight,
} from "react-icons/fa"; // Assuming you're using react-icons for the Crown
import flaxImage from "../../../../../public/farming/flax.png";
import oatImage from "../../../../../public/farming/oat.png";
import wheatImage from "../../../../../public/farming/wheat.png";
import maltImage from "../../../../../public/farming/malt.png";
import riceImage from "../../../../../public/farming/rice.png";
import hopImage from "../../../../../public/farming/hop.png";
import Image from "next/image";
import { generateGridData, GRAINS } from "../functions";

const Table = () => {
  return (
    <table className="border-collapse w-[320px]">
      <thead>
        <tr>
          {/* Empty corner cell for the row labels */}
          <th className="border border-gray-300 px-3 py-1"></th>
          {/* Column headers */}
          {[1, 2, 3, 4, "Total", "Points"].map((header) => (
            <th
              key={header}
              className="border border-gray-300 px-3 py-1 text-sm"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Loop to generate 8 rows */}
        {Array.from({ length: 8 }, (_, rowIndex) => (
          <tr key={rowIndex}>
            {/* Row label */}
            <td className="border border-gray-300 px-3 py-1 text-sm">
              {rowIndex + 1}
            </td>
            {/* 6 empty cells for each row */}
            {Array.from({ length: 6 }, (_, colIndex) => (
              <td
                key={colIndex}
                className="border border-gray-300 px-3 py-1"
              ></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Dice = ({ value }) => {
  // Dots on the dice, depending on the value
  const dots = {
    1: [[1, 1]],
    2: [
      [0, 0],
      [2, 2],
    ],
    3: [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    4: [
      [0, 0],
      [0, 2],
      [2, 0],
      [2, 2],
    ],
    5: [
      [0, 0],
      [0, 2],
      [1, 1],
      [2, 0],
      [2, 2],
    ],
    6: [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 2],
      [1, 2],
      [2, 2],
    ],
  };

  return (
    <div className="w-16 h-16 bg-white border-2 border-black rounded-lg grid grid-rows-3 grid-cols-3 p-1">
      {Array.from({ length: 3 }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <div
            key={`${row}-${col}`}
            className="flex items-center justify-center"
          >
            {dots[value].some(([r, c]) => r === row && c === col) && (
              <div className="w-3 h-3 bg-black rounded-full"></div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const grainsMap = {
  wheat: { color: "bg-yellow-300", diceValue: 5, image: wheatImage },
  malt: { color: "bg-amber-300", diceValue: 6, image: maltImage },
  rice: { color: "bg-amber-500", diceValue: 3, image: riceImage },
  hop: { color: "bg-green-300", diceValue: 2, image: hopImage },
  flax: { color: "bg-blue-300", diceValue: 1, image: flaxImage },
  oat: { color: "bg-gray-300", diceValue: 4, image: oatImage },
};

export const Grain = ({ type }) => {
  const { color, diceValue, image } = grainsMap[type];
  return (
    <div className="relative w-[26px] h-[26px] border rounded-full border-black">
      <div
        className={`w-full h-full rounded-full ${color} flex items-center justify-center overflow-hidden`}
      >
        <Image
          width={24}
          height={24}
          src={image}
          alt={type}
          className="w-[22px] h-[22px] object-contain"
        />
      </div>
      <div className="absolute -bottom-[-5px] -right-[-5px] w-4 h-4 scale-[0.25] origin-bottom-right">
        <Dice value={diceValue} />
      </div>
    </div>
  );
};

const DottedCircle = () => (
  <div className="w-4 h-4 rounded-full border border-gray-400 border-dashed"></div>
);

const GrainWithDots = ({ type }) => (
  <div className="flex flex-col items-center space-y-1">
    <DottedCircle />
    <DottedCircle />
    <DottedCircle />
    <Grain type={type} />
  </div>
);

const Cell = ({ headerGrain, mainGrains }) => (
  <div className="w-[110px] h-[130px] flex flex-col overflow-hidden">
    <div className="flex justify-between items-center p-1">
      <FaCrown className="text-yellow-500" />
      <Grain type={headerGrain} />
      <DottedCircle />
    </div>
    <div className="flex justify-between w-[110px] pl-1 pr-3">
      {mainGrains.map((grain, index) => (
        <GrainWithDots key={index} type={grain} />
      ))}
    </div>
  </div>
);

const GrainTracker = ({ grainType }) => {
  return (
    <div className="w-40 h-32 p-1 flex flex-col">
      <div className="flex items-start justify-between">
        <Grain type={grainType} />
        <div className="ml-2 flex flex-wrap w-32">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="w-1/4 p-1">
              <DottedCircle />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap flex-grow">
        {[...Array(18)].map((_, index) => (
          <div key={index} className="w-1/6 p-1">
            <DottedCircle />
          </div>
        ))}
      </div>
    </div>
  );
};

const GrainTrackers = () => {
  return (
    <div className="inline-block border border-gray-300">
      <div className="flex flex-col">
        {[0, 2, 4].map((rowStart) => (
          <div key={rowStart} className="flex">
            {[0, 1].map((colOffset) => {
              const index = rowStart + colOffset;
              return (
                <div
                  key={index}
                  className={`w-40 h-32 
                    ${colOffset === 0 ? "border-r" : ""} 
                    ${rowStart < 4 ? "border-b" : ""} 
                    border-gray-300`}
                >
                  <GrainTracker grainType={GRAINS[index]} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const TrackerComponent = ({ type }) => {
  const iconMap = {
    plus: FaPlus,
    minus: FaMinus,
    question: FaQuestion,
    arrow: FaArrowRight,
  };

  const Icon = iconMap[type];

  return (
    <div className="flex items-center space-x-2 p-2">
      <div className="w-6">
        {type === "arrow" ? (
          <Icon className="transform rotate-180" />
        ) : (
          <Icon />
        )}
      </div>
      <div className="flex space-x-1">
        {[...Array(6)].map((_, index) => (
          <DottedCircle key={index} />
        ))}
      </div>
    </div>
  );
};

const TrackerGrid = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <TrackerComponent type="plus" />
      <TrackerComponent type="minus" />
      <TrackerComponent type="question" />
      <TrackerComponent type="arrow" />
    </div>
  );
};

const Map = () => {
  const [gridData, setGridData] = useState(null);
  const [error, setError] = useState(null);

  const generateNewMap = () => {
    try {
      const newGridData = generateGridData();
      setGridData(newGridData);
      setError(null);
    } catch (err) {
      console.error("Error generating map:", err);
      setError("Failed to generate map. Please try again.");
    }
  };

  useEffect(() => {
    generateNewMap();
  }, []);

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={generateNewMap}>Try Again</button>
      </div>
    );
  }

  if (!gridData) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="flex gap-4 justify-center items-center p-4">
      <div className="inline-block border border-gray-300">
        <div className="flex flex-wrap" style={{ width: `${110 * 6}px` }}>
          {gridData.map((cellData, index) => {
            const isLastColumn = (index + 1) % 6 === 0;
            const isLastRow = index >= 30; // Assuming 6x6 grid

            return (
              <div
                key={index}
                className={`w-[110px] h-[130px] 
                  ${!isLastColumn ? "border-r" : ""} 
                  ${!isLastRow ? "border-b" : ""} 
                  border-gray-300`}
              >
                <Cell
                  headerGrain={cellData.headerGrain}
                  mainGrains={cellData.mainGrains}
                />
              </div>
            );
          })}
        </div>
      </div>
      {/* <button
        onClick={generateNewMap}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Generate New Map
      </button> */}

      <div className="flex flex-col gap-4 w-[320px]">
        <GrainTrackers />
        <Table />
        <TrackerGrid />
      </div>
    </div>
  );
};

export default Map;
