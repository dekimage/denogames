import React, { useEffect, useState } from "react";

import { renderIcons } from "./Icons";
import { tombsDeck } from "../data";
import { drawRandomItems } from "../utils";

import tomb1Image from "../../../../../public/vampires/tombs/tomb-emerald.png";
import tomb2Image from "../../../../../public/vampires/tombs/t2.png";
import tomb3Image from "../../../../../public/vampires/tombs/t3.png";
import tomb4Image from "../../../../../public/vampires/tombs/t4.png";

const tombImages = [tomb1Image, tomb2Image, tomb3Image, tomb4Image];

import Image from "next/image";

const TombCard = ({ name, index, nextScoring, cost, vp, powerVp }) => {
  return (
    <div className="w-[150px] h-[250px] border border-gray-300 rounded-md bg-white flex flex-col items-center shadow-lg">
      {/* Image Section */}
      <div className="w-[150px] h-[150px] bg-gray-100 flex items-center justify-center">
        <Image
          src={tombImages[index]}
          alt={name}
          width={250}
          height={250}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name Section */}
      <h2 className="text-center uppercase font-strike text-xs mt-1">{name}</h2>

      {/* Next Scoring Section */}
      <div className="flex justify-center mt-2">{renderIcons(nextScoring)}</div>

      {/* Cost Section - Larger Icons */}
      <div className="flex justify-center mt-2 h-12">{renderIcons(cost)}</div>

      {/* VP Sections */}
      <div className="flex justify-between mt-2 w-full">
        <div className="text-xs font-semibold text-gray-600">VP: {vp}</div>
        <div className="text-xs font-semibold text-gray-600">
          Power VP: {powerVp}
        </div>
      </div>
    </div>
  );
};

const TombsSection = () => {
  const [tombs, setTombs] = useState([]);

  useEffect(() => {
    // Draw 4 random tombs
    const selectedTombs = drawRandomItems(tombsDeck, 4);
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
        />
      ))}
    </div>
  );
};

export default TombsSection;
