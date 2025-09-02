// Permission type definitions for role management

export interface Permission {
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

export interface PermissionsResponse {
  success: boolean;
  data: Permission[];
  message: string;
}
