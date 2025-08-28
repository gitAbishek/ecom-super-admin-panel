import { get, post, put, deleteApi, postWithToken } from "@/api/client";
import { useMutation, useQuery } from "@tanstack/react-query";

// Permission types
export interface Permission {
  _id: string;
  resource: string;
  action: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  permission: string;
  id: string;
  __v: number;
}

export interface CreatePermissionData {
  resource: string;
  action: string;
  description: string;
  isActive: boolean;
}

export interface UpdatePermissionData {
  resource?: string;
  action?: string;
  description?: string;
  isActive?: boolean;
}

export interface PermissionsResponse {
  success: boolean;
  message: string;
  data: Permission[];
}

// Get list of permissions
export const useGetAllPermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: () =>
      get({
        url: "api/v1/user/permission",
      }),
  });
};

// Get single permission details
export const useGetSinglePermissionDetails = (id: string) =>
  useQuery({
    queryKey: ["permissions", id],
    queryFn: () =>
      get({
        url: `api/v1/user/permission/${id}`,
      }),
    enabled: !!id,
  });

// Create permission
export const useCreatePermission = () =>
  useMutation({
    mutationFn: (body: CreatePermissionData) =>
      postWithToken({
        url: "api/v1/user/permission",
        body,
      }),
  });

// Update permission
export const useUpdatePermission = () =>
  useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdatePermissionData }) =>
      put({
        url: `api/v1/user/permission/${id}`,
        body,
      }),
  });

// Delete permission
export const useDeletePermission = () =>
  useMutation({
    mutationFn: (id: string) =>
      deleteApi({
        url: `api/v1/user/permission/${id}`,
      }),
  });
