"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useIsMobile from "@/hooks/useIsMobile";
import { useCallback } from "react";
import FullScreenImage from "./FullScreenImage";

// ImageCarousel Component
const ImageCarousel = ({ images }) => {
  // State for the current main image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0); // State to control translation for sliding effect
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [carouselStartIndex, setCarouselStartIndex] = useState(0); // State for carousel start index

  const isMobile = useIsMobile();
  const maxVisibleThumbnails = isMobile ? 3 : 5;

  const handleArrowClick = (direction) => {
    if (isTransitioning) return; // Prevent multiple transitions at once
    setIsTransitioning(true);

    setCurrentImageIndex((prevIndex) => {
      let newIndex;
      if (direction === "left") {
        newIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      } else if (direction === "right") {
        newIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      }

      setTranslateX(newIndex * -100); // Slide in the appropriate direction

      // Update thumbnail carousel start index if needed
      if (newIndex < carouselStartIndex) {
        setCarouselStartIndex((prevStartIndex) =>
          Math.max(0, prevStartIndex - 1)
        );
      } else if (newIndex >= carouselStartIndex + maxVisibleThumbnails) {
        setCarouselStartIndex((prevStartIndex) =>
          Math.min(images.length - maxVisibleThumbnails, prevStartIndex + 1)
        );
      } else if (newIndex === 0) {
        // If looping back to first image, reset thumbnails to start
        setCarouselStartIndex(0);
      } else if (newIndex === images.length - 1) {
        // If looping to last image, update thumbnails to show the last set
        setCarouselStartIndex(images.length - maxVisibleThumbnails);
      }

      return newIndex;
    });

    // Reset the transition state after the animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Duration of the transition (300ms)
  };

  // Handler for clicking a thumbnail
  const handleThumbnailClick = (index) => {
    if (isTransitioning) return; // Prevent multiple transitions at once
    setIsTransitioning(true);

    setCurrentImageIndex(index);
    setTranslateX(index * -100); // Update translateX to show the selected image

    // Center the clicked thumbnail in the carousel
    const newStartIndex = Math.max(
      0,
      Math.min(
        index - Math.floor(maxVisibleThumbnails / 2),
        images.length - maxVisibleThumbnails
      )
    );
    setCarouselStartIndex(newStartIndex);

    // Reset the transition state after the animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Duration of the transition (300ms)
  };

  // Calculate the thumbnails to display
  const getVisibleThumbnails = () => {
    return images
      .slice(carouselStartIndex, carouselStartIndex + maxVisibleThumbnails)
      .map((thumbnail, index) => ({
        thumbnail,
        actualIndex: carouselStartIndex + index,
      }));
  };

  // Zoom functionality
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    // Disabled for now
    // setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    // Disabled for now
    // setIsZoomed(false);
  };

  const handleMouseMove = (e) => {
    // Disabled for now
    // ... existing code ...
  };

  const handleSwipe = useCallback(
    (direction) => {
      handleArrowClick(direction);
    },
    [handleArrowClick]
  );

  const [startX, setStartX] = useState(0);
  const swipeThreshold = 50; // Minimum swipe distance to trigger a swipe

  const handleTouchStart = (e) => {
    if (!isMobile) return; // Only handle touch events on mobile
    const touch = e.touches[0];
    setStartX(touch.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isMobile || isTransitioning) return; // Only handle touch events on mobile and if not transitioning
    const touch = e.touches[0];
    const touchX = touch.clientX;
    const diffX = touchX - startX;

    if (diffX > swipeThreshold) {
      handleSwipe("left");
    } else if (diffX < -swipeThreshold) {
      handleSwipe("right");
    }
  };

  const handleTouchEnd = () => {
    if (!isMobile) return; // Only handle touch events on mobile
    setStartX(0); // Reset start position after swipe
  };

  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleImageClick = () => {
    setIsFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
  };

  const handleFullScreenNavigate = (direction) => {
    handleArrowClick(direction);
  };

  return (
    <div className="relative w-full sm:w-[600px] h-auto">
      <div
        className="relative flex flex-col justify-center w-full max-w-[full] sm:max-w-[600px]"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Main Image Display */}
        <div className="relative overflow-hidden w-full h-auto">
          <div
            className="flex transition-transform duration-300"
            style={{
              transform: `translateX(${translateX}%)`,
              transition: isTransitioning ? "transform 0.3s ease" : "none",
              cursor: "zoom-in", // Add this line to set the cursor to zoom-in
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleImageClick}
          >
            {images.map((image, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <Image
                  src={image}
                  alt={`Game image ${index + 1}`}
                  className="w-full h-auto" // Remove cursor-zoom-in from here
                  height={400}
                  width={400}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Zoom effect overlay - Commented out for now */}
        {/* {isZoomed && (
          <div
            className="absolute bg-cover bg-no-repeat border border-gray-200"
            style={{
              // ... existing styles ...
            }}
          />
        )} */}

        {/* Left Arrow */}
        <Button
          className="absolute left-[-6px] sm:left-[-12px] top-1/2 transform -translate-y-1/2 rounded-full bg-black hover:bg-gray-800 text-white h-[60px] w-[60px]"
          onClick={() => handleArrowClick("left")}
        >
          <ChevronLeft />
        </Button>

        {/* Right Arrow */}
        <Button
          className="absolute right-[-6px] sm:right-[-12px] top-1/2 transform -translate-y-1/2  rounded-full bg-black hover:bg-gray-800 text-white h-[60px] w-[60px]"
          onClick={() => handleArrowClick("right")}
        >
          <ChevronRight />
        </Button>
      </div>

      {/* Thumbnail Carousel */}
      <div className="flex items-center mt-4">
        {/* Left Arrow for Carousel */}
        {carouselStartIndex > 0 && (
          <Button
            variant="reverse"
            className="rounded-full"
            onClick={() =>
              setCarouselStartIndex((prev) => Math.max(0, prev - 1))
            }
          >
            &lt;
          </Button>
        )}

        {/* Thumbnails */}
        <div className="flex overflow-hidden">
          {getVisibleThumbnails().map(({ thumbnail, actualIndex }) => {
            const isSelected = currentImageIndex === actualIndex;
            return (
              <Image
                key={actualIndex}
                src={thumbnail}
                alt={`Thumbnail ${actualIndex + 1}`}
                className={`w-24 h-24 cursor-pointer ${
                  isSelected
                    ? "border-4 p-1 border-black"
                    : "border-4 p-1 border-transparent"
                }`}
                onClick={() => handleThumbnailClick(actualIndex)}
                height={128}
                width={128}
              />
            );
          })}
        </div>

        {/* Right Arrow for Carousel */}
        {carouselStartIndex + maxVisibleThumbnails < images.length && (
          <Button
            variant="reverse"
            className="rounded-full"
            onClick={() =>
              setCarouselStartIndex((prev) =>
                Math.min(images.length - maxVisibleThumbnails, prev + 1)
              )
            }
          >
            &gt;
          </Button>
        )}
      </div>

      {/* Full Screen Mode */}
      {isFullScreen && (
        <FullScreenImage
          images={images}
          currentIndex={currentImageIndex}
          onClose={handleCloseFullScreen}
          onNavigate={handleFullScreenNavigate}
        />
      )}
    </div>
  );
};

export default ImageCarousel;
