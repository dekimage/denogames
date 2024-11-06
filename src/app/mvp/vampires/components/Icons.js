// iconsHelper.js

import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import garlicImage from "../../../../../public/vampires/resources/garlic.png";
import crossImage from "../../../../../public/vampires/resources/cross.png";
import silverImage from "../../../../../public/vampires/resources/silver.png";
import militaryImage from "../../../../../public/vampires/tiles/military.png";
import artifactImage from "../../../../../public/vampires/tiles/artifacts.png";
import engineImage from "../../../../../public/vampires/tiles/engine.png";
import farmingImage from "../../../../../public/vampires/tiles/farm.png";
import prestigeImage from "../../../../../public/vampires/tiles/prestige.png";
import house1Image from "../../../../../public/vampires/houses/house_1.png";
import house2Image from "../../../../../public/vampires/houses/house_2.png";
import house3Image from "../../../../../public/vampires/houses/house_3.png";
import house4Image from "../../../../../public/vampires/houses/house_4.png";

import diceImage from "../../../../../public/vampires/bonuses/dice.png";
import drawImage from "../../../../../public/vampires/bonuses/draw.png";
import drawCardImage from "../../../../../public/vampires/bonuses/draw_card.png";
import discoverImage from "../../../../../public/vampires/bonuses/discover.png";
import discoverFragmentImage from "../../../../../public/vampires/bonuses/discover_fragment.png";
import discoverDiceImage from "../../../../../public/vampires/bonuses/discover_dice.png";
import discoverCardImage from "../../../../../public/vampires/bonuses/discover_card.png";
import randomFragmentImage from "../../../../../public/vampires/bonuses/random_fragment.png";

import refreshImage from "../../../../../public/vampires/bonuses/refresh.png";
import refreshAllImage from "../../../../../public/vampires/bonuses/refresh_all.png";

import powerImage from "../../../../../public/vampires/general/power.png";
import vpImage from "../../../../../public/vampires/general/vp.png";

import emblem1Image from "../../../../../public/vampires/emblems/emblem_1.png";
import emblem2Image from "../../../../../public/vampires/emblems/emblem_2.png";
import emblem3Image from "../../../../../public/vampires/emblems/emblem_3.png";
import emblem4Image from "../../../../../public/vampires/emblems/emblem_4.png";

import artifact1Image from "../../../../../public/vampires/artifacts/artifact_1.png";
import artifact2Image from "../../../../../public/vampires/artifacts/artifact_2.png";
import artifact3Image from "../../../../../public/vampires/artifacts/artifact_3.png";
import artifact4Image from "../../../../../public/vampires/artifacts/artifact_4.png";
import artifact5Image from "../../../../../public/vampires/artifacts/artifact_5.png";
import artifact6Image from "../../../../../public/vampires/artifacts/artifact_6.png";
import artifact7Image from "../../../../../public/vampires/artifacts/artifact_7.png";

import fragmentEmerald1Image from "../../../../../public/vampires/fragments/fragment_emerald_1.png";
import fragmentGranite1Image from "../../../../../public/vampires/fragments/fragment_granite_1.png";
import fragmentCrimson1Image from "../../../../../public/vampires/fragments/fragment_crimson_1.png";
import fragmentEbony1Image from "../../../../../public/vampires/fragments/fragment_ebony_1.png";
import fragmentEmerald2Image from "../../../../../public/vampires/fragments/fragment_emerald_2.png";
import fragmentGranite2Image from "../../../../../public/vampires/fragments/fragment_granite_2.png";
import fragmentCrimson2Image from "../../../../../public/vampires/fragments/fragment_crimson_2.png";
import fragmentEbony2Image from "../../../../../public/vampires/fragments/fragment_ebony_2.png";
import fragmentEmerald3Image from "../../../../../public/vampires/fragments/fragment_emerald_3.png";
import fragmentGranite3Image from "../../../../../public/vampires/fragments/fragment_granite_3.png";
import fragmentCrimson3Image from "../../../../../public/vampires/fragments/fragment_crimson_3.png";
import fragmentEbony3Image from "../../../../../public/vampires/fragments/fragment_ebony_3.png";

