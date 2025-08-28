import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import CustomHeaders from '@/components/common/CustomHeaders';
import CustomFilters from '@/components/common/CustomFilters';
import CustomLoader from '@/components/loader/CustomLoader';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import BaseTable from '@/components/ui/BaseTable';
import RoleTable from '@/components/RoleTable';
import DeleteModal from '@/components/ui/DeleteModal';
import { Shield } from 'lucide-react';
import { useGetAllRoles, useDeleteRole } from '@/hooks/role.hook';
import { getValue } from '@/utils/object';
import { showSuccessMessage, showErrorMessage } from '@/utils/toast';
import type { Role } from '@/components/RoleTable';

export default function Roles() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const { data, isLoading, error, refetch } = useGetAllRoles();
  const deleteRoleMutation = useDeleteRole();

  // Table headers
  const tableHeaders = [
    { title: 'Role' },
    { title: 'Description' },
    { title: 'Permissions' },
    { title: 'Created Date' },
  ];

  const handleDeleteRole = (role: Role) => {
    setDeletingRole(role);
    setShowDeleteModal(true);
  };

  const handleViewRole = (role: Role) => {
    navigate(`/roles/view/${role._id}`);
  };

  const handleEditRole = (role: Role) => {
    navigate(`/roles/edit/${role._id}`);
  };

  const confirmDelete = async () => {
    if (deletingRole) {
      try {
        const roleId = getValue(deletingRole, '_id') || getValue(deletingRole, 'id');
        const roleName = getValue(deletingRole, 'label') || 'Unknown';
        await deleteRoleMutation.mutateAsync(roleId as string);
        showSuccessMessage(`Role "${roleName}" deleted successfully!`);
        setDeletingRole(null);
        setShowDeleteModal(false);
        refetch(); // Refresh the roles list
      } catch (error) {
        console.error('Error deleting role:', error);
        const roleName = getValue(deletingRole, 'label') || 'Unknown';
        showErrorMessage(`Failed to delete role "${roleName}". Please try again.`);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingRole(null);
  };

  if (isLoading) return <CustomLoader text="Loading roles..." />;
  if (error) return (
    <CustomEmptyState
      icon={<Shield className="h-12 w-12 text-gray-400" />}
      title="Error loading roles"
      description="There was an error loading the roles data."
    />
  );

  // Extract roles from the API response structure
  const rolesData = getValue(data, 'roles') as Record<string, unknown> || {};
  const rolesArray = getValue(rolesData, 'results') as Record<string, unknown>[] || [];
  // Fallback to direct array if no nested structure
  const rawRoles = rolesArray.length > 0 ? rolesArray : (Array.isArray(data) ? data : []);
  
  // Transform raw data to typed Role objects
  const roles: Role[] = rawRoles.map((role: Record<string, unknown>) => ({
    _id: getValue(role, '_id') as string || getValue(role, 'id') as string || '',
    label: getValue(role, 'label') as string || '',
    description: getValue(role, 'description') as string || '',
    permissions: getValue(role, 'permissions') as string[] || [],
    isActive: getValue(role, 'isActive') !== false,
    adminAccess: getValue(role, 'adminAccess') === true,
    isSystemRole: getValue(role, 'isSystemRole') === true,
    createdAt: getValue(role, 'createdAt') as string || '',
  }));
  
  const filteredRoles = roles.filter((role: Role) => {
    const matchesSearch = role.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || 
      (selectedStatus === 'Active' && role.isActive) || 
      (selectedStatus === 'Inactive' && !role.isActive);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <CustomHeaders
        title="Role Management"
        description="Manage user roles and access levels"
        onAdd={() => navigate("/roles/add")}
        buttonText="Add Role"
      />

      <CustomFilters
        filters={[
          {
            type: 'search',
            placeholder: 'Search roles by name or description...',
            value: searchTerm,
            onChange: setSearchTerm,
          },
          {
            type: 'select',
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: [
              { value: 'All', label: 'All Status' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ],
          },
        ]}
      />

      <Card>
        <CardContent className="p-0">
          {filteredRoles.length === 0 ? (
            <CustomEmptyState
              icon={<Shield className="h-12 w-12 text-gray-400" />}
              title="No roles found"
              description={searchTerm ? 'No roles match your search.' : 'No roles have been created yet.'}
            />
          ) : (
            <BaseTable
              tableHeaders={tableHeaders}
              tableData={
                <RoleTable
                  data={filteredRoles}
                  onView={handleViewRole}
                  onEdit={handleEditRole}
                  onDelete={handleDeleteRole}
                />
              }
              showAction={true}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        visible={showDeleteModal}
        setVisible={setShowDeleteModal}
        onClose={handleCloseDeleteModal}
        handleDelete={confirmDelete}
        isPending={deleteRoleMutation.isPending}
        title="Delete Role"
        description={
          deletingRole
            ? `Are you sure you want to delete the role "${deletingRole.label || 'Unknown'}"? This action cannot be undone.`
            : ""
        }
      />
    </div>
  );
}
