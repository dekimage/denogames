import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const ProductTypeBadge = ({ type, className }) => {
  return (
    <Badge
      className={cn(
        "uppercase w-fit text-black font-bold",
        type === "game" && "bg-emerald-400 hover:bg-emerald-600",
        type === "expansion" && "bg-blue-300 hover:bg-blue-600",
        type === "add-on" && "bg-orange-400 hover:bg-orange-600",
        className
      )}
    >
      {type || "game"}
    </Badge>
  );
};
