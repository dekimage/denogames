"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import OrdersSection from "../../components/OrdersSection";
import TagsSection from "../../components/TagsSection";
import MilestonesSection from "../../components/MilestonesSection";
import CartStatusSection from "../../components/CartStatusSection";
import BasicInfoSection from "../../components/BasicInfoSection";

import ReviewsSection from "../../components/ReviewsSection";
import GamesSection from "../../components/GamesSection";

import { formatDistanceToNow } from "date-fns";

import { ChevronDown, ChevronUp } from "lucide-react";

import { ProductCard } from "@/components/ProductCard";
import KickstarterTable from "../../components/KickstarterTable";

function PersonalRecommendationsSection({ recommendations }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Personal Recommendations</h2>
        <Button variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((product) => (
            <ProductCard key={product.id} product={product} isSmall={true} />
          ))}
        </div>
      )}
    </div>
  );
}

function CustomerHeader({ customer }) {
  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold">{customer.name}</h1>
      <p className="text-muted-foreground">
        {customer.location} • Customer for{" "}
        {formatDistanceToNow(customer.createdAt)}
      </p>
    </div>
  );
}

// Dummy data for a single customer
const customerData = {
  id: "1",
  name: "John Doe",
  location: "Glogji, North Macedonia",
  createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  previousCustomerId: "prev123",
  nextCustomerId: "next456",
  lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  accountStatus: "active", // Can be 'active', 'inactive', or 'suspended'
  lifetimeValue: 483,
  averageOrderValue: 241.5,
  loginsCount: 27,
  logoutsCount: 25,
  hasGoogleAccountLinked: true,
  orders: [
    {
      id: "ord1",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      productsPurchased: ["Game A", "Game B"],
      total: 354,
    },
    {
      id: "ord2",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      productsPurchased: ["Game C"],
      total: 129,
    },
  ],
  tags: ["#backers", "#firsttime", "#buyer"],
  milestones: [
    {
      type: "purchase",
      datetime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      details: "Purchased Game A and Game B",
    },
    {
      type: "review",
      datetime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      details: "Reviewed Game C",
    },
    {
      type: "download",
      datetime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      details: "Downloaded Game C",
    },
  ],
  cart: [
    {
      id: "item1",
      name: "Game D",
      price: 59.99,
      image: "/placeholder.svg",
      addedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "item2",
      name: "Game E DLC",
      price: 19.99,
      image: "/placeholder.svg",
      addedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  ],
  basicInfo: {
    email: { address: "john@example.com", isSubscribed: true },
    discord: { isMember: true, username: "johnd", tag: "1234" },
    instagram: { username: "johndoe" },
    kickstarter: {
      isBacker: true,
      backedCampaigns: [
        {
          id: "camp1",
          link: "https://kickstarter.com/camp1",
          totalSpent: 100,
          tierBacked: "Silver",
          game: "Game X",
        },
      ],
    },
    level: 7,
    xp: { current: 35, max: 80 },
    notes: "Enthusiastic gamer, prefers strategy games.",
  },
  personalRecommendations: [
    {
      id: "rec1",
      name: "Game F",
      description: "An exciting new strategy game",
      price: 49.99,
      thumbnail: "/placeholder.svg",
      type: "game",
      slug: "game-f",
    },
    {
      id: "rec2",
      name: "Game G Expansion",
      description: "Expand your Game G experience",
      price: 29.99,
      thumbnail: "/placeholder.svg",
      type: "expansion",
      slug: "game-g-expansion",
    },
  ],
  reviews: [
    {
      productId: "prod1",
      productName: "Game A",
      rating: 4,
      comment: "Great game, really enjoyed it!",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      productId: "prod2",
      productName: "Game C",
      rating: 5,
      comment: "Absolutely fantastic, couldn't stop playing!",
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  ],
  games: [
    {
      id: "game1",
      name: "Game A",
      image: "/placeholder.svg",
      status: "purchased",
      downloadsCount: 34,
    },
    {
      id: "game2",
      name: "Game B",
      image: "/placeholder.svg",
      status: "purchased",
      downloadsCount: 12,
    },
    {
      id: "game3",
      name: "Game C",
      image: "/placeholder.svg",
      status: "in_cart",
      downloadsCount: null,
    },
    {
      id: "game4",
      name: "Game D",
      image: "/placeholder.svg",
      status: "none",
      downloadsCount: null,
    },
  ],
};

export default function CustomerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCustomer(customerData);
      } catch (err) {
        setError("Failed to load customer data");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const handleSave = () => {
    // Implement save functionality here
    console.log("Saving customer data...");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-[250px]" />
        <Skeleton className="h-4 w-[300px]" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">{error}</h1>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/admin/customer/${customer.previousCustomerId}`)
              }
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/admin/customer/${customer.nextCustomerId}`)
              }
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <CustomerHeader customer={customer} />

        <BasicInfoSection basicInfo={customer.basicInfo} customer={customer} />

        <div className="grid gap-6 md:grid-cols-2">
          <OrdersSection orders={customer.orders} />
          <TagsSection tags={customer.tags} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <MilestonesSection milestones={customer.milestones} />
          <CartStatusSection cart={customer.cart} />
        </div>
        <KickstarterTable
          kickstarterInfo={customerData.basicInfo.kickstarter}
        />
        <ReviewsSection reviews={customer.reviews} />
        <GamesSection games={customer.games} />

        <PersonalRecommendationsSection
          recommendations={customer.personalRecommendations}
        />

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
