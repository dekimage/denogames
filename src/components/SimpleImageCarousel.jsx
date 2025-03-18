"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "./ui/button";

export default function SimpleImageCarousel({ images = [] }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showLightbox, setShowLightbox] = useState(false);

  if (!images.length) return null;

  const currentIndex = images.indexOf(selectedImage);

  const navigateImage = (direction) => {
    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % images.length
        : (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[newIndex]);
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleImageClick = () => {
    if (isZoomed) {
      setIsZoomed(false);
    } else {
      setShowLightbox(true);
    }
  };

  return (
    <>
      <div className="w-full space-y-4 md:space-y-6">
        {/* Main Image Container */}
        <div className="relative">
          <div
            className={cn(
              "relative aspect-square w-full overflow-hidden rounded-lg border group",
              isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
            )}
            onMouseMove={handleMouseMove}
            onClick={handleImageClick}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <Image
              src={selectedImage}
              alt="Product image"
              fill
              className={cn(
                "object-contain transition-transform duration-200",
                isZoomed && "scale-150"
              )}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : undefined
              }
              priority
            />
            {/* Zoom Button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
            >
              {isZoomed ? (
                <ZoomOut className="h-4 w-4" />
              ) : (
                <ZoomIn className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-md text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails - Mobile Scroll, Desktop Grid */}
        <div className="relative mt-4 md:mt-6">
          <div className="flex md:grid md:grid-cols-5 gap-2 overflow-x-auto pb-2 md:pb-0 md:gap-4 scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedImage(image);
                  setIsZoomed(false);
                }}
                className={cn(
                  "relative flex-shrink-0 w-16 md:w-auto aspect-square overflow-hidden rounded-md border transition-all duration-200 hover:opacity-80",
                  selectedImage === image
                    ? "ring-2 ring-primary ring-offset-2"
                    : "opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={image}
                  alt={`Product thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setShowLightbox(false)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white z-50"
            onClick={() => setShowLightbox(false)}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 md:left-4 text-white h-12 w-12 rounded-full bg-black/50 hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("prev");
            }}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 md:right-4 text-white h-12 w-12 rounded-full bg-black/50 hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("next");
            }}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Main Lightbox Image */}
          <div className="relative w-full h-[80vh] md:h-[90vh] max-w-6xl mx-4">
            <Image
              src={selectedImage}
              alt="Product image fullscreen"
              fill
              className="object-contain"
              quality={100}
            />
          </div>

          {/* Lightbox Thumbnails */}
          <div className="absolute bottom-4 left-0 right-0">
            <div className="flex justify-center">
              <div className="flex gap-2 bg-black/50 p-2 rounded-lg overflow-x-auto max-w-[90vw] md:max-w-[600px] scrollbar-hide">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(image);
                    }}
                    className={cn(
                      "relative w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden transition-all flex-shrink-0",
                      selectedImage === image
                        ? "ring-2 ring-white"
                        : "opacity-50 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
