import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseTable from "@/components/ui/BaseTable";
import CouponTable from "@/components/CouponTable";
import DeleteModal from "@/components/ui/DeleteModal";
import CustomHeaders from "@/components/common/CustomHeaders";
import CustomFilters from "@/components/common/CustomFilters";
import { useGetAllCoupons, useDeleteCoupon } from "@/hooks/coupon.hook";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import { getValue } from "@/utils/object";
import { AlertTriangle, TicketPercent, Plus } from "lucide-react";
import CustomLoader from "@/components/loader/CustomLoader";
import CustomEmptyState from "@/components/common/CustomEmptyState";
import Pagination from "@/lib/pagination";
import { useDebounce } from "@/hooks/useDebounceSearch.hook";
import { couponTableHeaders } from "@/constants/tableHeaders";
import type { Coupon } from "@/types/coupon";

export default function Coupons() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allCoupons, setAllCoupons] = useState<Coupon[]>([]);
  const [selectedDistribution, setSelectedDistribution] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [limit] = useState(6);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(
    null
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const { mutateAsync: deleteCoupon, isPending: isDeleting } =
    useDeleteCoupon();

  // Navigate to add coupon page
  const handleAddCoupon = () => {
    navigate("/coupons/add");
  };

  // Fetch coupons from API
  const {
    data: couponsData,
    isLoading,
    error,
  } = useGetAllCoupons({
    page: currentPage + 1,
    limit,
    search: debouncedSearchTerm,
    filters: {
      distributionMethod: selectedDistribution,
      status: selectedStatus,
    },
  });

  const handleViewCoupon = (coupon: Coupon) => {
    navigate(`/coupons/view/${coupon.id}`);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    navigate(`/coupons/edit/${coupon.id}`);
  };

  const handleDeleteCoupon = (coupon: Coupon) => {
    setDeletingCoupon(coupon);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deletingCoupon) {
      try {
        const response = await deleteCoupon(deletingCoupon.id);
        showSuccessMessage(
          getValue(response, "message") ||
            `Coupon "${deletingCoupon.code}" deleted successfully!`
        );
        setDeletingCoupon(null);
        setShowDeleteModal(false);
      } catch (error) {
        showErrorMessage(
          getValue(error, "message") ||
            "Failed to delete coupon. Please try again."
        );
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingCoupon(null);
  };

  const handlePageChange = (data: { selected: number }) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    if (couponsData) {
      setAllCoupons(getValue(couponsData, "coupons", []));
    }
  }, [couponsData]);

  // Loading state
  if (isLoading) {
    return <CustomLoader text="Loading coupons..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
          <span>Error loading coupons: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <CustomHeaders
        title="Coupons"
        description="Manage discount coupons and promotional codes"
        onAdd={handleAddCoupon}
        buttonText="Add Coupon"
      />

      {/* Filters */}
      <CustomFilters
        filters={[
          {
            type: "search",
            placeholder: "Search coupons...",
            value: searchTerm,
            onChange: setSearchTerm,
          },
          {
            type: "select",
            value: selectedDistribution,
            onChange: setSelectedDistribution,
            options: [
              { value: "All", label: "All Distribution" },
              { value: "public", label: "Public" },
              { value: "private", label: "Private" },
              { value: "targeted", label: "Targeted" },
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

      {/* Coupons Table */}
      <div className="overflow-hidden">
        {allCoupons.length === 0 ? (
          <CustomEmptyState
            icon={<TicketPercent className="h-12 w-12 text-gray-400" />}
            title="No coupons found"
            description={
              debouncedSearchTerm
                ? "No coupons match your search."
                : "Get started by adding your first coupon."
            }
            showAction={!debouncedSearchTerm}
            actionText="Add Coupon"
            onAction={handleAddCoupon}
            actionIcon={<Plus className="h-4 w-4 mr-2" />}
          />
        ) : (
          <BaseTable
            tableHeaders={couponTableHeaders}
            tableData={
              <CouponTable
                data={allCoupons}
                onView={handleViewCoupon}
                onEdit={handleEditCoupon}
                onDelete={handleDeleteCoupon}
              />
            }
          />
        )}

        <Pagination
          handlePageChange={handlePageChange}
          total={getValue(couponsData, "totalCount", 0)}
          pageCount={getValue(couponsData, "totalPages", 0)}
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
        title="Delete Coupon"
        description={
          deletingCoupon
            ? `Are you sure you want to delete the coupon "${deletingCoupon.code}"? This action cannot be undone.`
            : ""
        }
      />
    </div>
  );
}
