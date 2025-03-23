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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info, Calendar, Package, CreditCard } from "lucide-react";

// Component for order cards on mobile view
const OrderMobileCard = ({ order, products, onClick }) => {
  const orderProducts = order.cartItems
    .map((item) => products.find((p) => p.id === item.id))
    .filter(Boolean);

  const formatDate = (dateObj) => {
    if (!dateObj || !dateObj._seconds) return "Invalid date";
    return new Date(dateObj._seconds * 1000).toLocaleDateString();
  };

  return (
    <Card
      className="mb-4 cursor-pointer hover:shadow-md transition-shadow w-full"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              {formatDate(order.createdAt)}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              ID: {order.id.slice(0, 8)}...
            </p>
          </div>
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 dark:bg-primary/30 dark:hover:bg-primary/40">
            {order.paymentStatus || "Paid"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-3">
          {orderProducts.length > 0 ? (
            <>
              <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0 border dark:border-gray-700">
                <Image
                  src={orderProducts[0].thumbnail || "/placeholder-image.jpg"}
                  alt={orderProducts[0].name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{orderProducts[0].name}</p>
                {orderProducts.length > 1 && (
                  <p className="text-xs text-muted-foreground">
                    +{orderProducts.length - 1} more{" "}
                    {orderProducts.length > 2 ? "items" : "item"}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center text-muted-foreground">
              <Package className="mr-2 h-4 w-4" />
              <span>No product information</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <CreditCard className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="font-medium">${order.amountTotal.toFixed(2)}</span>
          </div>
          <Button variant="outline" size="sm" className="ml-auto">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const OrderDetails = ({ order, orderProducts }) => {
  const formatDate = (dateObj) => {
    if (!dateObj || !dateObj._seconds) return "Invalid date";
    const date = new Date(dateObj._seconds * 1000);
    return date.toLocaleString();
  };

  return (
    <DialogContent
      className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto"
      aria-describedby="order-details-description"
    >
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>Order #{order.id.slice(0, 8)}</span>
          <Badge
            variant="outline"
            className="text-primary bg-primary/10 dark:bg-primary/20"
          >
            {order.paymentStatus || "Paid"}
          </Badge>
        </DialogTitle>
        <DialogDescription>
          View the complete details of your order placed on{" "}
          {formatDate(order.createdAt)}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Purchased Items</h4>
          <div className="grid gap-3">
            {orderProducts.map((item) => (
              <Link
                key={item.id}
                href={`/product-details/${item.slug}`}
                className="flex items-center gap-4 p-3 rounded-lg border dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-colors group"
              >
                <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border dark:border-gray-700">
                  <Image
                    src={item.thumbnail || "/placeholder-image.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    $
                    {(
                      order.cartItems.find(
                        (cartItem) => cartItem.id === item.id
                      )?.price ||
                      item.price ||
                      0
                    ).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Separator className="dark:bg-gray-700" />

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Order ID</p>
            <p className="font-medium break-all">{order.id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium break-all">{order.customerEmail}</p>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

const OrdersPage = observer(() => {
  const {
    orders,
    fetchOrders,
    products,
    user,
    ordersLoading,
    userFullyLoaded,
  } = MobxStore;
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Get product details for an order
  const getOrderProducts = (order) => {
    if (!order?.cartItems || !products.length) return [];

    return order.cartItems
      .map((item) => {
        const product = products.find((p) => p.id === item.id);
        return product ? product : null;
      })
      .filter(Boolean);
  };

  // Format date safely
  const formatDate = (dateObj) => {
    if (!dateObj || !dateObj._seconds) return "Invalid date";
    return new Date(dateObj._seconds * 1000).toLocaleDateString();
  };

  const handleRowClick = (orderId) => {
    setSelectedOrderId(orderId);
    setDialogOpen(true);
  };

  useEffect(() => {
    // Only fetch orders if we have a logged-in user and we're not already loading
    if (user && userFullyLoaded && !ordersLoading) {
      fetchOrders();
    }
  }, [user, userFullyLoaded, fetchOrders, ordersLoading]);

  // Show loading state when user data is loading or orders are loading
  if (!userFullyLoaded || ordersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  // If no user is logged in
  if (!user) {
    return (
      <Card className="max-w-md mx-auto my-8 overflow-hidden">
        <CardHeader className="pb-4 pt-6 px-6">
          <CardTitle className="text-xl text-center">Please Log In</CardTitle>
        </CardHeader>
        <CardContent className="pb-6 px-6 text-center">
          <p className="text-muted-foreground mb-6">
            You need to be logged in to view your order history.
          </p>
          <Link href="/login">
            <Button>Log In</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // If user has no orders
  if (orders.length === 0) {
    return (
      <Card className="max-w-md mx-auto my-8 overflow-hidden">
        <CardHeader className="pb-4 pt-6 px-6">
          <CardTitle className="text-xl text-center">No Orders Found</CardTitle>
        </CardHeader>
        <CardContent className="pb-6 px-6 text-center">
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet. Start shopping to see your orders
            here.
          </p>
          <Link href="/shop">
            <Button>Browse Games</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const selectedOrder = orders.find((order) => order.id === selectedOrderId);
  const selectedOrderProducts = selectedOrder
    ? getOrderProducts(selectedOrder)
    : [];

  return (
    <div className="container py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold font-strike">
          Your Orders
        </h2>
      </div>

      {/* Mobile view */}
      {isMobile && (
        <div className="md:hidden w-full">
          <div className="w-full">
            {orders.map((order) => (
              <OrderMobileCard
                key={order.id}
                order={order}
                products={products}
                onClick={() => handleRowClick(order.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Desktop view */}
      {!isMobile && (
        <div className="hidden md:block rounded-lg border dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 dark:bg-muted/20">
                  <TableHead className="w-32">Date</TableHead>
                  <TableHead className="w-2/5">Products</TableHead>
                  <TableHead className="text-right w-28">Price</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="text-right w-28">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const orderProducts = getOrderProducts(order);

                  return (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer hover:bg-muted/30 dark:hover:bg-muted/10 transition-colors"
                      onClick={() => handleRowClick(order.id)}
                    >
                      <TableCell>
                        <div className="font-medium">
                          {formatDate(order.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {orderProducts.length > 0 ? (
                            <>
                              <div className="relative w-12 h-12 rounded-md overflow-hidden border dark:border-gray-700">
                                <Image
                                  src={
                                    orderProducts[0].thumbnail ||
                                    "/placeholder-image.jpg"
                                  }
                                  alt={orderProducts[0].name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="ml-3 flex flex-col">
                                <span className="font-medium truncate max-w-[180px]">
                                  {orderProducts[0].name}
                                </span>
                                {orderProducts.length > 1 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{orderProducts.length - 1} more{" "}
                                    {orderProducts.length > 2
                                      ? "items"
                                      : "item"}
                                  </span>
                                )}
                              </div>
                            </>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              No product information
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${order.amountTotal.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30">
                          {order.paymentStatus || "Paid"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            handleRowClick(order.id);
                          }}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            orderProducts={selectedOrderProducts}
          />
        )}
      </Dialog>
    </div>
  );
});

export default OrdersPage;
