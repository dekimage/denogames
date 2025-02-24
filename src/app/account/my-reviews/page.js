"use client";

import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useEffect, useState } from "react";
import Link from "next/link";
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
import { Star, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

const AddReviewDialog = observer(({ products }) => {
  const nonReviewedProducts = products.filter(
    (product) => !product.hasUserReview
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>Earn +2 XP for each review you write!</p>
            {nonReviewedProducts.length > 0 && (
              <p className="text-sm text-muted-foreground">
                You have {nonReviewedProducts.length} game
                {nonReviewedProducts.length !== 1 ? "s" : ""} available to
                review
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        {nonReviewedProducts.length > 0 ? (
          <div className="grid gap-4">
            {nonReviewedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product-details/${product.slug}#reviews`}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors"
              >
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {product.type === "expansion" ? "Expansion" : "Base Game"}
                  </div>
                </div>
                <Button variant="ghost">Review</Button>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              It seems you don't have any purchased games that you haven't
              reviewed yet.
            </p>
            <p className="text-sm mt-2">
              Note: You must own a game or expansion to leave a review.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});

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
  const productsForReview = purchasedProducts.map((product) => ({
    ...product,
    hasUserReview: reviewedProductIds.has(product.id),
  }));

  return (
    <div className="py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Reviews</h2>
        <AddReviewDialog products={productsForReview} />
      </div>

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Game</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="hidden md:table-cell">Comment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>XP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow
                key={review.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() =>
                  (window.location.href = `/product-details/${review.product?.slug}#reviews`)
                }
              >
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
                  <div className="max-w-[300px] truncate">{review.comment}</div>
                </TableCell>
                <TableCell>
                  {new Date(review.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span className="text-green-600">+2 XP</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
});

export default ReviewsPage;
