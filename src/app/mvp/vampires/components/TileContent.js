// TileContent.js

import React from "react";

// Individual content components for each tile type
const MilitaryContent = ({ content }) => (
  <div className="military-content">
    <p className="font-semibold text-red-500">Power: {content.power}</p>
    <p className="text-gray-700">Advanced Power: {content.advancedPower}</p>
    <p className="italic text-sm text-gray-500">
      Condition: {content.condition.condition}
    </p>
  </div>
);

const ArtifactsContent = ({ content }) => (
  <div className="artifact-content">
    <p className="font-semibold text-blue-500">
      Artifacts: {content.artifacts.join(", ")}
    </p>
  </div>
);

const EngineContent = ({ content }) => (
  <div className="engine-content">
    <p className="font-semibold text-green-500">Uses: {content.uses}</p>
    <p className="text-gray-700">Effect: {content.effect}</p>
  </div>
);

const FarmingContent = ({ content }) => (
  <div className="farming-content">
    <p className="font-semibold text-yellow-600">
      Resources: {content.resources.join(", ")}
    </p>
  </div>
);

const PrestigeContent = ({ content }) => (
  <div className="prestige-content">
    <p className="font-semibold text-purple-500">End Game VP Condition:</p>
    <p className="text-gray-700">{content.vpCondition}</p>
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
