import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/app/components/Modal";
import { heroesCards } from "@/app/mvp/monstermixology/data";
import { BuildingCard } from "@/app/mvp/monstermixology/page";
import { useSearchParams } from "next/navigation";

export const BlueprintPurchaseModals = ({
  blueprint,
  onCancel,
  onComplete,
  CardComponent,
  rerolls,
}) => {
  const searchParams = useSearchParams();
  const [showBuildingSelect, setShowBuildingSelect] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [remainingRerolls, setRemainingRerolls] = useState(rerolls || 0);
  const [availableBuildings, setAvailableBuildings] = useState([]);
  const [filteredHeroes, setFilteredHeroes] = useState(heroesCards);

  // Initialize with the correct blueprint and rerolls
  useEffect(() => {
    if (rerolls !== undefined) {
      setRemainingRerolls(rerolls);
    }
  }, [rerolls]);

  // Reset state when blueprint changes
  useEffect(() => {
    setSelectedBuilding(null);
    // Get character IDs from URL
    const chars = searchParams.get("chars");
    if (chars) {
      const characterIds = chars.split(",").map(Number);
      console.log("Filtering for these IDs:", characterIds);

      // Filter heroesCards to only include the specified IDs
      const filtered = heroesCards.filter((card) =>
        characterIds.includes(card.id)
      );
      console.log("Filtered heroes:", filtered);

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

  function handleReroll() {
    if (remainingRerolls > 0) {
      setAvailableBuildings(getRandomBuildings(filteredHeroes));
      setRemainingRerolls((prev) => prev - 1);
      setSelectedBuilding(null);
    }
  }

  function handleClose() {
    setShowBuildingSelect(false);
    setSelectedBuilding(null);
    onCancel();
  }

  // Initial Blueprint Purchase Modal
  if (!showBuildingSelect) {
    return (
      <Modal onClose={handleClose}>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Make Coctail?</h2>
          <div className="mb-6 flex justify-center">
            <div className="transform scale-110">
              {blueprint && CardComponent && <CardComponent item={blueprint} />}
            </div>
          </div>
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
      <div className="bg-background p-2 w-full h-full flex flex-col">
        <h2 className="text-2xl font-bold  text-center border-b border-gray-200 pb-2">
          Select a Customer
        </h2>

        {/* Building Cards using the BuildingCard component */}
        <div className="flex-1 flex flex-wrap gap-4 justify-center overflow-y-scroll ">
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

        {/* Action Buttons */}
        <div className="flex justify-center gap-4  border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handleReroll}
            disabled={remainingRerolls === 0}
          >
            Reroll ({remainingRerolls})
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
