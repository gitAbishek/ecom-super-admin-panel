import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseTable from "@/components/ui/BaseTable";
import StaffTableNew from "@/components/StaffTableNew";
import DeleteModal from "@/components/ui/DeleteModal";
import CustomHeaders from "@/components/common/CustomHeaders";
import CustomFilters from "@/components/common/CustomFilters";
import {
  useGetAllStaff,
  useDeleteStaff,
} from "@/hooks/staff.hook";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import { getValue } from "@/utils/object";
import { AlertTriangle, Users, Plus } from "lucide-react";
import CustomLoader from "@/components/loader/CustomLoader";
import CustomEmptyState from "@/components/common/CustomEmptyState";
import Pagination from "@/lib/pagination";
import { useDebounce } from "@/hooks/useDebounceSearch.hook";
import { staffTableHeaders } from "@/constants/tableHeaders";
import type { StaffType } from "@/types/staff";

export default function Staff() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allStaff, setAllStaff] = useState<StaffType[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [limit] = useState(6);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingStaff, setDeletingStaff] = useState<StaffType | null>(
    null
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const { mutateAsync: deleteStaff, isPending: isDeleting } =
    useDeleteStaff();

  // Navigate to add staff page
  const handleAddStaff = () => {
    navigate("/staff/add");
  };

  // Fetch staff from API
  const {
    data: staffData,
    isLoading,
    error,
  } = useGetAllStaff({
    page: currentPage + 1,
    limit,
    search: debouncedSearchTerm,
    filter: {
      department: selectedDepartment === "All" ? "" : selectedDepartment,
      status: selectedStatus === "All" ? "" : selectedStatus,
    },
  });

  const handleViewStaff = (staff: StaffType) => {
    navigate(`/staff/view/${staff._id}`);
  };

  const handleEditStaff = (staff: StaffType) => {
    navigate(`/staff/edit/${staff._id}`);
  };

  const handleDeleteStaff = (staff: StaffType) => {
    setDeletingStaff(staff);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deletingStaff) {
      try {
        const response = await deleteStaff(deletingStaff._id);
        showSuccessMessage(
          getValue(response, "message") ||
            `Staff member "${deletingStaff.firstName} ${deletingStaff.lastName}" deleted successfully!`
        );
        setDeletingStaff(null);
        setShowDeleteModal(false);
      } catch (error) {
        showErrorMessage(
          getValue(error, "message") ||
            "Failed to delete staff member. Please try again."
        );
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingStaff(null);
  };

  const handlePageChange = (data: { selected: number }) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    if (staffData) {
      // Transform the API data to match our StaffType interface
      const rawStaff = getValue(staffData, "data.results", []);
      const transformedStaff = rawStaff.map((member: Record<string, unknown>) => ({
        _id: getValue(member, '_id') || '',
        firstName: getValue(member, 'firstName') || '',
        lastName: getValue(member, 'lastName') || '',
        email: getValue(member, 'email') || '',
        phone: getValue(member, 'mobile') || '',
        role: getValue(member, 'role.label') || getValue(member, 'jobTitle') || '',
        department: getValue(member, 'department') || '',
        status: getValue(member, 'employmentStatus') || (getValue(member, 'isActive') ? 'Active' : 'Inactive'),
        isActive: getValue(member, 'isActive') !== false,
        joiningDate: getValue(member, 'hireDate') || getValue(member, 'createdAt') || '',
        createdAt: getValue(member, 'createdAt') || '',
        updatedAt: getValue(member, 'updatedAt') || '',
      }));
      setAllStaff(transformedStaff);
    }
  }, [staffData]);

  // Get unique departments for filter
  const uniqueDepartments = [...new Set(allStaff.map(s => s.department))].filter(Boolean);

  // Loading state
  if (isLoading) {
    return <CustomLoader text="Loading staff..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
          <span>Error loading staff: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <CustomHeaders
        title="Staff Management"
        description="Manage your staff members and their information"
        onAdd={handleAddStaff}
        buttonText="Add Staff"
      />

      {/* Filters */}
      <CustomFilters
        filters={[
          {
            type: "search",
            placeholder: "Search staff...",
            value: searchTerm,
            onChange: setSearchTerm,
          },
          {
            type: "select",
            value: selectedDepartment,
            onChange: setSelectedDepartment,
            options: [
              { value: "All", label: "All Departments" },
              ...uniqueDepartments.map(dept => ({ value: dept, label: dept })),
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

      {/* Staff Table */}
      <div className="overflow-hidden">
        {allStaff.length === 0 ? (
          <CustomEmptyState
            icon={<Users className="h-12 w-12 text-gray-400" />}
            title="No staff found"
            description={
              debouncedSearchTerm
                ? "No staff match your search."
                : "Get started by adding your first staff member."
            }
            showAction={!debouncedSearchTerm}
            actionText="Add Staff"
            onAction={handleAddStaff}
            actionIcon={<Plus className="h-4 w-4 mr-2" />}
          />
        ) : (
          <BaseTable
            tableHeaders={staffTableHeaders}
            tableData={
              <StaffTableNew
                data={allStaff}
                onView={handleViewStaff}
                onEdit={handleEditStaff}
                onDelete={handleDeleteStaff}
              />
            }
          />
        )}

        <Pagination
          handlePageChange={handlePageChange}
          total={getValue(staffData, "data.totalCount", allStaff.length)}
          pageCount={Math.max(getValue(staffData, "data.totalPages", 0), allStaff.length > 0 ? 1 : 0)}
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
        title="Delete Staff"
        description={
          deletingStaff
            ? `Are you sure you want to delete staff member "${deletingStaff.firstName} ${deletingStaff.lastName}"? This action cannot be undone.`
            : ""
        }
      />
    </div>
  );
}
