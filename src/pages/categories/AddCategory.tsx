import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import CustomBackHeader from "@/components/common/CustomBackHeader";
import {
  FormProvider,
  useForm,
} from "react-hook-form";
import type { SubmitHandler, FieldValues } from "react-hook-form";
import { useAddCategories, useGetAllCategories } from "@/hooks/categories.hook";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import { getValue } from "@/utils/object";
import type { Category } from "@/hooks/categories.hook";

export function AddCategory() {
  const navigate = useNavigate();
  const methods = useForm();
  const [slug, setSlug] = useState("");

  const { data: categoriesData } = useGetAllCategories();
  const { mutateAsync: createCategory, isPending } = useAddCategories();

  // Get available categories for parent selection
  const availableCategories = useMemo(() => {
    const apiData = categoriesData as unknown as {
      categories?: { results?: Category[] };
      results?: Category[];
    };
    return apiData?.categories?.results || apiData?.results || [];
  }, [categoriesData]);

  // Auto-generate slug from name
  const watchedName = methods.watch("name");
  useEffect(() => {
    if (watchedName) {
      const generatedSlug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
      methods.setValue("slug", generatedSlug);
    }
  }, [watchedName, methods]);

  const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
    try {
      const submitData = {
        name: data.name,
        slug: data.slug,
        parentId: data.parentId || null,
      };

      const response = await createCategory(submitData);
      showSuccessMessage(
        getValue(response, "message", "Category created successfully")
      );
      navigate("/categories");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create category";
      showErrorMessage(getValue(error, "message", errorMessage));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <CustomBackHeader
          title="Add New Category"
          description="Create a new product category"
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
                {availableCategories.map((category: Category) => (
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
                {isPending ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
