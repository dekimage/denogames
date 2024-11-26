import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/app/components/Modal";
import { mockBuildings } from "./data";

export const BlueprintPurchaseModals = ({
  blueprint,
  onCancel,
  onComplete,
  CardComponent,
  rerolls,
}) => {
  const [showBuildingSelect, setShowBuildingSelect] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [remainingRerolls, setRemainingRerolls] = useState(rerolls || 0);
  const [availableBuildings, setAvailableBuildings] = useState(() =>
    getRandomBuildings()
  );

  // Initialize with the correct blueprint and rerolls
  useEffect(() => {
    if (rerolls !== undefined) {
      setRemainingRerolls(rerolls);
    }
  }, [rerolls]);

  // Reset state when blueprint changes
  useEffect(() => {
    setSelectedBuilding(null);
    setAvailableBuildings(getRandomBuildings());
  }, [blueprint]);

  function getRandomBuildings(count = 3) {
    const shuffled = [...mockBuildings].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  function handleReroll() {
    if (remainingRerolls > 0) {
      setAvailableBuildings(getRandomBuildings());
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
          <h2 className="text-2xl font-bold mb-4">Buy Blueprint?</h2>
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
              Buy
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
      onClose={handleClose}
      className="fixed inset-0 flex items-center justify-center"
    >
      <div className="bg-background p-6 w-full h-full flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Select a Building
        </h2>

        {/* Building Cards */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
          {availableBuildings.map((building) => (
            <div
              key={building.id}
              className={`
                p-6 border rounded-lg cursor-pointer
                transition-all duration-200
                ${
                  selectedBuilding?.id === building.id
                    ? "border-4 border-primary"
                    : "border-border hover:border-primary"
                }
              `}
              onClick={() => setSelectedBuilding(building)}
              style={{
                borderColor:
                  selectedBuilding?.id === building.id
                    ? "rgb(var(--primary))"
                    : "",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{building.image}</div>
                <div>
                  <h3 className="text-xl font-bold">{building.name}</h3>
                  <p className="text-muted-foreground">
                    {building.description}
                  </p>
                  <p className="text-sm mt-2">Cost: {building.cost}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-4">
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
            Buy
          </Button>
        </div>
      </div>
    </Modal>
  );
};
