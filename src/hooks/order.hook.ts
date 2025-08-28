import { get, patch, post, put } from "@/api/client";
import { useMutation, useQuery } from "@tanstack/react-query";

// Place order
export const usePlaceOrder = () =>
  useMutation({
    mutationFn: (body: object) =>
      post({
        url: "api/v1/order/",
        body,
      }),
  });

// Place order from cart
export const usePlaceOrderFromCart = () =>
  useMutation({
    mutationFn: (body: object) =>
      post({
        url: "api/v1/order/from-cart",
        body,
      }),
  });

// Update order (admin only)
export const useUpdateOrder = () =>
  useMutation({
    mutationFn: ({ id, body }: { id: string; body: object }) =>
      put({
        url: `api/v1/order/${id}`,
        body,
      }),
  });

// Update order status
export const useUpdateOrderStatus = () =>
  useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      patch({
        url: `api/v1/order/${id}/status`,
        body: { status },
      }),
  });

// Refund order
export const useRefundOrder = () =>
  useMutation({
    mutationFn: ({ id, body }: { id: string; body: object }) =>
      post({
        url: `api/v1/order/${id}/refund`,
        body,
      }),
  });

// Retry failed payment by customer
export const useRetryPayment = () =>
  useMutation({
    mutationFn: ({ id, body }: { id: string; body: object }) =>
      post({
        url: `api/v1/order/${id}/retry-payment`,
        body,
      }),
  });

// Get list of orders
export const useGetAllOrders = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) =>
  useQuery({
    queryKey: ["orders", page, limit],
    queryFn: () =>
      get({
        url: `api/v1/order/?page=${page}&limit=${limit}`,
      }),
  });

// Get single order details by id
export const useGetSingleOrderDetails = (id: string) =>
  useQuery({
    queryKey: ["orders", id],
    queryFn: () =>
      get({
        url: `api/v1/order/${id}`,
      }),
    enabled: !!id,
  });

// Track order by order id (public)
export const useTrackOrder = (trackingId: string) =>
  useQuery({
    queryKey: ["orders", "track", trackingId],
    queryFn: () =>
      get({
        url: `api/v1/order/track/${trackingId}`,
      }),
    enabled: !!trackingId,
  });

// Get user orders
export const useGetUserOrders = ({
  userId,
  page,
  limit,
}: {
  userId: string;
  page: number;
  limit: number;
}) =>
  useQuery({
    queryKey: ["orders", "user", userId, page, limit],
    queryFn: () =>
      get({
        url: `api/v1/order/user/${userId}?page=${page}&limit=${limit}`,
      }),
    enabled: !!userId,
  });

// Get orders analytics
export const useGetOrdersAnalytics = () =>
  useQuery({
    queryKey: ["orders", "analytics"],
    queryFn: () =>
      get({
        url: "api/v1/order/admin/analytics",
      }),
  });
