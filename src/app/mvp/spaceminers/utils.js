export const renderIcon = (type) => {
  // Handle resource types
  if (resourceTypes[type]) {
    const { emoji, color } = resourceTypes[type];
    return { emoji, color };
  }
  // Handle special types (2_coin, etc)
  if (type.includes("_")) {
    const [count, resourceType] = type.split("_");
    return {
      emoji: `${count}${resourceTypes[resourceType]?.emoji || ""}`,
      color: resourceTypes[resourceType]?.color,
    };
  }
  // Default fallback
  return { emoji: "❓", color: "#6B7280" };
};
// A4 size constants (in pixels for 300 DPI)
export const A4_DIMENSIONS = {
  width: 816, // 210mm
  height: 1920, // 297mm
};

export const PAPER_DIMENSIONS = {
  A4: {
    width: 794, // 210mm at 96 DPI
    height: 1123, // 297mm at 96 DPI
  },
  LETTER: {
    width: 816, // 8.5in at 96 DPI
    height: 1056, // 11in at 96 DPI
  },
};
