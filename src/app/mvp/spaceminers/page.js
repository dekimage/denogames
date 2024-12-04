"use client";
import React from "react";
import { A4_DIMENSIONS } from "./utils";
import { heroesCards } from "./data";
import Image from "next/image";
import {
  SPACE_MINERS_COLORS,
  SPACE_MINERS_ICONS,
} from "@/app/app/engine/monstermixology/page";

import boomImg from "../../../../public/spaceminers/boom.png";
import logoImg from "../../../../public/spaceminers/mm-logo.png";
import vpImg from "../../../../public/spaceminers/vp.png";
import cupImg from "../../../../public/spaceminers/cup.png";
import resourceImg from "../../../../public/spaceminers/resource.png";

import template1Img from "../../../../public/spaceminers/template-1.png";
import template2Img from "../../../../public/spaceminers/template-2.png";
import template3Img from "../../../../public/spaceminers/template-3.png";

import hero1Img from "../../../../public/spaceminers/heroes/h1.png";
import hero2Img from "../../../../public/spaceminers/heroes/h2.png";
import hero3Img from "../../../../public/spaceminers/heroes/h3.png";
import hero4Img from "../../../../public/spaceminers/heroes/h4.png";
import hero5Img from "../../../../public/spaceminers/heroes/h5.png";
import hero6Img from "../../../../public/spaceminers/heroes/h6.png";
import hero7Img from "../../../../public/spaceminers/heroes/h7.png";
import hero8Img from "../../../../public/spaceminers/heroes/h8.png";
import hero9Img from "../../../../public/spaceminers/heroes/h9.png";
import hero10Img from "../../../../public/spaceminers/heroes/h10.png";
import hero11Img from "../../../../public/spaceminers/heroes/h11.png";
import hero12Img from "../../../../public/spaceminers/heroes/h12.png";

import tracker1Img from "../../../../public/spaceminers/trackers/t1.png";
import tracker2Img from "../../../../public/spaceminers/trackers/t2.png";
import tracker3Img from "../../../../public/spaceminers/trackers/t3.png";
import tracker4Img from "../../../../public/spaceminers/trackers/t4.png";
import tracker5Img from "../../../../public/spaceminers/trackers/t5.png";
import tracker6Img from "../../../../public/spaceminers/trackers/t6.png";

import QRCodeComponent from "@/utils/qr";

const getTrackerImg = (number) => {
  switch (number) {
    case 1:
      return tracker1Img;
    case 2:
      return tracker2Img;
    case 3:
      return tracker3Img;
    case 4:
      return tracker4Img;
    case 5:
      return tracker5Img;
    case 6:
      return tracker6Img;
  }
};

const getTemplateImg = (uses) => {
  switch (uses) {
    case 1:
      return template1Img;
    case 2:
      return template2Img;
    case 3:
      return template3Img;
  }
};

const getHeroImage = (number) => {
  switch (number) {
    case 1:
      return hero1Img;
    case 2:
      return hero2Img;
    case 3:
      return hero3Img;
    case 4:
      return hero4Img;
    case 5:
      return hero5Img;
    case 6:
      return hero6Img;
    case 7:
      return hero7Img;
    case 8:
      return hero8Img;
    case 9:
      return hero9Img;
    case 10:
      return hero10Img;
    case 11:
      return hero11Img;
    case 12:
      return hero12Img;
  }
};

