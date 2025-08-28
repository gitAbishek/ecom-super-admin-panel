import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, X, Loader2 } from "lucide-react";
import CustomBackHeader from "@/components/common/CustomBackHeader";
import {
  FormProvider,
  useForm,
  useFieldArray,
  type SubmitHandler,
} from "react-hook-form";
import { 
  useAddProduct,
  type ProductFormData,
} from "@/hooks/product.hook";
import { useGetAllCategories, type Category } from "@/hooks/categories.hook";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import { CustomInput, CustomSelect, CustomTextArea, CustomLabel, CustomMultiSelectCheckbox } from "@/components/form";
import { getValue } from "@/utils/object";

export default function AddProduct() {
  const navigate = useNavigate();
  const methods = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      categories: [],
      status: "active",
      visible: true,
      inventory: 0,
      tags: [],
      relatedProducts: [],
      images: [],
      variants: [
        {
          sku: "",
          name: "",
          price: 0,
          stock: 0,
          attributes: {},
          media: [],
        },
      ],
      seo: {
        title: "",
        description: "",
        keywords: [],
      },
    },
  });

  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedImagePreviews, setSelectedImagePreviews] = useState<string[]>([]);
  const [variantMediaFiles, setVariantMediaFiles] = useState<File[][]>([]);
  const [variantMediaPreviews, setVariantMediaPreviews] = useState<string[][]>([]);

  const { data: categoriesData } = useGetAllCategories();
  const { mutateAsync: createProduct, isPending } = useAddProduct();

  // Get available categories
  const availableCategories = useMemo(() => {
    const apiData = categoriesData as unknown as {
      categories?: { results?: Category[] };
      results?: Category[];
    };
    return apiData?.categories?.results || apiData?.results || [];
  }, [categoriesData]);

  // Category options for CustomSelect
  const categoryOptions = useMemo(() => 
    availableCategories.map((category) => ({
      value: category._id,
      label: category.name,
    })), [availableCategories]
  );

  // Status options
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "draft", label: "Draft" },
  ];

  // Variants field array
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: methods.control,
    name: "variants",
  });

  // Add tag
  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = methods.getValues("tags");
      if (!currentTags.includes(tagInput.trim())) {
        methods.setValue("tags", [...currentTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    const currentTags = methods.getValues("tags");
    methods.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  // Add keyword
  const addKeyword = () => {
    if (keywordInput.trim()) {
      const currentKeywords = methods.getValues("seo.keywords");
      if (!currentKeywords.includes(keywordInput.trim())) {
        methods.setValue("seo.keywords", [...currentKeywords, keywordInput.trim()]);
      }
      setKeywordInput("");
    }
  };

  // Remove keyword
  const removeKeyword = (keywordToRemove: string) => {
    const currentKeywords = methods.getValues("seo.keywords");
    methods.setValue("seo.keywords", currentKeywords.filter(keyword => keyword !== keywordToRemove));
  };

  // Add variant
  const addVariant = () => {
    appendVariant({
      sku: "",
      name: "",
      price: 0,
      stock: 0,
      attributes: {},
      media: [],
    });
    
    // Initialize empty media arrays for the new variant
    setVariantMediaFiles(prev => [...prev, []]);
    setVariantMediaPreviews(prev => [...prev, []]);
  };

  // Handle image selection and preview
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedImages(fileArray);
      
      // Create preview URLs
      const previewUrls = fileArray.map(file => URL.createObjectURL(file));
      setSelectedImagePreviews(previewUrls);
    }
  };

  // Remove selected image
  const removeSelectedImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = selectedImagePreviews.filter((_, i) => i !== index);
    
    // Revoke the removed URL to prevent memory leaks
    URL.revokeObjectURL(selectedImagePreviews[index]);
    
    setSelectedImages(newImages);
    setSelectedImagePreviews(newPreviews);
  };

  // Cleanup preview URLs on component unmount
  useEffect(() => {
    return () => {
      selectedImagePreviews.forEach(url => URL.revokeObjectURL(url));
      variantMediaPreviews.flat().forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedImagePreviews, variantMediaPreviews]);

  // Handle variant media change
  const handleVariantMediaChange = (variantIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      
      // Update variant media files
      const newVariantMediaFiles = [...variantMediaFiles];
      newVariantMediaFiles[variantIndex] = fileArray;
      setVariantMediaFiles(newVariantMediaFiles);
      
      // Create preview URLs
      const previewUrls = fileArray.map(file => URL.createObjectURL(file));
      const newVariantMediaPreviews = [...variantMediaPreviews];
      
      // Cleanup old preview URLs for this variant
      if (variantMediaPreviews[variantIndex]) {
        variantMediaPreviews[variantIndex].forEach(url => URL.revokeObjectURL(url));
      }
      
      newVariantMediaPreviews[variantIndex] = previewUrls;
      setVariantMediaPreviews(newVariantMediaPreviews);
    }
  };

  // Remove variant media file
  const removeVariantMediaFile = (variantIndex: number, fileIndex: number) => {
    const newVariantMediaFiles = [...variantMediaFiles];
    const newVariantMediaPreviews = [...variantMediaPreviews];
    
    // Revoke the removed URL to prevent memory leaks
    if (variantMediaPreviews[variantIndex] && variantMediaPreviews[variantIndex][fileIndex]) {
      URL.revokeObjectURL(variantMediaPreviews[variantIndex][fileIndex]);
    }
    
    // Remove the file and preview
    newVariantMediaFiles[variantIndex] = newVariantMediaFiles[variantIndex]?.filter((_, i) => i !== fileIndex) || [];
    newVariantMediaPreviews[variantIndex] = newVariantMediaPreviews[variantIndex]?.filter((_, i) => i !== fileIndex) || [];
    
    setVariantMediaFiles(newVariantMediaFiles);
    setVariantMediaPreviews(newVariantMediaPreviews);
  };

  // Remove variant with media cleanup
  const handleRemoveVariant = (index: number) => {
    // Cleanup media preview URLs for this variant
    if (variantMediaPreviews[index]) {
      variantMediaPreviews[index].forEach(url => URL.revokeObjectURL(url));
    }
    
    // Remove from form array
    removeVariant(index);
    
    // Remove from media arrays
    setVariantMediaFiles(prev => prev.filter((_, i) => i !== index));
    setVariantMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add basic product data (each field individually)
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('slug', data.slug);
      formData.append('status', data.status);
      formData.append('visible', data.visible.toString());
      formData.append('inventory', String(Number(data.inventory) || 0));
      
      // Add categories as JSON array
      formData.append('categories', JSON.stringify(data.categories));
      
      // Add tags array
      data.tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });
      
      // Add related products array
      data.relatedProducts.forEach((productId, index) => {
        formData.append(`relatedProducts[${index}]`, productId);
      });
      
      // Add SEO data as JSON object
      const seoData = {
        title: data.seo.title,
        description: data.seo.description,
        keywords: data.seo.keywords,
      };
      formData.append('seo', JSON.stringify(seoData));
      
      // Add main product images from selectedImages state
      selectedImages.forEach((file) => {
        formData.append('product', file);
      });
      
      // Add variants as JSON array using variantMediaFiles state
      const variantsData = data.variants.map((variant, variantIndex) => {
        // Get media file names for this variant from state
        const mediaFileInfo: string[] = [];
        
        if (variantMediaFiles[variantIndex]) {
          variantMediaFiles[variantIndex].forEach((file) => {
            mediaFileInfo.push(file.name);
          });
        }
        
        return {
          sku: variant.sku,
          name: variant.name,
          price: Number(variant.price) || 0,
          stock: Number(variant.stock) || 0,
          attributes: variant.attributes,
          media: mediaFileInfo, // Array of file names only in JSON
        };
      });
      formData.append('variants', JSON.stringify(variantsData));

      const response = await createProduct(formData);
      
      // Cleanup preview URLs after successful submission
      selectedImagePreviews.forEach(url => URL.revokeObjectURL(url));
      variantMediaPreviews.flat().forEach(url => URL.revokeObjectURL(url));
      
      showSuccessMessage(getValue(response, "message") || "Product created successfully!");
      navigate("/products");
    } catch (error) {
      showErrorMessage(getValue(error,"message") || "Failed to create product. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <CustomBackHeader
            title="Add New Product"
            description="Create a new product with variants and media files"
            onBack={() => navigate("/products")}
          />
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <CustomLabel required>Product Name</CustomLabel>
                  <CustomInput
                    name="name"
                    type="text"
                    placeHolder="Enter product name"
                    required
                  />
                </div>
                
                <div>
                  <CustomLabel>Slug</CustomLabel>
                  <CustomInput
                    name="slug"
                    type="text"
                    placeHolder="product-url-slug"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <CustomLabel>Description</CustomLabel>
                  <CustomTextArea
                    name="description"
                    placeHolder="Enter product description"
                    rows={4}
                  />
                </div>
                
                <div>
                  <CustomLabel>Status</CustomLabel>
                  <CustomSelect
                    name="status"
                    options={statusOptions}
                    placeHolder="Select status"
                    defaultValue="active"
                  />
                </div>
                
                <div>
                  <CustomLabel>Inventory</CustomLabel>
                  <CustomInput
                    name="inventory"
                    type="number"
                    placeHolder="Total inventory count"
                  />
                </div>
              </div>
            </Card>

            {/* Product Media */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Product Images
              </h2>
              
              {/* Selected Images Preview */}
              {selectedImagePreviews.length > 0 && (
                <div className="mb-6">
                  <CustomLabel>Selected Images ({selectedImagePreviews.length})</CustomLabel>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {selectedImagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Selected image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeSelectedImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Upload Images */}
              <div>
                <CustomLabel>Upload Images</CustomLabel>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-400 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Select multiple images for your product. Accepted formats: JPG, PNG, GIF
                </p>
              </div>
            </Card>

            {/* Categories */}
            {categoryOptions.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Categories
                </h2>
                <CustomLabel>Select Categories (Multiple)</CustomLabel>
                <CustomMultiSelectCheckbox
                  name="categories"
                  options={categoryOptions}
                />
              </Card>
            )}

            {/* Tags */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {methods.watch("tags").map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-blue-600"
                      onClick={() => removeTag(tag)}
                    />
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag}>
                  Add Tag
                </Button>
              </div>
            </Card>

            {/* Product Variants */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Product Variants
                </h2>
                <Button type="button" onClick={addVariant} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Variant
                </Button>
              </div>
              
              {variantFields.map((field, index) => (
                <div key={field.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Variant {index + 1}
                    </h3>
                    {variantFields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveVariant(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <CustomLabel>SKU</CustomLabel>
                      <CustomInput
                        name={`variants.${index}.sku`}
                        type="text"
                        placeHolder="Enter SKU"
                      />
                    </div>
                    
                    <div>
                      <CustomLabel>Variant Name</CustomLabel>
                      <CustomInput
                        name={`variants.${index}.name`}
                        type="text"
                        placeHolder="Enter variant name"
                      />
                    </div>
                    
                    <div>
                      <CustomLabel>Price</CustomLabel>
                      <CustomInput
                        name={`variants.${index}.price`}
                        type="number"
                        placeHolder="0.00"
                      />
                    </div>
                    
                    <div>
                      <CustomLabel>Stock</CustomLabel>
                      <CustomInput
                        name={`variants.${index}.stock`}
                        type="number"
                        placeHolder="0"
                      />
                    </div>
                  </div>
                  
                  {/* Variant Media */}
                  <div className="mt-4">
                    <CustomLabel>Variant Media Files</CustomLabel>
                    
                    {/* Selected Variant Media Preview */}
                    {variantMediaPreviews[index] && variantMediaPreviews[index].length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Selected Files ({variantMediaPreviews[index].length})
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {variantMediaPreviews[index].map((preview, fileIndex) => (
                            <div key={fileIndex} className="relative group">
                              <img
                                src={preview}
                                alt={`Variant ${index + 1} media ${fileIndex + 1}`}
                                className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                              />
                              <button
                                type="button"
                                onClick={() => removeVariantMediaFile(index, fileIndex)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Upload Variant Media */}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleVariantMediaChange(index, e)}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-400 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Select images for this variant
                    </p>
                  </div>
                </div>
              ))}
            </Card>

            {/* SEO Settings */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                SEO Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <CustomLabel>SEO Title</CustomLabel>
                  <CustomInput
                    name="seo.title"
                    type="text"
                    placeHolder="SEO optimized title"
                  />
                </div>
                
                <div>
                  <CustomLabel>SEO Description</CustomLabel>
                  <CustomTextArea
                    name="seo.description"
                    placeHolder="SEO description for search engines"
                    rows={3}
                  />
                </div>
                
                <div>
                  <CustomLabel>Keywords</CustomLabel>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {methods.watch("seo.keywords").map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        {keyword}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-green-600"
                          onClick={() => removeKeyword(keyword)}
                        />
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      placeholder="Add a keyword"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                    />
                    <Button type="button" onClick={addKeyword}>
                      Add Keyword
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Form Actions */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/products")}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="min-w-32">
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
