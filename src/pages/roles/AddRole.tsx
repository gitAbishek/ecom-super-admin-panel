import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomBackHeader from '@/components/common/CustomBackHeader';
import CustomLoader from '@/components/loader/CustomLoader';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import { Shield, Save, AlertCircle } from 'lucide-react';
import { useCreateRole } from '@/hooks/role.hook';
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

export default function AddRole() {
  const navigate = useNavigate();
  const createRoleMutation = useCreateRole();
  const { data: permissionsData, isLoading: permissionsLoading, error: permissionsError } = useGetAllPermissions();

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

  const onSubmit = async (data: RoleFormData) => {
    try {
      await createRoleMutation.mutateAsync(data);
      showSuccessMessage('Role created successfully!');
      navigate('/roles');
    } catch (error) {
      console.error('Error creating role:', error);
      showErrorMessage('Failed to create role. Please try again.');
    }
  };

  // Loading state for permissions
  if (permissionsLoading) {
    return (
      <div className="p-6">
        <CustomBackHeader
          title="Add New Role"
          description="Create a new role with specific permissions"
          onBack={() => navigate('/roles')}
        />
        <CustomLoader text="Loading permissions..." />
      </div>
    );
  }

  // Error state for permissions
  if (permissionsError) {
    return (
      <div className="p-6">
        <CustomBackHeader
          title="Add New Role"
          description="Create a new role with specific permissions"
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

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto" >
      <CustomBackHeader
        title="Add New Role"
        description="Create a new role with specific permissions"
        onBack={() => navigate('/roles')}
      />

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
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
              disabled={createRoleMutation.isPending}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{createRoleMutation.isPending ? 'Creating...' : 'Create Role'}</span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
