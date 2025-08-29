// Staff interface for table display
export interface StaffType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: string;
  isActive: boolean;
  joiningDate: string;
  createdAt: string;
  updatedAt: string;
}

// Staff creation interface
export interface CreateStaffData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  isActive: boolean;
}

// Staff update interface
export interface UpdateStaffData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  isActive?: boolean;
}
