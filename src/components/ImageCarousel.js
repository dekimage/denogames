"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useIsMobile from "@/hooks/useIsMobile";
import { useCallback } from "react";

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

    if (direction === "left") {
      setCurrentImageIndex((prevIndex) => {
        const newIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
        setTranslateX(newIndex * -100); // Slide right

        // Update thumbnail carousel start index if needed
        if (newIndex < carouselStartIndex) {
          setCarouselStartIndex((prevStartIndex) =>
            Math.max(0, prevStartIndex - 1)
          );
        } else if (newIndex === images.length - 1) {
          // If looping back to last image, update thumbnails to show the last set
          setCarouselStartIndex(images.length - maxVisibleThumbnails);
        }

        return newIndex;
      });
    } else if (direction === "right") {
      setCurrentImageIndex((prevIndex) => {
        const newIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
        setTranslateX(newIndex * -100); // Slide left

        // Update thumbnail carousel start index if needed
        if (newIndex >= carouselStartIndex + maxVisibleThumbnails) {
          setCarouselStartIndex((prevStartIndex) =>
            Math.min(images.length - maxVisibleThumbnails, prevStartIndex + 1)
          );
        } else if (newIndex === 0) {
          // If looping back to first image, reset thumbnails to start
          setCarouselStartIndex(0);
        }

        return newIndex;
      });
    }

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
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleMouseMove = (e) => {
    // Find the currently visible image element
    const currentImageElement =
      e.currentTarget.querySelectorAll("img")[currentImageIndex];
    const rect = currentImageElement.getBoundingClientRect(); // Get the bounding box of the current image

    // Calculate the cursor's position in pixels relative to the current image
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate the percentage position within the image where the mouse is located
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    // Update state with these calculated values

    setZoomPosition({
      x: xPercent, // Percentage relative to the current image
      y: yPercent, // Percentage relative to the current image
      zoomX: x,
      zoomY: y,
      width: rect.width * 2, // Double size for zoom
      height: rect.height * 2, // Double size for zoom
    });
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
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart} // Add touch start event
            onTouchMove={handleTouchMove} // Add touch move event
            onTouchEnd={handleTouchEnd}
          >
            {images.map((image, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <Image
                  src={image}
                  alt={`Game image ${index + 1}`}
                  className="w-full h-auto cursor-zoom-in"
                  height={400}
                  width={400}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Zoom effect overlay */}
        {isZoomed && (
          <div
            className="absolute bg-cover bg-no-repeat border border-gray-200"
            style={{
              borderRadius: "50%",
              width: "250px", // Size of the zoom window
              height: "250px", // Size of the zoom window
              top: `${zoomPosition.zoomY - 125}px`, // Center the zoom window vertically on the cursor
              left: `${zoomPosition.zoomX - 125}px`, // Center the zoom window horizontally on the cursor
              backgroundImage: `url(${images[currentImageIndex]})`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`, // Position the background image based on cursor location
              backgroundSize: `${zoomPosition.width}px ${zoomPosition.height}px`, // Zoom level
              pointerEvents: "none",
              zIndex: 999999,
            }}
          />
        )}
        {/* Left Arrow */}
        <Button
          className="absolute left-[-6px] sm:left-[-25px] top-1/2 transform -translate-y-1/2 rounded-full bg-black hover:bg-gray-800 text-white h-[60px] w-[60px]"
          onClick={() => handleArrowClick("left")}
        >
          <ChevronLeft />
        </Button>

        {/* Right Arrow */}
        <Button
          className="absolute right-[-6px] sm:right-[-25px] top-1/2 transform -translate-y-1/2  rounded-full bg-black hover:bg-gray-800 text-white h-[60px] w-[60px]"
          onClick={() => handleArrowClick("right")}
        >
          <ChevronRight />
        </Button>
      </div>

      {/* Thumbnail Carousel */}
      <div className="flex items-center mt-4">
        {/* Left Arrow for Carousel */}
        {carouselStartIndex > 0 && (
          <button
            className="bg-gray-700 text-white p-2 rounded-full"
            onClick={() =>
              setCarouselStartIndex((prev) => Math.max(0, prev - 1))
            }
          >
            &lt;
          </button>
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
          <button
            className="bg-gray-700 text-white p-2 rounded-full"
            onClick={() =>
              setCarouselStartIndex((prev) =>
                Math.min(images.length - maxVisibleThumbnails, prev + 1)
              )
            }
          >
            &gt;
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;
