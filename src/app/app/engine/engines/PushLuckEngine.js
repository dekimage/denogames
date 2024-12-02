"use client";

import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import pushLuckStore from "@/app/stores/pushLuckStore";
import { Button } from "@/components/ui/button";
import Modal from "@/app/components/Modal";
import { BlueprintPurchaseModals } from "../spaceminers/BlueprintModals";
import { ModeToggle } from "@/components/ui/themeButton";

// Animation duration in seconds
const ANIMATION_DURATION = 1.5;

const PushLuckEngine = observer(({ config, CardComponent }) => {
  const [isActionsAnimating, setIsActionsAnimating] = useState(false);
  const [highlightedCards, setHighlightedCards] = useState(new Set());
  const previousActions = useRef(pushLuckStore.actions);
  const actionSound = useRef(null);
  const boomSound = useRef(null);
  const [soundLoaded, setSoundLoaded] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);

  useEffect(() => {
    pushLuckStore.setConfig(config);
    actionSound.current = new Audio("/sounds/action-gained.mp3");

    // Initialize sounds with error handling
    try {
      boomSound.current = new Audio();
      boomSound.current.src = "/sounds/boom.mp3";

      // Add event listeners to handle loading
      boomSound.current.addEventListener("canplaythrough", () => {
        setSoundLoaded(true);
      });

      boomSound.current.addEventListener("error", (e) => {
        console.error("Error loading sound:", e);
      });

      // Preload the sound
      boomSound.current.load();
    } catch (error) {
      console.error("Error initializing sound:", error);
    }

    // Cleanup
    return () => {
      if (boomSound.current) {
        boomSound.current.removeEventListener("canplaythrough", () => {
          setSoundLoaded(false);
        });
      }
    };
  }, [config]);

  useEffect(() => {
    if (pushLuckStore.actions > previousActions.current) {
      actionSound.current?.play();
      setIsActionsAnimating(true);
      setTimeout(() => setIsActionsAnimating(false), ANIMATION_DURATION * 1000);

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

  const playBoomSound = () => {
    if (boomSound.current && soundLoaded) {
      try {
        // Reset the sound to the beginning if it's already playing
        boomSound.current.currentTime = 0;

        // Play with error handling
        const playPromise = boomSound.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Error playing sound:", error);
          });
        }
      } catch (error) {
        console.error("Error playing boom sound:", error);
      }
    }
  };

  const renderShields = (count) => {
    return Array.from({ length: count }, (_, i) => (
      <span key={i} className="inline-block">
        🛡️
      </span>
    ));
  };

  const renderExplosionModal = () => {
    const disasterCard =
      pushLuckStore.centralBoard[pushLuckStore.centralBoard.length - 1];
    const threatLevel = disasterCard.threat || 1;

    playBoomSound();

    return (
      <Modal>
        <div className="p-6 text-center animate-wobble">
          <div className="text-4xl mb-6 animate-bounce">👁️</div>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            Oops! a Mixing Disaster!
          </h2>

          {/* Disaster Card Container */}
          <div className="mb-6 flex justify-center animate-shake">
            <div className="transform scale-90">
              <CardComponent item={disasterCard} />
            </div>
          </div>

          <p className="mb-6 text-lg">What would you like to do?</p>

          <div className="flex justify-center gap-4">
            <Button
              variant="default"
              onClick={() => pushLuckStore.diffuseBomb()}
              className="animate-pulse flex items-center gap-2"
            >
              <span>Mine</span>
              <span className="flex gap-1">{renderShields(threatLevel)}</span>
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                pushLuckStore.diffuseBomb();
                pushLuckStore.nextTurn();
              }}
              className="animate-pulse"
            >
              End Turn
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  const handleCardSelection = (card) => {
    // Only allow blueprint selection during collection or other players phase
    const isCollectPhase = !pushLuckStore.canDraw;
    const isOtherPlayersPhase = pushLuckStore.isOtherPlayersPhase;

    if (card.card === "blueprint" && (isCollectPhase || isOtherPlayersPhase)) {
      setSelectedBlueprint(card);
    } else if (card.card !== "blueprint") {
      pushLuckStore.toggleCardSelection(card.id);
    }
  };

  const renderCard = (card, index) => {
    const isSelected = pushLuckStore.selectedCards.has(card.id);
    const selectionColor = pushLuckStore.selectedCards.get(card.id);
    const isHighlighted = highlightedCards.has(card.id);

    // Determine if card should be clickable
    const isCollectPhase = !pushLuckStore.canDraw;
    const isOtherPlayersPhase = pushLuckStore.isOtherPlayersPhase;
    const isClickable =
      card.card === "blueprint" ? isCollectPhase || isOtherPlayersPhase : true;

    return (
      <div
        key={`${card.id}-${index}`}
        className={`relative ${
          isClickable ? "cursor-pointer" : "cursor-not-allowed"
        }`}
        onClick={() => isClickable && handleCardSelection(card)}
      >
        <CardComponent
          item={card}
          isHighlighted={isHighlighted}
          isSelected={isSelected}
          selectionColor={selectionColor}
        />
      </div>
    );
  };

  return (
    <div className="sm:container sm:mx-auto font-strike uppercase">
      {/* Header Section - Minimized for mobile */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b sm:relative sm:bg-transparent sm:border-none">
        <div className="flex justify-between items-center p-2 sm:my-6 sm:p-0">
          <div className="flex items-center gap-2 sm:gap-4 justify-center w-full">
            <div
              className={`text-sm sm:text-base ${
                isActionsAnimating
                  ? "text-green-500 scale-125"
                  : "text-foreground scale-100"
              } transition-all duration-300`}
            >
              Actions: {Math.min(pushLuckStore.actions, 5)}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="sm:hidden mr-2"
            onClick={() => pushLuckStore.restartGame()}
          >
            Restart
          </Button>
          <ModeToggle />
        </div>
      </div>

      {/* Game Stats - Hidden on mobile */}
      <div className="hidden sm:grid grid-cols-2 gap-4 mb-6">
        <div className="border rounded p-4">
          <h3 className="mb-2">Deck</h3>
          <p>{pushLuckStore.deck.length} cards remaining</p>
        </div>
        <div className="border rounded p-4">
          <h3 className="mb-2">Discard Pile</h3>
          <p>{pushLuckStore.discardPile.length} cards discarded</p>
        </div>
      </div>

      {/* Central Board */}
      <div className="border rounded-lg p-2 sm:p-6 mb-16 sm:mb-6 min-h-screen">
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mt-14">
          {pushLuckStore.centralBoard.map((card, index) =>
            renderCard(card, index)
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center gap-2 p-2 bg-background/80 backdrop-blur-sm border-t">
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

      {selectedBlueprint && (
        <BlueprintPurchaseModals
          blueprint={{ ...selectedBlueprint }}
          CardComponent={CardComponent}
          rerolls={selectedBlueprint.blueprintRewards?.rerolls}
          onCancel={() => {
            setSelectedBlueprint(null);
          }}
          onComplete={(building) => {
            if (building) {
              pushLuckStore.toggleCardSelection(selectedBlueprint.id);
            }
            setSelectedBlueprint(null);
          }}
        />
      )}
    </div>
  );
});

export default PushLuckEngine;
