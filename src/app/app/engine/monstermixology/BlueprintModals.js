import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/app/components/Modal";
import { heroesCards } from "@/app/mvp/monstermixology/data";
import { BuildingCard } from "@/app/mvp/monstermixology/page";
import { useSearchParams } from "next/navigation";
import { SPACE_MINERS_ICONS } from "@/app/app/engine/monstermixology/page";
import Image from "next/image";

export const BlueprintPurchaseModals = ({
  blueprint,
  onCancel,
  onComplete,
  CardComponent,
  isAsymmetricMode,
}) => {
  const searchParams = useSearchParams();
  const [showBuildingSelect, setShowBuildingSelect] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [availableBuildings, setAvailableBuildings] = useState([]);
  const [filteredHeroes, setFilteredHeroes] = useState(heroesCards);
  const [activeCardNumbers, setActiveCardNumbers] = useState([]);

  // Reset state when blueprint changes
  useEffect(() => {
    setSelectedBuilding(null);
    // Get character IDs from URL
    const chars = searchParams.get("chars");
    if (chars) {
      const characterIds = chars.split(",").map(Number);
      // console.log("Filtering for these IDs:", characterIds);

      // Filter heroesCards to only include the specified IDs
      const filtered = heroesCards.filter((card) =>
        characterIds.includes(card.id)
      );
      // console.log("Filtered heroes:", filtered);

      setFilteredHeroes(filtered);
      setAvailableBuildings(getRandomBuildings(filtered));
    } else {
      setFilteredHeroes(heroesCards);
      setAvailableBuildings(getRandomBuildings(heroesCards));
    }
  }, [blueprint, searchParams]);

  function getRandomBuildings(sourceCards, count = 3) {
    const shuffled = [...sourceCards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Function to generate random active cards
  const generateRandomActiveCards = () => {
    const numbers = Array.from({ length: 12 }, (_, i) => i + 1);
    const shuffled = numbers.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  // Update active cards when rerolling
  function handleReroll() {
    if (isAsymmetricMode) {
      setActiveCardNumbers(generateRandomActiveCards());
    } else {
      setAvailableBuildings(getRandomBuildings(filteredHeroes));
    }
    setSelectedBuilding(null);
  }

  function handleClose() {
    setShowBuildingSelect(false);
    setSelectedBuilding(null);
    onCancel();
  }

  // Initialize active cards
  useEffect(() => {
    if (isAsymmetricMode) {
      setActiveCardNumbers(generateRandomActiveCards());
    }
  }, [isAsymmetricMode]);

  const renderResourceIcons = (resources) => {
    if (!resources) return null;

    return (
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm font-medium">Required:</span>
        {resources.map((resource, index) => (
          <div
            key={index}
            className="w-8 h-8 flex items-center justify-center bg-secondary/20 rounded-lg p-1"
          >
            <Image
              src={
                SPACE_MINERS_ICONS.resourceTypes[resource.toLowerCase()]?.src
              }
              width={32}
              height={32}
              alt={resource}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
    );
  };

  // Initial Blueprint Purchase Modal
  if (!showBuildingSelect) {
    return (
      <Modal onClose={handleClose}>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Make Cocktail?</h2>
          <div className="mb-6 flex justify-center">
            <div className="transform scale-110">
              {blueprint && CardComponent && <CardComponent item={blueprint} />}
            </div>
          </div>
          {blueprint?.cost && (
            <div className="mb-4 p-3 bg-secondary/20 rounded-lg">
              <p className="text-sm font-medium mb-2">Required Ingredients:</p>
              <div className="flex gap-2 justify-center">
                {blueprint.cost.map((ingredient, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-primary/10 rounded-md"
                  >
                    {ingredient}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-center gap-4">
            <Button
              variant="default"
              onClick={() => setShowBuildingSelect(true)}
            >
              Make
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  // Building Selection Modal
  return (
    <Modal
      fullscreen
      onClose={handleClose}
      className="fixed inset-0 flex items-center justify-center"
    >
      <div className="bg-background w-full h-full flex flex-col">
        {/* Fixed Header */}
        <div className="border-b border-gray-200 pb-2 px-2 flex-shrink-0">
          <h2 className="text-2xl font-bold text-center">Select a Customer</h2>

          {/* Resource icons display */}
          <div className="mt-2 mb-2 p-2">
            {renderResourceIcons(blueprint?.ingredients)}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {isAsymmetricMode ? (
            // Render 3x4 grid for asymmetric mode
            <div className="grid grid-cols-4 gap-2 p-4 max-w-3xl mx-auto">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((number) => (
                <div
                  key={number}
                  className={`border rounded-lg flex items-center justify-center cursor-pointer
                    aspect-[2/3]
                    ${
                      activeCardNumbers.includes(number)
                        ? "bg-primary/20 border-primary font-bold text-2xl"
                        : "border-gray-300"
                    }
                    ${selectedBuilding === number ? "ring-2 ring-primary" : ""}
                  `}
                  onClick={() =>
                    activeCardNumbers.includes(number) &&
                    setSelectedBuilding(number)
                  }
                >
                  {activeCardNumbers.includes(number) && number}
                </div>
              ))}
            </div>
          ) : (
            // Original building cards display
            <div className="flex flex-wrap gap-4 justify-center p-4">
              {availableBuildings.map((building) => (
                <div
                  key={building.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedBuilding?.id === building.id
                      ? "scale-105 ring-4 ring-primary"
                      : "hover:scale-105"
                  }`}
                  onClick={() => setSelectedBuilding(building)}
                >
                  <BuildingCard card={building} fromApp={true} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-center gap-4 bg-background flex-shrink-0">
          <Button variant="secondary" onClick={handleReroll}>
            Reroll
          </Button>
          <Button
            variant="default"
            onClick={() => onComplete(selectedBuilding)}
            disabled={!selectedBuilding}
          >
            Serve
          </Button>
        </div>
      </div>
    </Modal>
  );
};
