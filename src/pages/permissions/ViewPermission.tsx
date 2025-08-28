import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Shield, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomLoader from '@/components/loader/CustomLoader';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import CustomBackHeader from '@/components/common/CustomBackHeader';
import { useGetSinglePermissionDetails } from '@/hooks/permission.hook';
import { getValue } from '@/utils/object';

export default function ViewPermission() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetSinglePermissionDetails(id!);

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const handleEdit = () => {
    navigate(`/permissions/edit/${id}`);
  };

  if (isLoading) {
    return <CustomLoader text="Loading permission details..." />;
  }

  if (error || !data) {
    return (
      <CustomEmptyState
        icon={<Shield className="h-12 w-12 text-gray-400" />}
        title="Permission not found"
        description="The permission you're looking for doesn't exist or has been removed."
      />
    );
  }

  // Extract permission data from API response
  const permissionData = getValue(data, 'data') as Record<string, unknown>;
  const permission = {
    _id: getValue(permissionData, '_id') as string,
    resource: getValue(permissionData, 'resource') as string,
    action: getValue(permissionData, 'action') as string,
    description: getValue(permissionData, 'description') as string,
    isActive: getValue(permissionData, 'isActive') as boolean,
    isDeleted: getValue(permissionData, 'isDeleted') as boolean,
    createdAt: getValue(permissionData, 'createdAt') as string,
    updatedAt: getValue(permissionData, 'updatedAt') as string,
    permission: getValue(permissionData, 'permission') as string,
    id: getValue(permissionData, 'id') as string,
    __v: getValue(permissionData, '__v') as number,
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <CustomBackHeader
        title="Permission Details"
        description="View and manage permission information"
        onBack={() => navigate('/permissions')}
        editButton={{
          onEdit: handleEdit,
          text: "Edit Permission",
          icon: <Edit className="h-4 w-4" />
        }}
      />

      {/* Permission Information */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
          <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
            <Shield className="h-5 w-5" />
            <span>Permission Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 bg-white dark:bg-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Permission Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Permission</label>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                <p className="text-sm font-mono text-gray-900 dark:text-white">{permission.permission}</p>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <div className="flex items-center space-x-2">
                {permission.isActive ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-xs font-medium rounded-full border dark:border-green-700">
                      Active
                    </span>
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 text-red-500" />
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 text-xs font-medium rounded-full border dark:border-red-700">
                      Inactive
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Resource */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Resource</label>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                <p className="text-sm text-gray-900 dark:text-white capitalize">{permission.resource}</p>
              </div>
            </div>

            {/* Action */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Action</label>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                <p className="text-sm text-gray-900 dark:text-white capitalize">{permission.action}</p>
              </div>
            </div>

            {/* Created Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Created Date</label>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                <p className="text-sm text-gray-900 dark:text-white">{formatDate(permission.createdAt)}</p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</label>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                <p className="text-sm text-gray-900 dark:text-white">{formatDate(permission.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
              <p className="text-sm text-gray-900 dark:text-white">{permission.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
          <CardTitle className="text-gray-900 dark:text-white">System Information</CardTitle>
        </CardHeader>
        <CardContent className="bg-white dark:bg-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Permission ID:</span>
              <p className="text-gray-600 dark:text-gray-400 font-mono break-all">{permission._id}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Version:</span>
              <p className="text-gray-600 dark:text-gray-400">{permission.__v}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Deleted:</span>
              <p className="text-gray-600 dark:text-gray-400">{permission.isDeleted ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
