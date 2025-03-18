"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function SimpleImageCarousel({ images = [] }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  if (!images.length) return null;

  return (
    <div className="w-full space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
        <Image
          src={selectedImage}
          alt="Product image"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-2 sm:gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-md border",
              selectedImage === image && "ring-2 ring-primary ring-offset-2"
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
  );
}
