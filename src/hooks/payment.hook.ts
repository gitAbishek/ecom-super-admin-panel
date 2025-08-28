import { get, deleteApi } from "@/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface GetAllPaymentsParams {
  page?: number;
  limit?: number;
  search?: string;
  filters?: Record<string, unknown>;
}

interface GetAllCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  filters?: Record<string, unknown>;
}

// Get list of payments
export const useGetAllPayments = (params: GetAllPaymentsParams = {}) => {
  const { page = 1, limit = 20, search, filters } = params;
  
  return useQuery({
    queryKey: ["payments", page, limit, search, JSON.stringify(filters)],
    queryFn: () =>
      get({
        url: "api/v1/payments/",
        params: {
          page,
          limit,
          search,
          ...filters,
        },
      }),
  });
};

// Get single payment details
export const useGetSinglePaymentDetails = (id: string) =>
  useQuery({
    queryKey: ["payments", id],
    queryFn: () =>
      get({
        url: `api/v1/payments/${id}`,
      }),
    enabled: !!id,
  });

// Delete payment
export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteApi({
        url: `api/v1/payments/${id}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};

// Get list of customers
export const useGetAllCustomers = (params: GetAllCustomersParams = {}) => {
  const { page = 1, limit = 20, search, filters } = params;
  
  return useQuery({
    queryKey: ["customers", page, limit, search, JSON.stringify(filters)],
    queryFn: () =>
      get({
        url: "api/v1/payments/customer/",
        params: {
          page,
          limit,
          search,
          ...filters,
        },
      }),
  });
};

// Get single customer details
export const useGetSingleCustomerDetails = (id: string) =>
  useQuery({
    queryKey: ["customers", id],
    queryFn: () =>
      get({
        url: `api/v1/payments/customer/${id}`,
      }),
    enabled: !!id,
  });

// Delete customer
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteApi({
        url: `api/v1/payments/customer/${id}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};
