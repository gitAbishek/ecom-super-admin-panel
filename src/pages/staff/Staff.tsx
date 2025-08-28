import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import CustomHeaders from '@/components/common/CustomHeaders';
import CustomFilters from '@/components/common/CustomFilters';
import CustomLoader from '@/components/loader/CustomLoader';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import BaseTable from '@/components/ui/BaseTable';
import StaffTable from '@/components/StaffTable';
import DeleteModal from '@/components/ui/DeleteModal';
import { Users } from 'lucide-react';
import { useGetAllStaff, useDeleteStaff } from '@/hooks/staff.hook';
import { getValue } from '@/utils/object';
import { showSuccessMessage, showErrorMessage } from '@/utils/toast';
import type { Staff } from '@/components/StaffTable';

export default function Staff() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null);
  const { data, isLoading, error, refetch } = useGetAllStaff();
  const deleteStaffMutation = useDeleteStaff();

  // Table headers
  const tableHeaders = [
    { title: 'Staff Member' },
    { title: 'Role' },
    { title: 'Department' },
    { title: 'Employment Status' },
    { title: 'Hire Date' },
  ];  const handleDeleteStaff = (staff: Staff) => {
    setDeletingStaff(staff);
    setShowDeleteModal(true);
  };

  const handleViewStaff = (staff: Staff) => {
    navigate(`/staff/view/${staff._id}`);
  };

  const handleEditStaff = (staff: Staff) => {
    navigate(`/staff/edit/${staff._id}`);
  };

  const confirmDelete = async () => {
    if (deletingStaff) {
      try {
        await deleteStaffMutation.mutateAsync(deletingStaff._id);
        showSuccessMessage('Staff member deleted successfully');
        refetch();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete staff member';
        showErrorMessage(errorMessage);
      } finally {
        setShowDeleteModal(false);
        setDeletingStaff(null);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingStaff(null);
  };

  if (isLoading) return <CustomLoader text="Loading staff..." />;
  if (error) {
    console.error('Staff API error:', error);
    return (
      <CustomEmptyState
        icon={<Users className="h-12 w-12 text-gray-400" />}
        title="Error loading staff"
        description="There was an error loading the staff data."
      />
    );
  }

  // Extract staff from the API response structure
  const rawStaff = getValue(data, 'data.results') as Record<string, unknown>[] || [];
  console.log('Raw staff data:', rawStaff);
  
  // Transform raw data to typed Staff objects
  const staff: Staff[] = rawStaff.map((member: Record<string, unknown>) => ({
    _id: getValue(member, '_id') as string || '',
    userId: {
      _id: getValue(member, 'userId._id') as string || '',
      email: getValue(member, 'userId.email') as string || '',
      status: getValue(member, 'userId.status') as string || '',
    },
    tenantId: getValue(member, 'tenantId') as string || '',
    firstName: getValue(member, 'firstName') as string || '',
    lastName: getValue(member, 'lastName') as string || '',
    email: getValue(member, 'email') as string || '',
    mobile: getValue(member, 'mobile') as string || '',
    role: {
      _id: getValue(member, 'role._id') as string || '',
      label: getValue(member, 'role.label') as string || '',
    },
    department: getValue(member, 'department') as string || '',
    jobTitle: getValue(member, 'jobTitle') as string || '',
    isActive: getValue(member, 'isActive') as boolean !== false,
    isVerified: getValue(member, 'isVerified') as boolean || false,
    employmentStatus: getValue(member, 'employmentStatus') as string || '',
    hireDate: getValue(member, 'hireDate') as string || '',
    emergencyContact: {
      name: getValue(member, 'emergencyContact.name') as string || '',
      relationship: getValue(member, 'emergencyContact.relationship') as string || '',
      phone: getValue(member, 'emergencyContact.phone') as string || '',
    },
    isDeleted: getValue(member, 'isDeleted') as boolean || false,
    deletedAt: getValue(member, 'deletedAt') as string | null,
    deletedBy: getValue(member, 'deletedBy') as string | null,
    createdAt: getValue(member, 'createdAt') as string || '',
    updatedAt: getValue(member, 'updatedAt') as string || '',
    __v: getValue(member, '__v') as number || 0,
    fullName: getValue(member, 'fullName') as string || `${getValue(member, 'firstName')} ${getValue(member, 'lastName')}`,
    id: getValue(member, 'id') as string || getValue(member, '_id') as string || '',
  }));
  
  const filteredStaff = staff.filter((member: Staff) => {
    const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'All' || member.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All' || 
      (selectedStatus === 'Active' && member.isActive) || 
      (selectedStatus === 'Inactive' && !member.isActive);
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Get unique departments for filter
  const uniqueDepartments = [...new Set(staff.map(s => s.department))];

  // Prepare filters
  const filters = [
    {
      type: 'search' as const,
      placeholder: 'Search staff members...',
      value: searchTerm,
      onChange: setSearchTerm,
    },
    {
      type: 'select' as const,
      placeholder: 'Department',
      value: selectedDepartment,
      onChange: setSelectedDepartment,
      options: [
        { value: 'All', label: 'All Departments' },
        ...uniqueDepartments.map(dept => ({ value: dept, label: dept.charAt(0).toUpperCase() + dept.slice(1) }))
      ],
    },
    {
      type: 'select' as const,
      placeholder: 'Status',
      value: selectedStatus,
      onChange: setSelectedStatus,
      options: [
        { value: 'All', label: 'All Status' },
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <CustomHeaders
        title="Staff Management"
        description="Manage staff members and their information"
        onAdd={() => navigate('/staff/add')}
      />
      
      <CustomFilters filters={filters} />

      <Card>
        <CardContent className="p-0">
          {filteredStaff.length === 0 ? (
            <div className="p-6">
              <CustomEmptyState
                icon={<Users className="h-12 w-12 text-gray-400" />}
                title="No staff members found"
                description="No staff members match your current filters."
              />
            </div>
          ) : (
            <BaseTable 
              tableHeaders={tableHeaders}
              showAction={true}
              tableData={
                <StaffTable
                  data={filteredStaff}
                  onView={handleViewStaff}
                  onEdit={handleEditStaff}
                  onDelete={handleDeleteStaff}
                />
              }
            />
          )}
        </CardContent>
      </Card>

      <DeleteModal
        visible={showDeleteModal}
        setVisible={setShowDeleteModal}
        onClose={handleCloseDeleteModal}
        handleDelete={confirmDelete}
        title="Delete Staff Member"
        description={`Are you sure you want to delete ${deletingStaff?.fullName}? This action cannot be undone.`}
        isPending={deleteStaffMutation.isPending}
      />
    </div>
  );
}