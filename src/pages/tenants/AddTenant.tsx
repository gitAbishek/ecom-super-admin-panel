import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomBackHeader from '@/components/common/CustomBackHeader';
import CustomLoader from '@/components/loader/CustomLoader';
import { Building2, Save } from 'lucide-react';
import { useCreateTenant } from '@/hooks/tenant.hook';
import { CustomInput, CustomLabel, CustomSelect } from '@/components/form';
import { Button } from '@/components/ui/button';
import { showSuccessMessage, showErrorMessage } from '@/utils/toast';
import type { CreateTenantData } from '@/types/tenant';

interface TenantFormData {
  name: string;
  domain: string;
  admin_domain: string;
  email: string;
  password: string;
  industry: string;
  employees: number;
  status: 'active' | 'inactive' | 'suspended';
}

export default function AddTenant() {
  const navigate = useNavigate();
  const createTenantMutation = useCreateTenant();

  const methods = useForm<TenantFormData>({
    defaultValues: {
      name: '',
      domain: '',
      admin_domain: '',
      email: '',
      password: '',
      industry: '',
      employees: 1,
      status: 'active',
    },
  });

  const { handleSubmit, watch, setValue } = methods;

  // Watch domain field to auto-generate admin_domain
  const domainValue = watch('domain');

  // Auto-generate admin domain when domain changes
  useMemo(() => {
    if (domainValue && !domainValue.startsWith('admin.')) {
      setValue('admin_domain', `admin.${domainValue}`);
    }
  }, [domainValue, setValue]);

  const onSubmit = async (data: TenantFormData) => {
    try {
      console.log('Starting tenant creation process...');
      console.log('Form data:', data);
      
      // Skip validation and directly create tenant - let backend handle validation
      console.log('Creating tenant...');
      const tenantData: CreateTenantData = {
        name: data.name,
        domain: data.domain,
        admin_domain: data.admin_domain,
        metafield: {
          industry: data.industry,
          employees: data.employees,
        },
        email: data.email,
        password: data.password,
        status: data.status,
      };

      console.log('Tenant data to be sent:', tenantData);
      const createResponse = await createTenantMutation.mutateAsync(tenantData);
      console.log('Create response:', createResponse);
      
      showSuccessMessage('Tenant created successfully');
      navigate('/tenants');
    } catch (error) {
      console.error('Error creating tenant:', error);
      showErrorMessage('Failed to create tenant. Please try again.');
    }
  };

  const industryOptions = [
    { value: '', label: 'Select Industry' },
    { value: 'Property Rental', label: 'Property Rental' },
    { value: 'E-commerce', label: 'E-commerce' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Education', label: 'Education' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Food & Beverage', label: 'Food & Beverage' },
    { value: 'Other', label: 'Other' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
  ];

  if (createTenantMutation.isPending) {
    return <CustomLoader text="Creating tenant..." />;
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <CustomBackHeader
        title="Add New Tenant"
        description="Create a new tenant with domain and admin access"
        onBack={() => navigate('/tenants')}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-6 w-6" />
                <span>Tenant Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tenant Name */}
                  <div>
                    <CustomLabel htmlFor="name" required>
                      Tenant Name
                    </CustomLabel>
                    <CustomInput
                      name="name"
                      type="text"
                      placeHolder="Enter tenant name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <CustomLabel htmlFor="email" required>
                      Email Address
                    </CustomLabel>
                    <CustomInput
                      name="email"
                      type="email"
                      placeHolder="Enter email address"
                      required
                    />
                  </div>

                  {/* Domain */}
                  <div>
                    <CustomLabel htmlFor="domain" required>
                      Domain
                    </CustomLabel>
                    <CustomInput
                      name="domain"
                      type="text"
                      placeHolder="example.com"
                      required
                    />
                  </div>

                  {/* Admin Domain */}
                  <div>
                    <CustomLabel htmlFor="admin_domain" required>
                      Admin Domain
                    </CustomLabel>
                    <CustomInput
                      name="admin_domain"
                      type="text"
                      placeHolder="admin.example.com"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <CustomLabel htmlFor="password" required>
                      Password
                    </CustomLabel>
                    <CustomInput
                      name="password"
                      type="password"
                      placeHolder="Enter secure password"
                      required
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <CustomLabel htmlFor="industry" required>
                      Industry
                    </CustomLabel>
                    <CustomSelect
                      name="industry"
                      options={industryOptions}
                      required
                    />
                  </div>

                  {/* Employees */}
                  <div>
                    <CustomLabel htmlFor="employees" required>
                      Number of Employees
                    </CustomLabel>
                    <CustomInput
                      name="employees"
                      type="number"
                      placeHolder="Enter number of employees"
                      required
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <CustomLabel htmlFor="status" required>
                      Status
                    </CustomLabel>
                    <CustomSelect
                      name="status"
                      options={statusOptions}
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
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createTenantMutation.isPending}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{createTenantMutation.isPending ? 'Creating...' : 'Create Tenant'}</span>
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    );
  }
