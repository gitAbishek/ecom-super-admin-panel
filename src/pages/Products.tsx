import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseTable from "@/components/ui/BaseTable";
import ProductTable from "@/components/ProductTable";
import DeleteModal from "@/components/ui/DeleteModal";
import CustomHeaders from "@/components/common/CustomHeaders";
import CustomFilters from "@/components/common/CustomFilters";
import {
  useGetAllProducts,
  useDeleteProduct,
} from "@/hooks/product.hook";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import { getValue } from "@/utils/object";
import { AlertTriangle, Package, Plus } from "lucide-react";
import CustomLoader from "@/components/loader/CustomLoader";
import CustomEmptyState from "@/components/common/CustomEmptyState";
import Pagination from "@/lib/pagination";
import { useDebounce } from "@/hooks/useDebounceSearch.hook";
import { productTableHeaders } from "@/constants/tableHeaders";
import type { ProductType } from "@/types/product";

export function Products() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [limit] = useState(6);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<ProductType | null>(
    null
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const { mutateAsync: deleteProduct, isPending: isDeleting } =
    useDeleteProduct();

  // Navigate to add product page
  const handleAddProduct = () => {
    navigate("/products/add");
  };

  // Fetch products from API
  const {
    data: productsData,
    isLoading,
    error,
  } = useGetAllProducts({
    page: currentPage,
    limit,
    search: debouncedSearchTerm,
    filter: {
      status: selectedStatus === "All" ? "" : selectedStatus.toLowerCase(),
    },
  });

  const handleViewProduct = (product: ProductType) => {
    navigate(`/products/view/${product._id}`);
  };

  const handleEditProduct = (product: ProductType) => {
    navigate(`/products/edit/${product._id}`);
  };

  const handleDeleteProduct = (product: ProductType) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deletingProduct) {
      try {
        const response = await deleteProduct(deletingProduct.id);
        showSuccessMessage(
          getValue(response, "message") ||
            `Product "${deletingProduct.name}" deleted successfully!`
        );
        setDeletingProduct(null);
        setShowDeleteModal(false);
      } catch (error) {
        showErrorMessage(
          getValue(error, "message") ||
            "Failed to delete product. Please try again."
        );
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingProduct(null);
  };

  const handlePageChange = (data: { selected: number }) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    if (productsData) {
      //   // Transform API products to match our interface (map _id to id)
      //   const transformedProducts = products.map((product: Product) => ({
      //     ...product,
      //     id: product._id,
      //   }));
      setAllProducts(getValue(productsData, "products.results", []));
    }
  }, [productsData]);

  // Loading state
  if (isLoading) {
    return <CustomLoader text="Loading products..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
          <span>Error loading products: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <CustomHeaders
        title="Products"
        description="Manage your product inventory and catalog"
        onAdd={handleAddProduct}
        buttonText="Add Product"
      />

      {/* Filters */}
      <CustomFilters
        filters={[
          {
            type: "search",
            placeholder: "Search products...",
            value: searchTerm,
            onChange: setSearchTerm,
          },
          {
            type: "select",
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: [
              //   { value: "all", label: "all status" },
              { value: "active", label: "active" },
              { value: "inactive", label: "inactive" },
            ],
          },
        ]}
      />

      {/* Products Table */}
      <div className="overflow-hidden">
        {allProducts.length === 0 ? (
          <CustomEmptyState
            icon={<Package className="h-12 w-12 text-gray-400" />}
            title="No products found"
            description={
              searchTerm
                ? "No products match your search."
                : "Get started by adding your first product."
            }
            showAction={!searchTerm}
            actionText="Add Product"
            onAction={handleAddProduct}
            actionIcon={<Plus className="h-4 w-4 mr-2" />}
          />
        ) : (
          <BaseTable
            tableHeaders={productTableHeaders}
            tableData={
              <ProductTable
                data={allProducts}
                onView={handleViewProduct}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            }
          />
        )}

        <Pagination
          handlePageChange={handlePageChange}
          total={getValue(productsData, "products.totalCount", 0)}
          pageCount={getValue(productsData, "products.totalPages", 0)}
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
        title="Delete Product"
        description={
          deletingProduct
            ? `Are you sure you want to delete the product "${deletingProduct.name}"? This action cannot be undone.`
            : ""
        }
      />
    </div>
  );
}
