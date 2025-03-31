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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import { Star, Plus, ChevronRight, ShieldCheck, Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { EasterEggDialog } from "@/components/ui/easter-egg-dialog";

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
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

const ReviewDialog = ({ review = null, productId = null, onSuccess }) => {
  const {
    products,
    submitReview,
    updateReview,
    reviewSubmitting,
    reviewUpdating,
  } = MobxStore;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rating, setRating] = useState(review ? review.rating : 0);
  const [comment, setComment] = useState(review ? review.comment : "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [showSatisfiedEgg, setShowSatisfiedEgg] = useState(false);
  const [showStarTrigger, setShowStarTrigger] = useState(false);

  const product = review?.product || products.find((p) => p.id === productId);
  const isEditing = !!review;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateReview(review.id, review.productId, rating, comment);
        toast({
          title: "Review Updated",
          description: "Your review has been updated successfully.",
        });
      } else {
        await submitReview(productId, rating, comment);
        toast({
          title: "Review Submitted",
          description:
            "Your review has been submitted successfully. You earned 50 XP!",
        });
      }

      setDialogOpen(false);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setIsSubmitting(false);
        setRating(0);
        setComment("");
      }, 300);
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button
            variant="outline"
            size="sm"
            className="flex gap-2 items-center"
          >
            <Edit className="w-4 h-4" /> Edit
          </Button>
        ) : (
          <Button variant="outline" className="flex gap-2 items-center">
            Write Review <Plus className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isEditing ? "Edit Your Review" : "Write a Review"}
          </DialogTitle>
        </DialogHeader>

        {isEditing && rating === 5 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 hover:text-yellow-400 transition-colors"
            onClick={() => setShowSatisfiedEgg(true)}
          >
            <Star className="h-5 w-5 animate-pulse text-yellow-400" />
          </Button>
        )}

        {product && (
          <div className="flex items-center mb-4">
            <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden border dark:border-gray-700">
              <Image
                src={product.thumbnail || "/placeholder-image.jpg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="ml-3">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                {product.type === "expansion" ? "Expansion" : "Base Game"}
              </p>
            </div>
          </div>
        )}

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
            {isEditing
              ? "Updating your review helps other players make better decisions."
              : "Your review helps other players make better decisions."}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner className="h-4 w-4" />
                  <span>{isEditing ? "Updating..." : "Submitting..."}</span>
                </div>
              ) : isEditing ? (
                "Update"
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>

      <EasterEggDialog
        open={showSatisfiedEgg}
        onOpenChange={setShowSatisfiedEgg}
        title="Perfect Rating!"
        code="SATISFIED"
        message="Ahh I can see you are a happy player ^^ Here's a little something ;)"
        image="/easterEggs/2.png"
        imageAlt="Happy Player Reward"
      />
    </Dialog>
  );
};

const GameToReview = ({ product }) => {
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({
      title: "Review Submitted",
      description: `Thank you for reviewing ${product.name}!`,
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border dark:border-gray-800 hover:border-primary dark:hover:border-primary transition-colors gap-4">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-md overflow-hidden border dark:border-gray-700">
          <Image
            src={product.thumbnail || "/placeholder-image.jpg"}
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
          <div className="flex mt-1">
            <Link href={`/product-details/${product.slug}#reviews`}>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-primary"
              >
                View Product
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <ReviewDialog productId={product.id} onSuccess={handleSuccess} />
    </div>
  );
};

const formatReviewDate = (isoDate) => {
  if (!isoDate) return "";

  const date = new Date(isoDate);
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

const ReviewsPage = observer(() => {
  const {
    user,
    products,
    userReviews,
    userReviewsLoading,
    userReviewsFetched,
    fetchUserReviews,
    userFullyLoaded,
  } = MobxStore;
  const { toast } = useToast();

  useEffect(() => {
    if (user && userFullyLoaded && !userReviewsLoading && !userReviewsFetched) {
      fetchUserReviews();
    }
  }, [
    user,
    userFullyLoaded,
    userReviewsLoading,
    userReviewsFetched,
    fetchUserReviews,
  ]);

  const handleReviewSuccess = () => {
    toast({
      title: "Review Updated",
      description: "Your review has been updated successfully.",
    });
  };

  // Show loading state when user data is loading or reviews are loading
  if (!userFullyLoaded || userReviewsLoading) {
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
            You need to be logged in to view your reviews.
          </p>
          <Link href="/login">
            <Button>Log In</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Get purchased products that haven't been reviewed
  const purchasedProducts = products.filter((product) =>
    user.purchasedProducts?.includes(product.id)
  );

  const reviewedProductIds = new Set(
    userReviews.map((review) => review.productId)
  );
  const productsForReview = purchasedProducts.filter(
    (product) =>
      !reviewedProductIds.has(product.id) && product.type !== "expansion"
  );

  return (
    <div className="container py-8 px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-strike">Your Reviews</h2>
      </div>

      <Separator className="my-6 dark:bg-gray-800" />

      {userReviews.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 dark:bg-muted/10 rounded-lg">
          <p className="text-lg text-muted-foreground">
            You haven&apos;t written any reviews yet.
          </p>
          <p className="text-sm mt-2 mb-6 text-muted-foreground">
            Share your thoughts about the games you&apos;ve played!
          </p>
        </div>
      ) : (
        <div className="rounded-lg border dark:border-gray-800 overflow-hidden">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 dark:bg-muted/20">
                  <TableHead className="w-[100px]">Game</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="hidden md:table-cell w-[300px]">
                    Comment
                  </TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userReviews.map((review) => (
                  <TableRow
                    key={review.id}
                    className="hover:bg-muted/30 dark:hover:bg-muted/10 transition-colors"
                  >
                    <TableCell>
                      <div className="relative w-12 h-12 rounded-md overflow-hidden border dark:border-gray-700">
                        <Image
                          src={
                            review.product?.thumbnail ||
                            "/placeholder-image.jpg"
                          }
                          alt={review.product?.name || "Game"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/product-details/${
                          review.product?.slug || "#"
                        }#reviews`}
                      >
                        <div className="hover:text-primary transition-colors">
                          <div className="font-medium">
                            {review.product?.name || "Unknown Game"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {review.product?.type === "expansion"
                              ? "Expansion"
                              : "Base Game"}
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StarRating rating={review.rating} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="max-w-[300px] truncate text-muted-foreground">
                        {review.comment || "No comment provided"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {formatReviewDate(review.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <ReviewDialog
                        review={review}
                        onSuccess={handleReviewSuccess}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {productsForReview.length > 0 && (
        <div id="games-to-review" className="mt-8 space-y-4 scroll-mt-8">
          <h2 className="text-lg font-medium flex items-center">
            <Star className="w-5 h-5 text-yellow-400 mr-2" />
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
