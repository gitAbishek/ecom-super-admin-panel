import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { Building2, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomLoader from "@/components/loader/CustomLoader";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomLabel from "@/components/form/CustomLabel";
import CustomBackHeader from "@/components/common/CustomBackHeader";
import { useGetSingleTenantDetails, useUpdateTenant } from "@/hooks/tenant.hook";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import type { Tenant, UpdateTenantData } from "@/types/tenant";

const EditTenant = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: tenantData, isLoading: isTenantLoading } = useGetSingleTenantDetails(id || "");
  const { mutateAsync: updateTenant, isPending: isUpdating } = useUpdateTenant();

  const methods = useForm();

  const { handleSubmit } = methods;

  useEffect(() => {
    if (tenantData?.tenant && id) {
      const foundTenant = tenantData.tenant;
      setTenant(foundTenant);
      setIsLoading(false);
    } else if (!isTenantLoading && id) {
      // If not loading but no data, tenant not found
      setIsLoading(false);
    }
  }, [tenantData, id, isTenantLoading]);

  const handleBack = () => {
    navigate("/tenants");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (formData: any) => {
    if (!tenant) return;

    try {
      const updateData: UpdateTenantData = {
        name: formData.name,
        email: formData.email,
        domain: formData.domain,
        admin_domain: formData.admin_domain,
        metafield: {
          industry: formData.metafield.industry,
          employees: typeof formData.metafield.employees === 'string' 
            ? parseInt(formData.metafield.employees.split('-')[0]) || 1
            : Number(formData.metafield.employees) || 1
        }
      };

      await updateTenant({
        id: tenant._id,
        data: updateData
      });
      showSuccessMessage("Tenant updated successfully");
      navigate("/tenants");
    } catch (error) {
      console.error('Error updating tenant:', error);
      showErrorMessage("Failed to update tenant");
    }
  };

  const industryOptions = [
    { value: "Technology", label: "Technology" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Finance", label: "Finance" },
    { value: "Retail", label: "Retail" },
    { value: "Manufacturing", label: "Manufacturing" },
    { value: "Education", label: "Education" },
    { value: "Real Estate", label: "Real Estate" },
    { value: "Food & Beverage", label: "Food & Beverage" },
    { value: "Transportation", label: "Transportation" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Other", label: "Other" }
  ];

  const employeeOptions = [
    { value: "1-10", label: "1-10 employees" },
    { value: "11-50", label: "11-50 employees" },
    { value: "51-200", label: "51-200 employees" },
    { value: "201-500", label: "201-500 employees" },
    { value: "501-1000", label: "501-1000 employees" },
    { value: "1000+", label: "1000+ employees" }
  ];

  if (isTenantLoading || isLoading) {
    return <CustomLoader text="Loading tenant details..." />;
  }

  if (!tenant) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Tenant Not Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                The tenant you're trying to edit doesn't exist.
              </p>
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tenants
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <CustomBackHeader
        title="Edit Tenant"
        description={`Update ${tenant.name} information`}
        onBack={() => navigate('/tenants')}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <CustomLabel htmlFor="name" required>
                          Tenant Name
                        </CustomLabel>
                        <CustomInput
                          name="name"
                          type="text"
                          placeHolder="Enter tenant name"
                          defaultValue={tenantData?.tenant?.name || ""}
                          required
                        />
                      </div>

                      <div>
                        <CustomLabel htmlFor="email" required>
                          Email Address
                        </CustomLabel>
                        <CustomInput
                          name="email"
                          type="email"
                          placeHolder="Enter email address"
                          defaultValue={tenantData?.tenant?.email || ""}
                          required
                        />
                      </div>

                      <div>
                        <CustomLabel htmlFor="domain" required>
                          Domain
                        </CustomLabel>
                        <CustomInput
                          name="domain"
                          type="text"
                          placeHolder="example.com"
                          defaultValue={tenantData?.tenant?.domain || ""}
                          required
                        />
                      </div>

                      <div>
                        <CustomLabel htmlFor="admin_domain" required>
                          Admin Domain
                        </CustomLabel>
                        <CustomInput
                          name="admin_domain"
                          type="text"
                          placeHolder="admin.example.com"
                          defaultValue={tenantData?.tenant?.admin_domain || ""}
                          required
                        />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <CustomLabel htmlFor="industry" required>
                      Industry
                    </CustomLabel>
                    <CustomSelect
                      name="metafield.industry"
                      placeHolder="Select industry"
                      options={industryOptions}
                      defaultValue={tenantData?.tenant?.metafield?.industry || ""}
                      required
                    />
                  </div>

                  <div>
                    <CustomLabel htmlFor="employees" required>
                      Number of Employees
                    </CustomLabel>
                    <CustomSelect
                      name="metafield.employees"
                      placeHolder="Select employee range"
                      options={employeeOptions}
                      defaultValue={tenantData?.tenant?.metafield?.employees?.toString() || ""}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/tenants')}
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
                <span>{isUpdating ? 'Updating...' : 'Update Tenant'}</span>
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    );
};

export default EditTenant;