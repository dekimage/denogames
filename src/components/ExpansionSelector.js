"use client";

import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import Image from "next/image";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { Check } from "lucide-react";
import React from "react";

const ExpansionItem = observer(
  ({ expansion, isSelected, onToggle, isPurchased }) => {
    return (
      <div className="box-inner mb-4">
        <div className="box-broken">
          <div className="flex items-center p-4 gap-4">
            {/* Left: Checkbox or Lock */}
            <div className="flex-shrink-0 w-[40px] flex justify-center">
              {isPurchased ? (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggle(expansion.id)}
                  disabled={!isPurchased}
                />
              ) : (
                <Lock className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {/* Center: Content */}
            <div className="flex-grow">
              <h3 className="font-strike uppercase text-lg mb-1">
                {expansion.name}
              </h3>
              {isPurchased ? (
                <p className="text-sm text-gray-600">{expansion.description}</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Expansion not owned</p>
                  <div className="flex items-center gap-2">
                    <span className="font-strike text-lg">
                      ${expansion.price}.00
                    </span>
                    <Link href={`/product-details/${expansion.slug}`}>
                      <Button size="sm">Buy Expansion</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Image */}
            <div className="flex-shrink-0 w-[100px] h-[100px]">
              <Image
                src={expansion.thumbnail}
                alt={expansion.name}
                width={100}
                height={100}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

const ExpansionSelector = observer(
  ({ gameId, selectedExpansions, setSelectedExpansions }) => {
    const { getRelatedExpansions, products } = MobxStore;
    const [isExpanded, setIsExpanded] = React.useState(false);

    // Get the core game details
    const coreGame = React.useMemo(
      () => products.find((p) => p.id === gameId),
      [products, gameId]
    );

    const expansions = React.useMemo(
      () => getRelatedExpansions(gameId, { includeOwned: true }),
      [gameId, getRelatedExpansions]
    );

    const handleToggleExpansion = React.useCallback(
      (expansionId) => {
        setSelectedExpansions((prev) => {
          if (prev.includes(expansionId)) {
            return prev.filter((id) => id !== expansionId);
          }
          return [...prev, expansionId];
        });
      },
      [setSelectedExpansions]
    );

    if (!coreGame) return null;

    return (
      <div className="w-full max-w-3xl mx-auto mb-8">
        {/* Collapsible Header */}
        <div
          className="box-inner mb-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="box-broken">
            <div className="flex flex-row p-4 justify-between items-center px-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-strike uppercase text-lg items-center flex">
                  Play with Expansions
                </h2>
              </div>

              {/* Thumbnail Preview Row */}
              <div className="flex gap-4 items-center flex-grow justify-center px-4">
                {/* Core Game Thumbnail (Always checked) */}
                <div className="relative w-[60px] h-[60px]">
                  <Image
                    src={coreGame.thumbnail}
                    alt={coreGame.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover w-full h-full"
                  />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>

                <div className="text-4xl">+</div>

                {/* Expansion Thumbnails */}
                {expansions.map((expansion) => (
                  <div
                    key={expansion.id}
                    className="relative w-[60px] h-[60px]"
                  >
                    <Image
                      src={expansion.thumbnail}
                      alt={expansion.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover w-full h-full"
                    />
                    {selectedExpansions.includes(expansion.id) && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="space-y-4">
            {/* Core Game (Always shown with permanent checkmark) */}
            <div className="box-inner">
              <div className="box-broken">
                <div className="flex items-center p-4 gap-4">
                  <div className="flex-shrink-0 w-[40px] flex justify-center">
                    <Checkbox checked={true} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-strike uppercase text-lg mb-1">
                      {coreGame.name} (Core Game)
                    </h3>
                    <p className="text-sm text-gray-600">
                      Base game components
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-[100px] h-[100px]">
                    <Image
                      src={coreGame.thumbnail}
                      alt={coreGame.name}
                      width={100}
                      height={100}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Available Expansions */}
            {expansions.length > 0 && (
              <>
                <h3 className="text-lg font-strike uppercase mb-4 text-center">
                  Select Expansions to Download
                </h3>
                {expansions.map((expansion) => (
                  <ExpansionItem
                    key={expansion.id}
                    expansion={expansion}
                    isSelected={selectedExpansions.includes(expansion.id)}
                    onToggle={handleToggleExpansion}
                    isPurchased={expansion.isOwned}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default ExpansionSelector;
