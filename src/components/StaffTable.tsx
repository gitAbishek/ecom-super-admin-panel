import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, User, Check, X } from 'lucide-react';
import { getValue } from '@/utils/object';

export interface Staff {
  _id: string;
  userId: {
    _id: string;
    email: string;
    status: string;
  };
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: {
    _id: string;
    label: string;
  };
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
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface StaffTableProps {
  data: Staff[];
  onView: (staff: Staff) => void;
  onEdit: (staff: Staff) => void;
  onDelete: (staff: Staff) => void;
}

export default function StaffTable({ data, onView, onEdit, onDelete }: StaffTableProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      {data.map((staff) => (
        <tr key={staff._id}>
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {staff.fullName || `${staff.firstName} ${staff.lastName}`}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {staff.email}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {staff.jobTitle} • {staff.department}
                </div>
              </div>
            </div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {getValue(staff.role, 'label') || 'No Role'}
            </span>
          </td>
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900 dark:text-white">{staff.mobile}</div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="flex flex-col space-y-1">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                staff.employmentStatus === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : staff.employmentStatus === 'inactive'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {staff.employmentStatus}
              </span>
              <div className="flex items-center space-x-1">
                {staff.isActive ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <X className="h-3 w-3 text-red-500" />
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {staff.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {formatDate(staff.hireDate)}
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-right">
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(staff)}
                className="h-8 w-8 p-0"
                title="View staff member"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(staff)}
                className="h-8 w-8 p-0"
                title="Edit staff member"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(staff)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                title="Delete staff member"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}