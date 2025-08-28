import { deleteApi, get, post, postWithToken, put } from "@/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Inventory interfaces based on the provided payload
export interface InventoryItem {
  _id: string;
  productId: string;
  variantId: string; // This is the variant SKU
  quantity: number;
  // Additional fields that might come from API
  productName?: string;
  variantName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryFormData {
  productId: string;
  variantId: string;
  quantity: number;
}

// API Response interfaces
export interface InventoryResponse {
  success: boolean;
  inventory: InventoryItem;
}

export interface InventoriesResponse {
  success: boolean;
  inventories: {
    totalPages: number;
    totalCount: number;
    currentPage: number;
    results: InventoryItem[];
  };
}

// Get all inventory items
export const useGetAllInventories = () =>
  useQuery({
    queryKey: ["inventories"],
    queryFn: () =>
      get({
        url: "api/v1/products/inventories",
      }),
  });

// Get single inventory item
export const useGetSingleInventory = (id: string) =>
  useQuery({
    queryKey: ["inventory", id],
    queryFn: () =>
      get({
        url: `api/v1/products/inventories/${id}`,
      }),
    enabled: !!id,
  });

// Add inventory item
export const useAddInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: InventoryFormData) =>
      postWithToken({
        url: "api/v1/products/inventories",
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
  });
};

// Update inventory item
export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: InventoryFormData }) =>
      put({
        url: `api/v1/products/inventories/${id}`,
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};

// Delete inventory item
export const useDeleteInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      deleteApi({
        url: `api/v1/products/inventories/${id}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
  });
};

// Update stock level
export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      put({
        url: `api/v1/products/inventories/${id}/stock`,
        body: { stock },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};
