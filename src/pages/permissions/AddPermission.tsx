import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CustomInput from '@/components/form/CustomInput';
import CustomTextArea from '@/components/form/CustomTextArea';
import CustomSelect from '@/components/form/CustomSelect';
import CustomLabel from '@/components/form/CustomLabel';
import CustomBackHeader from '@/components/common/CustomBackHeader';
import { Shield } from 'lucide-react';
import { useCreatePermission } from '@/hooks/permission.hook';
import { showSuccessMessage, showErrorMessage } from '@/utils/toast';

interface AddPermissionFormData {
  resource: string;
  action: string;
  description: string;
  customResource?: string;
  customAction?: string;
}

export default function AddPermission() {
  const navigate = useNavigate();
  const createPermissionMutation = useCreatePermission();

  const methods = useForm<AddPermissionFormData>({
    defaultValues: {
      resource: '',
      action: '',
      description: '',
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data: AddPermissionFormData) => {
    try {
      const payload = {
        resource: data.customResource || data.resource,
        action: data.customAction || data.action,
        description: data.description,
        isActive: true,
      };

      await createPermissionMutation.mutateAsync(payload);
      showSuccessMessage('Permission created successfully!');
      navigate('/permissions');
    } catch (error) {
      console.error('Error creating permission:', error);
      showErrorMessage('Failed to create permission. Please try again.');
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
    { value: 'cart', label: 'Cart' },
    { value: 'wishlist', label: 'Wishlist' },
    { value: 'search', label: 'Search' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'settings', label: 'Settings' },
    { value: '*', label: 'All Resources (*)' },
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
    { value: 'archive', label: 'Archive' },
    { value: 'export', label: 'Export' },
    { value: 'import', label: 'Import' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'refund', label: 'Refund' },
    { value: '*', label: 'All Actions (*)' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <CustomBackHeader
        title="Add New Permission"
        description="Create a new permission to control system access"
        onBack={() => navigate('/permissions')}
      />

      <div className="w-full">
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
              <Shield className="h-5 w-5" />
              <span>Permission Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white dark:bg-gray-900">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                </div>

                {/* Custom Resource Input */}
                <div className="space-y-2">
                  <CustomLabel>Custom Resource (Optional)</CustomLabel>
                  <CustomInput
                    name="customResource"
                    placeHolder="Enter custom resource name if not in the list above"
                    type="text"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">
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

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/permissions')}
                    disabled={isSubmitting || createPermissionMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || createPermissionMutation.isPending}
                    className="min-w-[120px]"
                  >
                    {isSubmitting || createPermissionMutation.isPending ? 'Creating...' : 'Create Permission'}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}