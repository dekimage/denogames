import { useState, useEffect } from "react";

const useIsMobile = (breakpoint = 600) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to update the `isMobile` state
    const updateIsMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < breakpoint);
      }
    };

    // Call the function initially to set the correct state
    updateIsMobile();

    // Add event listener to update state on window resize
    window.addEventListener("resize", updateIsMobile);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", updateIsMobile);
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
