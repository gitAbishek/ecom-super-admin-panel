import { get, put, deleteApi, postWithToken } from "@/api/client";
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
  search,
  filters,
}: {
  page: number;
  limit: number;
  search?: string;
  filters?: Record<string, unknown>;
}) => {
  const searchParams = search ? `&search=${encodeURIComponent(search)}` : '';
  const filterParams = filters ? `&filters=${encodeURIComponent(JSON.stringify(filters))}` : '';
  
  return useQuery({
    queryKey: ["coupons", page, limit, search, filters],
    queryFn: () =>
      get({
        url: `api/v1/coupons/?page=${page}&limit=${limit}${searchParams}${filterParams}`,
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
