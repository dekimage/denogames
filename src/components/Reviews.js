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

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [existingReview, setExistingReview] = useState(null);

  const reviews = reviewsByProduct[productId] || [];
  const hasMoreReviews = hasMoreReviewsByProduct[productId];
  const lastReviewFetched = lastReviewFetchedByProduct[productId];

  useEffect(() => {
    if (reviews.length === 0) {
      fetchReviews(productId);
    }
  }, [productId, fetchReviews, reviews.length]);

  useEffect(() => {
    const userReview = reviews.find(
      (review) => review.userId === user.uid && review.productId === productId
    );
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment);
      setExistingReview(userReview);
    } else {
      setRating(0);
      setComment("");
      setExistingReview(null);
    }
  }, [reviews, user?.uid, productId]);

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
    <div className="mt-8 w-full px-2 sm:px-8 flex flex-col" id="ratings">
      <div className="text-4xl font-bold my-4">Reviews</div>
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
          <div className="font-bold text-2xl">
            {averageRating?.toFixed(1) || 0}
          </div>
          <div className="text-md">Average Rating</div>
        </div>
      </div>
      <p className="text-lg">{productDetails.totalReviews} store reviews</p>
      <div className="flex">
        <Dialog>
          <DialogTrigger>
            <Button
              className="my-4"
              variant={existingReview ? "outline" : "primary"}
            >
              {existingReview ? (
                <div className="flex gap-2 items-center">
                  Edit Your Review <Edit />
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  Submit Your Review <Plus />
                </div>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent
            className="bg-white rounded-lg p-6 mx-auto mt-10"
            style={{ maxWidth: "500px" }}
          >
            <div className="rating mb-4 flex justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-4xl ${
                    rating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave a comment (optional)"
            />
            <div className="flex justify-between mt-4"></div>
            <DialogFooter>
              <Button onClick={handleSubmit}>
                {existingReview ? "Update Review" : "Submit Review"}
              </Button>
              {/* {existingReview && (
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete Review
            </button>
          )} */}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <ul className="space-y-4">
        {[existingReview, ...reviews.filter((r) => r !== existingReview)]
          .filter((review) => review && review.username && review.createdAt)
          .map((review) => (
            <li key={review.id} className="flex border-b py-4">
              <div className="flex-shrink-0 flex flex-col items-start justify-between mr-4">
                <div>
                  <div className="text-lg font-bold mb-2">
                    {review.username}
                  </div>
                  <div className="flex text-sm items-center">
                    <ShieldCheck className="mr-1" size={18} /> Verified Buyer
                  </div>
                </div>
              </div>
              <div className="flex-grow">
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
          onClick={() => loadMoreReviews()}
        >
          Load More Reviews
        </Button>
      )}
    </div>
  );
});
