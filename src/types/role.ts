// Role interface for table display
export interface RoleType {
  _id: string;
  label: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  adminAccess: boolean;
  isSystemRole: boolean;
  scopes: string[];
  createdAt: string;
  updatedAt: string;
}

// Role creation interface
export interface CreateRoleData {
  label: string;
  description: string;
  permissions: string[];
  isActive: boolean;
}

// Role update interface
export interface UpdateRoleData {
  label?: string;
  description?: string;
  permissions?: string[];
  isActive?: boolean;
}
