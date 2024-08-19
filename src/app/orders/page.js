"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useEffect, useState } from "react";
import Link from "next/link";
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
import { Copy, CreditCard, Download, Truck } from "lucide-react";
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg justify-center">
                Order ID # <span className="text-sm">{order.id}</span>
              </CardTitle>
              <CardDescription>Date: November 23, 2023</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-sm">
            <div className="grid gap-3">
              <div className="font-semibold">Order Details</div>
              <ul className="grid gap-3">
                {order.cartItems.map((ca) => (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">{ca.name}</span>
                    <span>{ca.price}.00</span>
                  </li>
                ))}
              </ul>
              <Separator className="my-2" />
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{order.total.toFixed(2)}</span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>$0.00</span>
                </li>
                <li className="flex items-center justify-between font-semibold">
                  <span className="text-muted-foreground">Total</span>
                  <span>{order.total.toFixed(2)}</span>
                </li>
              </ul>
            </div>
            <Separator className="my-4" />

            <div className="grid gap-3">
              <div className="font-semibold">Invoice</div>
              <Button variant="outline">
                <Download className="mr-1" size={16} /> Download
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
              Updated <time dateTime="2023-11-23">November 23, 2023</time>
            </div>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

const OrdersPage = observer(() => {
  const { orders, fetchOrders, user } = MobxStore;

  const [orderDetails, setOrderDetails] = useState(null);
  const [showOrder, setShowOrder] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!user) {
    return <div>Please log in to view your orders.</div>;
  }

  if (orders.length === 0) {
    return <div>You have no orders yet.</div>;
  }

  return (
    <div className="py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className=" sm:table-cell">Products</TableHead>
            <TableHead className=" sm:table-cell">Price</TableHead>
            <TableHead className=" sm:table-cell">Status</TableHead>
            <TableHead className=" md:table-cell">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow>
              <TableCell>
                <div className="font-medium">
                  {order.createdAt
                    ? new Date(
                        order.createdAt.seconds * 1000
                      ).toLocaleDateString("en-US")
                    : "Date not available"}
                </div>
              </TableCell>
              <TableCell className="sm:table-cell">
                {order.cartItems.length > 0 && (
                  <>
                    <Link
                      href={`/product-details/${order.cartItems[0].slug}`}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      {order.cartItems[0].name}
                    </Link>
                    {order.cartItems.length > 1 && (
                      <span className="text-gray-500">
                        +{order.cartItems.length - 1} more
                      </span>
                    )}
                  </>
                )}
              </TableCell>
              <TableCell className="sm:table-cell">
                ${order.total.toFixed(2)}
              </TableCell>
              <TableCell className="sm:table-cell">
                <Badge className="text-xs" variant="outline">
                  {order.status || "Paid"}
                </Badge>
              </TableCell>
              <TableCell className=" md:table-cell">
                {/* <Button variant="outline">Details</Button> */}
                <OrderDetails order={order} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

export default OrdersPage;
