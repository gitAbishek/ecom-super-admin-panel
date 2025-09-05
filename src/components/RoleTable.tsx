import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Shield, Users } from 'lucide-react';
import { getValue } from '@/utils/object';
import type { Role } from '@/types/role';

export interface RoleTableProps {
  data: Role[];
  onView: (role: Role) => void;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export default function RoleTable({ 
  data, 
  onView, 
  onEdit,
  onDelete
}: RoleTableProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };

  const getRoleTypeColor = (isSystemRole: boolean) => {
    return isSystemRole
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
  };

  const getRoleTypeText = (isSystemRole: boolean) => {
    return isSystemRole ? 'System' : 'Custom';
  };

  if (!data || data.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
          <div className="flex flex-col items-center space-y-2">
            <Shield className="h-8 w-8 text-gray-400" />
            <span>No roles found</span>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <>
      {data.map((role) => (
        <tr 
          key={role._id} 
          className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
        >
          {/* Role Info */}
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {getValue(role, 'label') || 'N/A'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                  {getValue(role, 'description') || 'No description'}
                </div>
              </div>
            </div>
          </td>

          {/* Permissions */}
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-900 dark:text-gray-100">
                {role.permissions ? role.permissions.length : 0} permissions
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {role.permissions && role.permissions.length > 0 
                ? role.permissions.slice(0, 2).join(', ') + (role.permissions.length > 2 ? '...' : '')
                : 'No permissions'
              }
            </div>
          </td>

          {/* Type */}
          <td className="px-4 py-4 whitespace-nowrap">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleTypeColor(role.isSystemRole)}`}>
              {getRoleTypeText(role.isSystemRole)}
            </span>
          </td>

          {/* Status */}
          <td className="px-4 py-4 whitespace-nowrap">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(role.isActive)}`}>
              {getStatusText(role.isActive)}
            </span>
          </td>

          {/* Created */}
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            {formatDate(getValue(role, 'createdAt'))}
          </td>

          {/* Actions */}
          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(role)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Eye className="h-4 w-4 text-gray-500 hover:text-blue-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(role)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Edit className="h-4 w-4 text-gray-500 hover:text-blue-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(role)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
