import { useState } from "react";
import { Button } from "@/components/ui/button";
import { heroesCards } from "./data";
import Image from "next/image";

const MONSTER_COUNT = 36; // UPDATE WHEN PUT MONSTER
// Use the same image import logic
const heroImages = Object.fromEntries(
  Array.from({ length: MONSTER_COUNT }, (_, i) => [
    i + 1,
    require(`../../../../public/monstermixology/heroes/h${i + 1}.png`).default,
  ])
);

export const CustomizeCharacters = ({ onGenerateCustomPDF }) => {
  const [selectedHeroes, setSelectedHeroes] = useState([]);

  const toggleHeroSelection = (hero) => {
    if (selectedHeroes.find((h) => h.id === hero.id)) {
      setSelectedHeroes((prev) => prev.filter((h) => h.id !== hero.id));
    } else if (selectedHeroes.length < 12) {
      setSelectedHeroes((prev) => [...prev, hero]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 bg-white rounded-lg shadow-lg max-w-4xl mx-auto mb-4">
      <h2 className="text-2xl font-bold">Customize Characters</h2>

      {/* Character Grid */}
      <div className="grid grid-cols-5 gap-4 bg-gray-100 p-4 rounded-lg">
        {heroesCards.map((hero) => (
          <div
            key={hero.id}
            onClick={() => toggleHeroSelection(hero)}
            className={`relative cursor-pointer transition-all duration-200 transform ${
              selectedHeroes.find((h) => h.id === hero.id)
                ? "ring-4 ring-blue-500 scale-105"
                : "hover:scale-105"
            }`}
          >
            <Image
              src={heroImages[hero.id]}
              alt={hero.name}
              width={125}
              height={125}
              className="rounded-lg object-cover border-2 border-black"
            />
            {selectedHeroes.find((h) => h.id === hero.id) && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border-2 border-white">
                {selectedHeroes.findIndex((h) => h.id === hero.id) + 1}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Characters Counter */}
      <div className="text-lg font-semibold">
        Chosen characters for play: {selectedHeroes.length}/12
      </div>

      {/* Selected Characters Preview */}
      <div className="grid grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className={`relative ${
              selectedHeroes[index]
                ? ""
                : "border-2 border-dashed border-gray-300 w-[125px] h-[125px] rounded-lg"
            }`}
          >
            {selectedHeroes[index] && (
              <Image
                src={heroImages[selectedHeroes[index].id]}
                alt={selectedHeroes[index].name}
                width={125}
                height={125}
                className="rounded-lg object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {/* Generate Button */}
      <Button
        onClick={() => onGenerateCustomPDF(selectedHeroes.map((h) => h.id))}
        disabled={selectedHeroes.length !== 12}
        className={`px-8 py-2 text-lg ${
          selectedHeroes.length === 12
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-300"
        }`}
      >
        Save Selection({selectedHeroes.length}/12)
      </Button>
    </div>
  );
};
