// iconsHelper.js

import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import garlicImage from "../../../../../public/builders-town/bricks.jpeg";
import crossImage from "../../../../../public/builders-town/steel.jpeg";
import silverImage from "../../../../../public/builders-town/wood.jpeg";
import Image from "next/image";

// Dice components mapped to numbers 1 through 6
const diceIcons = {
  1: <Dice1 className="bg-blue-100" />,
  2: <Dice2 className="bg-purple-200" />,
  3: <Dice3 className="bg-green-300" />,
  4: <Dice4 className="bg-red-400" />,
  5: <Dice5 className="bg-yellow-500" />,
  6: <Dice6 className="bg-orange-600" />,
};

// Resource images for items like garlic, cross, and silver
const resourceMap = {
  garlic: garlicImage,
  cross: crossImage,
  silver: silverImage,
  // Add additional resources as needed
};

// Main function to determine the correct icon or text to display
export const getIcon = (resource) => {
  // Check if the resource is a dice number
  if (diceIcons[resource]) {
    return diceIcons[resource];
  }

  // Check if the resource is a named resource with an image
  if (resourceMap[resource]) {
    return (
      <Image
        src={resourceMap[resource]}
        alt={resource}
        className="w-6 h-6"
        width={25}
        height={25}
      />
    );
  }

  // Default fallback: Render text if the resource isn’t found in the mappings
  return <span className="text-sm">{resource}</span>;
};

// Universal renderIcons function that can be used anywhere
export const renderIcons = (resources) => {
  // Parse the input string, removing brackets and splitting by comma
  const items = resources.replace(/[\[\]]/g, "").split(", ");

  // Map each item to a JSX element using getIcon
  return items.map((item, index) => (
    <div key={index} className="w-6 h-6 flex items-center justify-center">
      {getIcon(item)}
    </div>
  ));
};
