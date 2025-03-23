"use client";

import { motion } from "framer-motion";

// Set the default spinner variant here
// Options: "circle", "dots", "pulse"
const DEFAULT_SPINNER = "circle";

export const LoadingSpinner = ({
  variant = DEFAULT_SPINNER,
  size = 16,
  center = true,
}) => {
  // Choose spinner based on variant
  const getSpinner = () => {
    switch (variant) {
      case "dots":
        return <DotsSpinner size={size} />;
      case "pulse":
        return <PulseSpinner size={size} />;
      case "circle":
      default:
        return <CircleSpinner size={size} />;
    }
  };

  // If center is true, center the spinner on the screen
  if (center) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 dark:bg-background/90 backdrop-blur-sm z-50">
        {getSpinner()}
      </div>
    );
  }

  // Otherwise just return the spinner
  return getSpinner();
};

// Spinner Variant 1: Circle Spinner (Original)
const CircleSpinner = ({ size = 16 }) => {
  return (
    <motion.div
      className={`w-${size} h-${size} border-4 border-muted border-t-primary rounded-full`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        ease: "linear",
        repeat: Infinity,
      }}
    />
  );
};

// Spinner Variant 2: Dots Spinner
const DotsSpinner = ({ size = 16 }) => {
  const dotSize = Math.max(2, Math.floor(size / 4));
  const containerSize = size;

  return (
    <div className="flex space-x-2 items-center justify-center">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`w-${dotSize} h-${dotSize} rounded-full bg-primary`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
};

// Spinner Variant 3: Pulse Spinner
const PulseSpinner = ({ size = 16 }) => {
  return (
    <div className="relative">
      <motion.div
        className={`w-${size} h-${size} rounded-full bg-primary/20 absolute`}
        animate={{
          scale: [1, 2],
          opacity: [1, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      <motion.div
        className={`w-${size} h-${size} rounded-full bg-primary`}
        animate={{
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

// Export individual spinners for specific use cases
export { CircleSpinner, DotsSpinner, PulseSpinner };
