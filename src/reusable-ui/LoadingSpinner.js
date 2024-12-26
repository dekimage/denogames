"use client";

import { motion } from "framer-motion";

export const LoadingSpinner = () => {
  return (
    // <div class="flex justify-center items-center min-h-screen">
    //   <div class="animate-spin rounded-full h-4 w-4 border-t-4 border-slate-900 border-solid"></div>
    // </div>
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <motion.div
        className="w-16 h-16 border-4 border-gray-300 border-t-gray-800 rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Infinity,
        }}
      />
    </div>
  );
};
