"use client";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import cardDrawStore from "../../stores/cardDrawStore";

const CardDrawEngine = observer(({ config }) => {
  useEffect(() => {
    cardDrawStore.setConfig(config);
  }, [config]);

  const renderCard = (index, isActiveSide) => {
    const cardNumber = index + 1;
    const isActive =
      isActiveSide && cardDrawStore.activeCards.includes(cardNumber);
    const isExtraActive =
      isActiveSide && cardDrawStore.extraActiveCards.has(cardNumber);

    return (
      <div
        key={index}
        className={`
          aspect-square rounded-lg border-2 
          flex items-center justify-center text-2xl font-bold
          ${
            isExtraActive
              ? "bg-yellow-500 text-white"
              : isActive
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-500"
          }
        `}
      >
        {cardNumber}
      </div>
    );
  };

  return (
    <div className="h-[100dvh] flex flex-col py-4">
      {/* Player 2 Side (Upside Down) */}
      <div
        className={`flex-1 flex items-center justify-center px-2 ${
          cardDrawStore.activePlayer === 2 ? "opacity-100" : "opacity-30"
        }`}
        style={{ transform: "rotate(180deg)" }}
      >
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${cardDrawStore.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${cardDrawStore.rows}, minmax(0, 1fr))`,
            gap: "2px",
            maxWidth: "100vw",
            height: "calc((100dvh - 80px) / 2)",
          }}
        >
          {Array.from({ length: cardDrawStore.totalCards }).map((_, i) =>
            renderCard(i, cardDrawStore.activePlayer === 2)
          )}
        </div>
      </div>

      {/* Middle Control */}
      <div className="h-12 flex items-center justify-center gap-2 my-2">
        <Button
          onClick={() => cardDrawStore.handleButtonClick()}
          className="rounded-full h-12 w-12"
        >
          {cardDrawStore.gameState === "initial" ? "Start" : "Next"}
        </Button>
        {cardDrawStore.gameState === "playing" && (
          <Button
            onClick={() => cardDrawStore.drawExtraCard()}
            className="rounded-full h-12 w-12"
            variant="outline"
          >
            <Plus className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Player 1 Side */}
      <div
        className={`flex-1 flex items-center justify-center px-2 ${
          cardDrawStore.activePlayer === 1 ? "opacity-100" : "opacity-30"
        }`}
      >
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${cardDrawStore.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${cardDrawStore.rows}, minmax(0, 1fr))`,
            gap: "2px",
            maxWidth: "100vw",
            height: "calc((100dvh - 80px) / 2)",
          }}
        >
          {Array.from({ length: cardDrawStore.totalCards }).map((_, i) =>
            renderCard(i, cardDrawStore.activePlayer === 1)
          )}
        </div>
      </div>
    </div>
  );
});

export default CardDrawEngine;
