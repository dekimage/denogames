"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useEffect, useState } from "react";
import { FaStar, FaEdit } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useCallback } from "react";
import { useRef } from "react";
import { Textarea } from "./ui/textarea";
import { Edit, Plus, ShieldCheck } from "lucide-react";
import { getRelativeTime } from "@/utils/date";
import { toJS } from "mobx";

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

  const reviews = reviewsByProduct[productId] || [];
  const hasMoreReviews = hasMoreReviewsByProduct[productId];
  const lastReviewFetched = lastReviewFetchedByProduct[productId];

  // Add this to get the existing review for the current user
  const existingReview = user
    ? reviews.find((review) => review.userId === user.uid)
    : null;

  const [rating, setRating] = useState(
    existingReview ? existingReview.rating : 0
  );
  const [comment, setComment] = useState(
    existingReview ? existingReview.comment : ""
  );

  useEffect(() => {
    if (reviews.length === 0) {
      fetchReviews(productId);
    }
  }, [productId, fetchReviews, reviews.length]);

  const loadMoreReviews = () => {
    fetchReviews(productId, lastReviewFetched);
  };

  const handleSubmit = () => {
    if (existingReview) {
      updateReview(existingReview.id, productId, rating, comment);
    } else {
      submitReview(productId, rating, comment);
    }
  };

  // const handleDelete = () => {
  //   if (existingReview) {
  //     deleteReview(existingReview.id, productId);
  //     closeModal();
  //   }
  // };

  const averageRating = productDetails.averageRating;

  return (
    <div className="my-8 w-full flex flex-col" id="ratings">
      <div className="text-2xl font-strike uppercase my-4">Reviews</div>
      <div className="flex items-center text-lg mb-2">
        <div className="flex items-center gap-2">
          <div className="text-yellow-400 flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`text-2xl ${
                  averageRating >= star ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="font-strike uppercase text-2xl">
            {averageRating?.toFixed(1) || 0}
          </div>
          <div className="text-sm">Average Rating</div>
        </div>
      </div>
      <p className="text-sm">({productDetails.totalReviews} store reviews)</p>
      <div className="flex">
        <Dialog>
          <DialogTrigger>
            <div className="my-4">
              {existingReview ? (
                <Button variant="reverse" className="flex gap-2 items-center">
                  Edit Your Review <Edit />
                </Button>
              ) : (
                <Button variant="reverse" className="flex gap-2 items-center">
                  Submit Your Review <Plus />
                </Button>
              )}
            </div>
          </DialogTrigger>
          <DialogContent
            className="bg-white rounded-lg p-8 mx-auto mt-10 max-w-md"
            style={{ maxWidth: "500px" }}
          >
            <h2 className="text-2xl font-strike uppercase text-center mb-4">
              Share Your Experience
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Thank you so much for taking the time to leave a review! It helps
              me improve each game and allows others to know what to expect.
            </p>
            <div className="rating mb-6 flex justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setRating(star)}
                  onMouseLeave={() => setRating(rating)}
                  className={`cursor-pointer text-5xl transition-colors ${
                    rating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-center font-semibold mb-4">
              {rating === 0
                ? "Select your rating"
                : `You've rated ${rating} star${rating !== 1 ? "s" : ""}`}
            </p>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about the product (optional)"
              className="mb-6 h-32"
            />
            <DialogFooter className="flex-col items-stretch sm:flex-row sm:justify-between">
              <p className="flex items-center text-sm text-gray-500 mb-4 sm:mb-0">
                {existingReview
                  ? "Updating your review"
                  : "Submitting a new review"}{" "}
                will earn you 50 XP!
              </p>
              <Button onClick={handleSubmit} className="w-full sm:w-auto">
                {existingReview ? "Update Review" : "Submit Review"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <ul className="space-y-4">
        {reviews
          .filter((review) => review && review.username && review.createdAt)
          .map((review) => (
            <li key={review.id} className="flex border-b py-4">
              <div className="flex-shrink-0 flex flex-col items-start justify-between mr-4">
                <div>
                  <div className="text-lg font-bold mb-2 capitalize">
                    {review.username}
                  </div>
                  <div className="flex text-sm items-center">
                    <ShieldCheck className="mr-1" size={18} /> Verified Buyer
                  </div>
                </div>
              </div>
              <div className="flex-grow items-between justify-between">
                <div className="flex items-center mb-2 justify-between">
                  <div className="rating text-yellow-400 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-2xl ${
                          review.rating >= star
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getRelativeTime(review.createdAt.seconds)}
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-gray-700 mb-2">
                  {review.comment}
                </div>
                <div className="text-xs text-gray-500 underline">
                  <a href={`/product-details/${productDetails.slug}`}>
                    {productDetails.name}
                  </a>
                </div>
              </div>
              {/* {review.userId === user.uid && (
                <button onClick={openModal} className="ml-auto text-blue-500">
                  <FaEdit />
                </button>
              )} */}
            </li>
          ))}
      </ul>

      {hasMoreReviews && (
        <Button
          variant="outline"
          className="w-fit mt-4"
          onClick={loadMoreReviews}
        >
          Load More Reviews
        </Button>
      )}
    </div>
  );
});
