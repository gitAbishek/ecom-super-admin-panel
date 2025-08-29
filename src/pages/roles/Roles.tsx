import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseTable from "@/components/ui/BaseTable";
import RoleTable from "@/components/RoleTable";
import DeleteModal from "@/components/ui/DeleteModal";
import CustomHeaders from "@/components/common/CustomHeaders";
import CustomFilters from "@/components/common/CustomFilters";
import {
  useGetAllRoles,
  useDeleteRole,
} from "@/hooks/role.hook";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import { getValue } from "@/utils/object";
import { AlertTriangle, Shield, Plus } from "lucide-react";
import CustomLoader from "@/components/loader/CustomLoader";
import CustomEmptyState from "@/components/common/CustomEmptyState";
import Pagination from "@/lib/pagination";
import { useDebounce } from "@/hooks/useDebounceSearch.hook";
import { roleTableHeaders } from "@/constants/tableHeaders";
import type { RoleType } from "@/types/role";

export default function Roles() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allRoles, setAllRoles] = useState<RoleType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [limit] = useState(6);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingRole, setDeletingRole] = useState<RoleType | null>(
    null
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const { mutateAsync: deleteRole, isPending: isDeleting } =
    useDeleteRole();

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
    filter: {
      status: selectedStatus === "All" ? "" : selectedStatus,
    },
  });

  const handleViewRole = (role: RoleType) => {
    navigate(`/roles/view/${role._id}`);
  };

  const handleEditRole = (role: RoleType) => {
    navigate(`/roles/edit/${role._id}`);
  };

  const handleDeleteRole = (role: RoleType) => {
    setDeletingRole(role);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deletingRole) {
      try {
        const response = await deleteRole(deletingRole._id);
        showSuccessMessage(
          getValue(response, "message") ||
            `Role "${deletingRole.label}" deleted successfully!`
        );
        setDeletingRole(null);
        setShowDeleteModal(false);
      } catch (error) {
        showErrorMessage(
          getValue(error, "message") ||
            "Failed to delete role. Please try again."
        );
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingRole(null);
  };

  const handlePageChange = (data: { selected: number }) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    if (rolesData) {
      setAllRoles(getValue(rolesData, "roles.results", []));
    }
  }, [rolesData]);

  // Loading state
  if (isLoading) {
    return <CustomLoader text="Loading roles..." />;
  }

  // Error state
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <CustomHeaders
        title="Role Management"
        description="Manage user roles and access permissions"
        onAdd={handleAddRole}
        buttonText="Add Role"
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
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: [
              { value: "All", label: "All Status" },
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ],
          },
        ]}
      />

      {/* Roles Table */}
      <div className="overflow-hidden">
        {allRoles.length === 0 ? (
          <CustomEmptyState
            icon={<Shield className="h-12 w-12 text-gray-400" />}
            title="No roles found"
            description={
              debouncedSearchTerm
                ? "No roles match your search."
                : "Get started by adding your first role."
            }
            showAction={!debouncedSearchTerm}
            actionText="Add Role"
            onAction={handleAddRole}
            actionIcon={<Plus className="h-4 w-4 mr-2" />}
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
          />
        )}

        <Pagination
          handlePageChange={handlePageChange}
          total={getValue(rolesData, "roles.totalCount", allRoles.length)}
          pageCount={Math.max(getValue(rolesData, "roles.totalPages", 0), allRoles.length > 0 ? 1 : 0)}
          currentPage={currentPage}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        visible={showDeleteModal}
        setVisible={setShowDeleteModal}
        onClose={handleCloseDeleteModal}
        handleDelete={confirmDelete}
        isPending={isDeleting}
        title="Delete Role"
        description={
          deletingRole
            ? `Are you sure you want to delete the role "${deletingRole.label}"? This action cannot be undone.`
            : ""
        }
      />
    </div>
  );
}
