import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DeleteModal from '@/components/ui/DeleteModal'
import BaseTable from '@/components/ui/BaseTable'
import InventoryTable from '@/components/InventoryTable'
import CustomHeaders from '@/components/common/CustomHeaders'
import CustomFilters from '@/components/common/CustomFilters'
import { useGetAllInventories, useDeleteInventory } from '@/hooks/inventories.hook'
import CustomEmptyState from '@/components/common/CustomEmptyState'
import { showErrorMessage, showSuccessMessage } from '@/utils/toast'
import { getValue } from '@/utils/object'
import {
  Plus,
  Package,
  AlertTriangle,
} from 'lucide-react'
import CustomLoader from '@/components/loader/CustomLoader'

// Inventory interfaces
interface InventoryItem {
  _id: string;
  productId: string;
  variantId: string;
  quantity: number;
  productName?: string;
  variantName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function Inventories() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingInventory, setDeletingInventory] = useState<InventoryItem | null>(null)

  // Fetch data
  const { 
    data: inventoriesData, 
    isLoading: isLoadingInventories, 
    error: inventoriesError 
  } = useGetAllInventories()

  const { mutateAsync: deleteInventory, isPending: isDeletingInventory } = useDeleteInventory()

  // Extract inventories from response
  const inventories = (() => {
    if (!inventoriesData) return [];
    
    const responseData = inventoriesData as unknown as {
      inventories?: { results?: InventoryItem[] };
      results?: InventoryItem[];
    };
    
    return responseData?.inventories?.results || responseData?.results || [];
  })();


  // Filter inventories based on search
  const filteredInventories = inventories.filter(inventory => {
    if (!searchTerm) return true;

    
    const searchLower = searchTerm.toLowerCase();
    return (
      inventory.productName?.toLowerCase().includes(searchLower) ||
      inventory.variantName?.toLowerCase().includes(searchLower) ||
      inventory.productId.toLowerCase().includes(searchLower) ||
      inventory.variantId.toLowerCase().includes(searchLower)
    );
  });

  // Table headers for BaseTable
  const tableHeaders = [
    { title: 'Product' },
    { title: 'Variant' },
    { title: 'Quantity' },
    { title: 'Stock Status' },
    { title: 'Actions' },
  ];

  const handleAddInventory = () => {
    navigate('/inventories/add')
  }

  const handleViewInventory = (inventory: InventoryItem) => {
    navigate(`/inventories/view/${inventory._id}`)
  }

  const handleEditInventory = (inventory: InventoryItem) => {
    navigate(`/inventories/edit/${inventory._id}`)
  }

  const handleDeleteInventory = (inventory: InventoryItem) => {
    setDeletingInventory(inventory)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (deletingInventory) {
      try {
        const response = await deleteInventory(deletingInventory._id)
        showSuccessMessage(getValue(response, "message") || `Inventory for "${deletingInventory.productName || deletingInventory.productId}" deleted successfully!`)
        setDeletingInventory(null)
        setShowDeleteModal(false)
      } catch (error) {
        showErrorMessage(getValue(error, "message") || "Failed to delete inventory. Please try again.")
        setDeletingInventory(null)
        setShowDeleteModal(false)
      }
    }
  }

  const cancelDelete = () => {
    setDeletingInventory(null)
    setShowDeleteModal(false)
  }

  if (inventoriesError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Failed to Load Inventories
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {getValue(inventoriesError, "message") || "An unexpected error occurred"}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header & Filters Section */}
        <div className="mb-8">
          <CustomHeaders
            title="Inventory Management"
            description="Manage your product inventory levels"
            onAdd={handleAddInventory}
            buttonText="Add Inventory"
          />
          <div className="pt-6">
            <CustomFilters
              filters={[
                {
                  type: 'search',
                  placeholder: 'Search inventories by product or variant...',
                  value: searchTerm,
                  onChange: setSearchTerm
                }
              ]}
            />
          </div>
        </div>

        {/* Inventories Table */}
        <Card>
          <CardContent className="p-0">
            {isLoadingInventories ? (
              <CustomLoader text="Loading inventories..." />
            ) : filteredInventories.length === 0 ? (
              <CustomEmptyState
                icon={<Package className="h-12 w-12 text-gray-400" />}
                title="No inventories found"
                description={searchTerm ? 'No inventories match your search.' : 'Get started by adding your first inventory item.'}
                showAction={!searchTerm}
                actionText="Add Inventory"
                onAction={handleAddInventory}
                actionIcon={<Plus className="h-4 w-4 mr-2" />}
              />
            ) : (
              <BaseTable
                tableHeaders={tableHeaders}
                tableData={
                  <InventoryTable
                    data={filteredInventories}
                    onView={handleViewInventory}
                    onEdit={handleEditInventory}
                    onDelete={handleDeleteInventory}
                  />
                }
                showAction={true}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingInventory && (
        <DeleteModal
          visible={showDeleteModal}
          title="Delete Inventory"
          description={`Are you sure you want to delete the inventory for "${deletingInventory.productName || deletingInventory.productId}" - "${deletingInventory.variantName || deletingInventory.variantId}"? This action cannot be undone.`}
          handleDelete={confirmDelete}
          onClose={cancelDelete}
          setVisible={setShowDeleteModal}
          isPending={isDeletingInventory}
        />
      )}
    </div>
  )
}
