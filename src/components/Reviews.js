"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useEffect, useState } from "react";
import { FaStar, FaEdit } from "react-icons/fa";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

export const ReviewSection = observer(({ productId }) => {
  const { user, reviews, submitReview, deleteReview, fetchReviews } = MobxStore;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [existingReview, setExistingReview] = useState(null);

  useEffect(() => {
    fetchReviews(productId);
  }, [productId]);

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
  }, [reviews, productId, user.uid]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = () => {
    submitReview(productId, rating, comment);
    closeModal();
  };

  const handleDelete = () => {
    if (existingReview) {
      deleteReview(existingReview.id, productId);
      closeModal();
    }
  };

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="review-section bg-white shadow-md rounded p-4 mt-8">
      <h3 className="text-xl font-semibold mb-4">Reviews</h3>
      <div className="average-rating text-lg mb-2">
        <span className="font-bold">{averageRating?.toFixed(1) || 0}</span> / 5
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
        <p>{reviews.length} store reviews</p>
      </div>

      {existingReview ? (
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Edit Your Review
        </button>
      ) : (
        <button
          onClick={openModal}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Submit Review
        </button>
      )}

      <ul className="space-y-4">
        {[existingReview, ...reviews.filter((r) => r !== existingReview)]
          .filter((review) => review && review.userId && review.createdAt)
          .map((review) => (
            <li key={review.id} className="flex border-b py-4">
              <div className="flex-shrink-0 mr-4">
                <div className="text-sm font-bold">{review.userId}</div>
                <div className="text-xs text-gray-500">
                  {new Date(review.createdAt.seconds * 1000).toLocaleDateString(
                    "en-US"
                  )}
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-center mb-2">
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
                  {review.userId === user.uid && (
                    <button
                      onClick={openModal}
                      className="ml-auto text-blue-500"
                    >
                      <FaEdit />
                    </button>
                  )}
                </div>
                <div className="comment text-gray-700 mb-2">
                  {review.comment}
                </div>
                <div className="text-xs text-gray-500 underline">
                  <a href={`/product-details/${productId}`}>
                    {productId} - {review.productName}
                  </a>
                </div>
              </div>
            </li>
          ))}
      </ul>

      <Dialog>
        <DialogTrigger>
          <Button>
            {existingReview ? "Edit Your Review" : "Submit Your Review"}
          </Button>
        </DialogTrigger>
        <DialogContent
          className="bg-white rounded-lg p-6 mx-auto mt-10"
          style={{ maxWidth: "500px" }}
        >
          <div className="rating mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer text-2xl ${
                  rating >= star ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave a comment (optional)"
            className="border p-2 w-full mt-2 rounded resize-none h-24"
          />
          <div className="flex justify-between mt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {existingReview ? "Update Review" : "Submit Review"}
            </button>
            {existingReview && (
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete Review
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});
