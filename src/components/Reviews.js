"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Edit, Plus, ShieldCheck, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DialogDescription } from "@radix-ui/react-dialog";
import { runInAction } from "mobx";

const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`w-5 h-5 ${
            index < rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
    </div>
  );
};

const StarRatingInput = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className={`cursor-pointer text-4xl mx-1 transition-colors ${
            (hoverRating || rating) >= star
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
    </div>
  );
};

const formatReviewDate = (timestamp) => {
  if (!timestamp) return "";

  // Handle both Firestore timestamp objects and ISO date strings
  let date;
  if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    date = new Date(timestamp);
  }

  const now = new Date();

  // If less than 24 hours ago, show relative time
  const diffHours = (now - date) / (1000 * 60 * 60);

  if (diffHours < 24) {
    if (diffHours < 1) {
      return "Just now";
    }
    const hours = Math.floor(diffHours);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  // If less than 7 days ago, show day of week
  if (diffHours < 168) {
    // 7 days
    const options = { weekday: "long" };
    return date.toLocaleDateString(undefined, options);
  }

  // Otherwise show full date
  return date.toLocaleDateString();
};

export const ReviewSection = observer(({ productDetails, productId }) => {
  const {
    user,
    reviewsByProduct,
    submitReview,
    updateReview,
    fetchReviews,
    hasMoreReviewsByProduct,
    lastReviewFetchedByProduct,
  } = MobxStore;
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reviews = reviewsByProduct[productId] || [];
  const hasMoreReviews = hasMoreReviewsByProduct[productId];
  const lastReviewFetched = lastReviewFetchedByProduct[productId];

  // Get the existing review for the current user
  const existingReview = user
    ? reviews.find((review) => review.userId === user?.uid)
    : null;

  const [rating, setRating] = useState(
    existingReview ? existingReview.rating : 0
  );
  const [comment, setComment] = useState(
    existingReview ? existingReview.comment : ""
  );

  // Reset form when dialog closes
  useEffect(() => {
    if (!dialogOpen) {
      setRating(existingReview ? existingReview.rating : 0);
      setComment(existingReview ? existingReview.comment : "");
    }
  }, [dialogOpen, existingReview]);

  useEffect(() => {
    // Fetch reviews on component mount
    fetchReviews(productId).then(() => {
      // This ensures the actual count matches the reviews loaded
      const actualCount = MobxStore.reviewsByProduct[productId]?.length || 0;

      // Check if displayed count differs from actual count
      const currentProduct = MobxStore.products.find((p) => p.id === productId);
      if (currentProduct && currentProduct.totalReviews !== actualCount) {
        console.log(
          `Fixing review count: Stored=${currentProduct.totalReviews}, Actual=${actualCount}`
        );

        // Update the local count to match actual reviews
        const productIndex = MobxStore.products.findIndex(
          (p) => p.id === productId
        );
        if (productIndex !== -1) {
          MobxStore.products[productIndex] = {
            ...MobxStore.products[productIndex],
            totalReviews: actualCount,
          };
        }
      }
    });
  }, [productId, fetchReviews]);

  const loadMoreReviews = () => {
    fetchReviews(productId, lastReviewFetched);
  };

  // Get the current product with reactive state from MobX store
  const currentProduct = MobxStore.products.find((p) => p.id === productId);
  // Use the reactive value from MobX store instead of static productDetails
  const averageRating = currentProduct?.averageRating || 0;
  const totalReviews = currentProduct?.totalReviews || 0;

  // Ensure reviews are unique by ID
  const uniqueReviews = useMemo(() => {
    const reviewsMap = new Map();
    reviews.forEach((review) => {
      reviewsMap.set(review.id, review);
    });
    return Array.from(reviewsMap.values()).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [reviews]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      if (existingReview) {
        const oldRating = existingReview.rating;
        await updateReview(existingReview.id, productId, rating, comment);

        toast({
          title: "Review Updated",
          description: "Your review has been updated successfully.",
        });
      } else {
        const result = await submitReview(productId, rating, comment);

        toast({
          title: "Review Submitted",
          description:
            "Your review has been submitted successfully. You earned 50 XP!",
        });
      }

      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-8 w-full flex flex-col" id="ratings">
      <div className="text-2xl font-strike uppercase my-4">Reviews</div>

      <div className="flex items-center text-lg mb-2">
        <div className="flex items-center gap-4">
          <StarRating rating={Math.round(averageRating)} />
          <div className="font-bold text-2xl">{averageRating.toFixed(1)}</div>
          <div className="text-sm text-muted-foreground">
            ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
          </div>
        </div>
      </div>

      {user ? (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="my-4 w-fit"
              disabled={!user?.purchasedProducts?.includes(productId)}
            >
              {existingReview ? (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Your Review
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {!user?.purchasedProducts?.includes(productId)
                    ? "You must own the game to write a review"
                    : "Write a Review"}
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-center">
                {existingReview ? "Edit Your Review" : "Write a Review"}
              </DialogTitle>
            </DialogHeader>
            <DialogDescription></DialogDescription>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-center block">
                  Your Rating
                </label>
                <StarRatingInput rating={rating} setRating={setRating} />
                <p className="text-center text-sm mt-2">
                  {rating === 0
                    ? "Select your rating"
                    : `You've rated ${rating} star${rating !== 1 ? "s" : ""}`}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Your Review</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product (optional)"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {existingReview
                  ? "Updating your review helps other players make better decisions."
                  : "Your review helps other players make better decisions!"}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting
                    ? "Processing..."
                    : existingReview
                      ? "Update"
                      : "Submit"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="my-4">
          <Button variant="outline" asChild>
            <a href="/login">Log in to write a review</a>
          </Button>
        </div>
      )}

      {/* Reviews List */}
      {uniqueReviews.length === 0 ? (
        <div className="p-8 text-center border rounded-lg bg-muted/10 dark:bg-muted/5">
          <p className="text-muted-foreground">
            No reviews yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <ul className="space-y-4 mt-4">
          {uniqueReviews
            .filter((review) => review && review.username && review.createdAt)
            .map((review) => (
              <li
                key={review.id}
                className="flex flex-col md:flex-row border rounded-lg p-4 dark:border-gray-800"
              >
                <div className="flex-shrink-0 mb-3 md:mb-0 md:mr-4 md:w-48">
                  <div className="text-base md:text-lg font-semibold mb-1 capitalize">
                    {review.username}
                  </div>
                  <div className="flex text-xs items-center text-muted-foreground mb-2">
                    <ShieldCheck className="mr-1 h-3 w-3" /> Verified Buyer
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatReviewDate(review.createdAt)}
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="mb-2">
                    <StarRating rating={review.rating} />
                  </div>
                  <div className="text-sm text-foreground mb-4">
                    {review.comment || "No additional comments."}
                  </div>
                </div>
              </li>
            ))}
        </ul>
      )}

      {hasMoreReviews && (
        <Button
          variant="outline"
          className="w-fit mt-6"
          onClick={loadMoreReviews}
        >
          Load More Reviews
        </Button>
      )}
    </div>
  );
});
