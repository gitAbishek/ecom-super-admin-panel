import { get, post, put, deleteApi, postWithToken } from "@/api/client";
import { useMutation, useQuery } from "@tanstack/react-query";

// Create coupon
export const useCreateCoupon = () =>
  useMutation({
    mutationFn: (body: object) =>
      postWithToken({
        url: "api/v1/coupons",
        body,
      }),
  });

// Update coupon
export const useUpdateCoupon = () =>
  useMutation({
    mutationFn: ({ id, body }: { id: string; body: object }) =>
      put({
        url: `api/v1/coupons/${id}`,
        body,
      }),
  });

// Delete coupon
export const useDeleteCoupon = () =>
  useMutation({
    mutationFn: (id: string) =>
      deleteApi({
        url: `api/v1/coupons/${id}`,
      }),
  });

// Get list of coupons
export const useGetAllCoupons = ({
  page,
  limit,
  distributionMethod,
  isActive,
  search,
}: {
  page: number;
  limit: number;
  distributionMethod?: string;
  isActive?: boolean;
  search?: string;
}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (distributionMethod) params.append('distributionMethod', distributionMethod);
  if (isActive !== undefined) params.append('isActive', isActive.toString());
  if (search) params.append('search', search);

  return useQuery({
    queryKey: ["coupons", page, limit, distributionMethod, isActive, search],
    queryFn: () =>
      get({
        url: `api/v1/coupons/?${params.toString()}`,
      }),
  });
};

// Get single coupon details
export const useGetSingleCouponDetails = (id: string) =>
  useQuery({
    queryKey: ["coupons", id],
    queryFn: () =>
      get({
        url: `api/v1/coupons/${id}`,
      }),
    enabled: !!id,
  });
