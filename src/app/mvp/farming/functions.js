export const GRAINS = ["flax", "hop", "rice", "oat", "wheat", "malt"];
const GRID_SIZE = 6;
const GRAINS_PER_CELL = 3;
const TOTAL_GRAINS = GRID_SIZE * GRID_SIZE * GRAINS_PER_CELL;
const GRAINS_PER_TYPE = TOTAL_GRAINS / GRAINS.length;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function generateGridData() {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    attempts++;

    try {
      const gridData = [];
      const grainCounts = Object.fromEntries(
        GRAINS.map((grain) => [grain, GRAINS_PER_TYPE])
      );

      // Generate header grains (1 of each per row, shuffled)
      for (let i = 0; i < GRID_SIZE; i++) {
        const rowHeaderGrains = shuffleArray([...GRAINS]);
        const row = rowHeaderGrains.map((headerGrain) => ({
          headerGrain,
          mainGrains: [],
        }));
        gridData.push(...row);
      }

      // Distribute remaining grains
      for (let cell of gridData) {
        let cellAttempts = 0;
        const maxCellAttempts = 100;

        while (
          cell.mainGrains.length < GRAINS_PER_CELL &&
          cellAttempts < maxCellAttempts
        ) {
          cellAttempts++;
          const availableGrains = Object.entries(grainCounts).filter(
            ([_, count]) => count > 0
          );

          if (availableGrains.length === 0) {
            throw new Error("No grains available");
          }

          const [grain, count] =
            availableGrains[Math.floor(Math.random() * availableGrains.length)];

          if (cell.mainGrains.filter((g) => g === grain).length < 2) {
            cell.mainGrains.push(grain);
            grainCounts[grain]--;
            if (grainCounts[grain] === 0) {
              availableGrains.splice(
                availableGrains.findIndex(([g]) => g === grain),
                1
              );
            }
          }
        }

        if (cellAttempts >= maxCellAttempts) {
          throw new Error("Max cell attempts reached");
        }
      }

      return gridData;
    } catch (error) {
      // console.log(`Attempt ${attempts} failed:`, error.message);
      if (attempts === maxAttempts) {
        // console.log("Failed to generate valid grid after maximum attempts");

        return Array(GRID_SIZE * GRID_SIZE).fill({
          headerGrain: "",
          mainGrains: [],
        });
      }
    }
  }

  return Array(GRID_SIZE * GRID_SIZE).fill({ headerGrain: "", mainGrains: [] });
}
