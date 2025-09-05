export interface Role {
  _id: string;
  tenant?: string;
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

export interface RolesResponse {
  success: boolean;
  roles: {
    totalPages: number;
    totalCount: number;
    currentPage: number;
    results: Role[];
  };
}

export interface RoleResponse {
  success: boolean;
  role: Role;
}

export interface CreateRoleData {
  label: string;
  description: string;
  permissions: string[];
  isActive: boolean;
}

export interface UpdateRoleData {
  label: string;
  description: string;
  permissions: string[];
  isActive: boolean;
}

export interface GetAllRolesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}
