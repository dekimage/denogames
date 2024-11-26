"use client";

import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import pushLuckStore from "@/app/stores/pushLuckStore";
import { Button } from "@/components/ui/button";
import Modal from "@/app/components/Modal";

// Animation duration in seconds
const ANIMATION_DURATION = 1.5;

const PushLuckEngine = observer(({ config, CardComponent }) => {
  const [isActionsAnimating, setIsActionsAnimating] = useState(false);
  const [highlightedCards, setHighlightedCards] = useState(new Set());
  const previousActions = useRef(pushLuckStore.actions);
  const actionSound = useRef(null);

  useEffect(() => {
    pushLuckStore.setConfig(config);
  }, [config]);

  useEffect(() => {
    // Initialize sound
    actionSound.current = new Audio("/sounds/action-gained.mp3"); // You'll need to add this file
  }, []);

  useEffect(() => {
    if (pushLuckStore.actions > previousActions.current) {
      // Play sound
      actionSound.current?.play();

      // Animate actions counter
      setIsActionsAnimating(true);
      setTimeout(() => setIsActionsAnimating(false), ANIMATION_DURATION * 1000);

      // Find matching cards and highlight them
      const matchingCards = findMatchingCards();
      setHighlightedCards(new Set(matchingCards));
      setTimeout(
        () => setHighlightedCards(new Set()),
        ANIMATION_DURATION * 1000
      );
    }
    previousActions.current = pushLuckStore.actions;
  }, [pushLuckStore.actions]);

  const findMatchingCards = () => {
    const lastCard =
      pushLuckStore.centralBoard[pushLuckStore.centralBoard.length - 1];
    if (!lastCard) return [];

    return pushLuckStore.centralBoard
      .filter((card) => card.type === lastCard.type)
      .map((card) => card.id);
  };

  const renderExplosionModal = () => (
    <Modal>
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">BOOM!</h2>
        <p className="mb-6">
          You`ve hit an explosion! What would you like to do?
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="default" onClick={() => pushLuckStore.diffuseBomb()}>
            Diffuse Bomb
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              pushLuckStore.diffuseBomb();
              pushLuckStore.nextTurn();
            }}
          >
            End Turn
          </Button>
        </div>
      </div>
    </Modal>
  );

  const renderCard = (card, index) => {
    const isSelected = pushLuckStore.selectedCards.has(card.id);
    const selectionColor = pushLuckStore.selectedCards.get(card.id);

    return (
      <div
        key={`${card.id}-${index}`}
        className={`relative cursor-pointer transition-all duration-200
          ${isSelected ? "opacity-70" : "hover:scale-105"}
        `}
        onClick={() => pushLuckStore.toggleCardSelection(card.id)}
      >
        {CardComponent ? (
          <CardComponent item={card} />
        ) : (
          <div className="w-32 h-48 border rounded flex items-center justify-center">
            {card.type}
          </div>
        )}
        {isSelected && (
          <div
            className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-2"
            style={{
              backgroundColor:
                selectionColor === "main" ? "#4A5568" : selectionColor,
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="sm:container sm:mx-auto font-strike uppercase">
      {/* Header Section - Minimized for mobile */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b sm:relative sm:bg-transparent sm:border-none">
        <div className="flex justify-between items-center p-2 sm:my-6 sm:p-0">
          <div className="flex items-center gap-2 sm:gap-4 justify-center w-full">
            {/* <h1 className="text-lg sm:text-2xl font-bold">Push Your Luck</h1> */}
            <div className="text-sm sm:text-base">
              {/* Turn:{pushLuckStore.currentTurn} */}
              Actions:{pushLuckStore.actions}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="sm:hidden"
            onClick={() => pushLuckStore.restartGame()}
          >
            Restart
          </Button>
        </div>
      </div>

      {/* Game Stats - Hidden on mobile */}
      <div className="hidden sm:grid grid-cols-2 gap-4 mb-6">
        <div className="border rounded p-4">
          <h3 className="mb-2">Deck</h3>
          <p>{pushLuckStore.deck.length} cards remaining</p>
        </div>
        <div className="border rounded p-4">
          <h3 className=" mb-2">Discard Pile</h3>
          <p>{pushLuckStore.discardPile.length} cards discarded</p>
        </div>
      </div>

      {/* Central Board - Optimized for mobile */}
      <div className="border rounded-lg p-2 sm:p-6 mb-16 sm:mb-6 min-h-screen">
        <div className="flex flex-wrap gap-2 sm:gap-4 sm:justify-center justify-center mt-12">
          {pushLuckStore.centralBoard.map((card, index) => (
            <div key={`${card.id}-${index}`} className=" first:ml-0 sm:ml-0">
              <CardComponent
                item={card}
                isHighlighted={highlightedCards.has(card.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom on mobile */}
      <div className="fixed bottom-0 left-0 right-0  flex justify-center gap-2  p-2 bg-background/80 backdrop-blur-sm border-t">
        {pushLuckStore.canDraw ? (
          <>
            <Button
              size="lg"
              onClick={() => pushLuckStore.drawCard()}
              disabled={!pushLuckStore.canDraw}
            >
              {config.buttons.draw}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => pushLuckStore.stopTurn()}
            >
              {config.buttons.stop}
            </Button>
          </>
        ) : (
          <div className="flex gap-2">
            {!pushLuckStore.isOtherPlayersPhase &&
              pushLuckStore.actions === 0 && (
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => pushLuckStore.startOtherPlayersPhase()}
                >
                  Other Players
                </Button>
              )}
            <Button
              size="lg"
              variant="default"
              onClick={() => pushLuckStore.nextTurn()}
            >
              Next Turn
            </Button>
          </div>
        )}
      </div>

      {/* Explosion Modal */}
      {pushLuckStore.isExploding && renderExplosionModal()}
    </div>
  );
});

export default PushLuckEngine;