const ResourceTracker = ({ type }) => {
  return (
    <div className="flex flex-col border-2 border-black rounded-lg p-1 w-[120px] relative">
      {/* Resource Header - positioned absolutely */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xl border-2 border-black"
          style={{ backgroundColor: SPACE_MINERS_COLORS.resourceTypes[type] }}
        >
          {SPACE_MINERS_ICONS.resourceTypes[type]}
        </div>
      </div>

      {/* Tracker Grid - 4 columns */}
      <div className="flex justify-between gap-1 mt-4">
        {[0, 1, 2, 3].map((col) => (
          <div key={col} className="flex flex-col gap-1">
            {Array.from({ length: 4 }).map((_, row) => (
              <div
                key={row}
                className="w-6 h-6 rounded-full border border-dashed border-gray-400"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
export const BuildingCard = ({ card }) => {
  return (
    <div className="relative w-fit">
      <Image
        src={getTemplateImg(card.uses)}
        alt={card.name}
        height={1400}
        width={1100}
        className="w-[200px] h-[240px] rounded-[10px]"
      />

      {/* Hero artwork overlay */}
      <div className="absolute top-[68px] left-[46%] -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px]">
        <Image
          src={getHeroImage(card.id)}
          alt={`${card.name} artwork`}
          height={1000}
          width={1000}
          className="w-[150px] h-[150px] "
        />
      </div>

      {/* Overlaid text elements */}
      <div className="absolute top-2 left-3 text-sm font-bold">
        {card.number}
      </div>

      <div className="absolute top-[147px] left-1/2 -translate-x-[60%] text-xs font-strike uppercase">
        {card.name}
      </div>

      <div className="absolute top-[2%] right-[9%] text-sm font-strike uppercase">
        <span className="text-xl">{card.vp}</span>
      </div>

      <div className="absolute bottom-[6%] left-[44%] -translate-x-1/2 w-[180px] text-center text-[10px] h-[55px] w-[130px]  flex justify-center items-center pt-1 leading-[1.1]">
        {card.effect}
      </div>
    </div>
  );
};
const TrackerComponent = ({ icon, bgColor, hasIcon = false, children }) => {
  return (
    <div className="flex flex-col rounded-lg w-full relative">
      {hasIcon && (
        <div
          className="w-[28px] h-[28px] absolute left-[16px]  top-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-md"
          style={{ backgroundColor: bgColor }}
        >
          <Image src={boomImg} alt={"boom img"} width={20} height={20} />
        </div>
      )}

      {children}
    </div>
  );
};
const DisasterTracker = () => {
  const disasterSymbolMap = {
    1: "coin",
    2: "shield",
    3: "star",
  };

  const disasterSequence = [
    1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2,
    1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 3,
  ];

  return (
    <TrackerComponent icon="☠️" bgColor="#FEE2E2" hasIcon={true}>
      {/* red-200 */}
      <div className="flex flex-col gap-2 pl-6">
        {[0, 1].map((row) => (
          <div key={row} className="flex justify-center gap-2">
            {Array.from({ length: 7 }).map((_, col) => (
              <div
                key={col}
                className="w-6 h-6 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center"
              >
                <Image
                  src={
                    SPACE_MINERS_ICONS[
                      disasterSymbolMap[disasterSequence[row * 20 + col]] ||
                        "coin"
                    ]
                  }
                  alt="disaster"
                  width={14}
                  height={14}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </TrackerComponent>
  );
};
const CoinTracker = () => {
  return (
    <TrackerComponent icon="🌕" bgColor="#FEF9C3">
      <div className="flex flex-col gap-2 mb-2">
        {[0].map((row) => (
          <div key={row} className="flex justify-center gap-2">
            {Array.from({ length: 14 }).map((_, col) => (
              <div
                key={col}
                className={`w-6 h-6 rounded-full border-2 ${
                  col < 3 ? "border-black" : "border-dashed border-gray-400"
                } flex items-center justify-center text-[12px]`}
              >
                <Image
                  src={SPACE_MINERS_ICONS["coin"]}
                  alt="disaster"
                  width={14}
                  height={14}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </TrackerComponent>
  );
};
const ShieldsTracker = () => {
  return (
    <TrackerComponent icon="🛡️" bgColor="#E0F2E9">
      <div className="flex flex-col gap-2 pl-8">
        {[0].map((row) => (
          <div key={row} className="flex justify-center gap-2">
            {Array.from({ length: 3 }).map((_, col) => (
              <div
                key={col}
                className={`w-6 h-6 rounded-full border-2 ${
                  col < 3 ? "border-black" : "border-dashed border-gray-400"
                } flex items-center justify-center text-[12px]`}
              >
                <Image
                  src={SPACE_MINERS_ICONS.shield}
                  alt="shield"
                  width={14}
                  height={14}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </TrackerComponent>
  );
};
const BlueprintTracker = () => {
  return (
    <TrackerComponent icon="📋" bgColor="#BFDBFE">
      <div className="flex justify-between items-center  max-h-[25px]">
        <div className="flex gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Image
              key={index}
              width={500}
              height={500}
              src={cupImg}
              alt=""
              className="w-[25px] h-[25px] border-[3px] border-black"
            />
          ))}
        </div>
        {/* <div className="flex items-center gap-2">
          <div className="h-10 w-[1px] bg-black"></div>
          <div className="font-bold text-xs uppercase tracking-wider bg-blue-100 px-2 py-1 rounded-lg border-2 border-black">
            End Game
          </div>
        </div> */}
      </div>
    </TrackerComponent>
  );
};
const Score = () => {
  return (
    <div>
      <div className="flex items-center gap-2">
        (
        <Image
          width={500}
          height={500}
          src={vpImg}
          alt=""
          className="w-[25px] h-[25px] border-[3px] border-black"
        />
        x
        <Image
          width={500}
          height={500}
          src={cupImg}
          alt=""
          className="w-[25px] h-[25px] border-[3px] border-black"
        />
        ) + (
        <Image
          width={500}
          height={500}
          src={resourceImg}
          alt=""
          className="w-[25px] h-[25px] border-[3px] border-black"
        />{" "}
        / 3) =
        <div className="w-[25px] h-[25px] border-[3px] border-black"></div>
      </div>
    </div>
  );
};
const ScoringTable = () => {
  const categories = [
    { label: "Customers", icon: "📋" },
    // { label: "Monument Bonuses", icon: "🏛️" },
    { label: "Ingridients (+1VP/3)", icon: "📦" },
    { label: "Total", icon: "⭐" },
  ];

  return (
    <TrackerComponent icon="🏆" bgColor="#FEF3C7">
      <div className="flex flex-col items-center justify-between font-strike uppercase">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center gap-2 w-full">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                <span className="text-xs uppercase tracking-wider">
                  {category.label}
                </span>
                {/* <span className="text-lg">{category.icon}</span> */}
              </div>
              {/* {index === categories.length - 1 && (
                <div className="text-[10px] text-gray-600 italic">
                  Final Score
                </div>
              )} */}
            </div>
            <div
              className={`w-8 h-8 border-2 border-black bg-white flex items-center justify-center
                ${
                  index === categories.length - 1
                    ? "bg-yellow-50 shadow-inner"
                    : "shadow-inner"
                }
                ${index === categories.length - 1 ? "rounded-lg" : "rounded-md"}
              `}
            />
          </div>
        ))}
      </div>
    </TrackerComponent>
  );
};
const PrintableSheet = () => {
  const getRandomCards = (cards, count) => {
    return [...cards].sort(() => Math.random() - 0.5).slice(0, count);
  };

  // const randomBuildingCards = getRandomCards(heroesCards, 12);

  return (
    <div
      className="bg-white flex gap-1"
      style={{
        width: `${A4_DIMENSIONS.height}px`,
        height: `${A4_DIMENSIONS.width}px`,
        padding: "12px",
      }}
    >
      {/* Left side: Building Cards Grid */}
      <div className={`w-[${A4_DIMENSIONS.width * 0.7}px]`}>
        <div className="flex gap-2 my-2 mb-1 h-[26px]">
          <BlueprintTracker />
          <ShieldsTracker />
          <CoinTracker />
        </div>

        <div className="grid grid-cols-4 gap-1">
          {heroesCards.map((card, i) => (
            <BuildingCard key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>

      {/* Right side: Trackers Column */}
      <div className={`w-[${A4_DIMENSIONS.width * 0.3}px] flex flex-col gap-2`}>
        <div className="flex justify-center items-center gap-4">
          <Image
            src={logoImg}
            alt="Space Miners Logo"
            width={1000}
            height={1000}
            className="w-[140px]"
          />
          <div className="flex flex-col items-center">
            <QRCodeComponent
              url="https://www.denogames.com/app/engine/monstermixology"
              width={90}
              height={90}
            />
            <div className="font-strike uppercase text-xs bg-black text-white px-[6px] py-[4px] rounded-[10px]">
              Deck
            </div>
          </div>
        </div>
        {/* Resource Trackers row */}
        <div className="grid grid-cols-2">
          {Object.keys(SPACE_MINERS_COLORS.resourceTypes).map((type, i) => (
            <div key={i} className="relative">
              <Image
                width={1000}
                height={1400}
                src={getTrackerImg(i + 1)}
                alt={type}
                className="w-[132px] h-[170px]"
              />
              {/* Overlay grid of circles */}
              <div className="absolute top-[53px] left-[53%] -translate-x-1/2 w-[110px]">
                <div className="grid grid-cols-3 gap-1 place-items-center px-2">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div
                      key={index}
                      className="w-[20px] h-[20px] rounded-full border-2 border-dashed border-gray-400 bg-white/70"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 items-center justify-center mt-3">
          <DisasterTracker />

          <Score />
        </div>
      </div>
    </div>
  );
};
export default PrintableSheet;
