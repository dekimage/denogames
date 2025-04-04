import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

export function EasterEggDialog({
  open,
  onOpenChange,
  title = "Wooop! What is this?",
  code,
  message = "You found a secret! But what does it mean? 🤔",
  image,
  imageSize = 120, // default size for the image
  imageAlt = "Easter Egg",
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {/* {image && (
            <div className="relative w-[120px] h-[120px] mb-2">
              <Image
                src={image}
                alt={imageAlt}
                fill
                className="object-contain"
              />
            </div>
          )} */}
          <div className="bg-muted rounded-lg px-4 py-2 font-mono text-lg font-bold tracking-wider">
            {code}
          </div>
          <p className="text-sm text-muted-foreground text-center">{message}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper component for clickable triggers
export function EasterEggTrigger({ children, onClick }) {
  return (
    <div
      className="cursor-pointer hover:scale-105 transition-transform"
      onClick={onClick}
    >
      {children}
    </div>
  );
}
