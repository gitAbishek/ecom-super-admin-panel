import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, deleteApi, postWithToken } from "@/api/client";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import type { ReviewType, ModerateReviewData } from "@/types/review";

// Response interfaces
interface ReviewsResponse {
  message: string;
  success: boolean;
  totalPages: number;
  totalCount: number;
  currentPage: number;
  results: ReviewType[];
}

interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  filter?: {
    status?: string;
    rating?: string;
  };
}

// Get all reviews
export const useGetAllReviews = ({
  page,
  limit,
  search = "",
  filter = {},
}: PaginationParams) => {
  return useQuery({
    queryKey: ["reviews", page, limit, search, JSON.stringify(filter)],
    queryFn: async (): Promise<ReviewsResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        params.append("search", search);
      }

      if (filter.status && filter.status !== "All") {
        params.append("status", filter.status);
      }

      if (filter.rating && filter.rating !== "All") {
        params.append("rating", filter.rating);
      }

      const response = await get({
        url: `api/v1/reviews?${params.toString()}`,
      });
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Moderate review (approve/reject)
export const useModerateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      data,
    }: {
      reviewId: string;
      data: ModerateReviewData;
    }) => {
      const response = await postWithToken({
        url: `api/v1/reviews/${reviewId}/moderate`,
        body: data,
      });
      return response;
    },
    onSuccess: (_data, variables) => {
      showSuccessMessage(
        `Review ${variables.data.status === "approved" ? "approved" : "rejected"} successfully`
      );
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: Error) => {
      showErrorMessage(
        error?.message || 
        `Failed to moderate review. Please try again.`
      );
    },
  });
};

// Delete review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const response = await deleteApi({
        url: `api/v1/reviews/${reviewId}`,
      });
      return response;
    },
    onSuccess: () => {
      showSuccessMessage("Review deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: Error) => {
      showErrorMessage(
        error?.message || 
        "Failed to delete review. Please try again."
      );
    },
  });
};
