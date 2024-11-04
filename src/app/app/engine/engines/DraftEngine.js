"use client";

import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import DieComponent from "@/app/components/Die";
import CardComponent from "@/app/components/Card";
import draftStore from "@/app/stores/draftStore";
import PlayerSetup from "@/app/components/PlayerSetup";
import Modal from "@/app/components/Modal";
import { FaCog, FaInbox, FaTrash } from "react-icons/fa"; // Make sure to install react-icons

const DraftEngine = observer(({ config }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  useEffect(() => {
    draftStore.setConfig(config);
  }, [config]);

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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Draft Engine</h1>

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
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-2 flex-wrap">
            <PlayerSetup store={draftStore} />
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => draftStore.nextTurn()}
            >
              Next Turn
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => draftStore.restartGame()}
            >
              Restart Game
            </button>
          </div>
        </div>
      )}

      {/* Central Board */}
      <div className="border p-4 mb-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Central Board</h2>
        <div className="flex flex-wrap gap-2">
          {draftStore.centralBoard.map((item, index) => (
            <div
              key={item.id}
              className="cursor-pointer"
              onClick={() => draftStore.draftItem(index)}
            >
              {item.type === "die" ? (
                <DieComponent item={item} />
              ) : (
                <CardComponent item={item} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Player's Board */}
      {activePlayer && (
        <div className="border p-4 rounded-lg bg-yellow-50">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: activePlayer.color }}
            />
            <h2 className="text-xl font-semibold">
              {activePlayer.name}`s Turn
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {activePlayer.hand.map((item) => (
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
      )}

      {/* Modals */}
      {showDeckModal &&
        renderPileModal("Deck", draftStore.deck, () => setShowDeckModal(false))}
      {showDiscardModal &&
        renderPileModal("Discard Pile", draftStore.discardPile, () =>
          setShowDiscardModal(false)
        )}
    </div>
  );
});

export default DraftEngine;
