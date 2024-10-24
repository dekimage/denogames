"use client";

import { useState } from "react";
import CustomerTable from "../components/CustomerTable";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const segmentsData = [
  {
    id: 0,
    name: "All Customers",
    tag: "#user",
    percentageOfCustomers: 100,
    totalCustomers: 400,
    columns: ["name", "isSubscribed", "location", "orders", "totalSpent"],
  },
  {
    id: 1,
    name: "Email Subscribers",
    tag: "#newsletter",
    percentageOfCustomers: 23,
    totalCustomers: 114,
    columns: ["name", "isSubscribed", "location", "orders", "totalSpent"],
  },
  {
    id: 2,
    name: "High Value Customers",
    tag: "#vip",
    percentageOfCustomers: 5,
    totalCustomers: 25,
    columns: ["name", "totalSpent", "lastPurchaseDate", "loyaltyPoints"],
  },
  {
    id: 3,
    name: "Inactive Users",
    tag: "#dormant",
    percentageOfCustomers: 15,
    totalCustomers: 75,
    columns: ["name", "lastLoginDate", "daysInactive", "lastPurchaseDate"],
  },
  {
    id: 4,
    name: "New Customers",
    tag: "#newbie",
    percentageOfCustomers: 8,
    totalCustomers: 40,
    columns: ["name", "registrationDate", "firstPurchaseDate", "orderCount"],
  },
];

const SegmentsTable = ({ segments, onSegmentClick }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Tag</TableHead>
          <TableHead>% of Customers</TableHead>
          <TableHead>Total Customers</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {segments.map((segment) => (
          <TableRow
            key={segment.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onSegmentClick(segment)}
          >
            <TableCell className="font-medium">{segment.name}</TableCell>
            <TableCell>{segment.tag}</TableCell>
            <TableCell>{segment.percentageOfCustomers}%</TableCell>
            <TableCell>{segment.totalCustomers}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default function SegmentsPage() {
  const [selectedSegment, setSelectedSegment] = useState(null);

  const handleSegmentClick = (segment) => {
    setSelectedSegment(segment);
  };

  return (
    <div className="min-w-[1200px] w-full bg-white p-4 border">
      <h1 className="text-3xl font-bold mb-6">Customer Segments</h1>
      <SegmentsTable
        segments={segmentsData}
        onSegmentClick={handleSegmentClick}
      />
      {selectedSegment && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            {selectedSegment.name} - Customers
          </h2>
          <CustomerTable
            segmentId={selectedSegment.id}
            columns={selectedSegment.columns}
          />
        </div>
      )}
    </div>
  );
}
