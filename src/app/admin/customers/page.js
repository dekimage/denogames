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

// from gpt improved added milestones as segments!
// const segmentsData = [
//   {
//     id: 0,
//     name: "All Customers",
//     tag: "#user",
//     percentageOfCustomers: 100,
//     totalCustomers: 400,
//     columns: ["name", "isSubscribed", "location", "orders", "totalSpent"],
//   },
//   {
//     id: 1,
//     name: "Discord Users",
//     tag: "#discordUser",
//     percentageOfCustomers: 30,
//     totalCustomers: 120,
//     columns: ["name", "discordJoinDate", "orders", "totalSpent"],
//   },
//   {
//     id: 2,
//     name: "First-Time Purchasers",
//     tag: "#purchased",
//     percentageOfCustomers: 45,
//     totalCustomers: 180,
//     columns: ["name", "firstPurchaseDate", "orders", "totalSpent"],
//   },
//   {
//     id: 3,
//     name: "Expansion Buyers",
//     tag: "#expansionPurchased",
//     percentageOfCustomers: 20,
//     totalCustomers: 80,
//     columns: ["name", "firstExpansionPurchaseDate", "expansionsBought"],
//   },
//   {
//     id: 4,
//     name: "1 Product Purchasers",
//     tag: "#1product",
//     percentageOfCustomers: 10,
//     totalCustomers: 40,
//     columns: ["name", "totalProductsBought", "firstPurchaseDate"],
//   },
//   {
//     id: 5,
//     name: "5 Product Purchasers",
//     tag: "#5products",
//     percentageOfCustomers: 5,
//     totalCustomers: 20,
//     columns: ["name", "totalProductsBought", "firstPurchaseDate"],
//   },
//   {
//     id: 6,
//     name: "10 Product Purchasers",
//     tag: "#10products",
//     percentageOfCustomers: 2,
//     totalCustomers: 8,
//     columns: ["name", "totalProductsBought", "firstPurchaseDate"],
//   },
//   {
//     id: 7,
//     name: "15 Product Purchasers",
//     tag: "#15products",
//     percentageOfCustomers: 1,
//     totalCustomers: 4,
//     columns: ["name", "totalProductsBought", "firstPurchaseDate"],
//   },
//   {
//     id: 8,
//     name: "Reviewed 1 Game",
//     tag: "#reviewed1game",
//     percentageOfCustomers: 10,
//     totalCustomers: 40,
//     columns: ["name", "firstReviewDate", "totalReviews"],
//   },
//   {
//     id: 9,
//     name: "Reviewed 5 Games",
//     tag: "#reviewed5games",
//     percentageOfCustomers: 3,
//     totalCustomers: 12,
//     columns: ["name", "firstReviewDate", "totalReviews"],
//   },
//   {
//     id: 10,
//     name: "Reviewed 10 Games",
//     tag: "#reviewed10games",
//     percentageOfCustomers: 1,
//     totalCustomers: 4,
//     columns: ["name", "firstReviewDate", "totalReviews"],
//   },
//   {
//     id: 11,
//     name: "Abandoned Cart Users",
//     tag: "#cartAbandoned",
//     percentageOfCustomers: 12,
//     totalCustomers: 48,
//     columns: ["name", "cartAbandonDate", "itemsInCart", "lastCartValue"],
//   },
//   {
//     id: 12,
//     name: "Blog Readers (1 Blog)",
//     tag: "#blogReader1",
//     percentageOfCustomers: 8,
//     totalCustomers: 32,
//     columns: ["name", "firstBlogReadDate", "totalBlogsRead"],
//   },
//   {
//     id: 13,
//     name: "Blog Readers (5 Blogs)",
//     tag: "#blogReader5",
//     percentageOfCustomers: 4,
//     totalCustomers: 16,
//     columns: ["name", "firstBlogReadDate", "totalBlogsRead"],
//   },
//   {
//     id: 14,
//     name: "Blog Readers (10 Blogs)",
//     tag: "#blogReader10",
//     percentageOfCustomers: 2,
//     totalCustomers: 8,
//     columns: ["name", "firstBlogReadDate", "totalBlogsRead"],
//   },
//   {
//     id: 15,
//     name: "Kickstarter Backers",
//     tag: "#backer",
//     percentageOfCustomers: 7,
//     totalCustomers: 28,
//     columns: ["name", "kickstarterBackedDate", "totalKickstartersBacked"],
//   },
//   {
//     id: 16,
//     name: "Kickstarter Superbackers (3+)",
//     tag: "#superbacker",
//     percentageOfCustomers: 3,
//     totalCustomers: 12,
//     columns: ["name", "kickstarterBackedDate", "totalKickstartersBacked"],
//   },
//   {
//     id: 17,
//     name: "Kickstarter Megabackers (5+)",
//     tag: "#megabacker",
//     percentageOfCustomers: 1,
//     totalCustomers: 4,
//     columns: ["name", "kickstarterBackedDate", "totalKickstartersBacked"],
//   },
//   {
//     id: 18,
//     name: "Kickstarter Ultimate Backers (10+)",
//     tag: "#ultimatebacker",
//     percentageOfCustomers: 0.5,
//     totalCustomers: 2,
//     columns: ["name", "kickstarterBackedDate", "totalKickstartersBacked"],
//   },
//   {
//     id: 19,
//     name: "Claimed Reward (1 Reward)",
//     tag: "#claimedReward1",
//     percentageOfCustomers: 5,
//     totalCustomers: 20,
//     columns: ["name", "firstRewardClaimDate", "totalRewardsClaimed"],
//   },
//   {
//     id: 20,
//     name: "Claimed 5 Rewards",
//     tag: "#claimedReward5",
//     percentageOfCustomers: 2,
//     totalCustomers: 8,
//     columns: ["name", "firstRewardClaimDate", "totalRewardsClaimed"],
//   },
//   {
//     id: 21,
//     name: "Found Easter Egg",
//     tag: "#foundEasterEgg",
//     percentageOfCustomers: 1,
//     totalCustomers: 4,
//     columns: ["name", "easterEggFoundDate", "foundEasterEgg"],
//   },
// ];

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
