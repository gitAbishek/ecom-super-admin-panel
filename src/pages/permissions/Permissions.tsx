import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import CustomHeaders from '@/components/common/CustomHeaders';
import CustomFilters from '@/components/common/CustomFilters';
import CustomLoader from '@/components/loader/CustomLoader';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import BaseTable from '@/components/ui/BaseTable';
import PermissionTable from '@/components/PermissionTable';
import DeleteModal from '@/components/ui/DeleteModal';
import { UserCheck } from 'lucide-react';
import { useGetAllPermissions, useDeletePermission } from '@/hooks/permission.hook';
import { getValue } from '@/utils/object';
import { showSuccessMessage, showErrorMessage } from '@/utils/toast';
import type { Permission } from '@/components/PermissionTable';

export default function Permissions() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPermission, setDeletingPermission] = useState<Permission | null>(null);
  const { data, isLoading, error, refetch } = useGetAllPermissions();
  const deletePermissionMutation = useDeletePermission();

  // Table headers
  const tableHeaders = [
    { title: 'Permission' },
    { title: 'Action' },
    { title: 'Resource' },
    { title: 'Created Date' },
  ];

  const handleDeletePermission = (permission: Permission) => {
    setDeletingPermission(permission);
    setShowDeleteModal(true);
  };

  const handleViewPermission = (permission: Permission) => {
    navigate(`/permissions/view/${permission._id}`);
  };

  const handleEditPermission = (permission: Permission) => {
    navigate(`/permissions/edit/${permission._id}`);
  };

  const confirmDelete = async () => {
    if (deletingPermission) {
      try {
        const permissionId = deletingPermission._id;
        const permissionName = deletingPermission.permission || 'Unknown';
        await deletePermissionMutation.mutateAsync(permissionId);
        showSuccessMessage(`Permission "${permissionName}" deleted successfully!`);
        setDeletingPermission(null);
        setShowDeleteModal(false);
        refetch(); // Refresh the permissions list
      } catch (error) {
        console.error('Error deleting permission:', error);
        const permissionName = deletingPermission.permission || 'Unknown';
        showErrorMessage(`Failed to delete permission "${permissionName}". Please try again.`);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingPermission(null);
  };

  if (isLoading) return <CustomLoader text="Loading permissions..." />;
  if (error) return (
    <CustomEmptyState
      icon={<UserCheck className="h-12 w-12 text-gray-400" />}
      title="Error loading permissions"
      description="There was an error loading the permissions data."
    />
  );

  // Extract permissions from the API response structure - based on real API response
  const rawPermissions = getValue(data, 'data') as Record<string, unknown>[] || [];
  
  // Transform raw data to typed Permission objects
  const permissions: Permission[] = rawPermissions.map((permission: Record<string, unknown>) => ({
    _id: getValue(permission, '_id') as string || '',
    resource: getValue(permission, 'resource') as string || '',
    action: getValue(permission, 'action') as string || '',
    description: getValue(permission, 'description') as string || '',
    isActive: getValue(permission, 'isActive') as boolean !== false,
    isDeleted: getValue(permission, 'isDeleted') as boolean || false,
    createdAt: getValue(permission, 'createdAt') as string || '',
    updatedAt: getValue(permission, 'updatedAt') as string || '',
    permission: getValue(permission, 'permission') as string || `${getValue(permission, 'resource')}:${getValue(permission, 'action')}`,
    id: getValue(permission, 'id') as string || getValue(permission, '_id') as string || '',
    __v: getValue(permission, '__v') as number || 0,
  }));
  
  const filteredPermissions = permissions.filter((permission: Permission) => {
    const matchesSearch = permission.permission.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesResource = selectedResource === 'All' || permission.resource === selectedResource;
    const matchesStatus = selectedStatus === 'All' || 
      (selectedStatus === 'Active' && permission.isActive) || 
      (selectedStatus === 'Inactive' && !permission.isActive);
    
    return matchesSearch && matchesResource && matchesStatus;
  });

  // Get unique resources for filter
  const uniqueResources = [...new Set(permissions.map(p => p.resource))];

  return (
    <div className="p-6 space-y-6">
      <CustomHeaders
        title="Permission Management"
        description="Manage system permissions and access controls"
        onAdd={() => navigate('/permissions/add')}
        buttonText="Add Permission"
      />

      <CustomFilters
        filters={[
          {
            type: 'search',
            placeholder: 'Search permissions by name, resource, or action...',
            value: searchTerm,
            onChange: setSearchTerm,
          },
          {
            type: 'select',
            value: selectedResource,
            onChange: setSelectedResource,
            options: [
              { value: 'All', label: 'All Resources' },
              ...uniqueResources.map(resource => ({ value: resource, label: resource })),
            ],
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
          {filteredPermissions.length === 0 ? (
            <CustomEmptyState
              icon={<UserCheck className="h-12 w-12 text-gray-400" />}
              title="No permissions found"
              description={searchTerm ? 'No permissions match your search.' : 'No permissions have been created yet.'}
            />
          ) : (
            <BaseTable
              tableHeaders={tableHeaders}
              tableData={
                <PermissionTable
                  data={filteredPermissions}
                  onView={handleViewPermission}
                  onEdit={handleEditPermission}
                  onDelete={handleDeletePermission}
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
        isPending={deletePermissionMutation.isPending}
        title="Delete Permission"
        description={
          deletingPermission
            ? `Are you sure you want to delete the permission "${deletingPermission.permission || 'Unknown'}"? This action cannot be undone.`
            : ""
        }
      />
    </div>
  );
}
