// utils/drawRandomItems.js

export const drawRandomItems = (array, numItems) => {
  if (numItems > array.length) {
    throw new Error("Number of items to draw exceeds the array length");
  }

  // Shuffle the array and return the first `numItems` items
  const shuffledArray = [...array].sort(() => 0.5 - Math.random());
  return shuffledArray.slice(0, numItems);
};

// EXAMPLE HOW TO USE PASS CONFIGS FOR EACH TYPE
//const criteriaConfigs = [
//   {
//     key: "symbol",         // The property to match
//     matchValue: "emblem",  // Prefix to match for specific symbols
//     count: 2,              // Number of emblem cards to draw
//     positions: [0, 3],     // Specific positions for emblem cards
//   },
//   // Add more criteria configs if needed, e.g., { key: "symbol", matchValue: "heart", count: 5 }
// ];
export const drawSpecificCards = (array, criteriaConfigs, totalDrawCount) => {
  let drawnCards = Array(totalDrawCount).fill(null); // Initialize array with nulls for specific positioning
  let usedPositions = new Set(); // Track specific positions used
  let selectedCards = new Set(); // Track cards already drawn to avoid duplicates
  let excludedSymbols = new Set(); // Track symbols to exclude in final draw

  // Process each criteria config
  criteriaConfigs.forEach((config) => {
    const { key, matchValue, count, positions } = config;

    // Filter matching items in the array
    const matchingItems = array.filter((item) =>
      item[key]?.startsWith(matchValue)
    );

    if (matchingItems.length < count) {
      throw new Error(
        `Not enough items matching "${matchValue}" for the given count.`
      );
    }

    // Shuffle and select the exact number of matching items needed
    const selectedItems = matchingItems
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
    excludedSymbols.add(matchValue); // Exclude this symbol from future random draws

    // Place selected items at specific positions if provided
    if (positions && positions.length) {
      positions.forEach((pos, idx) => {
        if (idx < selectedItems.length && !usedPositions.has(pos)) {
          drawnCards[pos] = selectedItems[idx];
          usedPositions.add(pos);
          selectedCards.add(selectedItems[idx]); // Mark this card as used
        }
      });
    }

    // Place remaining selected items at random available positions if any were not placed above
    selectedItems.slice(positions?.length || 0).forEach((item) => {
      let pos;
      do {
        pos = Math.floor(Math.random() * totalDrawCount);
      } while (usedPositions.has(pos) || drawnCards[pos] !== null); // Ensure position isn't used

      drawnCards[pos] = item;
      usedPositions.add(pos);
      selectedCards.add(item);
    });
  });

  // Filter the remaining deck to exclude previously selected cards and symbols in `excludedSymbols`
  const remainingDeck = array.filter(
    (item) =>
      !selectedCards.has(item) &&
      !excludedSymbols.has(item.symbol.split("_")[0])
  );
  const remainingDrawCount = totalDrawCount - Array.from(usedPositions).length;
  const randomDraw = remainingDeck
    .sort(() => 0.5 - Math.random())
    .slice(0, remainingDrawCount);

  // Place remaining items in empty positions
  let randomIndex = 0;
  drawnCards = drawnCards.map((card) => {
    if (card === null && randomIndex < randomDraw.length) {
      return randomDraw[randomIndex++];
    }
    return card;
  });

  return drawnCards;
};
