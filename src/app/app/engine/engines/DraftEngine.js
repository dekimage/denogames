"use client";

import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import DieComponent from "@/app/components/Die";
import CardComponent from "@/app/components/Card";
import draftStore from "@/app/stores/draftStore";
import PlayerSetup from "@/app/components/PlayerSetup";
import Modal from "@/app/components/Modal";
import { FaCog, FaInbox, FaTrash, FaEye } from "react-icons/fa"; // Make sure to install react-icons
import { Button } from "@/components/ui/button";
import { getIcon } from "@/app/mvp/vampires/components/Icons";

const DraftEngine = observer(({ config, CardComponent }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showDraftResults, setShowDraftResults] = useState(false);

  useEffect(() => {
    draftStore.setConfig(config);
  }, [config]);

  useEffect(() => {
    const checkDraftComplete = () => {
      const isLastPlayer = draftStore.activePlayerIndex === -1;
      const isDraftComplete =
        draftStore.draftingRound >= draftStore.maxDraftingRounds;

      if (isLastPlayer && isDraftComplete) {
        setShowDraftResults(true);
      }
    };

    checkDraftComplete();
  }, []);

  const activePlayer = draftStore.players[draftStore.activePlayerIndex] || null;

  const renderPileModal = (title, items, onClose) => (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-4">{items.length} items</p>
        <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id}>
              {item.type === "die" ? (
                <DieComponent item={item} />
              ) : (
                <CardComponent item={item} />
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );

  const renderItem = (item) => {
    if (item.type === "die") {
      return <DieComponent item={item} />;
    }
    return CardComponent ? (
      <CardComponent item={item} />
    ) : (
      <CardComponent item={item} />
    );
  };

  const DraftResults = () => {
    const [showRewardModal, setShowRewardModal] = useState(false);
    const [currentReward, setCurrentReward] = useState(null);
    const [rewardType, setRewardType] = useState(null);

    const resources = ["silver", "cross", "garlic"]; // example resources
    const dice = ["1", "2", "3", "4", "5", "6"]; // example dice
    const fragments = [
      "fragment_crimson_1",
      "fragment_crimson_2",
      "fragment_crimson_3",
      "fragment_emerald_1",
      "fragment_emerald_2",
      "fragment_emerald_3",
      "fragment_granite_1",
      "fragment_granite_2",
      "fragment_granite_3",
    ];
    const getRandomReward = (options) => {
      const randomIndex = Math.floor(Math.random() * options.length);
      return options[randomIndex];
    };

    const handleRewardClick = (type) => {
      let reward;
      setRewardType(type);

      switch (type) {
        case "resource":
          reward = getRandomReward(resources);
          break;
        case "dice":
          reward = getRandomReward(dice);
          break;
        case "fragment":
          reward = getRandomReward(fragments);
          break;
      }

      setCurrentReward(reward);
      setShowRewardModal(true);
    };

    const RewardModal = () => (
      <div className="uppercase font-strike fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <h3 className="text-xl font-bold mb-4">Your {rewardType} Reward</h3>
          <div className="mb-6">
            {/* Use getIcons here to display the reward */}
            <div className="flex justify-center items-center text-4xl mb-4">
              {getIcon(currentReward, 50)}
            </div>
          </div>
          <Button
            variant="default"
            size="lg"
            onClick={() => setShowRewardModal(false)}
          >
            Done
          </Button>
        </div>
      </div>
    );

    return (
      <div
        className="uppercase font-strike fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-lg p-4 w-full max-w-6xl">
          <div className="flex justify-between items-center text-2xl mb-4">
            <div>Draft Results</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleRewardClick("resource")}
              >
                {getIcon("random_resource", 50)}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRewardClick("dice")}
              >
                {getIcon("dice", 50)}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRewardClick("fragment")}
              >
                {getIcon("discover_fragment", 50)}
              </Button>
            </div>
          </div>

          {/* Existing draft results content */}
          <div className="flex flex-wrap gap-4">
            {draftStore.players.map((player) => (
              <div
                key={player.id}
                className="flex-1 min-w-[200px] p-4 rounded-lg"
                style={{ backgroundColor: player.color + "20" }}
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: player.color }}
                  />
                  <h3>{player.name}</h3>
                </div>
                <div className="flex justify-center items-center gap-2">
                  {player.hand.map((item) => (
                    <div key={item.id}>{renderItem(item)}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Keep the continue button at the bottom */}
          <div className="mt-4 flex justify-center">
            <Button
              variant="default"
              className="text-white bg-black hover:bg-gray-800"
              onClick={() => {
                setShowDraftResults(false);
                draftStore.continueDrafting();
              }}
            >
              Continue
            </Button>
          </div>

          {showRewardModal && <RewardModal />}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 font-strike uppercase">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl">Draft Engine</h1>
          <div className="text-gray-600">
            Turn: {draftStore.currentTurn} | Age: {draftStore.currentAge} |
            Round: {draftStore.draftingRound + 1}/{draftStore.maxDraftingRounds}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Deck and Discard pile indicators */}
          <button
            onClick={() => setShowDeckModal(true)}
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100"
            title="View Deck"
          >
            <FaInbox className="text-gray-600" />
          </button>

          <button
            onClick={() => setShowDiscardModal(true)}
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100"
            title="View Discard Pile"
          >
            <FaTrash className="text-gray-600" />
          </button>

          {/* Settings button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100"
            title="Settings"
          >
            <FaCog className="text-gray-600" />
          </button>

          <button
            onClick={() => setShowDraftResults(true)}
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100"
            title="View Draft Results"
          >
            <FaEye className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-2 flex-wrap">
            <PlayerSetup store={draftStore} />
            <Button
              className="bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded"
              onClick={() => draftStore.nextTurn()}
            >
              Next Turn
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-700 text-white  py-2 px-4 rounded"
              onClick={() => draftStore.restartGame()}
            >
              Restart Game
            </Button>
          </div>
        </div>
      )}

      {/* Central Board */}
      <div className="border p-4 mb-4 rounded-lg ">
        {/* <h2 className="text-xl font-semibold mb-2">Central Board</h2> */}
        <div className="flex justify-center items-center min-h-[600px] gap-4">
          {draftStore.centralBoard.map((item, index) => (
            <div
              key={item.id}
              className="cursor-pointer"
              onClick={() => draftStore.draftItem(index)}
            >
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>

      {/* Active Player's Board */}
      {activePlayer && (
        <div className="border p-4 rounded-lg bg-yellow-50">
          <div className="flex items-center  gap-2 mb-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: activePlayer.color }}
            />
            <h2 className="text-xl">{activePlayer.name}`s Turn</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {activePlayer?.hand.map((item) => (
              <div key={item.id}>{renderItem(item)}</div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showDeckModal &&
        renderPileModal("Deck", draftStore.deck, () => setShowDeckModal(false))}
      {showDiscardModal &&
        renderPileModal("Discard Pile", draftStore.discardPile, () =>
          setShowDiscardModal(false)
        )}
      {showDraftResults && <DraftResults />}
    </div>
  );
});

export default DraftEngine;
