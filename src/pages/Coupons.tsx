import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import CustomHeaders from '@/components/common/CustomHeaders';
import CustomFilters from '@/components/common/CustomFilters';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import CustomLoader from '@/components/loader/CustomLoader';
import BaseTable from '@/components/ui/BaseTable';
import CouponTable from '@/components/CouponTable';
import DeleteModal from '@/components/ui/DeleteModal';
import type { Coupon } from '@/types/coupon';
import { useGetAllCoupons, useDeleteCoupon } from '@/hooks/coupon.hook';
import { getValue } from '@/utils/object';
import { showErrorMessage, showSuccessMessage } from '@/utils/toast';
import { TicketPercent } from 'lucide-react';

export default function Coupons() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistribution, setSelectedDistribution] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);

  const { mutateAsync: deleteCoupon, isPending: isDeleting } = useDeleteCoupon();

  // Fetch coupons
  const { data: couponsData, isLoading, error } = useGetAllCoupons({
    page: 1,
    limit: 20,
    distributionMethod: selectedDistribution !== 'All' ? selectedDistribution : undefined,
    isActive: selectedStatus !== 'All' ? selectedStatus === 'Active' : undefined,
    search: searchTerm || undefined,
  });

  // Transform API data
  const apiData = couponsData as unknown as {
    coupons?: Record<string, unknown>[];
    results?: Record<string, unknown>[];
  };
  const apiCoupons = apiData?.coupons || apiData?.results || [];
  const coupons = apiCoupons.map((c: Record<string, unknown>) => ({
    id: getValue(c, '_id') as string,
    code: getValue(c, 'code') as string,
    discountType: getValue(c, 'discountType') as string,
    discountValue: getValue(c, 'discountValue') as number,
    isActive: getValue(c, 'isActive') as boolean,
    maxUsage: getValue(c, 'maxUsage') as number,
    distributionMethod: getValue(c, 'distributionMethod') as string,
    createdAt: getValue(c, 'createdAt') as string,
    conditions: getValue(c, 'conditions') as Record<string, unknown>,
  }));

  // Filtered coupons
  const filteredCoupons = coupons.filter((coupon) => {
    const code = getValue(coupon, 'code') ?? '';
    const isActive = getValue(coupon, 'isActive') ?? false;
    
    const matchesSearch = code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || 
      (selectedStatus === 'Active' && isActive) || 
      (selectedStatus === 'Inactive' && !isActive);
    
    return matchesSearch && matchesStatus;
  });

  const tableHeaders = [
    { title: 'Code' },
    { title: 'Discount' },
    { title: 'Distribution' },
    { title: 'Status' },
    { title: 'Max Usage' },
    { title: 'Valid Until' },
  ];

  // Actions
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
        showSuccessMessage(getValue(response, "message") || `Coupon "${deletingCoupon.code}" deleted successfully!`);
        
        // Invalidate coupons query to refetch the list
        queryClient.invalidateQueries({ queryKey: ["coupons"] });
        
        setDeletingCoupon(null);
        setShowDeleteModal(false);
      } catch (error) {
        showErrorMessage(getValue(error, "message") || 'Failed to delete coupon. Please try again.');
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingCoupon(null);
  };

  // Loading state
  if (isLoading) return <CustomLoader text="Loading coupons..." />;
  if (error) return (
    <div className="p-6 flex items-center justify-center min-h-[400px]">
      <span className="text-red-600 dark:text-red-400">
        {getValue(error, 'message') || 'Failed to load coupons.'}
      </span>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <CustomHeaders
        title="Coupons"
        description="Manage discount coupons and promotional codes"
        onAdd={() => navigate('/coupons/add')}
        buttonText="Add Coupon"
      />
      <CustomFilters
        filters={[
          {
            type: 'search',
            placeholder: 'Search coupons by code...',
            value: searchTerm,
            onChange: setSearchTerm,
          },
          {
            type: 'select',
            value: selectedDistribution,
            onChange: setSelectedDistribution,
            options: [
              { value: 'All', label: 'All Methods' },
              { value: 'email', label: 'Email' },
              { value: 'sms', label: 'SMS' },
              { value: 'manual', label: 'Manual' },
              { value: 'bulk', label: 'Bulk' },
            ],
          },
          {
            type: 'select',
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: [
              { value: 'All', label: 'All Status' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ],
          },
        ]}
      />
      <Card>
        <CardContent className="p-0">
          {filteredCoupons.length === 0 ? (
            <CustomEmptyState
              icon={<TicketPercent className="h-12 w-12 text-gray-400" />}
              title="No coupons found"
              description={searchTerm ? 'No coupons match your search.' : 'No coupons have been created yet.'}
            />
          ) : (
            <BaseTable
              tableHeaders={tableHeaders}
              tableData={
                <CouponTable
                  data={filteredCoupons}
                  onView={handleViewCoupon}
                  onEdit={handleEditCoupon}
                  onDelete={handleDeleteCoupon}
                />
              }
              showAction={true}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingCoupon && (
        <DeleteModal
          visible={showDeleteModal}
          setVisible={setShowDeleteModal}
          onClose={handleCloseDeleteModal}
          handleDelete={confirmDelete}
          isPending={isDeleting}
          title="Delete Coupon"
          description={`Are you sure you want to delete the coupon "${deletingCoupon.code}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
