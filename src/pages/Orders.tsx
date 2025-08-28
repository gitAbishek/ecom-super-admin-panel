import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import CustomHeaders from "@/components/common/CustomHeaders";
import CustomFilters from "@/components/common/CustomFilters";
import CustomEmptyState from "@/components/common/CustomEmptyState";
import CustomLoader from "@/components/loader/CustomLoader";
import BaseTable from "@/components/ui/BaseTable";
import OrderTable from "@/components/OrderTable";
import Pagination from "@/lib/pagination";
import DeleteModal from "@/components/ui/DeleteModal";
import { useDebounce } from "@/hooks/useDebounceSearch.hook";
import { orderTableHeaders } from "@/constants/tableHeaders";
import type { Order } from "@/types/order";
import { useGetAllOrders, useDeleteOrder } from "@/hooks/order.hook";
import { getValue } from "@/utils/object";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import { Package } from "lucide-react";
import { checkIfEmpty } from "@/utils/validation";

export default function Orders() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(20);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

  // Debounced search
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  // Prepare filters
  const filters = selectedStatus === "All" ? {} : { status: selectedStatus };

  // Delete mutation
  const { mutateAsync: deleteOrder, isPending: isDeleting } = useDeleteOrder();

  // Fetch orders with search and filters
  const {
    data: ordersData,
    isLoading,
    error,
  } = useGetAllOrders({
    page: currentPage + 1,
    limit: itemsPerPage,
    search: debouncedSearchTerm,
    filters,
  });

  // Sync orders with allOrders state
  useEffect(() => {
    if (!checkIfEmpty(getValue(ordersData, "orders.results"))) {
      setAllOrders(getValue(ordersData, "orders.results"));
    }
  }, [ordersData]);

  // Handle page change
  const handlePageChange = (page: { selected: number }) => {
    setCurrentPage(page.selected);
  };

  // Handle view order
  const handleViewOrder = (order: Order) => {
    navigate(`/orders/view/${order.id}`);
  };

  // Handle edit order
  const handleEditOrder = (order: Order) => {
    navigate(`/orders/edit/${order.id}`);
  };

  // Handle delete order
  const handleDeleteOrder = (order: Order) => {
    setDeletingOrder(order);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (deletingOrder) {
      try {
        const response = await deleteOrder(deletingOrder.id);
        showSuccessMessage(
          getValue(response, "message") ||
            `Order "${deletingOrder.id}" deleted successfully!`
        );

        // Invalidate orders query to refetch the list
        queryClient.invalidateQueries({ queryKey: ["orders"] });

        setDeletingOrder(null);
        setShowDeleteModal(false);
      } catch (error) {
        showErrorMessage(
          getValue(error, "message") ||
            "Failed to delete order. Please try again."
        );
      }
    }
  };

  // Handle close delete modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingOrder(null);
  };

  // Loading state
  if (isLoading) return <CustomLoader text="Loading orders..." />;

  if (error)
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <span className="text-red-600 dark:text-red-400">
          {getValue(error, "message") || "Failed to load orders."}
        </span>
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <CustomHeaders
        title="Orders"
        description="Manage and track all customer orders"
        onAdd={() => {}}
      />

      <CustomFilters
        filters={[
          {
            type: "search",
            placeholder: "Search orders by customer...",
            value: searchTerm,
            onChange: setSearchTerm,
          },
          {
            type: "select",
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: [
              { value: "All", label: "All Status" },
              { value: "Pending", label: "Pending" },
              { value: "Processing", label: "Processing" },
              { value: "Completed", label: "Completed" },
              { value: "Cancelled", label: "Cancelled" },
              { value: "Refunded", label: "Refunded" },
            ],
          },
        ]}
      />

      <Card>
        <CardContent className="p-0">
          {allOrders.length === 0 ? (
            <CustomEmptyState
              icon={<Package className="h-12 w-12 text-gray-400" />}
              title="No orders found"
              description={
                debouncedSearchTerm
                  ? "No orders match your search criteria."
                  : "No orders have been placed yet."
              }
            />
          ) : (
            <>
              <BaseTable
                tableHeaders={orderTableHeaders}
                tableData={
                  <OrderTable
                    data={allOrders}
                    onView={handleViewOrder}
                    onEdit={handleEditOrder}
                    onDelete={handleDeleteOrder}
                  />
                }
                showAction={true}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Pagination
        total={getValue(ordersData, "orders.totalCount", 0)}
        pageCount={getValue(ordersData, "orders.totalPages", 0)}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingOrder && (
        <DeleteModal
          visible={showDeleteModal}
          setVisible={setShowDeleteModal}
          onClose={handleCloseDeleteModal}
          handleDelete={confirmDelete}
          isPending={isDeleting}
          title="Delete Order"
          description={`Are you sure you want to delete order "${deletingOrder.id}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
