"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, CreditCard, Download, Truck, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const OrderDetails = ({ order }) => {
  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>Order #{order.id}</span>
          <Badge variant="outline" className="text-primary bg-primary/10">
            {order.status || "Paid"}
          </Badge>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Purchased Items</h4>
          <div className="grid gap-3">
            {order.cartItems.map((item, i) => (
              <Link
                key={i}
                href={`/product-details/${item.slug}`}
                className="flex items-center gap-4 p-3 rounded-lg border hover:border-primary transition-colors group"
              >
                <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.thumbnail || item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.type === "expansion" ? "Expansion" : "Base Game"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${item.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${order.amountTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${order.amountTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Order placed on{" "}
          {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
        </div>
      </div>
    </DialogContent>
  );
};

const OrdersPage = observer(() => {
  const { orders, fetchOrders, user } = MobxStore;

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  if (!user) {
    return <div>Please log in to view your orders.</div>;
  }

  if (orders.length === 0) {
    return <div>You have no orders yet.</div>;
  }

  console.log(orders);

  return (
    <div className="py-8 px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Orders</h2>
      </div>

      <Separator className="my-6" />

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, i) => (
              <TableRow
                key={i}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <TableCell>
                  <div className="font-medium">
                    {order.createdAt
                      ? new Date(
                          order.createdAt.seconds * 1000
                        ).toLocaleDateString()
                      : "Date not available"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {order.cartItems.length > 0 && (
                      <>
                        <div className="relative w-12 h-12 rounded-md overflow-hidden">
                          <Image
                            src={
                              order.cartItems[0].thumbnail ||
                              order.cartItems[0].image
                            }
                            alt={order.cartItems[0].name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {order.cartItems.length > 1 && (
                          <Badge variant="secondary" className="ml-2">
                            +{order.cartItems.length - 1}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${order.amountTotal.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                    {order.status || "Paid"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </DialogTrigger>
                    <OrderDetails order={order} />
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});

export default OrdersPage;
