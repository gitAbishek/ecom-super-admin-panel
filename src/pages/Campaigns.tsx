import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import CustomHeaders from '@/components/common/CustomHeaders';
import CustomFilters from '@/components/common/CustomFilters';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import CustomLoader from '@/components/loader/CustomLoader';
import BaseTable from '@/components/ui/BaseTable';
import CampaignTable from '@/components/CampaignTable';
import DeleteModal from '@/components/ui/DeleteModal';
import type { Campaign } from '@/types/campaign';
import { useGetAllCampaigns, useDeleteCampaign } from '@/hooks/campaign.hook';
import { getValue } from '@/utils/object';
import { showErrorMessage, showSuccessMessage } from '@/utils/toast';
import { Megaphone } from 'lucide-react';

export default function Campaigns() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null);

  const { mutateAsync: deleteCampaign, isPending: isDeleting } = useDeleteCampaign();

  // Fetch campaigns
  const { data: campaignsData, isLoading, error } = useGetAllCampaigns({
    page: 1,
    limit: 20,
    campaignType: selectedType !== 'All' ? selectedType : undefined,
    isActive: selectedStatus !== 'All' ? selectedStatus === 'Active' : undefined,
    search: searchTerm || undefined,
  });

  // Transform API data
  const apiData = campaignsData as unknown as {
    campaigns?: Record<string, unknown>[];
    results?: Record<string, unknown>[];
  };
  const apiCampaigns = apiData?.campaigns || apiData?.results || [];
  const campaigns = apiCampaigns.map((c: Record<string, unknown>) => ({
    id: getValue(c, '_id') as string,
    name: getValue(c, 'name') as string,
    description: getValue(c, 'description') as string,
    campaignType: getValue(c, 'campaignType') as string,
    discountType: getValue(c, 'discountType') as string,
    discountValue: getValue(c, 'discountValue') as number,
    isActive: getValue(c, 'isActive') as boolean,
    validFrom: getValue(c, 'validFrom') as string,
    validTo: getValue(c, 'validTo') as string,
    maxTotalUsage: getValue(c, 'maxTotalUsage') as number,
    createdAt: getValue(c, 'createdAt') as string,
  }));

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    const name = getValue(campaign, 'name') ?? '';
    const type = getValue(campaign, 'campaignType') ?? '';
    const isActive = getValue(campaign, 'isActive') ?? false;
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || type === selectedType;
    const matchesStatus = selectedStatus === 'All' || 
      (selectedStatus === 'Active' && isActive) || 
      (selectedStatus === 'Inactive' && !isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const tableHeaders = [
    { title: 'Name' },
    { title: 'Type' },
    { title: 'Discount' },
    { title: 'Status' },
    { title: 'Valid Until' },
  ];

  // Actions
  const handleViewCampaign = (campaign: Campaign) => {
    navigate(`/campaigns/view/${campaign.id}`);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    navigate(`/campaigns/edit/${campaign.id}`);
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    setDeletingCampaign(campaign);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deletingCampaign) {
      try {
        const response = await deleteCampaign(deletingCampaign.id);
        showSuccessMessage(getValue(response, "message") || `Campaign "${deletingCampaign.name}" deleted successfully!`);
        
        // Invalidate campaigns query to refetch the list
        queryClient.invalidateQueries({ queryKey: ["campaigns"] });
        
        setDeletingCampaign(null);
        setShowDeleteModal(false);
      } catch (error) {
        showErrorMessage(getValue(error, "message") || 'Failed to delete campaign. Please try again.');
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingCampaign(null);
  };

  // Loading state
  if (isLoading) return <CustomLoader text="Loading campaigns..." />;
  if (error) return (
    <div className="p-6 flex items-center justify-center min-h-[400px]">
      <span className="text-red-600 dark:text-red-400">
        {getValue(error, 'message') || 'Failed to load campaigns.'}
      </span>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <CustomHeaders
        title="Campaigns"
        description="Manage marketing campaigns and promotions"
        onAdd={() => navigate('/campaigns/add')}
        buttonText="Add Campaign"
      />
      <CustomFilters
        filters={[
          {
            type: 'search',
            placeholder: 'Search campaigns by name...',
            value: searchTerm,
            onChange: setSearchTerm,
          },
          {
            type: 'select',
            value: selectedType,
            onChange: setSelectedType,
            options: [
              { value: 'All', label: 'All Types' },
              { value: 'discount', label: 'Discount' },
              { value: 'bogo', label: 'Buy One Get One' },
              { value: 'free_shipping', label: 'Free Shipping' },
              { value: 'cashback', label: 'Cashback' },
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
          {filteredCampaigns.length === 0 ? (
            <CustomEmptyState
              icon={<Megaphone className="h-12 w-12 text-gray-400" />}
              title="No campaigns found"
              description={searchTerm ? 'No campaigns match your search.' : 'No campaigns have been created yet.'}
            />
          ) : (
            <BaseTable
              tableHeaders={tableHeaders}
              tableData={
                <CampaignTable
                  data={filteredCampaigns}
                  onView={handleViewCampaign}
                  onEdit={handleEditCampaign}
                  onDelete={handleDeleteCampaign}
                />
              }
              showAction={true}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingCampaign && (
        <DeleteModal
          visible={showDeleteModal}
          setVisible={setShowDeleteModal}
          onClose={handleCloseDeleteModal}
          handleDelete={confirmDelete}
          isPending={isDeleting}
          title="Delete Campaign"
          description={`Are you sure you want to delete the campaign "${deletingCampaign.name}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
