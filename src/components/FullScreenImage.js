import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

const FullScreenImage = ({ images, currentIndex, onClose, onNavigate }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.5, 1));

  const handleMouseDown = (e) => {
    if (zoomLevel === 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomLevel === 1) return;
    e.preventDefault();
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Calculate boundaries
    const maxX = ((zoomLevel - 1) * (imageRef.current?.offsetWidth || 0)) / 2;
    const maxY = ((zoomLevel - 1) * (imageRef.current?.offsetHeight || 0)) / 2;

    setPosition({
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const preventScroll = useCallback((e) => {
    e.preventDefault();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, [preventScroll]);

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-80"
      onClick={handleBackgroundClick}
    >
      <div className="absolute top-4 right-4 space-x-4 z-60">
        <button
          onClick={handleZoomIn}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <ZoomIn />
        </button>
        <button
          onClick={handleZoomOut}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <ZoomOut />
        </button>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <X />
        </button>
      </div>
      <button
        onClick={() => onNavigate("left")}
        className="absolute left-4 text-white hover:text-gray-300 transition-colors z-60"
      >
        <ChevronLeft size={40} />
      </button>
      <button
        onClick={() => onNavigate("right")}
        className="absolute right-4 text-white hover:text-gray-300 transition-colors z-60"
      >
        <ChevronRight size={40} />
      </button>
      <div
        ref={imageRef}
        className="relative"
        style={{
          cursor:
            zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "default",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Image
          src={images[currentIndex]}
          alt={`Full screen image ${currentIndex + 1}`}
          width={800}
          height={600}
          objectFit="contain"
          style={{
            transform: `scale(${zoomLevel}) translate(${
              position.x / zoomLevel
            }px, ${position.y / zoomLevel}px)`,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

export default FullScreenImage;
