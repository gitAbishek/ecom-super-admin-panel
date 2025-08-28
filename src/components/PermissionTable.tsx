import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, UserCheck } from 'lucide-react';
import { getValue } from '@/utils/object';

export interface Permission {
  _id: string;
  resource: string;
  action: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  permission: string;
  id: string;
  __v: number;
}

export interface PermissionTableProps {
  data: Permission[];
  onView: (permission: Permission) => void;
  onEdit: (permission: Permission) => void;
  onDelete: (permission: Permission) => void;
}

export default function PermissionTable({ data, onView, onEdit, onDelete }: PermissionTableProps) {
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
      {data.map((permission) => (
        <tr key={permission._id}>
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {getValue(permission, 'permission') || `${permission.resource}:${permission.action}`}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {permission.description && (
                    <span className="max-w-xs truncate block">{permission.description}</span>
                  )}
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                    permission.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {permission.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {permission.action}
            </span>
          </td>
          <td className="px-4 py-4 whitespace-nowrap">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {permission.resource}
            </span>
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {formatDate(permission.createdAt)}
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-right">
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(permission)}
                className="h-8 w-8 p-0"
                title="View permission"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(permission)}
                className="h-8 w-8 p-0"
                title="Edit permission"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(permission)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                title="Delete permission"
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
