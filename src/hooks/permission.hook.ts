import { get, post, put, deleteApi, postWithToken } from "@/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

interface GetAllPermissionsParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: Record<string, unknown>;
}

// Get list of permissions
export const useGetAllPermissions = (params: GetAllPermissionsParams = {}) => {
  const { page = 1, limit = 20, search, filter } = params;
  
  return useQuery({
    queryKey: ["permissions", page, limit, search, JSON.stringify(filter)],
    queryFn: () =>
      get({
        url: "api/v1/user/permission",
        params: {
          page,
          limit,
          search,
          ...filter,
        },
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
export const useDeletePermission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) =>
      deleteApi({
        url: `api/v1/user/permission/${id}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
};
