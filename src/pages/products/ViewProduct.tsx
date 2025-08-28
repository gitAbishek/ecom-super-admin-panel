import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Package, Tag, Eye, EyeOff, Calendar, User, Globe, Edit } from "lucide-react";
import { Card } from "../../components/ui/card";
import CustomBackHeader from '@/components/common/CustomBackHeader';
import { useGetSingleProduct } from "../../hooks/product.hook";
import { useGetAllCategories } from "../../hooks/categories.hook";

interface Product {
  _id: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  brand: string;
  model: string;
  status: string;
  visible: boolean;
  inventory: number;
  images: string[];
  categories: string[];
  tags: string[];
  relatedProducts: string[];
  variants: Array<{
    sku: string;
    name: string;
    price: number;
    stock: number;
    attributes: Record<string, unknown>;
    newMedia: string[];
  }>;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function ViewProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: productData, isLoading: isLoadingProduct } = useGetSingleProduct(id || "");
  const { data: categoriesData } = useGetAllCategories({});

  // Get available categories
  const availableCategories = useMemo(() => {
    const apiData = categoriesData as unknown as {
      categories?: { results?: Category[] };
      results?: Category[];
    };
    return apiData?.categories?.results || apiData?.results || [];
  }, [categoriesData]);

  // Extract product from response
  const product = useMemo(() => {
    if (!productData) return null;
    const responseData = productData as { success?: boolean; product?: Product };
    return responseData.product || (productData as Product);
  }, [productData]);

  // Get category names for the product
  const productCategories = useMemo(() => {
    if (!product || !availableCategories.length) return [];
    return availableCategories.filter(cat => 
      product.categories.includes(cat._id)
    );
  }, [product, availableCategories]);

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6 animate-spin" />
          <span className="text-gray-600 dark:text-gray-300">Loading product...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <CustomBackHeader
              title="Product Details"
              description="View product information"
              onBack={() => navigate("/products")}
            />
          </div>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Product Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The product you're looking for doesn't exist or has been removed.
              </p>
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
            title={product.name}
            description="Product Details"
            onBack={() => navigate("/products")}
            editButton={{
              onEdit: () => navigate(`/products/edit/${product._id}`),
              text: "Edit Product",
              icon: <Edit className="h-4 w-4" />
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images and Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Images */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Product Images
              </h2>
              
              {product.images && product.images.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="aspect-square sm:aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={product.images[selectedImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Thumbnail Grid */}
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImageIndex === index
                              ? 'border-blue-500 ring-2 ring-blue-200'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square sm:aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No images available</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Product Description */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Description
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {product.description || "No description available"}
                </p>
              </div>
            </Card>

            {/* Product Variants */}
            {product.variants && product.variants.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Product Variants
                </h2>
                <div className="space-y-4">
                  {product.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">SKU</p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {variant.sku}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {variant.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            ${variant.price}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Stock</p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {variant.stock}
                          </p>
                        </div>
                      </div>
                      
                      {/* Variant Attributes */}
                      {variant.attributes && Object.keys(variant.attributes).length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Attributes</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(variant.attributes).map(([key, value]) => (
                              <span
                                key={key}
                                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm"
                              >
                                {key}: {String(value)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Variant Media */}
                      {variant.newMedia && variant.newMedia.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Variant Images ({variant.newMedia.length})
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {variant.newMedia.map((media, mediaIndex) => (
                              <div
                                key={mediaIndex}
                                className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
                              >
                                <img
                                  src={media}
                                  alt={`${variant.name} image ${mediaIndex + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${product.price}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Brand</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {product.brand || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Model</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {product.model || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Visibility</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.visible
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {product.visible ? (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 mr-1" />
                          Hidden
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Inventory</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {product.inventory} units
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Slug</p>
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                    {product.slug}
                  </code>
                </div>
              </div>
            </Card>

            {/* Categories */}
            {productCategories.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Categories
                </h2>
                <div className="flex flex-wrap gap-2">
                  {productCategories.map((category) => (
                    <span
                      key={category._id}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* SEO Information */}
            {product.seo && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  SEO Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Title</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {product.seo.title || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {product.seo.description || "N/A"}
                    </p>
                  </div>
                  {product.seo.keywords && product.seo.keywords.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Keywords</p>
                      <div className="flex flex-wrap gap-1">
                        {product.seo.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Timestamps */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Timestamps
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Created At</p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(product.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(product.updatedAt).toLocaleString()}
                  </p>
                </div>
                {product.createdBy && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Created By</p>
                    <p className="text-gray-900 dark:text-gray-100 flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {product.createdBy}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
