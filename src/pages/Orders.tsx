import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import CustomHeaders from "@/components/common/CustomHeaders";
import CustomFilters from "@/components/common/CustomFilters";
import CustomEmptyState from "@/components/common/CustomEmptyState";
import CustomLoader from "@/components/loader/CustomLoader";
import BaseTable from "@/components/ui/BaseTable";
import OrderTable from "@/components/OrderTable";
import type { Order } from "@/types/order";
import { useGetAllOrders } from "@/hooks/order.hook";
import { getValue } from "@/utils/object";
import { Package } from "lucide-react";

export default function Orders() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  // Removed unused delete modal state

  // Fetch orders (static page/limit, since pagination is not implemented)
  const {
    data: ordersData,
    isLoading,
    error,
  } = useGetAllOrders({ page: 1, limit: 20 });

  // Removed unused updateOrder and deleteOrder logic

  // Transform API data to Order[]
  const apiData = ordersData as unknown as {
    orders?: { results?: Record<string, unknown>[] };
    results?: Record<string, unknown>[];
  };
  const apiOrders = apiData?.orders?.results || apiData?.results || [];
  const orders: Order[] = apiOrders.map((o: Record<string, unknown>) => ({
    id: getValue(o, '_id') as string,
    customer:
      (getValue(o, 'customerName') as string) ||
      (getValue(o, 'customer') as string) ||
      ((getValue(o, 'user') as { name?: string })?.name ?? 'N/A'),
    status: getValue(o, 'status') as string,
    total: (getValue(o, 'total') as number) || (getValue(o, 'amount') as number) || 0,
    createdAt: getValue(o, 'createdAt') as string,
  }));

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const customer = getValue(order, 'customer') ?? '';
    const status = getValue(order, 'status') ?? '';
    const matchesSearch = customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const tableHeaders = [
    { title: "Customer" },
    { title: "Status" },
    { title: "Total" },
    { title: "Created" },
  ];

  // Actions
  const handleViewOrder = (order: Order) => {
    navigate(`/orders/view/${order.id}`);
  };
  const handleEditOrder = (order: Order) => {
    navigate(`/orders/edit/${order.id}`);
  };

  // Loading state
  if (isLoading) return <CustomLoader text="Loading orders..." />;
  if (error)
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <span className="text-red-600 dark:text-red-400">
          {getValue(error, 'message') || 'Failed to load orders.'}
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
          {filteredOrders.length === 0 ? (
            <CustomEmptyState
              icon={<Package className="h-12 w-12 text-gray-400" />}
              title="No orders found"
              description={
                searchTerm
                  ? "No orders match your search."
                  : "No orders have been placed yet."
              }
            />
          ) : (
            <BaseTable
              tableHeaders={tableHeaders}
              tableData={
                <OrderTable
                  data={filteredOrders}
                  onView={handleViewOrder}
                  onEdit={handleEditOrder}
                />
              }
              showAction={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
