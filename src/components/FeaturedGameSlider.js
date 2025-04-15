import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics/client";
import { CLIENT_EVENTS } from "@/lib/analytics/events";
import MobxStore from "@/mobx";

const FeaturedGamesSlider = ({ games }) => {
  const [state, setState] = useState({ currentSlide: 0, progress: 0 });
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  // Ensure games array is not empty to prevent errors
  const numSlides = games?.length || 0;

  const nextSlide = useCallback(() => {
    if (numSlides === 0) return; // Do nothing if no slides
    setState((prevState) => {
      const nextSlide = (prevState.currentSlide + 1) % numSlides;
      return { currentSlide: nextSlide, progress: 0 };
    });
  }, [numSlides]);

  const prevSlide = useCallback(() => {
    if (numSlides === 0) return; // Do nothing if no slides
    setState((prevState) => {
      const prevSlide = (prevState.currentSlide - 1 + numSlides) % numSlides;
      return { currentSlide: prevSlide, progress: 0 };
    });
  }, [numSlides]);

  useEffect(() => {
    // Only run interval if there are multiple slides
    if (numSlides <= 1) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const updateProgress = () => {
      setState((prevState) => {
        // Check if component might be unmounted or state is unexpected
        if (typeof prevState?.progress !== "number") return prevState;

        const newProgress = prevState.progress + 1;
        if (newProgress >= 100) {
          // Call nextSlide directly - it handles state update
          nextSlide();
          // Return the *expected* state after nextSlide is called (reset progress)
          // This prevents potential state inconsistencies if nextSlide was async (though it's not here)
          const nextSlideIndex = (prevState.currentSlide + 1) % numSlides;
          return { currentSlide: nextSlideIndex, progress: 0 };
        } else {
          return { ...prevState, progress: newProgress };
        }
      });
    };

    // Clear previous interval if dependencies change
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(updateProgress, 100); // Adjust timing (e.g., 50ms for 5s total)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [numSlides, nextSlide]); // Use numSlides

  useEffect(() => {
    if (sliderRef.current) {
      // Apply the translation to show the correct slide
      sliderRef.current.style.transform = `translateX(-${state.currentSlide * 100}%)`;
    }
  }, [state.currentSlide]);

  const handleBannerClick = async (game) => {
    if (!game || !game.id) return; // Safety check
    const isFirstClick = !MobxStore.user?.analytics?.bannersClicked?.includes(
      game.id
    );
    await trackEvent({
      action: CLIENT_EVENTS.BANNER_CLICK,
      context: { bannerId: game.id, isFirstClick },
    });
  };

  // Handle case where there are no games
  if (numSlides === 0) {
    return (
      <div className="relative w-full h-[45vh] bg-muted flex items-center justify-center">
        <p>No featured content available.</p>
      </div>
    );
  }

  return (
    // This is the viewport container, defines the slider's visible height and width
    <div className="relative w-full h-[45vh] overflow-hidden">
      {/*
        This container holds all slides horizontally.
        - `flex h-full`: Makes it a flex container taking full height.
        - `width: ${numSlides * 100}%`: Makes it wide enough for all slides.
        - `transform`: Moves this container left/right.
      */}
      <div
        ref={sliderRef}
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ width: `${numSlides * 100}%` }} // Set width based on number of slides
      >
        {games.map((game, index) => (
          /*
            Each slide container MUST occupy exactly 100% of the VIEWPORT width.
            - `w-full`: This should refer to 100% of the PARENT's width (`sliderRef`).
                       To make it 100% of the viewport, we set the parent width and divide
                       by the number of slides for the basis, OR rely on the parent's width being N*100%.
                       Using `flex: 1 0 100%` is a robust way within flexbox.
            - `h-full`: Takes full height of the parent.
            - `flex-shrink-0`: CRITICAL - Prevents the slide from shrinking when the parent container gets wide.
            - `relative`: For positioning content inside (image, overlay).
          */
          <div
            key={game.id || index}
            // Using flex-basis is often more reliable for fixed widths in a flex container
            className="h-full relative flex-shrink-0"
            style={{ flex: `1 0 ${100 / numSlides}%` }} // Each slide takes up its fraction of the total width
          >
            <Link
              href={game.link || "#"} // Add fallback href
              target={game.openNewTab ? "_blank" : "_self"}
              rel={game.openNewTab ? "noopener noreferrer" : ""}
              onClick={() => handleBannerClick(game)}
              className="block w-full h-full" // Link covers the slide
              aria-label={`View details for ${game.title}`}
            >
              {/* Image container: absolute positioning ensures it fills the slide */}
              <div className="absolute inset-0">
                <Image
                  src={game.imgUrl}
                  alt={game.title || "Featured image"} // Add fallback alt text
                  fill // Fill the container div
                  sizes="100vw" // Image can be up to full viewport width
                  style={{
                    objectFit: "cover", // Fill container, crop if needed
                    objectPosition: "center", // Crop from center
                  }}
                  quality={90}
                  priority={index === 0} // Prioritize loading the first image
                  unoptimized={game.imgUrl?.endsWith(".gif")} // Example: Don't optimize gifs
                />
              </div>
              {/* Overlay container */}
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-end items-start p-[5%] pb-20 pointer-events-none">
                <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-[70px] text-white font-bold mb-2 sm:mb-4 font-strike uppercase leading-tight drop-shadow-lg  max-w-[800px]">
                  {game.title}
                </h2>
                <p className="text-lg sm:text-lg md:text-xl text-white mb-3 sm:mb-6 font-strike max-w-full md:max-w-3xl drop-shadow-lg">
                  {game.description}
                </p>
                {/* Visual button, interaction handled by link */}
                <Button
                  tabIndex={-1}
                  aria-hidden="true"
                  className="font-strike sm:p-6 text-sm sm:text-lg md:text-2xl w-32 sm:w-40 md:w-52 pointer-events-none"
                >
                  {game.button}
                </Button>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Controls (Arrows, Dots, Progress) - Only show if multiple slides */}
      {numSlides > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute bottom-6 left-4 z-20 w-10 h-10 bg-white/60 rounded-full flex items-center justify-center hover:bg-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute bottom-6 right-4 z-20 w-10 h-10 bg-white/60 rounded-full flex items-center justify-center hover:bg-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {games.map((_, index) => (
              <button
                key={index}
                aria-label={`Go to slide ${index + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${state.currentSlide === index ? "bg-white" : "bg-white/50 hover:bg-white/75"}`}
                onClick={() => setState({ currentSlide: index, progress: 0 })}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 overflow-hidden z-20">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-100 ease-linear"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FeaturedGamesSlider;
