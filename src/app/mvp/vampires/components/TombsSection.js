import React, { useEffect, useState } from "react";

import { renderIcons } from "./Icons";
import { tombsDeck } from "../data";
import { drawRandomItems } from "../utils";

import tomb1Image from "../../../../../public/vampires/tombs/tomb_1.png";
import tomb2Image from "../../../../../public/vampires/tombs/tomb_2.png";
import tomb3Image from "../../../../../public/vampires/tombs/tomb_3.png";

const tombImages = [tomb1Image, tomb2Image, tomb3Image];

import Image from "next/image";

const TombCard = ({
  name,
  index,
  nextScoring,
  cost,
  vp,
  powerVp,
  condition,
}) => {
  return (
    <div className="w-[150px] h-full border border-gray-300 rounded-md bg-white flex flex-col items-center shadow-lg">
      {/* Image Section */}
      <div className="bg-gray-100 flex items-center justify-center">
        <Image
          src={tombImages[index]}
          alt={name}
          width={250}
          height={250}
          className=" object-cover h-[125px] w-[125px]"
        />
      </div>

      <div className="uppercase font-strike text-xs text-gray-600  flex justify-center items-center my-1">
        {renderIcons(condition)}
      </div>

      {/* Name Section */}
      <h2 className="text-center uppercase font-strike text-xs pt-1 w-full border-t">
        {name}
      </h2>

      {/* Next Scoring Section */}
      <div className="flex justify-center  space-x-2 mt-1">
        {renderIcons(nextScoring)}
      </div>

      {/* Cost Section - Larger Icons */}
      <div className="flex justify-center space-x-2 my-1 mb-2">
        {renderIcons(cost)}
      </div>

      {/* VP Sections */}
      <div className="px-2 border-t flex  justify-between w-full font-strike uppercase text-gray-600">
        <div className="flex justify-center items-center gap-1 text-xs">
          half {renderIcons(vp)}
        </div>
        <div className="flex justify-center items-center gap-1 text-xs">
          full {renderIcons(powerVp)}
        </div>
      </div>
    </div>
  );
};

const TombsSection = () => {
  const [tombs, setTombs] = useState([]);

  useEffect(() => {
    // Draw 4 random tombs
    const selectedTombs = drawRandomItems(tombsDeck, 3);
    setTombs(selectedTombs);
  }, []);

  return (
    <div className="flex gap-2">
      {tombs.map((tomb, index) => (
        <TombCard
          key={index}
          index={index}
          name={tomb.name}
          nextScoring={tomb.nextScoring}
          cost={tomb.cost}
          vp={tomb.vp}
          powerVp={tomb.powerVp}
          condition={tomb.condition}
        />
      ))}
    </div>
  );
};

export default TombsSection;
