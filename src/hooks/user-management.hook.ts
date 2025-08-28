import { get, post, put, deleteApi, postWithToken } from "@/api/client";
import { useMutation, useQuery } from "@tanstack/react-query";

// Role Permission Hooks

// Get list of roles
export const useGetAllRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () =>
      get({
        url: "api/v1/roles/",
      }),
  });
};

// Get single role details
export const useGetSingleRoleDetails = (id: string) =>
  useQuery({
    queryKey: ["roles", id],
    queryFn: () =>
      get({
        url: `api/v1/roles/${id}`,
      }),
    enabled: !!id,
  });

// Create role
export const useCreateRole = () =>
  useMutation({
    mutationFn: (body: object) =>
      postWithToken({
        url: "api/v1/roles",
        body,
      }),
  });

// Update role
export const useUpdateRole = () =>
  useMutation({
    mutationFn: ({ id, body }: { id: string; body: object }) =>
      put({
        url: `api/v1/roles/${id}`,
        body,
      }),
  });

// Delete role
export const useDeleteRole = () =>
  useMutation({
    mutationFn: (id: string) =>
      deleteApi({
        url: `api/v1/roles/${id}`,
      }),
  });

// Staff Management Hooks

// Get list of staff members
export const useGetAllStaff = () => {
  return useQuery({
    queryKey: ["staff"],
    queryFn: () =>
      get({
        url: "api/v1/staff/",
      }),
  });
};

// Get single staff member details
export const useGetSingleStaffDetails = (id: string) =>
  useQuery({
    queryKey: ["staff", id],
    queryFn: () =>
      get({
        url: `api/v1/staff/${id}`,
      }),
    enabled: !!id,
  });

// Create staff member
export const useCreateStaff = () =>
  useMutation({
    mutationFn: (body: object) =>
      post({
        url: "api/v1/staff",
        body,
      }),
  });

// Update staff member
export const useUpdateStaff = () =>
  useMutation({
    mutationFn: ({ id, body }: { id: string; body: object }) =>
      put({
        url: `api/v1/staff/${id}`,
        body,
      }),
  });

// Delete staff member
export const useDeleteStaff = () =>
  useMutation({
    mutationFn: (id: string) =>
      deleteApi({
        url: `api/v1/staff/${id}`,
      }),
  });
