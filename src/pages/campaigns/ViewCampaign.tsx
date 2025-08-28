import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import CustomBackHeader from '@/components/common/CustomBackHeader';
import CustomLoader from '@/components/loader/CustomLoader';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import { Megaphone, Edit } from 'lucide-react';
import { useGetSingleCampaignDetails } from '@/hooks/campaign.hook';
import { getValue } from '@/utils/object';

export default function ViewCampaign() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetSingleCampaignDetails(id!);

  if (isLoading) return <CustomLoader text="Loading campaign details..." />;
  if (error || !data) return (
    <CustomEmptyState
      icon={<Megaphone className="h-12 w-12 text-gray-400" />}
      title="Campaign not found"
      description="The campaign you are looking for does not exist."
    />
  );

  const campaign = (data as { campaign?: Record<string, unknown> }).campaign || (data as Record<string, unknown>);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <CustomBackHeader
        title={`Campaign: ${getValue(campaign, 'name') || 'Unknown'}`}
        description={`Status: ${getValue(campaign, 'isActive') ? 'Active' : 'Inactive'}`}
        onBack={() => navigate('/campaigns')}
        editButton={{
          onEdit: () => navigate(`/campaigns/edit/${id}`),
          text: "Edit Campaign",
          icon: <Edit className="h-4 w-4" />
        }}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Campaign Name</label>
                <p className="text-sm font-medium">{getValue(campaign, 'name') || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-sm">{getValue(campaign, 'description') || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Campaign Type</label>
                <p className="text-sm capitalize">{getValue(campaign, 'campaignType') || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  getValue(campaign, 'isActive') 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {getValue(campaign, 'isActive') ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Discount Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Discount Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Discount Type</label>
                <p className="text-sm capitalize">{getValue(campaign, 'discountType') || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Discount Value</label>
                <p className="text-sm font-semibold">
                  {getValue(campaign, 'discountType') === 'percentage' 
                    ? `${getValue(campaign, 'discountValue')}%` 
                    : `$${Number(getValue(campaign, 'discountValue')).toFixed(2)}`}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Max Total Usage</label>
                <p className="text-sm">{getValue(campaign, 'maxTotalUsage') || 'Unlimited'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Current Usage</label>
                <p className="text-sm">{getValue(campaign, 'currentUsage') || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validity Period */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Validity Period</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Valid From</label>
                <p className="text-sm">{getValue(campaign, 'validFrom') ? new Date(getValue(campaign, 'validFrom')).toLocaleString() : 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Valid To</label>
                <p className="text-sm">{getValue(campaign, 'validTo') ? new Date(getValue(campaign, 'validTo')).toLocaleString() : 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="text-sm">{getValue(campaign, 'createdAt') ? new Date(getValue(campaign, 'createdAt')).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conditions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Conditions</h3>
            <div className="space-y-3">
              {(() => {
                const conditions = getValue(campaign, 'conditions') as Record<string, unknown>;
                return (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Min Order Value</label>
                      <p className="text-sm">${Number(getValue(conditions, 'minOrderValue')).toFixed(2) || '0.00'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Max Order Value</label>
                      <p className="text-sm">${Number(getValue(conditions, 'maxOrderValue')).toFixed(2) || 'No limit'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Max Usage Per Customer</label>
                      <p className="text-sm">{getValue(conditions, 'maxUsagePerCustomer') || 'Unlimited'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">First Time Customer Only</label>
                      <p className="text-sm">{getValue(conditions, 'firstTimeCustomer') ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Applicable Categories</label>
                      <p className="text-sm">
                        {(() => {
                          const categories = getValue(conditions, 'applicableCategories') as string[];
                          return categories && categories.length > 0 ? categories.join(', ') : 'All categories';
                        })()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Excluded Products</label>
                      <p className="text-sm">
                        {(() => {
                          const excludedProducts = getValue(conditions, 'excludeProducts') as string[];
                          return excludedProducts && excludedProducts.length > 0 ? excludedProducts.join(', ') : 'None';
                        })()}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
