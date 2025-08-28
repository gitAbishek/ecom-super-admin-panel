import { get, post, put, deleteApi, postWithToken } from "@/api/client";
import { useMutation, useQuery } from "@tanstack/react-query";

// Role types
export interface Role {
  _id: string;
  tenant: string;
  label: string;
  description: string;
  adminAccess: boolean;
  permissions: string[];
  isActive: boolean;
  isSystemRole: boolean;
  scopes: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateRoleData {
  label: string;
  description: string;
  permissions: string[];
  isActive: boolean;
}

export interface UpdateRoleData {
  label?: string;
  description?: string;
  permissions?: string[];
  isActive?: boolean;
}

export interface RolesResponse {
  success: boolean;
  roles: {
    totalPages: number;
    totalCount: number;
    currentPage: number;
    results: Role[];
  };
}

export interface SingleRoleResponse {
  success: boolean;
  role: Role | null;
}

// Get list of roles
export const useGetAllRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () =>
      get({
        url: "api/v1/user/role",
      }),
  });
};

// Get single role details
export const useGetSingleRoleDetails = (id: string) =>
  useQuery({
    queryKey: ["roles", id],
    queryFn: () =>
      get({
        url: `api/v1/user/role/${id}`,
      }),
    enabled: !!id,
  });

// Create role
export const useCreateRole = () =>
  useMutation({
    mutationFn: (body: CreateRoleData) =>
      postWithToken({
        url: "api/v1/user/role",
        body,
      }),
  });

// Update role
export const useUpdateRole = () =>
  useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateRoleData }) =>
      put({
        url: `api/v1/user/role/${id}`,
        body,
      }),
  });

// Delete role
export const useDeleteRole = () =>
  useMutation({
    mutationFn: (id: string) =>
      deleteApi({
        url: `api/v1/user/role/${id}`,
      }),
  });
