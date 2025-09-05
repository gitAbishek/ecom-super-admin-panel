import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { get, patch, postWithToken, put } from '@/api/client';
import type { 
  TenantsResponse, 
  TenantResponse, 
  CreateTenantData, 
  UpdateTenantData,
  ValidateTenantResponse
} from '@/types/tenant';

export interface GetAllTenantsParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: Record<string, unknown>;
}

// Get all tenants
export const useGetAllTenants = (params: GetAllTenantsParams = {}) => {
  const { page = 1, limit = 20, search, filter } = params;
  
  return useQuery<TenantsResponse, Error>({
    queryKey: ['tenants', page, limit, search, JSON.stringify(filter)],
    queryFn: () =>
      get({
        url: "api/v1/user/tenant/",
        params: {
          page,
          limit,
          ...(search && { search }),
          ...filter,
        },
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single tenant
export const useGetSingleTenantDetails = (tenantId: string) => {
  return useQuery<TenantResponse, Error>({
    queryKey: ['tenant', tenantId],
    queryFn: () =>
      get({
        url: `api/v1/user/tenant/${tenantId}`,
      }),
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Create tenant
export const useCreateTenant = () => {
  const queryClient = useQueryClient();
  
  return useMutation<TenantResponse, Error, CreateTenantData>({
    mutationFn: (tenantData: CreateTenantData) =>
      postWithToken({
        url: "api/v1/user/tenant/register",
        body: tenantData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
};

// Update tenant
export const useUpdateTenant = () => {
  const queryClient = useQueryClient();
  
  return useMutation<TenantResponse, Error, { id: string; data: UpdateTenantData }>({
    mutationFn: ({ id, data }) =>
      put({
        url: `api/v1/user/tenant/${id}`,
        body: data,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['tenant', variables.id] });
    },
  });
};

// Validate tenant
export const useValidateTenant = () => {
  return useMutation<ValidateTenantResponse, Error, Record<string, string | number>>({
    mutationFn: (data) =>
      postWithToken({
        url: `api/v1/user/tenant/validate`,
        body: data,
      }),
  });
};

// Update tenant status
export const useUpdateTenantStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation<TenantResponse, Error, { tenantId: string; status: string }>({
    mutationFn: ({ tenantId, status }) =>
      patch({
        url: `api/v1/user/tenant/update-status/${tenantId}`,
        body: { status },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['tenant'] });
    },
  });
};
