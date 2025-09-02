import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Shield } from "lucide-react";
import type { ReviewType } from "@/types/review";

interface ReviewTableProps {
  reviews: ReviewType[];
  onView: (review: ReviewType) => void;
  onModerate: (review: ReviewType) => void;
}

const ReviewTable: React.FC<ReviewTableProps> = ({
  reviews,
  onView,
  onModerate,
}) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          ({rating})
        </span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      {reviews.map((review) => (
        <tr
          key={review._id}
          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {/* Review Title & Content */}
          <td className="px-6 py-4">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs">
                {review.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                {review.content}
              </p>
            </div>
          </td>

          {/* Product */}
          <td className="px-6 py-4">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Product
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                ID: {review.productId.slice(-8)}
              </p>
            </div>
          </td>

          {/* Customer */}
          <td className="px-6 py-4">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Customer
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ID: {review.userId.slice(-8)}
                </p>
                {review.isVerifiedPurchase && (
                  <span className="text-green-600 text-xs font-medium">✓ Verified</span>
                )}
              </div>
            </div>
          </td>

          {/* Rating */}
          <td className="px-6 py-4">
            {getRatingStars(review.rating)}
          </td>

          {/* Status */}
          <td className="px-6 py-4">
            {getStatusBadge(review.status)}
          </td>

          {/* Date */}
          <td className="px-6 py-4">
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {formatDate(review.createdAt)}
            </p>
          </td>

          {/* Actions */}
          <td className="px-6 py-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(review)}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onModerate(review)}
                className="h-8 w-8 p-0"
              >
                <Shield className="h-4 w-4" />
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default ReviewTable;