import Image from "next/image";
import BasicDice from "@/app/app/common/BasicDice";

// Resource images for items like garlic, cross, and silver
const resourceMap = {
  // resources
  garlic: garlicImage,
  cross: crossImage,
  silver: silverImage,

  // tile types
  military: militaryImage,
  artifact: artifactImage,
  engine: engineImage,
  farming: farmingImage,
  prestige: prestigeImage,

  // completion bonuses
  dice: diceImage,
  draw: drawImage,
  draw_card: drawCardImage,
  refresh: refreshImage,
  refresh_all: refreshAllImage,
  // random_resource: randomResourceImage,
  // random_dice: randomDiceImage,
  discover: discoverImage,
  discover_fragment: discoverFragmentImage,
  discover_dice: discoverDiceImage,
  discover_card: discoverCardImage,
  random_fragment: randomFragmentImage,

  // houses
  house_1: house1Image,
  house_2: house2Image,
  house_3: house3Image,
  house_4: house4Image,

  // emblems
  emblem_1: emblem1Image,
  emblem_2: emblem2Image,
  emblem_3: emblem3Image,
  emblem_4: emblem4Image,

  // artifacts
  artifact_1: artifact1Image,
  artifact_2: artifact2Image,
  artifact_3: artifact3Image,
  artifact_4: artifact4Image,
  artifact_5: artifact5Image,
  artifact_6: artifact6Image,
  artifact_7: artifact7Image,

  // fragments
  fragment_emerald_1: fragmentEmerald1Image,
  fragment_granite_1: fragmentGranite1Image,
  fragment_crimson_1: fragmentCrimson1Image,
  fragment_ebony_1: fragmentEbony1Image,
  fragment_emerald_2: fragmentEmerald2Image,
  fragment_granite_2: fragmentGranite2Image,
  fragment_crimson_2: fragmentCrimson2Image,
  fragment_ebony_2: fragmentEbony2Image,
  fragment_emerald_3: fragmentEmerald3Image,
  fragment_granite_3: fragmentGranite3Image,
  fragment_crimson_3: fragmentCrimson3Image,
  fragment_ebony_3: fragmentEbony3Image,
};

const specialResources = {
  power: powerImage,
  vp: vpImage,
  // Add more special types if needed
};

const renderSpecialResource = (resource, size) => {
  const [key, level] = resource.split("_");
  const imageSrc = specialResources[key];

  if (!imageSrc || !level) return null;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Image
        src={imageSrc}
        alt={key}
        className="absolute z-0"
        style={{ width: size, height: size }}
        width={size}
        height={size}
      />
      <span className="text-black font-bold text-center absolute z-10">
        {level}
      </span>
    </div>
  );
};

// Main function to determine the correct icon or text to display
export const getIcon = (resource, size = 25) => {
  // Dice 1-6
  const diceValue = parseInt(resource);
  if (diceValue >= 1 && diceValue <= 6) {
    return <BasicDice value={diceValue} />;
  }

  // Special resources
  if (resource && resource.includes("_")) {
    const [key] = resource.split("_");
    if (specialResources.hasOwnProperty(key)) {
      const specialIcon = renderSpecialResource(resource, size);
      if (specialIcon) return specialIcon;
    }
  }

  // All other images
  if (resourceMap[resource]) {
    return (
      <Image
        src={resourceMap[resource]}
        alt={"."}
        style={{ width: size, height: size }}
        width={250}
        height={250}
      />
    );
  }

  // Default fallback: Render text if the resource isn’t found in the mappings
  return <span className="text-sm">.</span>;
};

// Universal renderIcons function that can be used anywhere
export const renderIcons = (resources, size = 25) => {
  // Parse the input string, removing brackets and splitting by comma
  const items = resources.replace(/[\[\]]/g, "").split(", ");

  // Map each item to a JSX element using getIcon
  return items.map((item, index) => (
    <div key={index} className=" flex items-center justify-center">
      {getIcon(item, size)}
    </div>
  ));
};
