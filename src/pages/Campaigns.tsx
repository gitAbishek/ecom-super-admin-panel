import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseTable from "@/components/ui/BaseTable";
import CampaignTable from "@/components/CampaignTable";
import DeleteModal from "@/components/ui/DeleteModal";
import CustomHeaders from "@/components/common/CustomHeaders";
import CustomFilters from "@/components/common/CustomFilters";
import { useGetAllCampaigns, useDeleteCampaign } from "@/hooks/campaign.hook";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import { getValue } from "@/utils/object";
import { AlertTriangle, Megaphone, Plus } from "lucide-react";
import CustomLoader from "@/components/loader/CustomLoader";
import CustomEmptyState from "@/components/common/CustomEmptyState";
import Pagination from "@/lib/pagination";
import { useDebounce } from "@/hooks/useDebounceSearch.hook";
import { campaignTableHeaders } from "@/constants/tableHeaders";
import type { Campaign } from "@/types/campaign";

export default function Campaigns() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [limit] = useState(6);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(
    null
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const { mutateAsync: deleteCampaign, isPending: isDeleting } =
    useDeleteCampaign();

  // Navigate to add campaign page
  const handleAddCampaign = () => {
    navigate("/campaigns/add");
  };

  // Fetch campaigns from API
  const {
    data: campaignsData,
    isLoading,
    error,
  } = useGetAllCampaigns({
    page: currentPage + 1,
    limit,
    search: debouncedSearchTerm,
    filters: {
      status: selectedStatus,
      type: selectedType,
    },
  });

  const handleViewCampaign = (campaign: Campaign) => {
    navigate(`/campaigns/view/${campaign._id}`);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    navigate(`/campaigns/edit/${campaign._id}`);
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    setDeletingCampaign(campaign);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deletingCampaign) {
      try {
        const response = await deleteCampaign(deletingCampaign._id);
        showSuccessMessage(
          getValue(response, "message") ||
            `Campaign "${deletingCampaign.name}" deleted successfully!`
        );
        setDeletingCampaign(null);
        setShowDeleteModal(false);
      } catch (error) {
        showErrorMessage(
          getValue(error, "message") ||
            "Failed to delete campaign. Please try again."
        );
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingCampaign(null);
  };

  const handlePageChange = (data: { selected: number }) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };


  useEffect(() => {
    if (campaignsData) {
      setAllCampaigns(getValue(campaignsData, "campaigns", []));
    }
  }, [campaignsData]);

  // Loading state
  if (isLoading) {
    return <CustomLoader text="Loading campaigns..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
          <span>Error loading campaigns: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <CustomHeaders
        title="Campaigns"
        description="Manage your marketing campaigns and promotions"
        onAdd={handleAddCampaign}
        buttonText="Add Campaign"
      />

      {/* Filters */}
      <CustomFilters
        filters={[
          {
            type: "search",
            placeholder: "Search campaigns...",
            value: searchTerm,
            onChange: setSearchTerm,
          },
          {
            type: "select",
            value: selectedType,
            onChange: setSelectedType,
            options: [
              { value: "All", label: "All Types" },
              { value: "discount", label: "Discount" },
              { value: "bogo", label: "Buy One Get One" },
              { value: "free_shipping", label: "Free Shipping" },
              { value: "cashback", label: "Cashback" },
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

      {/* Campaigns Table */}
      <div className="overflow-hidden">
        {allCampaigns.length === 0 ? (
          <CustomEmptyState
            icon={<Megaphone className="h-12 w-12 text-gray-400" />}
            title="No campaigns found"
            description={
              debouncedSearchTerm
                ? "No campaigns match your search."
                : "Get started by adding your first campaign."
            }
            showAction={!debouncedSearchTerm}
            actionText="Add Campaign"
            onAction={handleAddCampaign}
            actionIcon={<Plus className="h-4 w-4 mr-2" />}
          />
        ) : (
          <BaseTable
            tableHeaders={campaignTableHeaders}
            tableData={
              <CampaignTable
                data={allCampaigns}
                onView={handleViewCampaign}
                onEdit={handleEditCampaign}
                onDelete={handleDeleteCampaign}
              />
            }
          />
        )}

        <Pagination
          handlePageChange={handlePageChange}
          total={getValue(campaignsData, "totalCount", 0)}
          pageCount={getValue(campaignsData, "totalPages", 0)}
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
        title="Delete Campaign"
        description={
          deletingCampaign
            ? `Are you sure you want to delete the campaign "${deletingCampaign.name}"? This action cannot be undone.`
            : ""
        }
      />
    </div>
  );
}
