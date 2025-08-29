// Permission interface for table display
export interface PermissionType {
  _id: string;
  name: string;
  resource: string;
  actions: string[];
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Permission creation interface
export interface CreatePermissionData {
  name: string;
  resource: string;
  actions: string[];
  description: string;
  isActive: boolean;
}

// Permission update interface
export interface UpdatePermissionData {
  name?: string;
  resource?: string;
  actions?: string[];
  description?: string;
  isActive?: boolean;
}
