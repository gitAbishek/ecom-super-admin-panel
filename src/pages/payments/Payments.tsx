import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseTable from "@/components/ui/BaseTable";
import PaymentTable from "@/components/PaymentTable";
import DeleteModal from "@/components/ui/DeleteModal";
import CustomHeaders from "@/components/common/CustomHeaders";
import CustomFilters from "@/components/common/CustomFilters";
import { useGetAllPayments, useDeletePayment } from "@/hooks/payment.hook";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import { getValue } from "@/utils/object";
import { AlertTriangle, CreditCard, Plus } from "lucide-react";
import CustomLoader from "@/components/loader/CustomLoader";
import CustomEmptyState from "@/components/common/CustomEmptyState";
import Pagination from "@/lib/pagination";
import { useDebounce } from "@/hooks/useDebounceSearch.hook";
import { paymentTableHeaders } from "@/constants/tableHeaders";

interface Payment {
  _id: string;
  customer: string;
  amount: number;
  method: string;
  status: string;
  date: string;
  [key: string]: unknown;
}

export default function Payments() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [selectedMethod, setSelectedMethod] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [limit] = useState(6);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPayment, setDeletingPayment] = useState<Payment | null>(
    null
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const { mutateAsync: deletePayment, isPending: isDeleting } =
    useDeletePayment();

  // Navigate to add payment page
  const handleAddPayment = () => {
    navigate("/payments/add");
  };

  // Fetch payments from API
  const {
    data: paymentsData,
    isLoading,
    error,
  } = useGetAllPayments({
    page: currentPage + 1,
    limit,
    search: debouncedSearchTerm,
    filters: {
      method: selectedMethod,
      status: selectedStatus,
    },
  });

  const handleViewPayment = (payment: Payment) => {
    navigate(`/payments/view/${payment._id}`);
  };

  const handleEditPayment = (payment: Payment) => {
    navigate(`/payments/edit/${payment._id}`);
  };

  const handleDeletePayment = (payment: Payment) => {
    setDeletingPayment(payment);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deletingPayment) {
      try {
        const response = await deletePayment(deletingPayment._id);
        showSuccessMessage(
          getValue(response, "message") ||
            `Payment #${deletingPayment._id.slice(0, 8)} deleted successfully!`
        );
        setDeletingPayment(null);
        setShowDeleteModal(false);
      } catch (error) {
        showErrorMessage(
          getValue(error, "message") ||
            "Failed to delete payment. Please try again."
        );
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingPayment(null);
  };

  const handlePageChange = (data: { selected: number }) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    if (paymentsData) {
     setAllPayments(getValue(paymentsData, "payments.results", []));
    }
  }, [paymentsData]);

  console.log({allPayments});

  // Loading state
  if (isLoading) {
    return <CustomLoader text="Loading payments..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
          <span>Error loading payments: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <CustomHeaders
        title="Payments"
        description="Track and manage payment transactions"
        onAdd={handleAddPayment}
        buttonText="Add Payment"
      />

      {/* Filters */}
      <CustomFilters
        filters={[
          {
            type: "search",
            placeholder: "Search payments...",
            value: searchTerm,
            onChange: setSearchTerm,
          },
          {
            type: "select",
            value: selectedMethod,
            onChange: setSelectedMethod,
            options: [
              { value: "All", label: "All Methods" },
              { value: "credit_card", label: "Credit Card" },
              { value: "debit_card", label: "Debit Card" },
              { value: "paypal", label: "PayPal" },
              { value: "bank_transfer", label: "Bank Transfer" },
              { value: "cash", label: "Cash" },
            ],
          },
          {
            type: "select",
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: [
              { value: "All", label: "All Status" },
              { value: "completed", label: "Completed" },
              { value: "pending", label: "Pending" },
              { value: "failed", label: "Failed" },
              { value: "refunded", label: "Refunded" },
            ],
          },
        ]}
      />

      {/* Payments Table */}
      <div className="overflow-hidden">
        {allPayments.length === 0 ? (
          <CustomEmptyState
            icon={<CreditCard className="h-12 w-12 text-gray-400" />}
            title="No payments found"
            description={
              debouncedSearchTerm
                ? "No payments match your search."
                : "Get started by adding your first payment."
            }
            showAction={!debouncedSearchTerm}
            actionText="Add Payment"
            onAction={handleAddPayment}
            actionIcon={<Plus className="h-4 w-4 mr-2" />}
          />
        ) : (
          <BaseTable
            tableHeaders={paymentTableHeaders}
            tableData={
              <PaymentTable
                data={Array.isArray(allPayments) ? allPayments : []}
                onView={handleViewPayment}
                onEdit={handleEditPayment}
                onDelete={handleDeletePayment}
              />
            }
          />
        )}

        <Pagination
          handlePageChange={handlePageChange}
          total={getValue(paymentsData, "totalCount", allPayments.length)}
          pageCount={Math.max(getValue(paymentsData, "totalPages", 0), allPayments.length > 0 ? 1 : 0)}
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
        title="Delete Payment"
        description={
          deletingPayment
            ? `Are you sure you want to delete payment #${deletingPayment._id.slice(0, 8)}? This action cannot be undone.`
            : ""
        }
      />
    </div>
  );
}
