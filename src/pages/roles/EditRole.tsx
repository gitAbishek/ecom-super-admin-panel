import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { Shield, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomLoader from "@/components/loader/CustomLoader";
import CustomInput from "@/components/form/CustomInput";
import CustomTextArea from "@/components/form/CustomTextArea";
import CustomLabel from "@/components/form/CustomLabel";
import CustomBackHeader from "@/components/common/CustomBackHeader";
import CustomMultiSelectCheckbox from "@/components/form/CustomMultiSelectCheckbox";
import { useGetSingleRoleDetails, useUpdateRole } from "@/hooks/role.hook";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import type { UpdateRoleData } from "@/types/role";

interface RoleFormData {
  label: string;
  description: string;
  permissions: string[];
  isActive: string | boolean;
}

// Available permissions list
const availablePermissions = [
  { value: "product:read", label: "View Products" },
  { value: "product:create", label: "Create Products" },
  { value: "product:update", label: "Update Products" },
  { value: "product:delete", label: "Delete Products" },
  { value: "product:*", label: "All Product Permissions" },
  
  { value: "order:read", label: "View Orders" },
  { value: "order:create", label: "Create Orders" },
  { value: "order:update", label: "Update Orders" },
  { value: "order:delete", label: "Delete Orders" },
  { value: "order:analytics", label: "Order Analytics" },
  { value: "order:*", label: "All Order Permissions" },
  
  { value: "user:read", label: "View Users" },
  { value: "user:create", label: "Create Users" },
  { value: "user:update", label: "Update Users" },
  { value: "user:delete", label: "Delete Users" },
  { value: "user:*", label: "All User Permissions" },
  
  { value: "inventory:read", label: "View Inventory" },
  { value: "inventory:update", label: "Update Inventory" },
  { value: "inventory:manage", label: "Manage Inventory" },
  
  { value: "payment:read", label: "View Payments" },
  { value: "payment:create", label: "Create Payments" },
  { value: "payment:*", label: "All Payment Permissions" },
  
  { value: "role:read", label: "View Roles" },
  { value: "role:create", label: "Create Roles" },
  { value: "role:update", label: "Update Roles" },
  { value: "role:delete", label: "Delete Roles" },
  
  { value: "permission:read", label: "View Permissions" },
  { value: "search:read", label: "Search Access" },
  { value: "search:*", label: "All Search Permissions" },
  
  { value: "cart:*", label: "All Cart Permissions" },
  { value: "wishlist:*", label: "All Wishlist Permissions" },
  
  { value: "*:*", label: "All Permissions (Super Admin)" },
];

const EditRole = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: roleData, isLoading: isRoleLoading } = useGetSingleRoleDetails(id || "");
  const { mutateAsync: updateRole, isPending: isUpdating } = useUpdateRole();

  const methods = useForm<RoleFormData>();

  const { handleSubmit } = methods;

  useEffect(() => {
    if (roleData?.role && id) {
      const foundRole = roleData.role;
      methods.reset({
        label: foundRole.label,
        description: foundRole.description,
        permissions: foundRole.permissions || [],
        isActive: foundRole.isActive,
      });
    }
  }, [roleData, id, methods]);

  const handleBack = () => {
    navigate("/roles");
  };

  const onSubmit = async (formData: RoleFormData) => {
    if (!roleData?.role) return;

    try {
      const updateData: UpdateRoleData = {
        label: formData.label,
        description: formData.description,
        permissions: formData.permissions,
        isActive: formData.isActive === "true" || formData.isActive === true,
      };

      await updateRole({
        roleId: roleData.role._id,
        data: updateData,
      });
      
      showSuccessMessage("Role updated successfully");
      navigate("/roles");
    } catch (error) {
      console.error('Error updating role:', error);
      showErrorMessage("Failed to update role");
    }
  };

  if (isRoleLoading) {
    return <CustomLoader text="Loading role..." />;
  }

  if (!roleData?.role) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Role not found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            The role you're trying to edit doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate('/roles')}>
            Back to Roles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <CustomBackHeader title="Edit Role" onBack={handleBack} />
      </div>
      
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Role Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <CustomLabel htmlFor="label" required>
                    Role Name
                  </CustomLabel>
                  <CustomInput
                    name="label"
                    type="text"
                    placeHolder="Enter role name (e.g., manager, staff)"
                    defaultValue={roleData.role.label}
                    required
                  />
                </div>

                <div>
                  <CustomLabel htmlFor="isActive">
                    Status
                  </CustomLabel>
                  <select
                    {...methods.register("isActive")}
                    defaultValue={roleData.role.isActive.toString()}
                    className="w-full bg-white dark:bg-[#182235] border border-gray-400 dark:border-gray-600 text-sm rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 block p-2.5 dark:text-white transition"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <CustomLabel htmlFor="description" required>
                  Description
                </CustomLabel>
                <CustomTextArea
                  name="description"
                  placeHolder="Describe the role's purpose and responsibilities"
                  defaultValue={roleData.role.description}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select the permissions this role should have
              </p>
            </CardHeader>
            <CardContent>
              <CustomMultiSelectCheckbox
                name="permissions"
                options={availablePermissions}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isUpdating ? 'Updating...' : 'Update Role'}</span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EditRole;
