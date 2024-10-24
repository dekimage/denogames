import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function CartStatusSection({ cart }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Shopping Cart</h2>
        <Button variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>
      {isExpanded && (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <Image
                src={item.image}
                alt={item.name}
                width={64}
                height={64}
                className="rounded-md"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Added {formatDistanceToNow(item.addedAt, { addSuffix: true })}
              </p>
            </div>
          ))}
          <div className="text-right font-semibold">
            Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
