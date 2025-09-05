import { Button } from '@/components/ui/button';
import { Eye, Edit, Building2 } from 'lucide-react';
import { getValue } from '@/utils/object';
import type { Tenant } from '@/types/tenant';

export interface TenantTableProps {
  data: Tenant[];
  onView: (tenant: Tenant) => void;
  onEdit: (tenant: Tenant) => void;
}

export default function TenantTable({ 
  data, 
  onView, 
  onEdit
}: TenantTableProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            Inactive
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <>
      {data.map((tenant) => (
        <tr key={tenant._id}>
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {getValue(tenant, 'name') || 'N/A'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ID: {getValue(tenant, 'tenant_id')?.slice(0, 8) || 'N/A'}...
                </div>
              </div>
            </div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900 dark:text-white">
              {getValue(tenant, 'email') || 'N/A'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {getValue(tenant, 'domain') || 'N/A'}
            </div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900 dark:text-white">
              {getValue(tenant, 'metafield.industry') || 'N/A'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {getValue(tenant, 'metafield.employees') || 0} employees
            </div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap">
            {getStatusBadge(getValue(tenant, 'status') || 'unknown')}
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            {formatDate(getValue(tenant, 'createdAt'))}
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(tenant)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Eye className="h-4 w-4 text-gray-500 hover:text-blue-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(tenant)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Edit className="h-4 w-4 text-gray-500 hover:text-blue-600" />
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
