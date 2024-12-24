"use client";
import React, { useRef, useState } from "react";
import { A4_DIMENSIONS, PAPER_DIMENSIONS } from "./utils";
import { heroesCards } from "./data";
import Image from "next/image";
import {
  SPACE_MINERS_COLORS,
  SPACE_MINERS_ICONS,
} from "@/app/app/engine/monstermixology/page";

import boomImg from "../../../../public/monstermixology/boom.png";
import logoImg from "../../../../public/monstermixology/mm-logo.png";
import vpImg from "../../../../public/monstermixology/vp.png";
import cupImg from "../../../../public/monstermixology/cup.png";

import resourceImg from "../../../../public/monstermixology/resource.png";

import template1Img from "../../../../public/monstermixology/template-1.png";
import template2Img from "../../../../public/monstermixology/template-2.png";
import template3Img from "../../../../public/monstermixology/template-3.png";

import tracker1Img from "../../../../public/monstermixology/trackers/t1.png";
import tracker2Img from "../../../../public/monstermixology/trackers/t2.png";
import tracker3Img from "../../../../public/monstermixology/trackers/t3.png";
import tracker4Img from "../../../../public/monstermixology/trackers/t4.png";
import tracker5Img from "../../../../public/monstermixology/trackers/t5.png";
import tracker6Img from "../../../../public/monstermixology/trackers/t6.png";

import QRCodeComponent from "@/utils/qr";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

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

const heroImages = Object.fromEntries(
  Array.from({ length: 25 }, (_, i) => [
    i + 1,
    require(`../../../../public/monstermixology/heroes/h${i + 1}.png`).default,
  ])
);

