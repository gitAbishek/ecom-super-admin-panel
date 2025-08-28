import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import CustomBackHeader from "@/components/common/CustomBackHeader";
import {
  FormProvider,
  useForm,
  type SubmitHandler,
  type FieldValues,
} from "react-hook-form";
import { 
  useUpdateCategory, 
  useGetAllCategories,
  useGetSingleCategoriesDetails,
  type Category 
} from "@/hooks/categories.hook";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import { getValue } from "@/utils/object";

export function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const methods = useForm();
  const [slug, setSlug] = useState("");

  // Get single category details
  const { data: categoryData, isLoading } = useGetSingleCategoriesDetails(id!);
  const { data: categoriesData } = useGetAllCategories();
  const { mutateAsync: updateCategory, isPending } = useUpdateCategory();

  // Get current category from API response
  const currentCategory = useMemo(() => {
    const apiData = categoryData as unknown as {
      category?: Category;
      data?: Category;
    };
    return apiData?.category || apiData?.data || null;
  }, [categoryData]);

  // Get available categories for parent selection
  const allCategories = useMemo(() => {
    const apiData = categoriesData as unknown as {
      categories?: { results?: Category[] };
      results?: Category[];
    };
    return apiData?.categories?.results || apiData?.results || [];
  }, [categoriesData]);
  
  // Initialize form with category data
  useEffect(() => {
    if (currentCategory) {
      // Reset form with current category data
      methods.reset({
        name: currentCategory.name,
        slug: currentCategory.slug,
        parentId: currentCategory.parentId || "",
      });
      setSlug(currentCategory.slug);
    }
  }, [currentCategory, methods]);

  // Filter available parents (exclude self and children)
  const availableParents = allCategories.filter((category: Category) => {
    if (category._id === id) return false; // Exclude self
    // TODO: Add logic to exclude children if needed
    return true;
  });

  // Auto-generate slug from name (only if manually changed)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    methods.setValue("name", name);
    
    // Only auto-generate slug if it matches the current slug pattern
    if (currentCategory && slug === currentCategory.slug) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
      methods.setValue("slug", generatedSlug);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
    try {
      if (!id) return;
      
      const submitData = {
        name: data.name,
        slug: data.slug,
        parentId: data.parentId || null,
      };

      const response = await updateCategory({ id, body: submitData });
      showSuccessMessage(
        getValue(response, "message", "Category updated successfully")
      );
      navigate("/categories");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update category";
      showErrorMessage(getValue(error, "message", errorMessage));
    }
  };

  if (!currentCategory && isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-gray-600 dark:text-gray-300">Loading category...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <CustomBackHeader
          title={`Update category: ${currentCategory?.name || "Loading..."}`}
          description="Edit category information"
          onBack={() => navigate("/categories")}
        />
      </div>

      {/* Form */}
      <Card className="p-6">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category Name *
                </label>
                <Input
                  {...methods.register("name", { required: "Name is required" })}
                  onChange={handleNameChange}
                  placeholder="Enter category name"
                  className="w-full"
                />
                {methods.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {methods.formState.errors.name.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Slug *
                </label>
                <Input
                  {...methods.register("slug", { required: "Slug is required" })}
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    methods.setValue("slug", e.target.value);
                  }}
                  placeholder="category-slug"
                  className="w-full"
                />
                {methods.formState.errors.slug && (
                  <p className="text-red-500 text-sm mt-1">
                    {methods.formState.errors.slug.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Parent Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Parent Category
              </label>
              <select
                {...methods.register("parentId")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Root Category (No Parent)</option>
                {availableParents.map((category: Category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/categories")}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isPending ? "Updating..." : "Update Category"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
