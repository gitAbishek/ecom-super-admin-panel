import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CustomBackHeader from '@/components/common/CustomBackHeader';
import CustomInput from '@/components/form/CustomInput';
import CustomSelect from '@/components/form/CustomSelect';
import CustomLabel from '@/components/form/CustomLabel';
import { useCreateStaff } from '@/hooks/staff.hook';
import { useGetAllRoles } from '@/hooks/role.hook';
import { showSuccessMessage, showErrorMessage } from '@/utils/toast';
import { getValue } from '@/utils/object';

interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  department: string;
  jobTitle: string;
  role: string;
  employmentStatus: string;
  hireDate: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

const departments = [
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'customer_service', label: 'Customer Service' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
  { value: 'admin', label: 'Admin' },
];

const employmentStatuses = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'terminated', label: 'Terminated' },
  { value: 'on-leave', label: 'On Leave' },
];

const relationships = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'child', label: 'Child' },
  { value: 'friend', label: 'Friend' },
  { value: 'other', label: 'Other' },
];

export default function AddStaff() {
  const navigate = useNavigate();
  const createStaffMutation = useCreateStaff();
  const { data: rolesData } = useGetAllRoles();

  // Transform roles data for select options  
  const rawRoles = getValue(rolesData, 'roles.results') as Record<string, unknown>[] || [];
  const roles = rawRoles.map((role: Record<string, unknown>) => ({
    value: getValue(role, '_id') as string,
    label: getValue(role, 'label') as string,
  }));

  const methods = useForm<StaffFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      department: '',
      jobTitle: '',
      role: '',
      employmentStatus: 'active',
      hireDate: new Date().toISOString().split('T')[0],
      emergencyContact: {
        name: '',
        relationship: '',
        phone: '',
      },
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data: StaffFormData) => {
    try {
      // Convert hireDate to proper ISO datetime format
      const submitData = {
        ...data,
        hireDate: new Date(data.hireDate).toISOString(),
      };
      
      await createStaffMutation.mutateAsync(submitData);
      showSuccessMessage('Staff member created successfully');
      navigate('/staff');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create staff member';
      showErrorMessage(errorMessage);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <CustomBackHeader
        title="Add New Staff Member"
        description="Create a new staff member profile with personal and employment details"
        onBack={() => navigate('/staff')}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <CustomLabel required>First Name</CustomLabel>
                  <CustomInput
                    name="firstName"
                    type="text"
                    placeHolder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <CustomLabel required>Last Name</CustomLabel>
                  <CustomInput
                    name="lastName"
                    type="text"
                    placeHolder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <CustomLabel required>Email</CustomLabel>
                  <CustomInput
                    name="email"
                    type="email"
                    placeHolder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <CustomLabel required>Mobile Number</CustomLabel>
                  <CustomInput
                    name="mobile"
                    type="text"
                    placeHolder="Enter mobile number"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <CustomLabel required>Department</CustomLabel>
                  <CustomSelect
                    name="department"
                    placeHolder="Select department"
                    options={departments}
                    required
                  />
                </div>
                <div>
                  <CustomLabel required>Job Title</CustomLabel>
                  <CustomInput
                    name="jobTitle"
                    type="text"
                    placeHolder="Enter job title"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <CustomLabel required>Role</CustomLabel>
                  <CustomSelect
                    name="role"
                    placeHolder="Select role"
                    options={roles}
                    required
                  />
                </div>
                <div>
                  <CustomLabel required>Employment Status</CustomLabel>
                  <CustomSelect
                    name="employmentStatus"
                    placeHolder="Select employment status"
                    options={employmentStatuses}
                    required
                  />
                </div>
              </div>

              <div>
                <CustomLabel required>Hire Date</CustomLabel>
                <CustomInput
                  name="hireDate"
                  type="date"
                  placeHolder="Select hire date"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <CustomLabel required>Contact Name</CustomLabel>
                <CustomInput
                  name="emergencyContact.name"
                  type="text"
                  placeHolder="Enter emergency contact name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <CustomLabel required>Relationship</CustomLabel>
                  <CustomSelect
                    name="emergencyContact.relationship"
                    placeHolder="Select relationship"
                    options={relationships}
                    required
                  />
                </div>
                <div>
                  <CustomLabel required>Phone Number</CustomLabel>
                  <CustomInput
                    name="emergencyContact.phone"
                    type="text"
                    placeHolder="Enter phone number"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/staff')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Staff Member'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
