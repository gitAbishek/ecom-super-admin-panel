import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Shield } from 'lucide-react';
import { getValue } from '@/utils/object';
import type { RoleType } from '@/types/role';

export interface RoleTableProps {
  data: RoleType[];
  onView: (role: RoleType) => void;
  onEdit: (role: RoleType) => void;
  onDelete: (role: RoleType) => void;
}

export default function RoleTable({ data, onView, onEdit, onDelete }: RoleTableProps) {
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
      {data.map((role) => (
        <tr key={role._id}>
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {getValue(role, 'label') || 'N/A'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    getValue(role, 'isActive') !== false
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {getValue(role, 'isActive') !== false ? 'Active' : 'Inactive'}
                  </span>
                  {getValue(role, 'adminAccess') && (
                    <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      Admin
                    </span>
                  )}
                  {getValue(role, 'isSystemRole') && (
                    <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                      System
                    </span>
                  )}
                </div>
              </div>
            </div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900 dark:text-white max-w-xs">
              <span className="block truncate">
                {getValue(role, 'description') || 'No description'}
              </span>
            </div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900 dark:text-white">
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                {(getValue(role, 'permissions') as string[])?.length || 0} permissions
              </span>
            </div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              getValue(role, 'isActive') !== false
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {getValue(role, 'isActive') !== false ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {formatDate(getValue(role, 'createdAt') as string)}
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-right">
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(role)}
                className="h-8 w-8 p-0"
                title="View role"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(role)}
                className="h-8 w-8 p-0"
                title="Edit role"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(role)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                title="Delete role"
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
