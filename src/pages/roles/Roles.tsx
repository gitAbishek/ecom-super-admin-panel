import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseTable from "@/components/ui/BaseTable";
import RoleTable from "@/components/RoleTable";
import CustomHeaders from "@/components/common/CustomHeaders";
import CustomFilters from "@/components/common/CustomFilters";
import DeleteModal from "@/components/ui/DeleteModal";
import {
  useGetAllRoles,
  useDeleteRole,
} from "@/hooks/role.hook";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import { AlertTriangle } from "lucide-react";
import CustomLoader from "@/components/loader/CustomLoader";
import CustomEmptyState from "@/components/common/CustomEmptyState";
import Pagination from "@/lib/pagination";
import { useDebounce } from "@/hooks/useDebounceSearch.hook";
import { roleTableHeaders } from "@/constants/tableHeaders";
import type { Role } from "@/types/role";

const Roles = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [limit] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const { mutateAsync: deleteRole, isPending: isDeleting } = useDeleteRole();

  // Navigate to add role page
  const handleAddRole = () => {
    navigate("/roles/add");
  };

  // Fetch roles from API
  const {
    data: rolesData,
    isLoading,
    error,
  } = useGetAllRoles({
    page: currentPage + 1,
    limit,
    search: debouncedSearchTerm,
    status: selectedStatus,
  });

  useEffect(() => {
    if (rolesData?.roles?.results) {
      setAllRoles(rolesData.roles.results);
    }
  }, [rolesData]);

  // Handle view role
  const handleViewRole = (role: Role) => {
    navigate(`/roles/view/${role._id}`);
  };

  // Handle edit role
  const handleEditRole = (role: Role) => {
    navigate(`/roles/edit/${role._id}`);
  };

  // Handle delete role
  const handleDeleteRole = (role: Role) => {
    setDeletingRole(role);
    setShowDeleteModal(true);
  };

  // Handle page change for pagination
  const handlePageChange = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deletingRole) return;

    try {
      await deleteRole(deletingRole._id);
      showSuccessMessage("Role deleted successfully");
      setShowDeleteModal(false);
      setDeletingRole(null);
    } catch (error) {
      console.error('Error deleting role:', error);
      showErrorMessage("Failed to delete role");
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingRole(null);
  };

  if (isLoading) {
    return <CustomLoader text="Loading roles..." />;
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
          <span>Error loading roles: {error.message}</span>
        </div>
      </div>
    );
  }

  const statusOptions = [
    { value: "All", label: "All Statuses" },
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <CustomHeaders
          title="Role Management"
          description="Manage user roles and permissions"
          buttonText="Add Role"
          onAdd={handleAddRole}
        />

        {/* Filters */}
        <CustomFilters
          filters={[
            {
              type: "search",
              placeholder: "Search roles...",
              value: searchTerm,
              onChange: setSearchTerm,
            },
            {
              type: "select",
              placeholder: "All Status",
              value: selectedStatus,
              onChange: setSelectedStatus,
              options: statusOptions,
            },
          ]}
        />

        {/* Table */}
        {allRoles.length === 0 && !isLoading ? (
          <CustomEmptyState
            title="No roles found"
            description="Get started by creating your first role."
            showAction={true}
            actionText="Add Role"
            onAction={handleAddRole}
          />
        ) : (
          <BaseTable
            tableHeaders={roleTableHeaders}
            tableData={
              <RoleTable
                data={allRoles}
                onView={handleViewRole}
                onEdit={handleEditRole}
                onDelete={handleDeleteRole}
              />
            }
            showAction={false}
          />
        )}

        <Pagination
          handlePageChange={handlePageChange}
          total={rolesData?.roles?.totalCount || 0}
          pageCount={rolesData?.roles?.totalPages || 1}
          currentPage={currentPage}
        />
      </div>

      {/* Delete Modal */}
      <DeleteModal
        visible={showDeleteModal}
        setVisible={setShowDeleteModal}
        onClose={handleCloseDeleteModal}
        handleDelete={confirmDelete}
        title="Delete Role"
        description={`Are you sure you want to delete "${deletingRole?.label}"? This action cannot be undone.`}
        isPending={isDeleting}
      />
    </div>
  );
};

export default Roles;
