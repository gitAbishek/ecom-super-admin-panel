import { get } from "@/api/client";
import { useQuery } from "@tanstack/react-query";

// Get list of customers
export const useGetAllCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: () =>
      get({
        url: "api/v1/payments/customer/",
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

// Get list of payments
export const useGetAllPayments = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: () =>
      get({
        url: "api/v1/payments/",
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
