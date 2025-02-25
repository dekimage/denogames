"use client";

import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/firebase"; // Import regular Firebase auth
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import { Star, Plus, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
            index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const GameToReview = ({ product }) => {
  return (
    <Link
      href={`/product-details/${product.slug}#reviews`}
      className="flex items-center justify-between p-4 bg-white rounded-lg border hover:border-primary transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-md overflow-hidden">
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {product.type === "expansion" ? "Expansion" : "Base Game"}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="gap-2">
        Write Review <ChevronRight className="w-4 h-4" />
      </Button>
    </Link>
  );
};

const ReviewsPage = observer(() => {
  const { user, products } = MobxStore;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Get the current Firebase user's token
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          throw new Error("No authenticated user");
        }

        const response = await fetch("/api/reviews", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        setReviews(data.reviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return <div>Please log in to view your reviews.</div>;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Get purchased products that haven't been reviewed
  const purchasedProducts = products.filter((product) =>
    user.purchasedProducts?.includes(product.id)
  );

  const reviewedProductIds = new Set(reviews.map((review) => review.productId));
  const productsForReview = purchasedProducts.filter(
    (product) => !reviewedProductIds.has(product.id)
  );

  return (
    <div className="py-8 px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Reviews</h2>
      </div>

      <Separator className="my-6" />

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            You haven't written any reviews yet.
          </p>
          <p className="text-sm mt-2">
            Share your thoughts about the games you've played!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Game</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="hidden md:table-cell">Comment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow
                  key={review.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() =>
                    (window.location.href = `/product-details/${review.product?.slug}#reviews`)
                  }
                >
                  <TableCell>
                    <div className="relative w-12 h-12 rounded-md overflow-hidden">
                      <Image
                        src={review.product?.thumbnail}
                        alt={review.product?.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{review.product?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {review.product?.type === "expansion"
                          ? "Expansion"
                          : "Base Game"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StarRating rating={review.rating} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="max-w-[300px] truncate">
                      {review.comment}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {productsForReview.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-medium">
            Games Available for Review ({productsForReview.length})
          </h2>
          <div className="grid gap-4">
            {productsForReview.map((product) => (
              <GameToReview key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default ReviewsPage;
