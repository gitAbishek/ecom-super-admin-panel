import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseTable from "@/components/ui/BaseTable";
import ReviewTable from "../../components/ReviewTable";
import ReviewModerationModal from "../../components/ReviewModerationModal";
import CustomHeaders from "@/components/common/CustomHeaders";
import CustomFilters from "@/components/common/CustomFilters";
import {
  useGetAllReviews,
  useModerateReview,
} from "@/hooks/review.hook";
import { getValue } from "@/utils/object";
import { AlertTriangle } from "lucide-react";
import CustomLoader from "@/components/loader/CustomLoader";
import CustomEmptyState from "@/components/common/CustomEmptyState";
import Pagination from "@/lib/pagination";
import { useDebounce } from "@/hooks/useDebounceSearch.hook";
import { reviewTableHeaders } from "@/constants/tableHeaders";
import type { ReviewType, ModerateReviewData } from "@/types/review";

export default function Reviews() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allReviews, setAllReviews] = useState<ReviewType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [limit] = useState(6);
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [moderatingReview, setModeratingReview] = useState<ReviewType | null>(
    null
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const { mutateAsync: moderateReview, isPending: isModerating } =
    useModerateReview();

  // Navigate to refresh reviews (since admins don't typically add reviews)
  const handleRefreshReviews = () => {
    window.location.reload();
  };

  // Fetch reviews from API
  const {
    data: reviewsData,
    isLoading,
    error,
  } = useGetAllReviews({
    page: currentPage + 1,
    limit,
    search: debouncedSearchTerm,
    filter: {
      status: selectedStatus === "All" ? "" : selectedStatus,
      rating: selectedRating === "All" ? "" : selectedRating,
    },
  });

  const handleViewReview = (review: ReviewType) => {
    navigate(`/reviews/view/${review._id}`);
  };

  const handleModerateReview = (review: ReviewType) => {
    setModeratingReview(review);
    setShowModerationModal(true);
  };

  const confirmModerateReview = async (data: ModerateReviewData) => {
    if (!moderatingReview) return;

    try {
      await moderateReview({
        reviewId: moderatingReview._id,
        data,
      });
      setShowModerationModal(false);
      setModeratingReview(null);
    } catch (error) {
      console.error("Error moderating review:", error);
    }
  };

  // Extract reviews from API response
  useEffect(() => {
    if (reviewsData?.results && Array.isArray(reviewsData.results)) {
      setAllReviews(reviewsData.results);
    } else {
      setAllReviews([]);
    }
  }, [reviewsData]);

  // Status filter options
  const statusOptions = [
    { value: "All", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  // Rating filter options
  const ratingOptions = [
    { value: "All", label: "All Ratings" },
    { value: "5", label: "5 Stars" },
    { value: "4", label: "4 Stars" },
    { value: "3", label: "3 Stars" },
    { value: "2", label: "2 Stars" },
    { value: "1", label: "1 Star" },
  ];

  const filters = [
    {
      type: 'search' as const,
      placeholder: "Search reviews...",
      value: searchTerm,
      onChange: setSearchTerm,
    },
    {
      type: 'select' as const,
      label: "Status",
      value: selectedStatus,
      onChange: setSelectedStatus,
      options: statusOptions,
    },
    {
      type: 'select' as const,
      label: "Rating",
      value: selectedRating,
      onChange: setSelectedRating,
      options: ratingOptions,
    },
  ];

  if (isLoading) return <CustomLoader />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Reviews
          </h3>
          <p className="text-gray-500">
            {getValue(error, "message", "Failed to load reviews")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <CustomHeaders
        title="Reviews Management"
        description="Manage customer reviews and ratings"
      />

      <CustomFilters filters={filters} />

      {allReviews.length === 0 ? (
        <CustomEmptyState
          title="No reviews found"
          description="No reviews match your current filters."
          showAction={true}
          actionText="Clear Filters"
          onAction={() => {
            setSelectedStatus("All");
            setSelectedRating("All");
            setSearchTerm("");
          }}
        />
      ) : (
        <div className="space-y-4">
          <BaseTable
            tableHeaders={reviewTableHeaders}
            tableData={
              <ReviewTable
                reviews={allReviews}
                onView={handleViewReview}
                onModerate={handleModerateReview}
              />
            }
          />

          <Pagination
            handlePageChange={(data) => setCurrentPage(data.selected)}
            total={getValue(reviewsData, "totalCount", 0)}
            pageCount={getValue(reviewsData, "totalPages", 0)}
            currentPage={currentPage}
          />
        </div>
      )}

      <ReviewModerationModal
        isOpen={showModerationModal}
        onClose={() => setShowModerationModal(false)}
        onConfirm={confirmModerateReview}
        review={moderatingReview}
        isLoading={isModerating}
      />
    </div>
  );
}
