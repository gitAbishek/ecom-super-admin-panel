import { get, put, deleteApi, postWithToken } from "@/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Product interfaces based on your payload
export interface ProductVariant {
  sku: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  media: string[];
}

export interface ProductSEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  slug: string;
  categories: string[];
  status: "active" | "inactive" | "draft";
  visible: boolean;
  inventory: number;
  tags: string[];
  relatedProducts: string[];
  variants: ProductVariant[];
  seo: ProductSEO;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  slug: string;
  categories: string[];
  status: "active" | "inactive" | "draft";
  visible: boolean;
  inventory: number;
  tags: string[];
  relatedProducts: string[];
  variants: ProductVariant[];
  seo: ProductSEO;
  images: string[]; // Product images
}

// API Response interfaces
export interface ProductResponse {
  success: boolean;
  product: Product;
}

export interface ProductsResponse {
  success: boolean;
  products: {
    totalPages: number;
    totalCount: number;
    currentPage: number;
    results: Product[];
  };
}

// Get all products
export const useGetAllProducts = ({
  page = 1,
  limit = 50,
  search = "",
  filter = {
    status: "",
  },
}: {
  page?: number;
  limit?: number;
  search?: string;
  filter?: {
    status?: string;
  };
} = {}) =>
  useQuery({
    queryKey: ["products", page, limit, search, filter],
    queryFn: () =>
      get({
        url: `api/v1/products?page=${page}&limit=${limit}&search=${search}&filter=${JSON.stringify(filter)}`,
      }),
  });

// Get single product
export const useGetSingleProduct = (id: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () =>
      get({
        url: `api/v1/products/${id}`,
      }),
    enabled: !!id,
  });

// Add product
export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: FormData | ProductFormData) =>
      postWithToken({
        url: "api/v1/products",
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: ProductFormData | FormData;
    }) =>
      put({
        url: `api/v1/products/${id}`,
        body,
        contentType:
          body instanceof FormData ? "multipart/form-data" : "application/json",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });
};

// Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      deleteApi({
        url: `api/v1/products/${id}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
