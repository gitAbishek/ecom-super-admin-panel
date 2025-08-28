import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseTable from "@/components/ui/BaseTable";
import CustomerTable from "@/components/CustomerTable";
import DeleteModal from "@/components/ui/DeleteModal";
import CustomHeaders from "@/components/common/CustomHeaders";
import CustomFilters from "@/components/common/CustomFilters";
import { useGetAllCustomers, useDeleteCustomer } from "@/hooks/payment.hook";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import { getValue } from "@/utils/object";
import { AlertTriangle, Users, Plus } from "lucide-react";
import CustomLoader from "@/components/loader/CustomLoader";
import CustomEmptyState from "@/components/common/CustomEmptyState";
import Pagination from "@/lib/pagination";
import { useDebounce } from "@/hooks/useDebounceSearch.hook";
import { customerTableHeaders } from "@/constants/tableHeaders";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  status: string;
  [key: string]: unknown;
}

export default function Customers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [limit] = useState(6);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(
    null
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const { mutateAsync: deleteCustomer, isPending: isDeleting } =
    useDeleteCustomer();

  // Navigate to add customer page
  const handleAddCustomer = () => {
    navigate("/customers/add");
  };

  // Fetch customers from API
  const {
    data: customersData,
    isLoading,
    error,
  } = useGetAllCustomers({
    page: currentPage + 1,
    limit,
    search: debouncedSearchTerm,
    filters: {
      status: selectedStatus,
    },
  });

  const handleViewCustomer = (customer: Customer) => {
    navigate(`/customers/view/${customer._id}`);
  };

  const handleEditCustomer = (customer: Customer) => {
    navigate(`/customers/edit/${customer._id}`);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setDeletingCustomer(customer);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deletingCustomer) {
      try {
        const response = await deleteCustomer(deletingCustomer._id);
        showSuccessMessage(
          getValue(response, "message") ||
            `Customer "${deletingCustomer.name}" deleted successfully!`
        );
        setDeletingCustomer(null);
        setShowDeleteModal(false);
      } catch (error) {
        showErrorMessage(
          getValue(error, "message") ||
            "Failed to delete customer. Please try again."
        );
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingCustomer(null);
  };

  const handlePageChange = (data: { selected: number }) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    if (customersData) {
      setAllCustomers(getValue(customersData, "customers.results", []));
    }
  }, [customersData]);

  // Loading state
  if (isLoading) {
    return <CustomLoader text="Loading customers..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
          <span>Error loading customers: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <CustomHeaders
        title="Customers"
        description="Manage and view customer information"
        onAdd={handleAddCustomer}
        buttonText="Add Customer"
      />

      {/* Filters */}
      <CustomFilters
        filters={[
          {
            type: "search",
            placeholder: "Search customers...",
            value: searchTerm,
            onChange: setSearchTerm,
          },
          {
            type: "select",
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: [
              { value: "All", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ],
          },
        ]}
      />

      {/* Customers Table */}
      <div className="overflow-hidden">
        {allCustomers.length === 0 ? (
          <CustomEmptyState
            icon={<Users className="h-12 w-12 text-gray-400" />}
            title="No customers found"
            description={
              debouncedSearchTerm
                ? "No customers match your search."
                : "Get started by adding your first customer."
            }
            showAction={!debouncedSearchTerm}
            actionText="Add Customer"
            onAction={handleAddCustomer}
            actionIcon={<Plus className="h-4 w-4 mr-2" />}
          />
        ) : (
          <BaseTable
            tableHeaders={customerTableHeaders}
            tableData={
              <CustomerTable
                data={allCustomers}
                onView={handleViewCustomer}
                onEdit={handleEditCustomer}
                onDelete={handleDeleteCustomer}
              />
            }
          />
        )}

        <Pagination
          handlePageChange={handlePageChange}
          total={getValue(customersData, "totalCount", allCustomers.length)}
          pageCount={Math.max(
            getValue(customersData, "totalPages", 0),
            allCustomers.length > 0 ? 1 : 0
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
        title="Delete Customer"
        description={
          deletingCustomer
            ? `Are you sure you want to delete customer "${deletingCustomer.name}"? This action cannot be undone.`
            : ""
        }
      />
    </div>
  );
}
