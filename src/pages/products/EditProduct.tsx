import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  useUpdateProduct,
  useGetSingleProduct,
  type ProductFormData,
} from "@/hooks/product.hook";
import { useGetAllCategories, type Category } from "@/hooks/categories.hook";
import { showErrorMessage, showSuccessMessage } from "@/utils/toast";
import { CustomInput, CustomSelect, CustomTextArea, CustomLabel, CustomMultiSelectCheckbox } from "@/components/form";
import { getValue } from "@/utils/object";

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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

  const [newTag, setNewTag] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [selectedMainImages, setSelectedMainImages] = useState<File[]>([]);
  const [selectedMainImagePreviews, setSelectedMainImagePreviews] = useState<string[]>([]);
  const [variantMediaFiles, setVariantMediaFiles] = useState<File[][]>([]);
  const [variantMediaPreviews, setVariantMediaPreviews] = useState<string[][]>([]);

  const { mutateAsync: updateProduct, isPending } = useUpdateProduct();
  const { data: categoriesData } = useGetAllCategories();
  const { data: productData, isLoading: isLoadingProduct } = useGetSingleProduct(id || "");

  // Effect to populate form with existing product data
  useEffect(() => {
    if (productData) {
      console.log('Raw productData:', productData);
      
      // Handle the nested response structure: { success: true, product: {...} }
      const responseData = productData as { success?: boolean; product?: Record<string, unknown> };
      const product = responseData.product || productData as Record<string, unknown>;
      
      console.log('Extracted product:', product);
      
      // Get variants and initialize media arrays
      const variants = (product.variants as Record<string, unknown>[]) || [];
      
      // Initialize empty arrays for new variant media uploads
      setVariantMediaFiles(variants.map(() => []));
      setVariantMediaPreviews(variants.map(() => []));
      
      const formData = {
        name: product.name as string || "",
        description: product.description as string || "",
        slug: product.slug as string || "",
        categories: (product.categories as string[]) || [],
        status: (product.status as "active" | "inactive" | "draft") || "active",
        visible: product.visible !== false, // Default to true if not explicitly false
        inventory: product.inventory as number || 0,
        tags: (product.tags as string[]) || [],
        relatedProducts: (product.relatedProducts as string[]) || [],
        images: [], // Reset images as we'll handle file uploads separately
        variants: (product.variants as Record<string, unknown>[])?.length > 0 ? (product.variants as Record<string, unknown>[]).map((variant: Record<string, unknown>) => ({
          sku: variant.sku as string || "",
          name: variant.name as string || "",
          price: variant.price as number || 0,
          stock: variant.stock as number || 0,
          attributes: (variant.attributes as Record<string, string>) || {},
          media: [], // Reset media as we'll handle file uploads separately
        })) : [
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
          title: (product.seo as Record<string, unknown>)?.title as string || "",
          description: (product.seo as Record<string, unknown>)?.description as string || "",
          keywords: ((product.seo as Record<string, unknown>)?.keywords as string[]) || [],
        },
      };
      
      console.log('Form data to reset:', formData);
      methods.reset(formData);
    }
  }, [productData, methods]);

  // Cleanup function for main image previews
  const cleanupMainImagePreviews = () => {
    selectedMainImagePreviews.forEach(url => URL.revokeObjectURL(url));
    setSelectedMainImagePreviews([]);
  };

  // Cleanup preview URLs on component unmount
  useEffect(() => {
    return () => {
      selectedMainImagePreviews.forEach(url => URL.revokeObjectURL(url));
      variantMediaPreviews.flat().forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedMainImagePreviews, variantMediaPreviews]);

  // Get available categories
  const availableCategories = useMemo(() => {
    const apiData = categoriesData as unknown as {
      categories?: { results?: Category[] };
      results?: Category[];
    };
    return apiData?.categories?.results || apiData?.results || [];
  }, [categoriesData]);

  const categoryOptions = useMemo(() => 
    availableCategories.map((category: Category) => ({
      value: category._id,
      label: category.name,
    })), [availableCategories]
  );

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "draft", label: "Draft" },
  ];

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control: methods.control, name: "variants" });

  // Handle adding new tags
  const addTag = () => {
    if (newTag.trim()) {
      const currentTags = methods.getValues("tags");
      if (!currentTags.includes(newTag.trim())) {
        methods.setValue("tags", [...currentTags, newTag.trim()]);
      }
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = methods.getValues("tags");
    methods.setValue("tags", currentTags.filter((tag) => tag !== tagToRemove));
  };

  // Handle adding new SEO keywords
  const addKeyword = () => {
    if (newKeyword.trim()) {
      const currentKeywords = methods.getValues("seo.keywords");
      if (!currentKeywords.includes(newKeyword.trim())) {
        methods.setValue("seo.keywords", [...currentKeywords, newKeyword.trim()]);
      }
      setNewKeyword("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    const currentKeywords = methods.getValues("seo.keywords");
    methods.setValue("seo.keywords", currentKeywords.filter((keyword) => keyword !== keywordToRemove));
  };

  // Handle main image selection
  const handleMainImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Cleanup old previews
      cleanupMainImagePreviews();
      
      const filesArray = Array.from(files);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      
      setSelectedMainImages(filesArray);
      setSelectedMainImagePreviews(newPreviews);
    }
  };

  const removeMainImage = (index: number) => {
    // Cleanup the specific preview URL
    URL.revokeObjectURL(selectedMainImagePreviews[index]);
    
    const newImages = selectedMainImages.filter((_, i) => i !== index);
    const newPreviews = selectedMainImagePreviews.filter((_, i) => i !== index);
    
    setSelectedMainImages(newImages);
    setSelectedMainImagePreviews(newPreviews);
  };

  const removeExistingMainImage = (index: number) => {
    // Note: This function is not needed since we're not managing existing images in state
    // Images will be managed server-side
    console.log('Remove existing image at index:', index);
  };

  // Handle adding new variants
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

  // Remove existing variant media (not needed since we're using newMedia from API)
  const removeExistingVariantMedia = (variantIndex: number, mediaIndex: number) => {
    console.log('Remove existing variant media:', { variantIndex, mediaIndex });
    // This function is not needed since we're using newMedia from the API response
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

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    if (!id) {
      showErrorMessage("Product ID is missing");
      return;
    }

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
      
      // Add tags as JSON array (not in a loop)
      formData.append('tags', JSON.stringify(data.tags));
      
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
      
      // Add new main product images
      selectedMainImages.forEach((file) => {
        formData.append(`images`, file);
      });

      console.log({data});
      
      // Add variants as JSON array using state-managed media
      const variantsData = data.variants.map((variant, variantIndex) => {
        // Get new media file names for this variant from state
        const newMediaFileInfo: string[] = [];
        
        if (variantMediaFiles[variantIndex]) {
          variantMediaFiles[variantIndex].forEach((file) => {
            newMediaFileInfo.push(file.name);
          });
        }
        
        return {
          sku: variant.sku,
          name: variant.name,
          price: Number(variant.price) || 0,
          stock: Number(variant.stock) || 0,
          attributes: variant.attributes,
          newMedia: newMediaFileInfo, // New files being uploaded
        };
      });
      formData.append('variants', JSON.stringify(variantsData));

      const response = await updateProduct({ id, body: formData });
      
      // Cleanup preview URLs after successful submission
      selectedMainImagePreviews.forEach(url => URL.revokeObjectURL(url));
      variantMediaPreviews.flat().forEach(url => URL.revokeObjectURL(url));
      
      showSuccessMessage(getValue(response, "message") || "Product updated successfully!");
      navigate("/products");
    } catch (error) {
      showErrorMessage(getValue(error,"message") || "Failed to update product. Please try again.");
    }
  };

  // Loading state for fetching product data
  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-gray-600 dark:text-gray-300">Loading product...</span>
        </div>
      </div>
    );
  }

  if (!productData && !isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <CustomBackHeader
              title="Edit Product"
              description="Update product information, variants, and settings."
              onBack={() => navigate("/products")}
            />
          </div>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Product not found</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">The product you're trying to edit doesn't exist.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <CustomBackHeader
            title="Edit Product"
            description="Update product information, variants, and settings."
            onBack={() => navigate("/products")}
          />
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <CustomLabel>Product Name</CustomLabel>
                  <CustomInput
                    name="name"
                    type="text"
                    placeHolder="Enter product name"
                    required
                  />
                </div>
                <div>
                  <CustomLabel>Product Slug</CustomLabel>
                  <CustomInput
                    name="slug"
                    type="text"
                    placeHolder="product-slug"
                  />
                </div>
                <div className="md:col-span-2">
                  <CustomLabel>Description</CustomLabel>
                  <CustomTextArea
                    name="description"
                    placeHolder="Product description"
                    rows={4}
                  />
                </div>
                <div>
                  <CustomLabel>Status</CustomLabel>
                  <CustomSelect
                    name="status"
                    options={statusOptions}
                  />
                </div>
                <div>
                  <CustomLabel>Inventory</CustomLabel>
                  <CustomInput
                    name="inventory"
                    type="number"
                    placeHolder="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    {...methods.register("visible")}
                    type="checkbox"
                    id="visible"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <CustomLabel>
                    <label htmlFor="visible" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                      Make product visible
                    </label>
                  </CustomLabel>
                </div>
              </div>
            </Card>

            {/* Categories */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Categories
              </h2>
              <CustomLabel>Product Categories</CustomLabel>
              <CustomMultiSelectCheckbox
                name="categories"
                options={categoryOptions}
              />
            </Card>

            {/* Product Images */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Product Images
              </h2>
              
              {/* Existing Images from Product Data */}
              {(() => {
                // Get product data
                const responseData = (productData || {}) as { success?: boolean; product?: Record<string, unknown> };
                const product = responseData?.product || {};
                const productImages = (product.images as string[]) || [];
                
                return productImages.length > 0 && (
                  <div className="mb-6">
                    <CustomLabel>Current Images</CustomLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      {productImages.map((imageUrl: string, index: number) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingMainImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              
              {/* Upload New Images */}
              <div>
                <CustomLabel>Upload New Images</CustomLabel>
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-400 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Select additional images for your product. Accepted formats: JPG, PNG, GIF
                </p>
                
                {/* Preview New Images */}
                {selectedMainImagePreviews.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Images Preview:
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedMainImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`New image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={() => removeMainImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Tags */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Tags
              </h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {methods.watch("tags").map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-600 dark:hover:text-blue-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Product Variants */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Product Variants
                </h2>
                <Button type="button" onClick={addVariant} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variant
                </Button>
              </div>
              <div className="space-y-6">
                {variantFields.map((variant, index) => (
                  <Card key={variant.id} className="p-4 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Variant {index + 1}
                      </h3>
                      {variantFields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveVariant(index)}
                          className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
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
                      <div className="md:col-span-2">
                        <CustomLabel>Variant Images</CustomLabel>
                        
                        {/* Existing Variant Media from Product Data */}
                        {(() => {
                          // Get product data and current variant
                          const responseData = (productData || {}) as { success?: boolean; product?: Record<string, unknown> };
                          const product = responseData?.product || {};
                          const variants = (product.variants as Record<string, unknown>[]) || [];
                          const currentVariant = variants[index];
                          const variantMedia = (currentVariant?.newMedia as string[]) || [];
                          
                          return variantMedia.length > 0 && (
                            <div className="mb-4">
                              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Current Images ({variantMedia.length})
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {variantMedia.map((imageUrl: string, mediaIndex: number) => (
                                  <div key={mediaIndex} className="relative group">
                                    <img
                                      src={imageUrl}
                                      alt={`Variant ${index + 1} existing image ${mediaIndex + 1}`}
                                      className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeExistingVariantMedia(index, mediaIndex)}
                                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                        
                        {/* Selected New Variant Media Preview */}
                        {variantMediaPreviews[index] && variantMediaPreviews[index].length > 0 && (
                          <div className="mb-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              New Images ({variantMediaPreviews[index].length})
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {variantMediaPreviews[index].map((preview, fileIndex) => (
                                <div key={fileIndex} className="relative group">
                                  <img
                                    src={preview}
                                    alt={`Variant ${index + 1} new image ${fileIndex + 1}`}
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
                        
                        {/* Upload New Variant Media */}
                        <div>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleVariantMediaChange(index, e)}
                            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-400 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                          />
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Add new images for this variant
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* SEO Settings */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
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
                  <CustomLabel>Meta Description</CustomLabel>
                  <CustomTextArea
                    name="seo.description"
                    placeHolder="SEO meta description"
                    rows={3}
                  />
                </div>
                <div>
                  <CustomLabel>SEO Keywords</CustomLabel>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        placeholder="Add a keyword"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      />
                      <Button type="button" onClick={addKeyword} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {methods.watch("seo.keywords").map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeKeyword(keyword)}
                            className="hover:text-green-600 dark:hover:text-green-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pb-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/products")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Update Product
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
