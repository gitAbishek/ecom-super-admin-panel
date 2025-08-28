import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Mail, Phone, Calendar, User, Building, Briefcase } from 'lucide-react';
import CustomBackHeader from '@/components/common/CustomBackHeader';
import CustomLoader from '@/components/loader/CustomLoader';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import { useGetSingleStaffDetails } from '@/hooks/staff.hook';
import { getValue } from '@/utils/object';

export default function ViewStaff() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetSingleStaffDetails(id || '');

  if (isLoading) return <CustomLoader text="Loading staff details..." />;
  
  if (error) {
    return (
      <div className="p-6 space-y-6">
        <CustomBackHeader
          title="Staff Details"
          description="View detailed information about this staff member"
          onBack={() => navigate('/staff')}
        />
        <CustomEmptyState
          icon={<User className="h-12 w-12 text-gray-400" />}
          title="Error loading staff details"
          description="There was an error loading the staff member details."
        />
      </div>
    );
  }

  // Extract staff data from API response
  const rawStaff = getValue(data, 'data') as Record<string, unknown> || {};
  
  const staff = {
    _id: getValue(rawStaff, '_id') as string || '',
    firstName: getValue(rawStaff, 'firstName') as string || '',
    lastName: getValue(rawStaff, 'lastName') as string || '',
    email: getValue(rawStaff, 'email') as string || '',
    mobile: getValue(rawStaff, 'mobile') as string || '',
    role: {
      _id: getValue(rawStaff, 'role._id') as string || '',
      label: getValue(rawStaff, 'role.label') as string || '',
    },
    department: getValue(rawStaff, 'department') as string || '',
    jobTitle: getValue(rawStaff, 'jobTitle') as string || '',
    isActive: getValue(rawStaff, 'isActive') as boolean !== false,
    employmentStatus: getValue(rawStaff, 'employmentStatus') as string || '',
    hireDate: getValue(rawStaff, 'hireDate') as string || '',
    emergencyContact: {
      name: getValue(rawStaff, 'emergencyContact.name') as string || '',
      relationship: getValue(rawStaff, 'emergencyContact.relationship') as string || '',
      phone: getValue(rawStaff, 'emergencyContact.phone') as string || '',
    },
    fullName: getValue(rawStaff, 'fullName') as string || `${getValue(rawStaff, 'firstName')} ${getValue(rawStaff, 'lastName')}`,
    createdAt: getValue(rawStaff, 'createdAt') as string || '',
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'terminated':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'on-leave':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <CustomBackHeader
        title="Staff Details"
        description="View detailed information about this staff member"
        onBack={() => navigate('/staff')}
        editButton={{
          onEdit: () => navigate(`/staff/edit/${staff._id}`),
          text: "Edit Staff",
          icon: <Edit className="h-4 w-4" />
        }}
      />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{staff.fullName}</h1>
          <p className="text-muted-foreground">{staff.jobTitle} • {staff.department}</p>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${staff.isActive ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}>
            {staff.isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">First Name</label>
                <p className="text-sm">{staff.firstName}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                <p className="text-sm">{staff.lastName}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{staff.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{staff.mobile}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Employment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Department</label>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm capitalize">{staff.department}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Job Title</label>
                <p className="text-sm">{staff.jobTitle}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <p className="text-sm capitalize">{staff.role.label}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Employment Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadgeClass(staff.employmentStatus)}`}>
                  {staff.employmentStatus}
                </span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Hire Date</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{formatDate(staff.hireDate)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Contact Name</label>
                <p className="text-sm">{staff.emergencyContact.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Relationship</label>
                <p className="text-sm capitalize">{staff.emergencyContact.relationship}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{staff.emergencyContact.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Staff ID</label>
                <p className="text-sm font-mono">{staff._id}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                <p className="text-sm">{formatDate(staff.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
