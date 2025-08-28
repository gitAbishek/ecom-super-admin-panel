import { get, put, deleteApi, postWithToken } from "@/api/client";
import { useMutation, useQuery } from "@tanstack/react-query";

// Staff types
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface CreateStaffData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  department: string;
  jobTitle: string;
  employmentStatus: string;
  hireDate: string;
  role: string;
  emergencyContact: EmergencyContact;
}

export interface UpdateStaffData {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  department?: string;
  jobTitle?: string;
  employmentStatus?: string;
  hireDate?: string;
  role?: string;
  emergencyContact?: EmergencyContact;
  isActive?: boolean;
}

export interface StaffUser {
  _id: string;
  email: string;
  status: string;
}

export interface StaffRole {
  _id: string;
  label: string;
  permissions?: string[];
  scopes?: string[];
}

export interface StaffTenant {
  _id: string;
  name: string;
}

export interface Staff {
  _id: string;
  userId: StaffUser;
  tenantId: string | StaffTenant;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: StaffRole;
  department: string;
  jobTitle: string;
  isActive: boolean;
  isVerified: boolean;
  employmentStatus: string;
  hireDate: string;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  fullName: string;
  id: string;
  emergencyContact: EmergencyContact;
}

export interface StaffListResponse {
  success: boolean;
  data: {
    totalPages: number;
    totalCount: number;
    currentPage: number;
    results: Staff[];
  };
}

export interface StaffDetailsResponse {
  success: boolean;
  data: Staff;
}

// Get list of staff
export const useGetAllStaff = () => {
  return useQuery({
    queryKey: ["staff"],
    queryFn: () =>
      get({
        url: "api/v1/user/staff",
      }),
  });
};

// Get single staff details
export const useGetSingleStaffDetails = (id: string) =>
  useQuery({
    queryKey: ["staff", id],
    queryFn: () =>
      get({
        url: `api/v1/user/staff/${id}`,
      }),
    enabled: !!id,
  });

// Create staff
export const useCreateStaff = () =>
  useMutation({
    mutationFn: (body: CreateStaffData) =>
      postWithToken({
        url: "api/v1/user/staff",
        body,
      }),
  });

// Update staff
export const useUpdateStaff = () =>
  useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateStaffData }) =>
      put({
        url: `api/v1/user/staff/${id}`,
        body,
      }),
  });

// Delete staff
export const useDeleteStaff = () =>
  useMutation({
    mutationFn: (id: string) =>
      deleteApi({
        url: `api/v1/user/staff/${id}`,
      }),
  });
