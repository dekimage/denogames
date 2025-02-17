"use client";
import React, { useRef, useState, useEffect } from "react";
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

import selfTriggerImg from "../../../../public/monstermixology/self.png";
import otherTriggerImg from "../../../../public/monstermixology/unique.png";
import uniqueTriggerImg from "../../../../public/monstermixology/other.png";
import endTriggerImg from "../../../../public/monstermixology/end.png";

import QRCodeComponent from "@/utils/qr";
// import { useReactToPrint } from "react-to-print";
import dynamic from "next/dynamic";

const html2pdf = dynamic(() => import("html2pdf.js"), {
  ssr: false,
});

import { useRouter, useSearchParams } from "next/navigation";
import { CustomizeCharacters } from "./CustomizeCharacters";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, Eye, EyeOff } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { gamesStaticData } from "@/app/product-details/productsData";
import { withGameAccess } from "@/components/hoc/withGameAccess";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import Link from "next/link";
import ExpansionSelector from "@/components/ExpansionSelector";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";


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

// Add this mapping object before the BuildingCard component
const TRIGGER_IMAGES = {
  self: selfTriggerImg,
  other: otherTriggerImg,
  unique: uniqueTriggerImg,
  end: endTriggerImg,
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
export const BuildingCard = ({ card, paperSize = "A4", fromApp }) => {
  return (
    <div className="relative w-fit text-black w-[200px] h-[240px]">
      <Image
        src={getTemplateImg(card.uses)}
        alt={card.name}
        height={1400}
        width={1100}
        className="w-[200px] h-[240px] rounded-[10px]"
        unoptimized
      />

      {/* Hero artwork overlay */}
      <div className="absolute top-[68px] left-[46%] -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px]">
        <Image
          src={getHeroImage(card.id)}
          alt={`${card.name} artwork`}
          height={1000}
          width={1000}
          className="w-[150px] h-[150px]"
          unoptimized
        />
      </div>

      <div className={`absolute ${fromApp ? "top-[20px]" : "top-2"} left-3 text-sm font-bold`}>
        {card.number}
      </div>

      <div className={`absolute ${fromApp ? "top-[146px]" : "top-[140px]"} left-1/2 -translate-x-[60%] text-xs font-strike uppercase w-fit`}>
        {card.name}
      </div>

      <div className={`absolute ${fromApp ? "top-[4px]" : "top-[-6px]"} right-[9%] text-sm font-strike uppercase`}>
        <span className="text-xl">{card.vp}</span>
      </div>

      {/* Add the trigger icon */}
      <div className="absolute bottom-[0px] left-[0px]">
        <Image
          src={TRIGGER_IMAGES[card.trigger]}
          alt={`${card.trigger} trigger`}
          width={75}
          height={75}
          className="w-[25px] h-[25px]"
          unoptimized
        />
      </div>

      <div
        className={`font-default normal-case text-regular absolute ${fromApp ? "bottom-[6%]" : "bottom-[8%]"} left-[44%] -translate-x-1/2 text-center text-[10px] h-[55px] flex justify-center items-center pt-1 leading-[1.1]`}
        style={{ width: paperSize === "A4" ? "145px" : "135px" }}
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
          <Image src={boomImg} alt={"boom img"} width={20} height={20} unoptimized />
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
              unoptimized
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
                className={`w-6 h-6 rounded-full border-2 ${!disableFirstThree && col < 3
                  ? "border-black"
                  : "border-dashed border-gray-400"
                  } flex items-center justify-center text-[12px]`}
              >
                <Image
                  src={SPACE_MINERS_ICONS["coin"]}
                  alt="disaster"
                  width={14}
                  height={14}
                  unoptimized
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
                className={`w-6 h-6 rounded-full border-2 ${col < 3 ? "border-black" : "border-dashed border-gray-400"
                  } flex items-center justify-center text-[12px]`}
              >
                <Image
                  src={SPACE_MINERS_ICONS.shield}
                  alt="shield"
                  width={14}
                  height={14}
                  unoptimized
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
                className={`w-6 h-6 rounded-full border-2 ${col < 3 ? "border-black" : "border-dashed border-gray-400"
                  } flex items-center justify-center text-[12px]`}
              >
                <Image
                  src={SPACE_MINERS_ICONS["reroll"]}
                  alt="shield"
                  width={14}
                  height={14}
                  unoptimized
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
              unoptimized
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
          unoptimized
        />
        x
        <Image
          width={500}
          height={500}
          src={cupImg}
          alt=""
          className="w-[25px] h-[25px] border-[1px] border-black"
          unoptimized
        />
        ) + (
        <Image
          width={500}
          height={500}
          src={resourceImg}
          alt=""
          className="w-[25px] h-[25px] border-[1px] border-black"
          unoptimized
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
  // Helper function to shuffle array
  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

  // Function to get cards by uniqueNumber
  const getCardsByUniqueNumber = (number) =>
    cards.filter(card => card.uniqueNumber === number);

  // Function to get cards excluding uniqueNumber
  const getCardsExcludingUniqueNumber = (number) =>
    cards.filter(card => card.uniqueNumber !== number);

  // 25% chance to include Bros (uniqueNumber 3)
  const includeBros = Math.random() < 0.25;

  if (includeBros) {
    // Get all Bros cards and keep them in order
    const brosCards = getCardsByUniqueNumber(3);
    // Get remaining cards excluding Bros
    const remainingCards = getCardsExcludingUniqueNumber(3);
    // Shuffle and get enough cards to complete the set
    const otherCards = shuffle(remainingCards).slice(0, count - brosCards.length);

    // Return Bros cards first, followed by shuffled remaining cards
    return [...brosCards, ...otherCards];
  } else {
    // Get cards excluding Bros and shuffle them
    const availableCards = getCardsExcludingUniqueNumber(3);
    return shuffle(availableCards).slice(0, count);
  }
};

const DownloadButton = ({
  componentRef,
  paperSize,
  selectedConfigs,
  setRandomCards,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (typeof window === "undefined") return;
    setIsGenerating(true);

    // Import html2pdf dynamically only when needed
    const html2pdfModule = await import("html2pdf.js");
    const html2pdf = html2pdfModule.default;

    // Always generate new random cards if in random mode
    if (selectedConfigs["Monster Cards"] === "random") {
      setRandomCards(getRandomCards(heroesCards, 12));
      // Wait for state update to reflect in the DOM
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const element = componentRef.current;
    const opt = {
      filename: `${paperSize === "A4" ? "A4" : "Letter"}-Monster-Mixology-${selectedConfigs["Monster Cards"]}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 4,
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
    <Button
      onClick={generatePDF}
      disabled={isGenerating}
      className="w-[80%] bg-foreground h-[48px] text-xl text-background mb-4"
    >
      <Download className="mr-2" />
      {isGenerating ? "Generating PDF..." : "Download Game Sheet"}
    </Button>
  );
};

const CardPreview = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="w-full max-w-7xl flex flex-col items-center gap-4 mt-8">
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => setIsPreviewOpen(!isPreviewOpen)}
      >
        {isPreviewOpen ? (
          <>
            <EyeOff className="w-4 h-4" />
            Hide Preview
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" />
            Show All Cards
          </>
        )}
      </Button>

      {isPreviewOpen && (
        <div className="w-full bg-white p-4 rounded-lg border-2 border-dashed">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {heroesCards.map((card) => (
              <BuildingCard
                key={card.id}
                card={card}
                paperSize="A4"
                fromApp={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PrintableSheet = () => {
  const componentRef = useRef();
  const [paperSize, setPaperSize] = useState("A4");
  const dimensions = PAPER_DIMENSIONS[paperSize];
  const [randomCards, setRandomCards] = useState(() =>
    getRandomCards(heroesCards, 12)
  );
  const [selectedExpansions, setSelectedExpansions] = useState([]);

  // Function to handle different card selection modes
  const handleCardSelection = (mode) => {
    switch (mode) {
      case "random":
        setRandomCards(getRandomCards(heroesCards, 12));
        break;
      case "preset":
        // Use the first 12 cards in order
        setRandomCards(heroesCards.slice(0, 12));
        break;
      case "select":
        // This is handled by CustomizeCharacters component
        setShowCustomize(true);
        break;
      default:
        setRandomCards(heroesCards.slice(0, 12)); // Default to preset
    }
  };

  // Base scale for Letter size
  const baseScale = dimensions.width / PAPER_DIMENSIONS[paperSize].width;
  // Additional scale reduction for Letter size
  // const contentScale = paperSize === "A4" ? 1 : 0.94;
  // Combine both scales for horizontal scaling
  const scaleX = baseScale;

  // Create the dynamic URL with character IDs
  const generateQRUrl = () => {
    const characterIds = randomCards.map((card) => card.id).join(",");
    // const link = `${
    //   process.env.NODE_ENV === "production"
    //     ? "https://denogames.com"
    //     : "http://localhost:3000"
    // }/app/engine/monstermixology?chars=${characterIds}`;
    const link = `https://denogames.com/app/engine/monstermixology?chars=${characterIds}`;

    return link;
  };

  const [showCustomize, setShowCustomize] = useState(false);
  const handleCustomPDFGeneration = async (selectedIds) => {
    // Update randomCards with the selected heroes
    const customCards = getRandomCards(
      heroesCards.filter((card) => selectedIds.includes(card.id)),
      12
    );
    setRandomCards(customCards);

    setShowCustomize(false);
  };

  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-7xl px-4 flex justify-center flex-col items-center">
        <div className="flex justify-center items-center w-full max-w-[600px]">
          <Button variant="outline" className="mr-4" onClick={() => router.back()}>
            <ChevronLeft className="mr-2" /> Back
          </Button>
          <h2 className="text-2xl font-strike uppercase my-8 text-center">
            Download Resources
          </h2>
        </div>

        <ExpansionSelector
          gameId="monstermixology"
          selectedExpansions={selectedExpansions}
          setSelectedExpansions={setSelectedExpansions}
        />

        <div className="space-y-6 mb-12 flex justify-center flex-col items-center">
          {(gamesStaticData["monster-mixology"]?.downloadResources || []).map(
            (resource, index) => (
              <ResourceComponent
                key={index}
                resource={resource}
                componentRef={componentRef}
                setShowCustomize={setShowCustomize}
                showCustomize={showCustomize}
                handleCustomPDFGeneration={handleCustomPDFGeneration}
                setPaperSize={setPaperSize}
                handleCardSelection={handleCardSelection}
                setRandomCards={setRandomCards}
              />
            )
          )}
        </div>

        <CardPreview />
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
                  unoptimized
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
                    url={generateQRUrl()}
                    width={100}
                    height={100}
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
                        unoptimized
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
const ResourceOption = ({ label, value, groupName, isSelected, onSelect }) => {
  return (
    <div className="flex items-center space-x-2" onClick={onSelect}>
      <RadioGroupItem value={value} id={`${groupName}-${value}`} />
      <Label htmlFor={`${groupName}-${value}`} className="cursor-pointer">
        {label}
      </Label>
    </div>
  );
};

const ResourceConfig = ({ config, selectedOption, onOptionSelect }) => {
  return (
    <div className="mb-6 w-full px-4">
      <h4 className="text-lg font-strike uppercase mb-3">{config.label}</h4>
      <RadioGroup
        value={selectedOption}
        onValueChange={(value) => onOptionSelect(config.label, value)}
        className="space-y-2"
      >
        {config.options.map((option) => (
          <ResourceOption
            key={option.key}
            label={option.label}
            value={option.key}
            groupName={config.label.toLowerCase().replace(/\s+/g, "-")}
            isSelected={selectedOption === option.key}
            onSelect={() => onOptionSelect(config.label, option.key)}
          />
        ))}
      </RadioGroup>
    </div>
  );
};

const ResourceComponent = ({
  resource,
  componentRef,
  setShowCustomize,
  showCustomize,
  handleCustomPDFGeneration,
  setPaperSize,
  handleCardSelection,
  setRandomCards,
}) => {
  const [selectedConfigs, setSelectedConfigs] = useState(
    resource.configurations
      ? Object.fromEntries(
        resource.configurations.map((config) => [
          config.label,
          config.options[0].key,
        ])
      )
      : {}
  );

  const paperSize = selectedConfigs["Paper Size"] || "A4";
  React.useEffect(() => {
    if (paperSize) {
      setPaperSize(paperSize);
    }
  }, [paperSize, setPaperSize]);

  const handleOptionSelect = (configLabel, option) => {
    setSelectedConfigs((prev) => ({
      ...prev,
      [configLabel]: option,
    }));
    if (option === "select") {
      setShowCustomize(true);
    }
    if (option !== "select") {
      setShowCustomize(false);
    }
    console.log(configLabel, option);
    if (configLabel === "Monster Cards") {
      handleCardSelection(option);
    }
  };

  const handleDownload = () => {
    console.log("Downloading with configs:", selectedConfigs);

    resource.onDownload?.(selectedConfigs);
  };

  return (
    <div className="box-inner">
      <div className=" rounded-lg w-full sm:w-[600px] md:w-[800px] box-broken p-4">
        <div className="flex flex-col md:flex-row gap-2 mb-2 border-b-2 border-black border-dashed p-2">
          <div className="w-full md:w-[150px] h-[150px] flex-shrink-0">
            <Image
              unoptimized
              src={resource.image}
              alt={resource.name}
              width={150}
              height={150}
              className="object-cover rounded-lg w-[150px] h-[150px] border"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-strike uppercase mb-2">
              {resource.name}
            </h3>
            {resource.description && (
              <p className="text-gray-600 mb-2">{resource.description}</p>
            )}
            {resource.instructions && (
              <p className="text-sm text-gray-500">{resource.instructions}</p>
            )}
          </div>
        </div>

        {resource.configurations && resource.configurations.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:justify-around items-start">
            {resource.configurations.map((config) => (
              <ResourceConfig
                key={config.label}
                config={config}
                selectedOption={selectedConfigs[config.label]}
                onOptionSelect={handleOptionSelect}
              />
            ))}
          </div>
        )}

        {showCustomize && resource.type === "main-sheet" && (
          <CustomizeCharacters
            onGenerateCustomPDF={handleCustomPDFGeneration}
          />
        )}

        <div className="flex justify-center">
          {resource.type === "main-sheet" ? (
            <DownloadButton
              componentRef={componentRef}
              paperSize={paperSize}
              selectedConfigs={selectedConfigs}
              setRandomCards={setRandomCards}
            />
          ) : resource.type === "rulebook" ? (
            <Link
              className="w-[80%]"
              href={
                gamesStaticData["monster-mixology"]?.rulebookUrl ||
                "https://drive.google.com/your-default-rulebook-url"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full mt-2 bg-foreground text-background h-[48px] text-xl mb-4">
                <Download className="mr-2" /> Download Rulebook
              </Button>
            </Link>
          ) : (
            <Button
              onClick={handleDownload}
              className="w-full mt-2 bg-foreground text-background h-[48px] text-xl mb-4"
            >
              <Download className="mr-2" /> Download {resource.name}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Wrap the component with the HOC
const ProtectedPrintableSheet = withGameAccess(
  observer((props) => {
    return <PrintableSheet {...props} />;
  }),
  "monstermixology"
);

// Create a wrapper component to handle the loading state
const MonstermixologyWrapper = observer(() => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || MobxStore.loadingUser) {
    return <LoadingSpinner />;
  }

  return <ProtectedPrintableSheet />;
});

// Modify the dynamic import to use the wrapper
const ClientMonstermixologyPage = dynamic(
  () => Promise.resolve(MonstermixologyWrapper),
  {
    ssr: false,
    loading: () => <LoadingSpinner />
  }
);

export default ClientMonstermixologyPage;
