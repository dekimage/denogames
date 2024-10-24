"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarShortcut } from "@/utils/transformers";

// Dummy data for customers
const customersData = {
  1: [
    {
      id: 1,
      name: "John Doe",
      isSubscribed: true,
      location: "New York",
      orders: 5,
      totalSpent: "$500",
    },
    {
      id: 2,
      name: "Jane Smith",
      isSubscribed: true,
      location: "Los Angeles",
      orders: 3,
      totalSpent: "$300",
    },
    {
      id: 3,
      name: "Bob Johnson",
      isSubscribed: false,
      location: "Chicago",
      orders: 1,
      totalSpent: "$100",
    },
  ],
  2: [
    {
      id: 4,
      name: "Alice Brown",
      totalSpent: "$1500",
      lastPurchaseDate: "2023-05-15",
      loyaltyPoints: 500,
    },
    {
      id: 5,
      name: "Charlie Davis",
      totalSpent: "$2000",
      lastPurchaseDate: "2023-05-20",
      loyaltyPoints: 750,
    },
    {
      id: 6,
      name: "Eva Wilson",
      totalSpent: "$1800",
      lastPurchaseDate: "2023-05-18",
      loyaltyPoints: 600,
    },
  ],
  3: [
    {
      id: 7,
      name: "Frank Miller",
      lastLoginDate: "2023-01-10",
      daysInactive: 150,
      lastPurchaseDate: "2022-12-25",
    },
    {
      id: 8,
      name: "Grace Lee",
      lastLoginDate: "2023-02-15",
      daysInactive: 114,
      lastPurchaseDate: "2023-01-05",
    },
    {
      id: 9,
      name: "Henry Taylor",
      lastLoginDate: "2023-03-20",
      daysInactive: 81,
      lastPurchaseDate: "2023-02-10",
    },
  ],
  4: [
    {
      id: 10,
      name: "Ivy Clark",
      registrationDate: "2023-05-01",
      firstPurchaseDate: "2023-05-05",
      orderCount: 2,
    },
    {
      id: 11,
      name: "Jack Robinson",
      registrationDate: "2023-05-10",
      firstPurchaseDate: "2023-05-12",
      orderCount: 1,
    },
    {
      id: 12,
      name: "Karen White",
      registrationDate: "2023-05-15",
      firstPurchaseDate: "2023-05-18",
      orderCount: 3,
    },
  ],
};

export default function CustomerTable({ segmentId, columns }) {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 100;
  const router = useRouter();

  useEffect(() => {
    // Simulating API call to fetch customers for the selected segment
    const fetchCustomers = async () => {
      // In a real application, you would fetch data from an API here
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulating network delay
      setCustomers(customersData[segmentId] || []);
    };
    fetchCustomers();
  }, [segmentId]);

  const totalPages = Math.ceil(customers.length / customersPerPage);
  const startIndex = (currentPage - 1) * customersPerPage;
  const endIndex = startIndex + customersPerPage;
  const currentCustomers = customers.slice(startIndex, endIndex);

  const handleRowClick = (customerId) => {
    router.push(`/admin/customers/${customerId}`);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Avatar</TableHead>
            {columns.map((column) => (
              <TableHead key={column}>
                {column.charAt(0).toUpperCase() + column.slice(1)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentCustomers.map((customer) => (
            <TableRow
              key={customer.id}
              onClick={() => handleRowClick(customer.id)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell>
                <Avatar className="h-8 w-8">
                  {/* <AvatarImage src="/avatars/01.png" alt="@shadcn" /> */}
                  <AvatarFallback>
                    {getAvatarShortcut(customer.name)}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              {columns.map((column) => (
                <TableCell key={`${customer.id}-${column}`}>
                  {customer[column]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {startIndex + 1} to {Math.min(endIndex, customers.length)} of{" "}
          {customers.length} customers
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
