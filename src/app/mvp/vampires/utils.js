// utils/drawRandomItems.js

export const drawRandomItems = (array, numItems) => {
  if (numItems > array.length) {
    throw new Error("Number of items to draw exceeds the array length");
  }

  // Shuffle the array and return the first `numItems` items
  const shuffledArray = [...array].sort(() => 0.5 - Math.random());
  return shuffledArray.slice(0, numItems);
};
