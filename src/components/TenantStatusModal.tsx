import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomSelect from "@/components/form/CustomSelect";
import CustomLabel from "@/components/form/CustomLabel";
import { X, Settings } from "lucide-react";
import type { Tenant } from "@/types/tenant";

interface TenantStatusModalProps {
  visible: boolean;
  onClose: () => void;
  tenant: Tenant | null;
  onStatusUpdate: (tenantId: string, status: string) => void;
  isUpdating: boolean;
}

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

interface StatusFormData {
  status: string;
}

const TenantStatusModal: React.FC<TenantStatusModalProps> = ({
  visible,
  onClose,
  tenant,
  onStatusUpdate,
  isUpdating,
}) => {
  const methods = useForm<StatusFormData>();
  const { handleSubmit } = methods;

  const onSubmit = (data: StatusFormData) => {
    if (tenant && data.status) {
      onStatusUpdate(tenant._id, data.status);
    }
  };

  if (!visible || !tenant) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-lg font-semibold">Update Status</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Update the status for <span className="font-medium">{tenant.name}</span>
                </p>
                
                <div className="space-y-2">
                  <CustomLabel htmlFor="status" required>
                    Status
                  </CustomLabel>
                  <CustomSelect
                    name="status"
                    placeHolder="Select status"
                    options={statusOptions}
                    defaultValue={tenant.status || ""}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>{isUpdating ? 'Updating...' : 'Update Status'}</span>
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantStatusModal;
