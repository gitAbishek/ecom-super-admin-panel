import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Shield, Edit, Users, Calendar, Settings2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomLoader from "@/components/loader/CustomLoader";
import CustomBackHeader from "@/components/common/CustomBackHeader";
import { useGetSingleRoleDetails } from "@/hooks/role.hook";
import type { Role } from "@/types/role";

const ViewRole = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);

  const { data: roleData, isLoading } = useGetSingleRoleDetails(id || "");

  useEffect(() => {
    if (roleData?.role && id) {
      setRole(roleData.role);
    }
  }, [roleData, id]);

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
    return isSystemRole ? 'System Role' : 'Custom Role';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPermissions = (permissions: string[]) => {
    if (!permissions || permissions.length === 0) return 'No permissions assigned';
    
    return permissions.map(permission => {
      const [resource, action] = permission.split(':');
      return {
        resource: resource.charAt(0).toUpperCase() + resource.slice(1),
        action: action === '*' ? 'All Actions' : action.charAt(0).toUpperCase() + action.slice(1),
        full: permission
      };
    });
  };

  if (isLoading) {
    return <CustomLoader text="Loading role details..." />;
  }

  if (!role) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Role not found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            The role you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate('/roles')}>
            Back to Roles
          </Button>
        </div>
      </div>
    );
  }

  const formattedPermissions = formatPermissions(role.permissions);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <CustomBackHeader 
          title="Role Details" 
          onBack={() => navigate('/roles')}
        />
      </div>

      <div className="space-y-6">
        {/* Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 capitalize">
                    {role.label}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {role.description}
                  </p>
                  <div className="flex items-center space-x-3 mt-3">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(role.isActive)}`}>
                      {getStatusText(role.isActive)}
                    </span>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRoleTypeColor(role.isSystemRole)}`}>
                      {getRoleTypeText(role.isSystemRole)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/roles/edit/${role._id}`)}
                  className="flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Role</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Role Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings2 className="h-5 w-5" />
                  <span>Role Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Role Name
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium capitalize">
                      {role.label}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Admin Access
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {role.adminAccess ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Description
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {role.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Permissions ({role.permissions.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(formattedPermissions) && formattedPermissions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formattedPermissions.map((permission, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {permission.resource}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {permission.action}
                          </p>
                        </div>
                        <code className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                          {permission.full}
                        </code>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No permissions assigned to this role
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Metadata */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Metadata</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Created At
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 text-sm">
                    {formatDate(role.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Last Updated
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 text-sm">
                    {formatDate(role.updatedAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Role ID
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 text-sm font-mono">
                    {role._id}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRole;
