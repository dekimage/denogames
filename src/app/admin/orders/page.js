"use client";

import { useState, useEffect } from "react";
import OrdersTable from "./components/OrdersTable";
import OrderDetails from "./components/OrderDetails";
import { useToast } from "@/components/ui/use-toast";

// Simulated API call
const fetchOrders = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        // 90% success rate
        resolve([
          {
            id: 1,
            total: 129.99,
            productsCount: 2,
            userId: "user123",
            datetime: "2023-06-15T10:30:00Z",
            isPending: false,
            paymentStatus: "paid",
            isBundle: false,
          },
          {
            id: 2,
            total: 79.99,
            productsCount: 1,
            userId: "user456",
            datetime: "2023-06-16T14:45:00Z",
            isPending: true,
            paymentStatus: "pending",
            isBundle: false,
          },
          {
            id: 3,
            total: 199.99,
            productsCount: 3,
            userId: "user789",
            datetime: "2023-06-17T09:15:00Z",
            isPending: false,
            paymentStatus: "paid",
            isBundle: true,
          },
          {
            id: 4,
            total: 59.99,
            productsCount: 1,
            userId: "user234",
            datetime: "2023-06-18T16:20:00Z",
            isPending: false,
            paymentStatus: "paid",
            isBundle: false,
          },
          {
            id: 5,
            total: 149.99,
            productsCount: 2,
            userId: "user567",
            datetime: "2023-06-19T11:00:00Z",
            isPending: false,
            paymentStatus: "refunded",
            isBundle: false,
          },
        ]);
      } else {
        reject(new Error("Failed to fetch orders"));
      }
    }, 1000);
  });
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load orders. Please try again.",
        });
      }
    };

    loadOrders();
  }, [toast]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>
      <div className="flex gap-6">
        <div className="flex-1">
          <OrdersTable
            orders={orders}
            isLoading={isLoading}
            error={error}
            onOrderClick={handleOrderClick}
          />
        </div>
        {selectedOrder && (
          <div className="w-1/3">
            <OrderDetails order={selectedOrder} />
          </div>
        )}
      </div>
    </div>
  );
}
