import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CustomBackHeader from '@/components/common/CustomBackHeader';
import CustomLoader from '@/components/loader/CustomLoader';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import { Percent, CalendarDays, Users, CreditCard, Edit } from 'lucide-react';
import { useGetSingleCouponDetails } from '@/hooks/coupon.hook';
import { getValue } from '@/utils/object';

export default function ViewCoupon() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetSingleCouponDetails(id!);

  if (isLoading) return <CustomLoader text="Loading coupon details..." />;
  if (error || !data) return (
    <CustomEmptyState
      icon={<Percent className="h-12 w-12 text-gray-400" />}
      title="Coupon not found"
      description="The coupon you are looking for does not exist."
    />
  );

  const coupon = (data as { coupon?: Record<string, unknown> }).coupon || (data as Record<string, unknown>);
  const conditions = getValue(coupon, 'conditions') as Record<string, unknown>;
  
  const formatDate = (dateString: unknown) => {
    if (!dateString) return 'N/A';
    return new Date(dateString as string).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDiscountDisplay = () => {
    const discountType = getValue(coupon, 'discountType') as string;
    const discountValue = getValue(coupon, 'discountValue') as number;
    
    if (discountType === 'percentage') {
      return `${discountValue}%`;
    }
    return `$${discountValue}`;
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <CustomBackHeader
        title={`Coupon: ${getValue(coupon, 'code')}`}
        description="View coupon details and configuration"
        onBack={() => navigate('/coupons')}
        editButton={{
          onEdit: () => navigate(`/coupons/edit/${id}`),
          text: "Edit Coupon",
          icon: <Edit className="h-4 w-4" />
        }}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Coupon Code</label>
                <p className="text-lg font-mono bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded border text-gray-900 dark:text-white">
                  {getValue(coupon, 'code') || 'N/A'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                <p className="text-gray-900 dark:text-white">
                  {getValue(coupon, 'description') || 'No description provided'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Coupon Type</label>
                <p className="text-gray-900 dark:text-white capitalize">
                  {getValue(coupon, 'couponType') || 'N/A'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    getValue(coupon, 'isActive') ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    getValue(coupon, 'isActive') ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                  }`}>
                    {getValue(coupon, 'isActive') ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Discount Information */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Percent className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Discount Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Discount Type</label>
                <p className="text-gray-900 dark:text-white capitalize">
                  {getValue(coupon, 'discountType') === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Discount Value</label>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {getDiscountDisplay()}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Max Total Usage</label>
                <p className="text-gray-900 dark:text-white">
                  {getValue(coupon, 'maxTotalUsage') || 'Unlimited'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Times Used</label>
                <p className="text-gray-900 dark:text-white">
                  {getValue(coupon, 'timesUsed') || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validity Period */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Validity Period</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Valid From</label>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(getValue(conditions, 'validFrom'))}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Valid To</label>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(getValue(conditions, 'validTo'))}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</label>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(getValue(coupon, 'createdAt'))}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(getValue(coupon, 'updatedAt'))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Conditions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Usage Conditions</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Min Order Value</label>
                <p className="text-gray-900 dark:text-white">
                  {getValue(conditions, 'minOrderValue') ? `$${getValue(conditions, 'minOrderValue')}` : 'No minimum'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Max Order Value</label>
                <p className="text-gray-900 dark:text-white">
                  {getValue(conditions, 'maxOrderValue') ? `$${getValue(conditions, 'maxOrderValue')}` : 'No maximum'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">First Time Customer Only</label>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    getValue(conditions, 'firstTimeCustomer') ? 'bg-blue-500' : 'bg-gray-400'
                  }`} />
                  <span className="text-gray-900 dark:text-white">
                    {getValue(conditions, 'firstTimeCustomer') ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Max Usage Per Customer</label>
                <p className="text-gray-900 dark:text-white">
                  {getValue(conditions, 'maxUsagePerCustomer') || 'Unlimited'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate('/coupons')}>
          Back to Coupons
        </Button>
        <Button onClick={() => navigate(`/coupons/edit/${id}`)}>
          Edit Coupon
        </Button>
      </div>
    </div>
  );
}
