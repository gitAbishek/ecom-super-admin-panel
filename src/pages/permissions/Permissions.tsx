import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseTable from "@/components/ui/BaseTable";
import PermissionTableNew from "@/components/PermissionTableNew";
import DeleteModal from "@/components/ui/DeleteModal";
import CustomHeaders from "@/components/common/CustomHeaders";
import CustomFilters from "@/components/common/CustomFilters";
import {
  useGetAllPermissions,
  useDeletePermission,
} from "@/hooks/permission.hook";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import { getValue } from "@/utils/object";
import { AlertTriangle, Shield, Plus } from "lucide-react";
import CustomLoader from "@/components/loader/CustomLoader";
import CustomEmptyState from "@/components/common/CustomEmptyState";
import Pagination from "@/lib/pagination";
import { useDebounce } from "@/hooks/useDebounceSearch.hook";
import { permissionTableHeaders } from "@/constants/tableHeaders";
import type { PermissionType } from "@/types/permission";

export default function Permissions() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allPermissions, setAllPermissions] = useState<PermissionType[]>([]);
  const [selectedResource, setSelectedResource] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [limit] = useState(6);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPermission, setDeletingPermission] =
    useState<PermissionType | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const { mutateAsync: deletePermission, isPending: isDeleting } =
    useDeletePermission();

  // Navigate to add permission page
  const handleAddPermission = () => {
    navigate("/permissions/add");
  };

  // Fetch permissions from API
  const {
    data: permissionsData,
    isLoading,
    error,
  } = useGetAllPermissions({
    page: currentPage + 1,
    limit,
    search: debouncedSearchTerm,
    filter: {
      resource: selectedResource === "All" ? "" : selectedResource,
      status: selectedStatus === "All" ? "" : selectedStatus,
    },
  });

  const handleViewPermission = (permission: PermissionType) => {
    navigate(`/permissions/view/${permission._id}`);
  };

  const handleEditPermission = (permission: PermissionType) => {
    navigate(`/permissions/edit/${permission._id}`);
  };

  const handleDeletePermission = (permission: PermissionType) => {
    setDeletingPermission(permission);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deletingPermission) {
      try {
        const response = await deletePermission(deletingPermission._id);
        showSuccessMessage(
          getValue(response, "message") ||
            `Permission "${deletingPermission.name}" deleted successfully!`
        );
        setDeletingPermission(null);
        setShowDeleteModal(false);
      } catch (error) {
        showErrorMessage(
          getValue(error, "message") ||
            "Failed to delete permission. Please try again."
        );
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingPermission(null);
  };

  const handlePageChange = (data: { selected: number }) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    if (permissionsData) {
      setAllPermissions(getValue(permissionsData, "data", []));
    }
  }, [permissionsData]);

  console.log({ permissionsData });
  console.log({ allPermissions });
  // Get unique resources for filter
  const uniqueResources = [
    ...new Set(allPermissions.map((p) => p.resource)),
  ].filter(Boolean);

  // Loading state
  if (isLoading) {
    return <CustomLoader text="Loading permissions..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
          <span>Error loading permissions: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <CustomHeaders
        title="Permission Management"
        description="Manage system permissions and access controls"
        onAdd={handleAddPermission}
        buttonText="Add Permission"
      />

      {/* Filters */}
      <CustomFilters
        filters={[
          {
            type: "search",
            placeholder: "Search permissions...",
            value: searchTerm,
            onChange: setSearchTerm,
          },
          {
            type: "select",
            value: selectedResource,
            onChange: setSelectedResource,
            options: [
              { value: "All", label: "All Resources" },
              ...uniqueResources.map((resource) => ({
                value: resource,
                label: resource,
              })),
            ],
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

      {/* Permissions Table */}
      <div className="overflow-hidden">
        {allPermissions.length === 0 ? (
          <CustomEmptyState
            icon={<Shield className="h-12 w-12 text-gray-400" />}
            title="No permissions found"
            description={
              debouncedSearchTerm
                ? "No permissions match your search."
                : "Get started by adding your first permission."
            }
            showAction={!debouncedSearchTerm}
            actionText="Add Permission"
            onAction={handleAddPermission}
            actionIcon={<Plus className="h-4 w-4 mr-2" />}
          />
        ) : (
          <BaseTable
            tableHeaders={permissionTableHeaders}
            tableData={
              <PermissionTableNew
                data={allPermissions}
                onView={handleViewPermission}
                onEdit={handleEditPermission}
                onDelete={handleDeletePermission}
              />
            }
          />
        )}

        <Pagination
          handlePageChange={handlePageChange}
          total={getValue(
            permissionsData,
            "permissions.totalCount",
            allPermissions.length
          )}
          pageCount={Math.max(
            getValue(permissionsData, "permissions.totalPages", 0),
            allPermissions.length > 0 ? 1 : 0
          )}
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
        title="Delete Permission"
        description={
          deletingPermission
            ? `Are you sure you want to delete the permission "${deletingPermission.name}"? This action cannot be undone.`
            : ""
        }
      />
    </div>
  );
}
