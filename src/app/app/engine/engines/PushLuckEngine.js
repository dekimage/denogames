"use client";

import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import pushLuckStore from "@/app/stores/pushLuckStore";
import { Button } from "@/components/ui/button";
import Modal from "@/app/components/Modal";
import { BlueprintPurchaseModals } from "../monstermixology/BlueprintModals";
import { ModeToggle } from "@/components/ui/themeButton";
import Image from "next/image";
import boomImg from "../../../../../public/monstermixology/boom.png";
import shieldImg from "../../../../../public/monstermixology/ingridients/shield.png";
import { Settings } from "lucide-react";


import { Progress } from "@/components/ui/progress";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import emptyDrinkImg from "../../../../../public/monstermixology/emptydrink.png";
import fullDrinkImg from "../../../../../public/monstermixology/fulldrink.png";

// Animation duration in seconds
const ANIMATION_DURATION = 1.5;

const PushLuckEngine = observer(({ config, CardComponent }) => {
  const { toast } = useToast();


  const [isActionsAnimating, setIsActionsAnimating] = useState(false);
  const [highlightedCards, setHighlightedCards] = useState(new Set());
  const previousActions = useRef(pushLuckStore.actions);
  const actionSound = useRef(null);
  const boomSound = useRef(null);
  const [soundLoaded, setSoundLoaded] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);
  const actionGainedFromDraw = useRef(false);
  const [isAsymmetricMode, setIsAsymmetricMode] = useState(false);
  const [isSoloMode, setIsSoloMode] = useState(false);
  const [mixoloBot, setMixoloBot] = useState({
    progressPoints: 0,
    cocktails: 0,
    victoryPoints: 0
  });
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [botDifficulty, setBotDifficulty] = useState('medium');

  useEffect(() => {
    if (typeof window !== "undefined") {
      pushLuckStore.setConfig(config);
      actionSound.current = new Audio("/sounds/action-gained.mp3");
  
      try {
        boomSound.current = new Audio();
        boomSound.current.src = "/sounds/boom.mp3";
  
        boomSound.current.addEventListener("canplaythrough", () => {
          setSoundLoaded(true);
        });
  
        boomSound.current.load();
      } catch (error) {
        console.error("Error initializing sound:", error);
      }
  
      return () => {
        if (boomSound.current) {
          boomSound.current.removeEventListener("canplaythrough", () => {
            setSoundLoaded(false);
          });
        }
      };
    }
  }, [config]);

  useEffect(() => {
    if (
      pushLuckStore.actions > previousActions.current &&
      actionGainedFromDraw.current
    ) {
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
    actionGainedFromDraw.current = false;
  }, [pushLuckStore.actions]);

  useEffect(() => {
    if (pushLuckStore.selectedCards.size > 0) {
      pushLuckStore.setCanDraw(false);
    } else if (!pushLuckStore.isOtherPlayersPhase) {
      pushLuckStore.setCanDraw(true);
    }
  });

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
      <div key={i} className="inline-block">
        <Image src={shieldImg} alt={"shield img"} width={20} height={20} />
      </div>
    ));
  };

  const renderExplosionModal = () => {
    const disasterCard =
      pushLuckStore.centralBoard[pushLuckStore.centralBoard.length - 1];
    const threatLevel = disasterCard.threat || 1;

    playBoomSound();

    return (
      <Modal showClose={false}>
        <div className="p-6 text-center animate-wobble">
          <div className="text-4xl mb-6 animate-bounce">
            <Image src={boomImg} alt={"boom img"} width={20} height={20} />
          </div>
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
              <span>Keep Exploring</span>
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                pushLuckStore.diffuseBomb();
                pushLuckStore.nextTurn();
                updateMixoloBot();
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
    // Don't allow selecting disaster cards
    if (card.type === "boom") {
      return;
    }

    // Always allow deselection of already selected cards
    const isAlreadySelected = pushLuckStore.selectedCards.has(card.id);
    if (isAlreadySelected) {
      pushLuckStore.toggleCardSelection(card.id);
      return;
    }

    // Don't allow selecting new cards (including blueprints) if no actions left
    if (pushLuckStore.actions <= 0 && !pushLuckStore.isOtherPlayersPhase) {
      return;
    }

    // For blueprints, show the purchase modal
    if (card.card === "blueprint") {
      setSelectedBlueprint(card);
    } else {
      // For all other cards, handle normal selection
      pushLuckStore.toggleCardSelection(card.id);
    }
  };

  const renderCard = (card, index) => {
    const isSelected = pushLuckStore.selectedCards.has(card.id);
    const selectionColor = pushLuckStore.selectedCards.get(card.id);
    const isHighlighted = highlightedCards.has(card.id);

    // Only prevent clicking on disaster cards
    const isDisaster = card.type === "boom";
    const isClickable = !isDisaster;

    return (
      <div
        key={`${card.id}-${index}`}
        className={`relative ${
          isClickable ? "cursor-pointer" : "cursor-not-allowed"
        } ${isSelected ? "brightness-50" : ""}`}
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

  const handleDrawCard = () => {
    actionGainedFromDraw.current = true;
    pushLuckStore.drawCard();

    // Only auto-scroll if we have 9 or more cards
    if (pushLuckStore.centralBoard.length >= 9) {
      setTimeout(() => {
        if (typeof window !== "undefined") {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  };

  // Add helper function for dice rolls
  const rollD6 = () => Math.floor(Math.random() * 6) + 1;

  const adjustRollForDifficulty = (roll) => {
    switch (botDifficulty) {
      case 'easy':
        return roll === 6 ? 1 : roll; // Treat 6 as 1
      case 'hard':
        return roll === 5 ? 6 : roll; // Treat 5 as 6
      default:
        return roll; // Medium difficulty - no changes
    }
  };

  const updateMixoloBot = () => {
    if (!isSoloMode) return;

    setMixoloBot(prev => {
      // Roll for progress with difficulty adjustment
      const progressRoll = adjustRollForDifficulty(rollD6());
      let progressGained = 0;
      
      // Calculate progress based on adjusted roll
      if (progressRoll === 1 || progressRoll === 2) {
        progressGained = 0;
      } else if (progressRoll === 3) {
        progressGained = 1;
      } else if (progressRoll === 4 || progressRoll === 5) {
        progressGained = 2;
      } else if (progressRoll === 6) {
        progressGained = 3;
      }

      const newProgressPoints = prev.progressPoints + progressGained;

      toast({title: `Mixolo-bot rolled ${progressRoll} and gained ${progressGained} progress! 🎲`});
      
      if (newProgressPoints >= 3) {
        const vpRoll = adjustRollForDifficulty(rollD6());
        let vpGained = 0;

        if (vpRoll === 1) {
          vpGained = 2;
        } else if (vpRoll === 2 || vpRoll === 3) {
          vpGained = 3;
        } else if (vpRoll === 4 || vpRoll === 5) {
          vpGained = 4;
        } else if (vpRoll === 6) {
          vpGained = 5;
        }

        const newCocktails = prev.cocktails + 1;
        const newVP = prev.victoryPoints + vpGained;
        
        toast({title: `Mixolo-bot made a drink! Rolled ${vpRoll} for ${vpGained} VP! 🍹`});
        
        if (newCocktails >= 8) {
          setTimeout(() => {
            setShowGameEndModal(true);
          }, 500);
        }
        
        return {
          progressPoints: newProgressPoints - 3, // Keep excess progress
          cocktails: newCocktails,
          victoryPoints: newVP
        };
      }
      
      return {
        ...prev,
        progressPoints: newProgressPoints
      };
    });
  };

  const handleTurnEnd = () => {
    pushLuckStore.nextTurn();
    updateMixoloBot();
  };

  const [showGameEndModal, setShowGameEndModal] = useState(false);

  const GameEndModal = () => (
    <Modal onClose={() => setShowGameEndModal(false)}>
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
        <p className="mb-4">Mixolo-bot has completed 8 cocktails!</p>
        <p className="text-xl font-bold mb-6">
          Final Score: {mixoloBot.victoryPoints} Victory Points
        </p>
        <Button onClick={() => {
          setShowGameEndModal(false);
          pushLuckStore.restartGame();
          setMixoloBot({
            progressPoints: 0,
            cocktails: 0,
            victoryPoints: 0
          });
        }}>
          New Game
        </Button>
      </div>
    </Modal>
  );

  const BotStatus = () => (
    <div className="fixed bottom-20 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-2">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-2">
          <span>Mixolo-bot Progress</span>
          <span>{mixoloBot.progressPoints}/3</span>
        </div>
        <Progress 
          value={(mixoloBot.progressPoints / 3) * 100} 
          className="h-2 mb-2"
        />
        <div className="flex justify-between text-sm mb-2">
          <span>Cocktails: {mixoloBot.cocktails}/8</span>
          <span>Victory Points: {mixoloBot.victoryPoints}</span>
        </div>
        
        {/* Drinks visualization */}
        <div className="flex justify-center gap-1 mt-2">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="w-6 h-6 relative">
              <Image
                src={index < mixoloBot.cocktails ? fullDrinkImg : emptyDrinkImg}
                alt={`drink ${index + 1}`}
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DifficultyModal = () => {
    const [selectedDifficulty, setSelectedDifficulty] = useState(botDifficulty);
    const hasProgress = mixoloBot.cocktails > 0 || mixoloBot.progressPoints > 0;

    return (
      <Modal onClose={() => setShowDifficultyModal(false)}>
        <div className="p-6 text-center">
          <Image
            src={emptyDrinkImg}
            alt="Mixolo-bot"
            width={48}
            height={48}
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold mb-6">Select Mixolo-bot's Difficulty</h2>
          
          <div className="flex flex-col gap-3 mb-6">
            {['easy', 'medium', 'hard'].map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? "default" : "outline"}
                className="relative"
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                <span className="capitalize">{difficulty}</span>
                {selectedDifficulty === difficulty && (
                  <span className="absolute right-3 text-primary-foreground">✓</span>
                )}
              </Button>
            ))}
          </div>

          {hasProgress && (
            <p className="text-sm text-muted-foreground mb-4">
              Changing difficulty will restart the game
            </p>
          )}

          <Button
            onClick={() => {
              setBotDifficulty(selectedDifficulty);
              if (hasProgress) {
                pushLuckStore.restartGame();
                setMixoloBot({
                  progressPoints: 0,
                  cocktails: 0,
                  victoryPoints: 0
                });
              }
              setShowDifficultyModal(false);
            }}
          >
            Save
          </Button>
        </div>
      </Modal>
    );
  };

  return (
    <div className="sm:container sm:mx-auto font-strike uppercase">
      {/* Header Section - Minimized for mobile */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b sm:relative sm:bg-transparent sm:border-none">
        <div className="flex justify-between items-center p-2 sm:my-6 sm:p-0">
          {/* Left side - ModeToggle */}
          <div className="flex items-center">
            <ModeToggle />
          </div>

          {/* Center - Main content */}
          {isSoloMode ? (
            <div className="flex items-center gap-2 sm:gap-4 justify-center flex-1">
              <Image
                src={emptyDrinkImg}
                alt="Mixolo-bot"
                width={24}
                height={24}
                className="object-contain"
              />
              <span className="font-bold text-lg">Mixolo-Bot</span>
              <div
                className={`text-sm sm:text-base ml-4 ${
                  isActionsAnimating
                    ? "text-green-500 scale-125"
                    : "text-foreground scale-100"
                } transition-all duration-300`}
              >
                Actions: {Math.min(pushLuckStore.actions, 4)}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4 justify-center flex-1">
              <div
                className={`text-sm sm:text-base ${
                  isActionsAnimating
                    ? "text-green-500 scale-125"
                    : "text-foreground scale-100"
                } transition-all duration-300`}
              >
                Actions: {Math.min(pushLuckStore.actions, 4)}
              </div>
            </div>
          )}

          {/* Right side - Settings */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuCheckboxItem
                  checked={pushLuckStore.isRedCardsDisabled}
                  onCheckedChange={pushLuckStore.toggleRedCards}
                >
                  Disable Red Cards
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={isAsymmetricMode}
                  onCheckedChange={setIsAsymmetricMode}
                >
                  Asymmetric Mode
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={isSoloMode}
                  onCheckedChange={(checked) => {
                    setIsSoloMode(checked);
                    if (checked) {
                      setShowDifficultyModal(true);
                    }
                  }}
                >
                  <div>
                    <div>Solo Mode</div>
                    {isSoloMode && (
                      <div className="text-xs text-muted-foreground">
                        Difficulty: <span className="capitalize">{botDifficulty}</span>
                      </div>
                    )}
                  </div>
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => pushLuckStore.restartGame()}>
                  Restart Game
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <ModeToggle />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
      <div className="border rounded-lg p-2 sm:p-6  mb-12 sm:mb-6 min-h-[90vh]">
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mt-14">
          {pushLuckStore.centralBoard.map((card, index) =>
            renderCard(card, index)
          )}
        </div>
      </div>

      {/* Modified Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center gap-2 p-2 bg-background/80 backdrop-blur-sm border-t">
        {pushLuckStore.selectedCards.size === 0 ? (
          // Show Explore button when no cards are selected
          <Button
            size="lg"
            onClick={handleDrawCard}
            disabled={
              !pushLuckStore.canDraw || pushLuckStore.isOtherPlayersPhase
            }
          >
            {config.buttons.draw || "Explore"}
          </Button>
        ) : (
          // Show Next Turn and Other Players buttons when cards are selected
          <div className="flex gap-2">
            {!pushLuckStore.isOtherPlayersPhase && !isSoloMode && (
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
              onClick={handleTurnEnd}
            >
              Next Turn
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => pushLuckStore.addAction()}
              className="px-2 aspect-square"
            >
              +
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
          isAsymmetricMode={isAsymmetricMode}
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

      {isSoloMode && <BotStatus />}
      {showGameEndModal && <GameEndModal />}
      {showDifficultyModal && <DifficultyModal />}
    </div>
  );
});

export default PushLuckEngine;
