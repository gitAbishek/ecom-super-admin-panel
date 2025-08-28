import { deleteApi, get, post, postWithToken, put } from "@/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Category interfaces based on your API response
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentId: string | null;
  isActive?: boolean;
  tenantId?: string;
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  parent?: Category;
  children?: Category[];
}

export interface CategoryFormData {
  name: string;
  slug: string;
  parentId: string | null;
}

// API Response interfaces
export interface CategoryResponse {
  success: boolean;
  category: Category;
}

export interface CategoriesResponse {
  success: boolean;
  categories: {
    totalPages: number;
    totalCount: number;
    currentPage: number;
    results: Category[];
  };
}

// Get all categories
export const useGetAllCategories = ({
  page = 1,
  limit = 50,
  search = "",
  filter = {
    parentId: "",
  },
}: {
  page?: number;
  limit?: number;
  search?: string;
  filter?: {
    parentId?: string;
  };
} = {}) =>
  useQuery({
    queryKey: ["categories", page, limit, search, filter],
    queryFn: () =>
      get({
        url: `api/v1/products/categories?page=${page}&limit=${limit}&search=${search}&filter=${JSON.stringify(filter)}`,
      }),
  });

// Get single category
export const useGetSingleCategoriesDetails = (id: string) =>
  useQuery({
    queryKey: ["category", id],
    queryFn: () =>
      get({
        url: `api/v1/products/categories/${id}`,
      }),
    enabled: !!id,
  });

// Add category
export const useAddCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CategoryFormData) =>
      postWithToken({
        url: "api/v1/products/categories",
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// Update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CategoryFormData }) =>
      put({
        url: `api/v1/products/categories/${id}`,
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });
};

// Delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      deleteApi({
        url: `api/v1/products/categories/${id}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
