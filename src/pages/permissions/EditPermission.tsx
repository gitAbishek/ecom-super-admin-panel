import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CustomInput from '@/components/form/CustomInput';
import CustomTextArea from '@/components/form/CustomTextArea';
import CustomSelect from '@/components/form/CustomSelect';
import CustomLabel from '@/components/form/CustomLabel';
import CustomLoader from '@/components/loader/CustomLoader';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import CustomBackHeader from '@/components/common/CustomBackHeader';
import { Shield } from 'lucide-react';
import { useGetSinglePermissionDetails, useUpdatePermission } from '@/hooks/permission.hook';
import { getValue } from '@/utils/object';
import { showSuccessMessage, showErrorMessage } from '@/utils/toast';
import { useEffect } from 'react';

interface EditPermissionFormData {
  resource: string;
  action: string;
  description: string;
  isActive: string;
  customResource?: string;
  customAction?: string;
}

export default function EditPermission() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const updatePermissionMutation = useUpdatePermission();

  const { data, isLoading, error } = useGetSinglePermissionDetails(id!);

  const methods = useForm<EditPermissionFormData>({
    defaultValues: {
      resource: '',
      action: '',
      description: '',
      isActive: 'true',
    },
  });

  const { handleSubmit, formState: { isSubmitting }, reset } = methods;

  // Populate form when data is loaded
  useEffect(() => {
    if (data) {
      const permissionData = getValue(data, 'data') as Record<string, unknown>;
      const resource = getValue(permissionData, 'resource') as string;
      const action = getValue(permissionData, 'action') as string;
      const description = getValue(permissionData, 'description') as string;
      const isActive = getValue(permissionData, 'isActive') as boolean;

      reset({
        resource,
        action,
        description,
        isActive: isActive ? 'true' : 'false',
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: EditPermissionFormData) => {
    if (!id) return;

    try {
      const payload = {
        resource: formData.customResource || formData.resource,
        action: formData.customAction || formData.action,
        description: formData.description,
        isActive: formData.isActive === 'true',
      };

      await updatePermissionMutation.mutateAsync({ id, body: payload });
      showSuccessMessage('Permission updated successfully!');
      navigate('/permissions');
    } catch (error) {
      console.error('Error updating permission:', error);
      showErrorMessage('Failed to update permission. Please try again.');
    }
  };

  const commonResources = [
    { value: 'product', label: 'Product' },
    { value: 'order', label: 'Order' },
    { value: 'user', label: 'User' },
    { value: 'role', label: 'Role' },
    { value: 'permission', label: 'Permission' },
    { value: 'payment', label: 'Payment' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'category', label: 'Category' },
    { value: 'campaign', label: 'Campaign' },
    { value: 'coupon', label: 'Coupon' },
    { value: 'customer', label: 'Customer' },
    { value: 'staff', label: 'Staff' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'settings', label: 'Settings' },
  ];

  const commonActions = [
    { value: 'create', label: 'Create' },
    { value: 'read', label: 'Read' },
    { value: 'update', label: 'Update' },
    { value: 'delete', label: 'Delete' },
    { value: 'list', label: 'List' },
    { value: 'view', label: 'View' },
    { value: 'manage', label: 'Manage' },
    { value: 'approve', label: 'Approve' },
    { value: 'reject', label: 'Reject' },
    { value: 'export', label: 'Export' },
    { value: 'import', label: 'Import' },
  ];

  const statusOptions = [
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
  ];

  if (isLoading) {
    return <CustomLoader text="Loading permission details..." />;
  }

  if (error || !data) {
    return (
      <CustomEmptyState
        icon={<Shield className="h-12 w-12 text-gray-400" />}
        title="Permission not found"
        description="The permission you're trying to edit doesn't exist or has been removed."
      />
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <CustomBackHeader
        title="Edit Permission"
        description="Update permission information and settings"
        onBack={() => navigate(`/permissions/view/${id}`)}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Permission Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Resource */}
                <div className="space-y-2">
                  <CustomLabel required>Resource</CustomLabel>
                  <CustomSelect
                    name="resource"
                    placeHolder="Select a resource"
                    options={commonResources}
                    required
                  />
                </div>

                {/* Action */}
                <div className="space-y-2">
                  <CustomLabel required>Action</CustomLabel>
                  <CustomSelect
                    name="action"
                    placeHolder="Select an action"
                    options={commonActions}
                    required
                  />
                </div>

                {/* Status */}
                <div className="space-y-2 md:col-span-2">
                  <CustomLabel required>Status</CustomLabel>
                  <CustomSelect
                    name="isActive"
                    placeHolder="Select status"
                    options={statusOptions}
                    required
                  />
                </div>
              </div>

              {/* Custom Resource Input */}
              <div className="space-y-2">
                <CustomLabel>Custom Resource (Optional)</CustomLabel>
                <CustomInput
                  name="customResource"
                  placeHolder="Enter custom resource name if not in the list above"
                  type="text"
                />
                <p className="text-sm text-gray-500">
                  If you need a resource not in the dropdown, enter it here. This will override the selected resource.
                </p>
              </div>

              {/* Custom Action Input */}
              <div className="space-y-2">
                <CustomLabel>Custom Action (Optional)</CustomLabel>
                <CustomInput
                  name="customAction"
                  placeHolder="Enter custom action name if not in the list above"
                  type="text"
                />
                <p className="text-sm text-gray-500">
                  If you need an action not in the dropdown, enter it here. This will override the selected action.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <CustomLabel required>Description</CustomLabel>
                <CustomTextArea
                  name="description"
                  placeHolder="Describe what this permission allows users to do"
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/permissions/view/${id}`)}
              disabled={isSubmitting || updatePermissionMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || updatePermissionMutation.isPending}
              className="min-w-[120px]"
            >
              {isSubmitting || updatePermissionMutation.isPending ? 'Updating...' : 'Update Permission'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