const getHeroImage = (number) => {
  return heroImages[number] || heroImages[1]; // Fallback to first hero if number not found
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
export const BuildingCard = ({ card, paperSize = "A4" }) => {
  return (
    <div className="relative w-fit text-black w-[200px] h-[240px]">
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
          className="w-[150px] h-[150px]"
        />
      </div>

      <div className="absolute top-2 left-3 text-sm font-bold">
        {card.number}
      </div>

      <div className="absolute top-[140px] left-1/2 -translate-x-[60%] text-xs font-strike uppercase">
        {card.name}
      </div>

      <div className="absolute top-[-6px] right-[9%] text-sm font-strike uppercase">
        <span className="text-xl">{card.vp}</span>
      </div>

      <div
        className="font-default normal-case text-regular absolute bottom-[8%] left-[44%] -translate-x-1/2 text-center text-[10px] h-[55px] flex justify-center items-center pt-1 leading-[1.1]"
        style={{ width: paperSize === "A4" ? "145px" : "140px" }}
      >
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
          className="w-[28px] h-[28px] absolute left-[16px]  top-[25px] -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-md"
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
    3: "reroll",
  };

  const disasterSequence = [2, 2, 3, 2, 2, 3, 2, 2, 3, 2, 2, 3, 2, 2, 3];

  return (
    <div className="flex justify-center items-center gap-2 h-full">
      <div className="flex flex-col justify-center gap-2">
        {/* Boom icon as first element */}
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#FEE2E2" }}
        >
          <Image src={boomImg} alt={"boom img"} width={20} height={20} />
        </div>

        {/* Rest of the disaster sequence */}
        {disasterSequence.map((symbol, index) => (
          <div
            key={index}
            className="w-6 h-6 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center"
          >
            <Image
              src={SPACE_MINERS_ICONS[disasterSymbolMap[symbol] || "coin"]}
              alt="disaster"
              width={14}
              height={14}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
const CoinTracker = ({ coins = 18, paperSize, disableFirstThree = false }) => {
  // Adjust number of coins based on paper size
  const adjustedCoins = paperSize === "LETTER" ? 17 : coins;
  return (
    <TrackerComponent icon="🌕" bgColor="#FEF9C3">
      <div className="flex flex-col gap-2 mb-2">
        {[0].map((row) => (
          <div key={row} className="flex justify-center gap-2">
            {Array.from({ length: adjustedCoins }).map((_, col) => (
              <div
                key={col}
                className={`w-6 h-6 rounded-full border-2 ${
                  !disableFirstThree && col < 3
                    ? "border-black"
                    : "border-dashed border-gray-400"
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
      <div className="flex flex-col gap-2 pr-2">
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
const RerollTracker = () => {
  return (
    <TrackerComponent icon="🛡️" bgColor="#E0F2E9">
      <div className="flex flex-col gap-2 pr-2">
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
                  src={SPACE_MINERS_ICONS["reroll"]}
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
      <div className="text-[13px] uppercase font-strike flex w-full justify-center mb-2">
        8th Drink = Game End
      </div>
      <div className="flex justify-center items-center  max-h-[25px]">
        <div className="flex gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Image
              key={index}
              width={500}
              height={500}
              src={cupImg}
              alt=""
              className="w-[22px] h-[22px] border-[1px] border-black"
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
    <div className="mt-2 h-[70px]">
      <div className="text-[13px] uppercase font-strike flex w-full justify-center mb-4">
        End Scoring
      </div>
      <div className="flex items-center gap-1 mt-2">
        (
        <Image
          width={500}
          height={500}
          src={vpImg}
          alt=""
          className="w-[25px] h-[25px] border-[1px] border-black"
        />
        x
        <Image
          width={500}
          height={500}
          src={cupImg}
          alt=""
          className="w-[25px] h-[25px] border-[1px] border-black"
        />
        ) + (
        <Image
          width={500}
          height={500}
          src={resourceImg}
          alt=""
          className="w-[25px] h-[25px] border-[1px] border-black"
        />{" "}
        / 3) =
        <div className="w-[25px] h-[25px] border-[1px] border-black"></div>
      </div>
    </div>
  );
};

const usePaperSize = () => {
  const [paperSize, setPaperSize] = React.useState("LETTER");

  React.useEffect(() => {
    // Could add detection logic here if needed
    const mediaQuery = window.matchMedia("(max-width: 816px)");
    setPaperSize(mediaQuery.matches ? "LETTER" : "A4");
  }, []);

  return PAPER_DIMENSIONS[paperSize];
};

// Move the helper function before the component
const getRandomCards = (cards, count) => {
  return [...cards].sort(() => Math.random() - 0.5).slice(0, count);
};

const DownloadButton = ({ componentRef, paperSize }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);

    const element = componentRef.current;
    const opt = {
      filename: `monster-mixology-${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: "mm",
        format: paperSize === "A4" ? "a4" : "letter",
        orientation: "landscape",
      },
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {isGenerating ? "Generating PDF..." : "Download PDF"}
    </button>
  );
};

const PrintableSheet = () => {
  const componentRef = useRef();
  const [paperSize, setPaperSize] = useState("A4"); // Default to A4
  const dimensions = PAPER_DIMENSIONS[paperSize];
  const [randomCards, setRandomCards] = useState(() =>
    getRandomCards(heroesCards, 12)
  );

  // Function to generate new random combination
  const generateNewCombination = () => {
    setRandomCards(getRandomCards(heroesCards, 12));
  };

  // Base scale for Letter size
  const baseScale = dimensions.width / PAPER_DIMENSIONS[paperSize].width;
  // Additional scale reduction for Letter size
  // const contentScale = paperSize === "A4" ? 1 : 0.94;
  // Combine both scales for horizontal scaling
  const scaleX = baseScale;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            {paperSize === "A4" ? "A4 Size" : "Letter Size"}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={paperSize}
              onValueChange={setPaperSize}
            >
              <DropdownMenuRadioItem value="A4">A4 Size</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="LETTER">
                Letter Size
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DownloadButton componentRef={componentRef} paperSize={paperSize} />
      </div>

      {/* Hide the actual content by default */}
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          {/* Your existing PrintableSheet content */}
          <div
            className="bg-white flex gap-1"
            style={{
              width: `${dimensions.height}px`,
              height: `${dimensions.width}px`,
              padding: "12px",
              transform: `scaleX(${scaleX})`,
              transformOrigin: "top left",
            }}
          >
            {/* Left side: Building Cards Grid */}
            <div className={`w-[${dimensions.width * 0.7}px]`}>
              <div className="flex gap-2 my-2 mb-1 h-[26px]">
                <ShieldsTracker />
                <RerollTracker />
                <CoinTracker paperSize={paperSize} />
              </div>

              <div
                className="grid grid-cols-4 gap-1"
                style={{
                  transform: paperSize === "LETTER" ? "scale(1, 1)" : "none",
                  transformOrigin: "left",
                }}
              >
                {randomCards.map((card, i) => (
                  <BuildingCard
                    key={card.id}
                    card={card}
                    index={i}
                    paperSize={paperSize}
                  />
                ))}
              </div>
            </div>

            {/* Right side: Trackers Column */}
            <div
              style={{
                width:
                  paperSize === "A4"
                    ? `${dimensions.width * 0.3}px`
                    : `${dimensions.width * 0.35}px`,
                display: "flex",
                gap: "4px",
                flexDirection: "column",
              }}
            >
              <div className="flex justify-center items-center gap-2 mt-2 ml-2">
                <Image
                  src={logoImg}
                  alt="Space Miners Logo"
                  width={1000}
                  height={1000}
                  className="w-[140px]"
                />
                <div className="flex flex-col items-center">
                  <div className="text-black font-strike uppercase text-md mb-2">
                    Deck
                  </div>
                  <QRCodeComponent
                    url="https://www.denogames.com/app/engine/monstermixology"
                    width={90}
                    height={90}
                  />
                </div>
              </div>
              {/* Resource Trackers row */}
              <div className="grid grid-cols-2 w-full">
                {Object.keys(SPACE_MINERS_COLORS.resourceTypes).map(
                  (type, i) => (
                    <div key={i} className="relative">
                      <Image
                        width={1000}
                        height={1400}
                        src={getTrackerImg(i + 1)}
                        alt={type}
                        className="w-[120px] h-[160px]"
                      />
                      {/* Overlay grid of circles */}
                      <div className="absolute top-[53px] left-[51%] -translate-x-1/2 w-[110px]">
                        <div className="grid grid-cols-3 gap-2 place-items-center px-4 mt-1">
                          {Array.from({ length: 9 }).map((_, index) => (
                            <div
                              key={index}
                              className="w-[20px] h-[20px] rounded-full border-2 border-dashed border-gray-400 bg-white/70"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="flex flex-col gap-2 items-center justify-center mt-[-10px]">
                <BlueprintTracker />
                <Score />
              </div>
            </div>

            <div>
              <DisasterTracker isVertical />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PrintableSheet;
