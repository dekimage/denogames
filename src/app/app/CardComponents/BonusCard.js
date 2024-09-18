import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Dummy icon mappings (replace URLs with your actual image paths)

import Image from "next/image";
const iconMapping = {
  coin: "dungeoneers/coin.png",
  coin_1: "dungeoneers/coin.png",
  coin_2: "dungeoneers/coin.png",
  coin_3: "dungeoneers/coin.png",
  speed: "dungeoneers/speed.png",
  gold: "dungeoneers/gold.png",
  ticket: "dungeoneers/ticket.png",
  initiative: "dungeoneers/initiative.png",
  draw_1_card: "dungeoneers/draw_1_card.png",
  discover_1_card: "dungeoneers/discover_1_card.png",
  draw_1_epic: "dungeoneers/draw_1_epic.png",
  dungeon: "dungeoneers/dungeon.png",
  guild: "dungeoneers/guild.png",
  // Add other resources as needed
};

// Function to replace strings in brackets with images
const parseEffectString = (effectString) => {
  const parts = effectString.split(/(\[[^\]]+\])/); // Split the string by brackets
  return parts.map((part, index) => {
    const match = part.match(/\[([^\]]+)\]/);
    if (match) {
      const key = match[1];
      if (iconMapping[key]) {
        return (
          <Image
            key={index}
            src={`${baseUrl}/${iconMapping[key]}`}
            alt={key}
            width={24}
            height={24}
            className="inline-block w-6 h-6 mx-1"
          />
        );
      }
    }
    return <span key={index}>{part}</span>;
  });
};

// Component to render the effect
export const BonusCard = ({ effect }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white max-w-[350px]">
      <div className="flex flex-wrap items-center space-x-2">
        {Array.isArray(effect) ? (
          // If the effect is an array, iterate over it
          effect.map((item, index) =>
            iconMapping[item] ? (
              <img
                key={index}
                src={`${baseUrl}/${iconMapping[item]}`}
                alt={item}
                className="inline-block w-6 h-6"
              />
            ) : (
              <span key={index}>{item}</span>
            )
          )
        ) : (
          // If the effect is a string, parse it
          <p className="text-lg flex items-center flex-wrap">
            {parseEffectString(effect)}
          </p>
        )}
      </div>
    </div>
  );
};
