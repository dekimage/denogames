"use client";

const GridCell = ({ content }) => (
  <div className="w-[30px] h-[30px] border-r border-b border-black last:border-r-0 flex items-center justify-center">
    {content}
  </div>
);

const ItemRow = ({ image, cellsConfig }) => (
  <div className="flex items-center mb-2">
    {/* Left side - Image */}
    <div className="w-[60px] h-[60px] bg-gray-200 flex-shrink-0 flex items-center justify-center border border-black">
      {image}
    </div>

    {/* Right side - 2x6 grid with shared borders */}
    <div className="border-t border-black">
      <div className="flex">
        {cellsConfig.slice(0, 6).map((cell, i) => (
          <GridCell key={`top-${i}`} content={cell} />
        ))}
      </div>
      <div className="flex">
        {cellsConfig.slice(6, 12).map((cell, i) => (
          <GridCell key={`bottom-${i}`} content={cell} />
        ))}
      </div>
    </div>
  </div>
);

export default function LeftColumn() {
  const createElementPattern = (emoji) => {
    return Array(12)
      .fill()
      .map((_, index) => {
        // Every 4th position (3, 7, 11) gets the emoji
        if ((index + 1) % 4 === 0) {
          return <div key={index}>{emoji}</div>;
        }
        // Other positions get an empty cell with dotted border
        return (
          <div
            key={index}
            className="w-[20px] h-[20px] rounded-full border border-gray-300 border-dotted m-auto"
          />
        );
      });
  };

  const patternedRow = {
    image: "🎮",
    cellsConfig: [
      "🌟",
      "🌟",
      "🌟",
      "🎯", // First row: 3 stars + target
      "🌟",
      "🌟",
      "🌟",
      "🎲", // Then 3 stars + dice
      "🌟",
      "🌟",
      "🌟",
      "🎨", // Then 3 stars + palette
    ],
  };

  // Example of a different configuration
  const differentRow = {
    image: "🎲",
    cellsConfig: Array(12).fill("🔥"), // All cells filled with fire
  };
  return (
    <div className="w-[250px] border-r border-black p-2">
      {/* Game Title and QR Code */}
      <div className="h-[50px] flex justify-between items-center mb-2">
        <h1 className="font-bold text-lg">Bazaar</h1>
        <div className="w-[50px] h-[50px] bg-gray-200 flex items-center justify-center">
          📱
        </div>
      </div>

      {/* Regular rows */}
      <ItemRow
        image={
          <img
            src="/bazaar/fire.png"
            alt="Fire"
            className="w-[40px] h-[40px]"
          />
        }
        cellsConfig={createElementPattern("🔥")}
      />
      <ItemRow
        image={
          <img
            src="/bazaar/water.png"
            alt="Fire"
            className="w-[40px] h-[40px]"
          />
        }
        cellsConfig={createElementPattern("💎")}
      />
      <ItemRow
        image={
          <img
            src="/bazaar/earth.png"
            alt="Fire"
            className="w-[40px] h-[40px]"
          />
        }
        cellsConfig={createElementPattern("🔮")}
      />
      <ItemRow
        image={
          <img src="/bazaar/air.png" alt="Fire" className="w-[40px] h-[40px]" />
        }
        cellsConfig={createElementPattern("🌙")}
      />
      <ItemRow image="🎪" cellsConfig={createElementPattern("⚡")} />
      <ItemRow image="🎠" cellsConfig={Array(12).fill("🔥")} />

      {/* Pattern rows */}
      <ItemRow {...patternedRow} />
      <ItemRow {...patternedRow} />
      <ItemRow {...patternedRow} />
      <ItemRow {...patternedRow} />
    </div>
  );
}
