import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseTable from "@/components/ui/BaseTable";
import TenantTable from "@/components/TenantTable";
import CustomHeaders from "@/components/common/CustomHeaders";
import CustomFilters from "@/components/common/CustomFilters";
import StatusUpdateModal from "@/components/ui/StatusUpdateModal";
import {
  useGetAllTenants,
  useUpdateTenantStatus,
} from "@/hooks/tenant.hook";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import { AlertTriangle, Building2 } from "lucide-react";
import CustomLoader from "@/components/loader/CustomLoader";
import CustomEmptyState from "@/components/common/CustomEmptyState";
import Pagination from "@/lib/pagination";
import { useDebounce } from "@/hooks/useDebounceSearch.hook";
import { tenantTableHeaders } from "@/constants/tableHeaders";
import type { Tenant } from "@/types/tenant";

const Tenants = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allTenants, setAllTenants] = useState<Tenant[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [limit] = useState(5);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const { mutateAsync: updateTenantStatus, isPending: isUpdatingStatus } = useUpdateTenantStatus();

  // Navigate to add tenant page
  const handleAddTenant = () => {
    navigate("/tenants/add");
  };

  // Fetch tenants from API
  const {
    data: tenantsData,
    isLoading,
    error,
  } = useGetAllTenants({
    page: currentPage + 1,
    limit,
    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    filter: selectedStatus !== "All" ? { status: selectedStatus.toLowerCase() } : {},
  });


  useEffect(() => {
    if (tenantsData?.data?.results) {
      setAllTenants(tenantsData.data.results);
    }
  }, [tenantsData]);

  // Handle view tenant
  const handleViewTenant = (tenant: Tenant) => {
    navigate(`/tenants/view/${tenant._id}`);
  };

  // Handle edit tenant
  const handleEditTenant = (tenant: Tenant) => {
    navigate(`/tenants/edit/${tenant._id}`);
  };

  // Handle status update
  const handleStatusUpdate = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowStatusModal(true);
  };

  // Confirm status update
  const confirmStatusUpdate = async (newStatus: string) => {
    if (!selectedTenant) return;

    try {
      await updateTenantStatus({
        tenantId: selectedTenant._id,
        status: newStatus
      });
      showSuccessMessage("Tenant status updated successfully");
      setShowStatusModal(false);
      setSelectedTenant(null);
    } catch (error) {
      console.error('Error updating tenant status:', error);
      showErrorMessage("Failed to update tenant status");
    }
  };

  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
    setSelectedTenant(null);
  };

  // Handle page change for pagination
  const handlePageChange = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  if (isLoading) {
    return <CustomLoader text="Loading tenants..." />;
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
          <span>Error loading tenants: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <CustomHeaders
        title="Tenant Management"
        description="Manage and monitor all tenants in your system"
        onAdd={handleAddTenant}
        buttonText="Add New Tenant"
      />

      {/* Filters */}
      <CustomFilters
        filters={[
          {
            type: "search",
            placeholder: "Search tenants...",
            value: searchTerm,
            onChange: setSearchTerm,
          },
          {
            type: "select",
            placeholder: "All Status",
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: [
              { value: "All", label: "All Status" },
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
              { value: "Suspended", label: "Suspended" },
            ],
          },
        ]}
      />

      {/* Table */}
      <div className="overflow-hidden">
          {allTenants.length === 0 ? (
            <CustomEmptyState
              icon={<Building2 className="h-12 w-12 text-gray-400" />}
              title="No Tenants Found"
              description={
                debouncedSearchTerm
                  ? "No tenants match your search."
                  : "Get started by creating your first tenant"
              }
              showAction={!debouncedSearchTerm}
              actionText="Add New Tenant"
              onAction={handleAddTenant}
            />
          ) : (
            <BaseTable
              tableHeaders={tenantTableHeaders}
              tableData={
                <TenantTable
                  data={allTenants}
                  onView={handleViewTenant}
                  onEdit={handleEditTenant}
                  onStatusUpdate={handleStatusUpdate}
                />
              }
            />
          )}

          <Pagination
            handlePageChange={handlePageChange}
            total={tenantsData?.data?.totalCount || 0}
            pageCount={tenantsData?.data?.totalPages || 1}
            currentPage={currentPage}
          />
        </div>

        {/* Status Update Modal */}
        <StatusUpdateModal
          visible={showStatusModal}
          onClose={handleCloseStatusModal}
          handleStatusUpdate={confirmStatusUpdate}
          title="Update Tenant Status"
          description={`Change the status for "${selectedTenant?.name}"`}
          currentStatus={selectedTenant?.status || ""}
          isPending={isUpdatingStatus}
        />
      </div>
    );
  };

export default Tenants;
