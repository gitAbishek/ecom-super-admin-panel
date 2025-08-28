import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Edit, Calendar, Tag, Folder, Users } from "lucide-react";
import { useGetSingleCategoriesDetails, type Category } from "@/hooks/categories.hook";
import CustomBackHeader from "@/components/common/CustomBackHeader";

export function CategoryDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Get single category details
  const { data: categoryData, isLoading, error } = useGetSingleCategoriesDetails(id!);

  // Get current category from API response
  const category = useMemo(() => {
    const apiData = categoryData as unknown as {
      category?: Category;
      data?: Category;
    };
    return apiData?.category || apiData?.data || null;
  }, [categoryData]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              Loading category details...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <CustomBackHeader
            title="Category Details"
            description="View category information and hierarchy"
            onBack={() => navigate("/categories")}
          />
        </div>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-md mx-auto">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Category Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base px-4">
              The category you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => navigate("/categories")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <CustomBackHeader
          title="Category Details"
          description="View category information and hierarchy"
          onBack={() => navigate("/categories")}
          editButton={{
            onEdit: () => navigate(`/categories/edit/${category._id}`),
            text: "Edit Category",
            icon: <Edit className="h-4 w-4" />
          }}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Information */}
        <div className="xl:col-span-2">
          <Card className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Category Name
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-lg font-medium text-gray-900 dark:text-gray-100 break-words">
                        {category.name}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Slug
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
                        {category.slug}
                      </span>
                    </div>
                  </div>

                  {category.description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Description
                      </label>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                        {category.description}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Status
                    </label>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          category.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hierarchy Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Category Hierarchy
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Parent Category
                    </label>
                    {category.parent ? (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Folder className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-900 dark:text-gray-100 break-words">
                          {category.parent.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Folder className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span className="text-blue-700 dark:text-blue-300 font-medium">
                          Root Category (No Parent)
                        </span>
                      </div>
                    )}
                  </div>

                  {category.children && category.children.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Child Categories ({category.children.length})
                      </label>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {category.children.map((child) => (
                          <div
                            key={child._id}
                            className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded"
                          >
                            <Folder className="h-3 w-3 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-900 dark:text-gray-100 break-words">
                              {child.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Stats */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Products</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  0
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Sub-categories</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {category.children?.length || 0}
                </span>
              </div>
            </div>
          </Card>

          {/* Metadata */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Metadata
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-3 w-3 text-gray-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Created
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 break-words">
                  {formatDate(category.createdAt)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-3 w-3 text-gray-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Last Updated
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 break-words">
                  {formatDate(category.updatedAt)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="h-3 w-3 text-gray-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Category ID
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono break-all">
                  {category._id}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
