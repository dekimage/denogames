import React, { useState, useEffect } from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Dummy icon mappings (replace URLs with your actual image paths)

import Image from "next/image";
const iconMapping = {
  coin: "dungeoneers/coin.png",
  coin_1: "dungeoneers/coin.png",
  coin_2: "dungeoneers/coin_2.png",
  coin_3: "dungeoneers/coin_3.png",
  coin_4: "dungeoneers/coin_4.png",
  coin_5: "dungeoneers/coin_5.png",
  vp_1: "dungeoneers/vp_1.png",
  vp_2: "dungeoneers/vp_2.png",
  vp_3: "dungeoneers/vp_3.png",
  vp_4: "dungeoneers/vp_4.png",
  vp_5: "dungeoneers/vp_5.png",
  speed: "dungeoneers/speed.png",
  gold: "dungeoneers/gold.png",
  ticket: "dungeoneers/ticket.png",
  initiative: "dungeoneers/initiative.png",
  draw_1_card: "dungeoneers/draw_1_card.png",
  discover_1_card: "dungeoneers/discover_1_card.png",
  draw_1_epic: "dungeoneers/draw_1_epic.png",
  dungeon: "dungeoneers/dungeon.png",
  guild: "dungeoneers/guild.png",
  upgrade: "dungeoneers/upgrade.png",
  "->": "dungeoneers/arrow.png",
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
            // src={`${baseUrl}/${iconMapping[key]}`}
            src={`/${iconMapping[key]}`}
            alt={key}
            width={24}
            height={24}
            className="inline-block w-12 h-12 mx-1"
          />
        );
      }
    }
    return (
      <span className="text-black font-strike uppercase" key={index}>
        {part}
      </span>
    );
  });
};

// Component to render the effect
export const BonusCard = ({ effect, isHistory, type }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, [effect]);

  const getCardStyle = () => {
    if (isHistory) {
      return { height: "200px", minHeight: "200px", width: "150px" };
    }

    switch (type) {
      case "trade":
        return {
          backgroundColor: "#faedcd",
          borderColor: "#b45309", // amber-700
        };
      case "epiccard":
        return {
          backgroundColor: "#e9d5ff", // purple-200
          borderColor: "#7e22ce", // purple-700
        };
      case "darkmoon":
        return {
          backgroundColor: "#bbf7d0", // green-200
          borderColor: "#15803d", // green-700
        };
      default:
        return {
          backgroundColor: "#faedcd",
          borderColor: "#b45309", // amber-700 (default to trade style)
        };
    }
  };

  const cardStyle = getCardStyle();

  return (
    <div className="box-inner">
      <div
        style={cardStyle}
        className={`box-broken border-8 rounded-[20px] text-black shadow-md max-w-[350px] min-w-[300px] min-h-[300px] flex justify-center items-center ${
          animate ? "animate-card-flip" : ""
        }`}
      >
        <div className="flex flex-wrap items-center space-x-2">
          {Array.isArray(effect) ? (
            // If the effect is an array, iterate over it
            effect.map((item, index) =>
              iconMapping[item] ? (
                <Image
                  key={index}
                  width={200}
                  height={200}
                  // src={`${baseUrl}/${iconMapping[item]}`}
                  src={`/${iconMapping[item]}`}
                  alt={item}
                  className="inline-block w-12 h-12"
                />
              ) : (
                <span key={index}>{item}</span>
              )
            )
          ) : (
            // If the effect is a string, parse it
            <p className="text-lg flex items-center flex-wrap text-background">
              {parseEffectString(effect)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
