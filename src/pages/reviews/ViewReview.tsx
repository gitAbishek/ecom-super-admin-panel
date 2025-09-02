import { useNavigate } from "react-router-dom";
import { Star, CheckCircle, XCircle, Clock } from "lucide-react";
import CustomBackHeader from "../../components/common/CustomBackHeader";
import type { ReviewType } from "../../types/review";

// This would typically come from API call using the ID
const mockReview: ReviewType = {
  _id: "68addfa0ecf3441ee6dff3af",
  reviewId: "f37814f7-5ffe-4b41-9ecc-2f85e7af8d8d",
  tenantId: "68a2049345e18471f7238890",
  productId: "68a2113be689520e57b766a7",
  userId: "68a2049345e18471f7238893",
  orderId: "68a4badefeecc4fe6aff7062",
  rating: 5,
  title: "Excellent Product!",
  content: "This product exceeded my expectations. The quality is outstanding and delivery was fast.",
  status: "pending",
  isVerifiedPurchase: true,
  helpfulCount: 0,
  helpfulUsers: [],
  images: [],
  createdBy: "68a2049345e18471f7238893",
  isDeleted: false,
  createdAt: "2025-08-26T16:24:00.898Z",
  updatedAt: "2025-08-26T16:24:00.898Z",
  __v: 0,
};

export default function ViewReview() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/reviews");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
        }`}
      >
        {getStatusIcon(status)}
        <span className="ml-2">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </span>
    );
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-lg font-medium text-gray-900 dark:text-gray-100">
          {rating}/5
        </span>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <CustomBackHeader 
        onBack={handleBack}
        title="Review Details"
        description="View customer review details and information"
      />

      {/* Review Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-6">
          {/* Title and Status */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {mockReview.title}
              </h2>
              {getRatingStars(mockReview.rating)}
            </div>
            {getStatusBadge(mockReview.status)}
          </div>

          {/* Review Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Review Content
              </h3>
              <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                {mockReview.content}
              </p>
            </div>
          </div>

          {/* Review Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Review ID
              </h4>
              <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                {mockReview.reviewId}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product ID
              </h4>
              <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                {mockReview.productId}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customer ID
              </h4>
              <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                {mockReview.userId}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Order ID
              </h4>
              <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                {mockReview.orderId}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Verified Purchase
              </h4>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {mockReview.isVerifiedPurchase ? (
                  <span className="text-green-600 font-medium">✓ Verified</span>
                ) : (
                  <span className="text-gray-500">Not Verified</span>
                )}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Helpful Count
              </h4>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {mockReview.helpfulCount} users found this helpful
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Created Date
              </h4>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {new Date(mockReview.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Updated
              </h4>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {new Date(mockReview.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Moderation Info */}
          {mockReview.moderatedAt && (
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Moderation Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Moderated By
                  </h4>
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                    {mockReview.moderatedBy}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Moderated At
                  </h4>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {new Date(mockReview.moderatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {mockReview.moderatorNotes && (
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Moderator Notes
                    </h4>
                    <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                      {mockReview.moderatorNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
