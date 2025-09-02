// Mock permission hook for role management
// This provides minimal permission functionality needed for roles to work

import { useQuery } from '@tanstack/react-query';

// Mock permission data structure
interface Permission {
  _id: string;
  name: string;
  description: string;
  module: string;
  action: string;
  resource: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock permissions data
const mockPermissions: Permission[] = [
  {
    _id: '1',
    name: 'View Dashboard',
    description: 'Can view the dashboard',
    module: 'Dashboard',
    action: 'read',
    resource: 'dashboard',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    _id: '2',
    name: 'Manage Roles',
    description: 'Can create, edit, and delete roles',
    module: 'User Management',
    action: 'write',
    resource: 'roles',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    _id: '3',
    name: 'View Settings',
    description: 'Can view application settings',
    module: 'Settings',
    action: 'read',
    resource: 'settings',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    _id: '4',
    name: 'Manage Notifications',
    description: 'Can manage notifications',
    module: 'Notifications',
    action: 'write',
    resource: 'notifications',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Mock API response structure
interface PermissionsResponse {
  success: boolean;
  data: Permission[];
  message: string;
}

// Hook to get all permissions
export const useGetAllPermissions = () => {
  return useQuery<PermissionsResponse, Error>({
    queryKey: ['permissions'],
    queryFn: async (): Promise<PermissionsResponse> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        data: mockPermissions,
        message: 'Permissions fetched successfully',
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
