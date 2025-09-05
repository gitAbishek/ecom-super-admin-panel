// Tenant type definitions

export interface TenantMetafield {
  industry: string;
  employees: number;
}

export interface Tenant {
  _id: string;
  tenant_id: string;
  name: string;
  email: string;
  domain: string;
  admin_domain: string;
  metafield: TenantMetafield;
  status: 'active' | 'inactive' | 'suspended';
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateTenantData {
  name: string;
  domain: string;
  admin_domain: string;
  metafield: TenantMetafield;
  email: string;
  password: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface UpdateTenantData {
  name: string;
  domain: string;
  admin_domain: string;
  metafield: TenantMetafield;
  email: string;
}

export interface UpdateTenantStatusData {
  status: 'active' | 'inactive' | 'suspended';
}

export interface TenantsResponse {
  success: boolean;
  data: {
    totalPages: number;
    totalCount: number;
    currentPage: number;
    results: Tenant[];
  };
}

export interface TenantResponse {
  success: boolean;
  tenant: Tenant;
}

export interface ValidateTenantResponse {
  success: boolean;
  isValid: boolean;
  message?: string;
}
