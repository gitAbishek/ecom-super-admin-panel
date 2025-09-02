import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Shield, CheckCircle, XCircle } from "lucide-react";
import type { ReviewType, ModerateReviewData } from "@/types/review";

interface ReviewModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: ModerateReviewData) => void;
  review: ReviewType | null;
  isLoading: boolean;
}

const ReviewModerationModal: React.FC<ReviewModerationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  review,
  isLoading,
}) => {
  const [selectedAction, setSelectedAction] = useState<"approved" | "rejected">("approved");
  const [moderatorNotes, setModeratorNotes] = useState("");

  if (!isOpen || !review) return null;

  const handleSubmit = () => {
    onConfirm({
      status: selectedAction,
      moderatorNotes: moderatorNotes.trim() || "No additional notes provided.",
    });
  };

  const handleClose = () => {
    setSelectedAction("approved");
    setModeratorNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Moderate Review
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Review Details */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                {review.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {review.content}
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <span>Rating: {review.rating}/5</span>
                <span>Status: {review.status}</span>
                <span>
                  {review.isVerifiedPurchase && "✓ Verified Purchase"}
                </span>
              </div>
            </div>

            {/* Action Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Select Action
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="action"
                    value="approved"
                    checked={selectedAction === "approved"}
                    onChange={(e) => setSelectedAction(e.target.value as "approved")}
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      Approve Review
                    </span>
                  </div>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="action"
                    value="rejected"
                    checked={selectedAction === "rejected"}
                    onChange={(e) => setSelectedAction(e.target.value as "rejected")}
                    className="h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      Reject Review
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Moderator Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Moderator Notes
              </label>
              <textarea
                value={moderatorNotes}
                onChange={(e) => setModeratorNotes(e.target.value)}
                placeholder="Add notes about your moderation decision..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`${
                selectedAction === "approved"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </div>
              ) : (
                `${selectedAction === "approved" ? "Approve" : "Reject"} Review`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModerationModal;
