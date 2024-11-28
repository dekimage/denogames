import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import CustomerDetailsBox from "./CustomerDetailsBox";
import CartItemsTable from "./CartitemsTable";

export default function OrderDetails({ order }) {
  // Dummy data for customer and cart items
  const customer = {
    email: "customer@example.com",
    name: "John Doe",
    id: order.userId,
    joinedDate: "2023-01-15T00:00:00Z",
    tags: ["VIP", "Frequent Buyer"],
    level: 5,
  };

  const cartItems = [
    { id: 1, image: "/placeholder.svg", name: "Game A", total: 59.99 },
    { id: 2, image: "/placeholder.svg", name: "Game B", total: 69.99 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">${order.total}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Date</p>
            <p className="text-2xl font-bold">
              {new Date(order.datetime).toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge variant={order.isPending ? "outline" : "default"}>
              {order.isPending ? "Pending" : "Completed"}
            </Badge>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Payment</p>
            <Badge
              variant={
                order.paymentStatus === "paid" ? "default" : "destructive"
              }
            >
              {order.paymentStatus}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Stripe Session ID
          </p>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-mono">cs_test_a1b2c3d4e5f6g7h8i9j0</p>
            <Button variant="outline" size="icon">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CustomerDetailsBox customer={customer} />

        <div>
          <h3 className="text-lg font-semibold mb-2">Order Items</h3>
          <CartItemsTable items={cartItems} />
        </div>
      </CardContent>
    </Card>
  );
}
