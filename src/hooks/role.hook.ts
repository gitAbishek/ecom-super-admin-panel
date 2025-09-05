import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, postWithToken, put, deleteApi } from '@/api/client';
import type { 
  RolesResponse, 
  RoleResponse, 
  CreateRoleData, 
  UpdateRoleData, 
  GetAllRolesParams 
} from '@/types/role';

// Get all roles with pagination and search
export const useGetAllRoles = (params: GetAllRolesParams = {}) => {
  const { page = 1, limit = 10, search, status } = params;
  
  const queryParams: Record<string, string | number> = {
    page,
    limit,
  };

  // Only add search if it's not empty
  if (search && search.trim() !== '') {
    queryParams.search = search.trim();
  }

  // Only add status filter if it's not "All"
  if (status && status !== 'All') {
    queryParams.status = status;
  }

  return useQuery<RolesResponse, Error>({
    queryKey: ['roles', queryParams],
    queryFn: () =>
      get({
        url: 'api/v1/user/role/superadmin/all',
        params: queryParams,
      }),
  });
};

// Get single role details
export const useGetSingleRoleDetails = (roleId: string) => {
  return useQuery<RoleResponse, Error>({
    queryKey: ['role', roleId],
    queryFn: () =>
      get({
        url: `api/v1/user/role/superadmin/${roleId}`,
      }),
    enabled: !!roleId,
  });
};

// Create role
export const useCreateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation<RoleResponse, Error, CreateRoleData>({
    mutationFn: (data) =>
      postWithToken({
        url: 'api/v1/user/role/superadmin/create',
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

// Update role
export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation<RoleResponse, Error, { roleId: string; data: UpdateRoleData }>({
    mutationFn: ({ roleId, data }) =>
      put({
        url: `api/v1/user/role/superadmin/${roleId}`,
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role'] });
    },
  });
};

// Delete role
export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation<RoleResponse, Error, string>({
    mutationFn: (roleId: string) =>
      deleteApi({
        url: `api/v1/user/role/superadmin/${roleId}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};
