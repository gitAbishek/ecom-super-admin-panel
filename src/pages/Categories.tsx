import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseTable from "@/components/ui/BaseTable";
import CategoryTable from "@/components/CategoryTable";
import DeleteModal from "@/components/ui/DeleteModal";
import CustomHeaders from "@/components/common/CustomHeaders";
import CustomFilters from "@/components/common/CustomFilters";
import {
  useGetAllCategories,
  useDeleteCategory,
} from "@/hooks/categories.hook";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import { getValue } from "@/utils/object";
import { AlertTriangle, FolderOpen, Plus } from "lucide-react";
import CustomLoader from "@/components/loader/CustomLoader";
import CustomEmptyState from "@/components/common/CustomEmptyState";
import Pagination from "@/lib/pagination";
import { useDebounce } from "@/hooks/useDebounceSearch.hook";
import { categoryTableHeaders } from "@/constants/tableHeaders";
import type { CategoryType } from "@/types/category";

export function Categories() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const [selectedParent, setSelectedParent] = useState("All");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [limit] = useState(6);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<CategoryType | null>(
    null
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const { mutateAsync: deleteCategory, isPending: isDeleting } =
    useDeleteCategory();

  // Navigate to add category page
  const handleAddCategory = () => {
    navigate("/categories/add");
  };

  // Fetch categories from API
  const {
    data: categoriesData,
    isLoading,
    error,
  } = useGetAllCategories({
    page: currentPage,
    limit,
    search: debouncedSearchTerm,
    filter: {
      parentId: selectedParent === "All" ? "" : selectedParent === "Root" ? "null" : selectedParent,
    },
  });

  const handleViewCategory = (category: CategoryType) => {
    navigate(`/categories/view/${category._id}`);
  };

  const handleEditCategory = (category: CategoryType) => {
    navigate(`/categories/edit/${category._id}`);
  };

  const handleDeleteCategory = (category: CategoryType) => {
    setDeletingCategory(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deletingCategory) {
      try {
        const response = await deleteCategory(deletingCategory._id);
        showSuccessMessage(
          getValue(response, "message") ||
            `Category "${deletingCategory.name}" deleted successfully!`
        );
        setDeletingCategory(null);
        setShowDeleteModal(false);
      } catch (error) {
        showErrorMessage(
          getValue(error, "message") ||
            "Failed to delete category. Please try again."
        );
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingCategory(null);
  };

  const handlePageChange = (data: { selected: number }) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    if (categoriesData) {
      setAllCategories(getValue(categoriesData, "categories.results", []));
    }
  }, [categoriesData]);

  // Loading state
  if (isLoading) {
    return <CustomLoader text="Loading categories..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
          <span>Error loading categories: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <CustomHeaders
        title="Categories"
        description="Manage your product categories and subcategories"
        onAdd={handleAddCategory}
        buttonText="Add Category"
      />

      {/* Filters */}
      <CustomFilters
        filters={[
          {
            type: "search",
            placeholder: "Search categories...",
            value: searchTerm,
            onChange: setSearchTerm,
          },
          {
            type: "select",
            value: selectedParent,
            onChange: setSelectedParent,
            options: [
              { value: "All", label: "All Categories" },
              { value: "Root", label: "Root Categories" },
              { value: "Subcategories", label: "Subcategories" },
            ],
          },
        ]}
      />

      {/* Categories Table */}
      <div className="overflow-hidden">
        {allCategories.length === 0 ? (
          <CustomEmptyState
            icon={<FolderOpen className="h-12 w-12 text-gray-400" />}
            title="No categories found"
            description={
              debouncedSearchTerm
                ? "No categories match your search."
                : "Get started by adding your first category."
            }
            showAction={!debouncedSearchTerm}
            actionText="Add Category"
            onAction={handleAddCategory}
            actionIcon={<Plus className="h-4 w-4 mr-2" />}
          />
        ) : (
          <BaseTable
            tableHeaders={categoryTableHeaders}
            tableData={
              <CategoryTable
                data={allCategories}
                onView={handleViewCategory}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
              />
            }
          />
        )}

        <Pagination
          handlePageChange={handlePageChange}
          total={getValue(categoriesData, "categories.totalCount", 0)}
          pageCount={getValue(categoriesData, "categories.totalPages", 0)}
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
        title="Delete Category"
        description={
          deletingCategory
            ? `Are you sure you want to delete the category "${deletingCategory.name}"? This action cannot be undone.`
            : ""
        }
      />
    </div>
  );
}
