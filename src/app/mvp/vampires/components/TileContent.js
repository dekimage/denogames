import React from "react";
import { getIcon, renderIcons } from "./Icons";

const MilitaryContent = ({ content }) => (
  <div className="flex justify-center items-center">
    {getIcon(`power_${content.power}`, 30)}

    {/* <p className="text-gray-700">Advanced Power: {content.advancedPower}</p>
    <p className="italic text-sm text-gray-500">
      Condition: {content.condition.condition}
    </p> */}
  </div>
);

const ArtifactsContent = ({ content }) => (
  <div className="flex justify-center items-center">
    {renderIcons(content.artifacts, 40)}
  </div>
);

const EngineContent = ({ content }) => (
  <div className="engine-content">
    <p className="font-semibold text-green-500">Uses: {content.uses}</p>
    <p className="text-gray-700">Effect: {content.effect}</p>
  </div>
);

const FarmingContent = ({ content }) => (
  <div className="flex justify-center items-center">
    <div className="flex gap-2">{renderIcons(content.resources)}</div>
  </div>
);

const PrestigeContent = ({ content }) => (
  <div className="flex justify-center items-center">
    {getIcon(content.vpCondition, 30)}
  </div>
);

// Main renderContent function
const renderContent = (tileType, content) => {
  switch (tileType) {
    case "military":
      return <MilitaryContent content={content} />;
    case "artifact":
      return <ArtifactsContent content={content} />;
    case "engine":
      return <EngineContent content={content} />;
    case "farming":
      return <FarmingContent content={content} />;
    case "prestige":
      return <PrestigeContent content={content} />;
    default:
      return <div className="text-gray-500">No content available</div>;
  }
};

export { renderContent };
