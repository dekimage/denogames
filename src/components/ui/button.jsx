import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative",
  {
    variants: {
      variant: {
        originalOutline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        reverse:
          "box-1 text-white border-input bg-blacky hover:bg-grayy hover:text-white overflow-visible",
        default:
          "box-1  bg-primary text-primary-foreground hover:bg-primary/70",
        destructive:
          "box-1  bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "box-1  border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        cream:
          "box-1  text-black border-input bg-cream hover:bg-cream/80 hover:text-accent-foreground",
        secondary:
          "box-1 border border-secondary bg-secondary text-secondary-foreground hover:bg-gray-500",
        ghost: "box-1  hover:bg-accent hover:text-accent-foreground",
        link: "box-1  text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
