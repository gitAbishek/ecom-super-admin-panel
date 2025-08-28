import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomBackHeader from '@/components/common/CustomBackHeader';
import CustomLoader from '@/components/loader/CustomLoader';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import { Shield, Edit, Clock, User, Settings } from 'lucide-react';
import { useGetSingleRoleDetails } from '@/hooks/role.hook';
import { getValue } from '@/utils/object';

export default function ViewRole() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetSingleRoleDetails(id || '');

  if (isLoading) return <CustomLoader text="Loading role details..." />;
  if (error) return (
    <CustomEmptyState
      icon={<Shield className="h-12 w-12 text-gray-400" />}
      title="Error loading role"
      description="There was an error loading the role details."
    />
  );

  // Extract role from the nested API response structure
  const role = getValue(data, 'role') || data || {};
  
  // Check if role data is actually null or empty
  const hasRoleData = data && (getValue(data, 'role') !== null || Object.keys(data).length > 0);

  if (!hasRoleData && !isLoading) {
    return (
      <div className="p-6">
        <CustomBackHeader
          title="Role Details"
          description="View detailed information about this role"
          onBack={() => navigate('/roles')}
        />
        <CustomEmptyState
          icon={<Shield className="h-12 w-12 text-gray-400" />}
          title="Role not found"
          description="The requested role could not be found. It may have been deleted or you may not have permission to access it."
        />
      </div>
    );
  }

  const label = getValue(role, 'label') || 'N/A';
  const description = getValue(role, 'description') || 'No description provided';
  const permissions = getValue(role, 'permissions') as string[] || [];
  const isActive = getValue(role, 'isActive') !== false;
  const adminAccess = getValue(role, 'adminAccess') === true;
  const isSystemRole = getValue(role, 'isSystemRole') === true;
  const createdAt = getValue(role, 'createdAt');
  const updatedAt = getValue(role, 'updatedAt');
  const tenant = getValue(role, 'tenant');

  const formatDate = (dateString: unknown) => {
    if (!dateString) return 'N/A';
    return new Date(dateString as string).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const groupPermissionsByCategory = (permissions: string[]) => {
    const groups: Record<string, string[]> = {};
    
    permissions.forEach(permission => {
      const [category] = permission.split(':');
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
    });

    return groups;
  };

  const permissionGroups = groupPermissionsByCategory(permissions);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <CustomBackHeader
        title="Role Details"
        description="View detailed information about this role"
        onBack={() => navigate('/roles')}
        editButton={{
          onEdit: () => navigate(`/roles/edit/${id}`),
          text: "Edit Role",
          icon: <Edit className="h-4 w-4" />
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Role Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Role Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Role Label
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {label}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Status
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                    {adminAccess && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        Admin Access
                      </span>
                    )}
                    {isSystemRole && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                        System Role
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Description
                </label>
                <p className="text-gray-900 dark:text-white">
                  {description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Permissions</span>
                </div>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  {permissions.length} total
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {permissions.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No permissions assigned to this role
                </p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(permissionGroups).map(([category, perms]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                        {category} ({perms.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {perms.map((permission) => (
                          <div
                            key={permission}
                            className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-900 dark:text-white font-mono">
                              {permission}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Created
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatDate(createdAt)}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Last Updated
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatDate(updatedAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tenant Information */}
          {tenant && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Tenant</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-900 dark:text-white font-mono">
                  {tenant}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total Permissions</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {permissions.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Permission Categories</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {Object.keys(permissionGroups).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Admin Access</span>
                <span className={`text-sm font-semibold ${
                  adminAccess ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {adminAccess ? 'Yes' : 'No'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
