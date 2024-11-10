import { useState } from "react";
import Modal from "./Modal"; // We'll create this basic modal component
import { Button } from "@/components/ui/button";

const colors = {
  red: "#EF4444",
  blue: "#3B82F6",
  green: "#10B981",
  yellow: "#F59E0B",
  purple: "#8B5CF6",
  pink: "#EC4899",
  indigo: "#6366F1",
  gray: "#6B7280",
  orange: "#F97316",
  teal: "#14B8A6",
  lime: "#84CC16",
  cyan: "#06B6D4",
};

const PlayerSetup = ({ store, minPlayers = 2, maxPlayers = 6 }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playerSettings, setPlayerSettings] = useState(
    store.players.map((p) => ({
      id: p.id,
      name: p.name,
      color: p.color || colors.blue,
    }))
  );

  const handlePlayerCountChange = (e) => {
    const count = Number(e.target.value);
    // Update local state first
    setPlayerSettings((prev) => {
      const newSettings = [...prev];
      if (count > prev.length) {
        // Add new players
        for (let i = prev.length; i < count; i++) {
          newSettings.push({
            id: i + 1,
            name: `Player ${i + 1}`,
            color: Object.values(colors)[i % Object.keys(colors).length],
          });
        }
      } else {
        // Remove excess players
        newSettings.splice(count);
      }
      return newSettings;
    });

    // Update store
    store.setPlayerCount(count, colors);
  };

  const handleNameChange = (index, name) => {
    setPlayerSettings((prev) => {
      const newSettings = [...prev];
      newSettings[index] = { ...newSettings[index], name };
      return newSettings;
    });
  };

  const handleColorChange = (index, color) => {
    setPlayerSettings((prev) => {
      const newSettings = [...prev];
      newSettings[index] = { ...newSettings[index], color };
      return newSettings;
    });
  };

  const saveChanges = () => {
    store.updatePlayerSettings(playerSettings);
    setIsModalOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={store.playerCount}
        onChange={handlePlayerCountChange}
        className="p-2 border rounded"
      >
        {Array.from(
          { length: maxPlayers - minPlayers + 1 },
          (_, i) => i + minPlayers
        ).map((num) => (
          <option key={num} value={num}>
            {num} Players
          </option>
        ))}
      </select>

      <Button
        onClick={() => setIsModalOpen(true)}
        className="text-white bg-black py-2 px-4 rounded"
      >
        Customize Players
      </Button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Customize Players</h2>
            {playerSettings.map((player, index) => (
              <div key={player.id} className="mb-4 p-4 border rounded">
                <div className="flex items-center gap-4 mb-2">
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    className="border rounded px-2 py-1"
                    placeholder={`Player ${index + 1}`}
                  />
                  <div className="flex gap-2">
                    {Object.entries(colors).map(([name, color]) => (
                      <div
                        key={name}
                        onClick={() => handleColorChange(index, color)}
                        className={`w-6 h-6 rounded-full cursor-pointer ${
                          player.color === color
                            ? "ring-2 ring-offset-2 ring-black"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </Button>
              <Button
                onClick={saveChanges}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PlayerSetup;
