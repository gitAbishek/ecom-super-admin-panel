import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, User } from 'lucide-react';
import { getValue } from '@/utils/object';
import type { StaffType } from '@/types/staff';

export interface StaffTableProps {
  data: StaffType[];
  onView: (staff: StaffType) => void;
  onEdit: (staff: StaffType) => void;
  onDelete: (staff: StaffType) => void;
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
          {/* Staff Member */}
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {`${getValue(staff, 'firstName')} ${getValue(staff, 'lastName')}`.trim() || 'N/A'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {getValue(staff, 'email') || 'N/A'}
                </div>
              </div>
            </div>
          </td>
          
          {/* Email */}
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900 dark:text-white">
              {getValue(staff, 'email') || 'N/A'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {getValue(staff, 'phone') || 'N/A'}
            </div>
          </td>

          {/* Role */}
          <td className="px-4 py-4 whitespace-nowrap">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {getValue(staff, 'role') || 'N/A'}
            </span>
          </td>

          {/* Department */}
          <td className="px-4 py-4 whitespace-nowrap">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {getValue(staff, 'department') || 'N/A'}
            </span>
          </td>

          {/* Status */}
          <td className="px-4 py-4 whitespace-nowrap">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              getValue(staff, 'isActive') !== false
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {getValue(staff, 'status') || (getValue(staff, 'isActive') ? 'Active' : 'Inactive')}
            </span>
          </td>

          {/* Joined */}
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {formatDate(getValue(staff, 'joiningDate') as string)}
          </td>

          {/* Actions */}
          <td className="px-4 py-4 whitespace-nowrap text-right">
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(staff)}
                className="h-8 w-8 p-0"
                title="View staff"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(staff)}
                className="h-8 w-8 p-0"
                title="Edit staff"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(staff)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                title="Delete staff"
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
