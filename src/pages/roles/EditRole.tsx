import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomBackHeader from '@/components/common/CustomBackHeader';
import CustomLoader from '@/components/loader/CustomLoader';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import { Shield, Save, AlertCircle } from 'lucide-react';
import { useGetSingleRoleDetails, useUpdateRole } from '@/hooks/role.hook';
import { useGetAllPermissions } from '@/hooks/permission.hook';
import { CustomInput, CustomLabel, CustomTextArea, CustomMultiSelectCheckbox } from '@/components/form';
import { Button } from '@/components/ui/button';
import { getValue } from '@/utils/object';
import { showSuccessMessage, showErrorMessage } from '@/utils/toast';

interface RoleFormData {
  label: string;
  description: string;
  permissions: string[];
  isActive: boolean;
}

export default function EditRole() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetSingleRoleDetails(id || '');
  const { data: permissionsData, isLoading: permissionsLoading, error: permissionsError } = useGetAllPermissions();
  const updateRoleMutation = useUpdateRole();

  // Transform permissions data for the multi-select component
  const permissionOptions = useMemo(() => {
    if (!permissionsData) return [];
    
    const permissions = getValue(permissionsData, 'data') as Array<Record<string, unknown>> || [];
    
    return permissions
      .filter((permission) => getValue(permission, 'isActive') === true)
      .map((permission) => ({
        value: getValue(permission, 'permission') as string || '',
        label: `${getValue(permission, 'description') || getValue(permission, 'permission')}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [permissionsData]);

  const methods = useForm<RoleFormData>({
    defaultValues: {
      label: '',
      description: '',
      permissions: [],
      isActive: true,
    },
  });

  useEffect(() => {
    if (data) {
      // Extract role from the nested API response structure
      const role = getValue(data, 'role') || data;
      
      // Only update if role is not null
      if (role) {
        methods.reset({
          label: getValue(role, 'label') || '',
          description: getValue(role, 'description') || '',
          permissions: getValue(role, 'permissions') as string[] || [],
          isActive: getValue(role, 'isActive') !== false,
        });
      }
    }
  }, [data, methods]);

  // Loading states
  if (isLoading || permissionsLoading) {
    return (
      <div className="p-6">
        <CustomBackHeader
          title="Edit Role"
          description="Update role information and permissions"
          onBack={() => navigate('/roles')}
        />
        <CustomLoader text={isLoading ? "Loading role details..." : "Loading permissions..."} />
      </div>
    );
  }

  // Error states
  if (error) {
    return (
      <div className="p-6">
        <CustomBackHeader
          title="Edit Role"
          description="Update role information and permissions"
          onBack={() => navigate('/roles')}
        />
        <CustomEmptyState
          icon={<Shield className="h-12 w-12 text-gray-400" />}
          title="Error loading role"
          description="There was an error loading the role details."
        />
      </div>
    );
  }

  if (permissionsError) {
    return (
      <div className="p-6">
        <CustomBackHeader
          title="Edit Role"
          description="Update role information and permissions"
          onBack={() => navigate('/roles')}
        />
        <CustomEmptyState
          icon={<AlertCircle className="h-12 w-12 text-gray-400" />}
          title="Error loading permissions"
          description="There was an error loading the permissions data. Please try again."
        />
      </div>
    );
  }

  // Extract role from the nested API response structure
  const role = getValue(data, 'role') || data || {};
  const isSystemRole = getValue(role, 'isSystemRole') === true;

  // Check if role data is actually null or empty
  const hasRoleData = data && (getValue(data, 'role') !== null || Object.keys(data).length > 0);

  if (!hasRoleData && !isLoading) {
    return (
      <div className="p-6">
        <CustomBackHeader
          title="Edit Role"
          description="Update role information and permissions"
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

  const onSubmit = async (formData: RoleFormData) => {
    if (!id) {
      showErrorMessage('Role ID is missing');
      return;
    }

    try {
      await updateRoleMutation.mutateAsync({ id, body: formData });
      showSuccessMessage('Role updated successfully!');
      navigate('/roles');
    } catch (error) {
      console.error('Error updating role:', error);
      showErrorMessage('Failed to update role. Please try again.');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <CustomBackHeader
        title="Edit Role"
        description="Update role information and permissions"
        onBack={() => navigate('/roles')}
      />

      {isSystemRole && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 dark:bg-yellow-900/20 dark:border-yellow-800">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <span className="font-semibold">System Role:</span> This is a system-defined role. Some fields may be restricted.
            </p>
          </div>
        </div>
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Role Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Role Label */}
              <div>
                <CustomLabel htmlFor="label" required>
                  Role Label
                </CustomLabel>
                <CustomInput
                  name="label"
                  type="text"
                  placeHolder="e.g., inventory_manager"
                  required
                  disabled={isSystemRole}
                />
              </div>

              {/* Description */}
              <div>
                <CustomLabel htmlFor="description">
                  Description
                </CustomLabel>
                <CustomTextArea
                  name="description"
                  placeHolder="Describe the role's responsibilities..."
                  rows={3}
                />
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...methods.register('isActive')}
                  disabled={isSystemRole}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
                />
                <CustomLabel htmlFor="isActive" className="mb-0">
                  Active Role
                </CustomLabel>
              </div>
            </CardContent>
          </Card>

          {/* Permissions Section */}
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomLabel>
                Select Permissions
              </CustomLabel>
              <CustomMultiSelectCheckbox
                name="permissions"
                options={permissionOptions}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/roles')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateRoleMutation.isPending}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{updateRoleMutation.isPending ? 'Updating...' : 'Update Role'}</span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
