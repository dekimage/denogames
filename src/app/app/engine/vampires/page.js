"use client";
import { vampiresConfig } from "@/app/gameConfig";
import Engine from "../page";

const VampireCard = ({ item }) => (
  <div
    className="p-4 border rounded-lg text-center"
    style={{ backgroundColor: item.color }}
  >
    <h3 className="text-lg font-bold">{`Vampire Power ${item.value}`}</h3>
  </div>
);

const vampiresUIConfig = {
  showPlayerCountDropdown: true, // Only show player count dropdown
};

const VampiresGame = () => {
  return <Engine config={vampiresConfig} uiConfig={vampiresUIConfig} />;
};

export default VampiresGame;
