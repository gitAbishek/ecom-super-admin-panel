import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Calendar, Edit, AlertTriangle, Loader2 } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useGetSingleInventory } from "../../hooks/inventories.hook";
import { useGetAllProducts } from "../../hooks/product.hook";

// Inventory interfaces
interface InventoryItem {
  _id: string;
  productId: string;
  variantId: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

// Product interfaces
interface ProductVariant {
  sku: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, unknown>;
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  variants: ProductVariant[];
}

export default function ViewInventory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: inventoryData, isLoading: isLoadingInventory } = useGetSingleInventory(id || "");
  const { data: productsData, isLoading: isLoadingProducts } = useGetAllProducts({});

  // Extract inventory from response
  const inventory = useMemo(() => {
    if (!inventoryData) return null;
    const responseData = inventoryData as unknown as {
      inventory?: InventoryItem;
      success?: boolean;
    };
    return responseData?.inventory || (inventoryData as InventoryItem);
  }, [inventoryData]);

  // Extract products from response
  const products = useMemo(() => {
    if (!productsData) return [];
    
    const responseData = productsData as unknown as {
      products?: { results?: Product[] };
      results?: Product[];
    };
    
    return responseData?.products?.results || responseData?.results || [];
  }, [productsData]);

  // Find the product and variant for this inventory
  const productInfo = useMemo(() => {
    if (!inventory || !products.length) return null;
    
    const product = products.find(p => p._id === inventory.productId);
    if (!product) return null;
    
    const variant = product.variants.find(v => v.sku === inventory.variantId);
    
    return {
      product,
      variant,
    };
  }, [inventory, products]);

  if (isLoadingInventory || isLoadingProducts) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-gray-600 dark:text-gray-300">Loading inventory...</span>
        </div>
      </div>
    );
  }

  if (!inventory) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Inventory Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The inventory you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/inventories")}>
            Back to Inventories
          </Button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/inventories/edit/${inventory._id}`);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return {
        status: 'Out of Stock',
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        icon: AlertTriangle,
      };
    } else if (quantity < 10) {
      return {
        status: 'Low Stock',
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        icon: AlertTriangle,
      };
    } else {
      return {
        status: 'In Stock',
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        icon: Package,
      };
    }
  };

  const stockStatus = getStockStatus(inventory.quantity);
  const StatusIcon = stockStatus.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/inventories")}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Inventory Details
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                View inventory information
              </p>
            </div>
          </div>
          
          {/* Action Button */}
          <Button
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Product Information
              </h2>
              
              {productInfo ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Product Name</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {productInfo.product.name}
                    </p>
                  </div>
                  
                  {productInfo.product.description && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">
                        {productInfo.product.description}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Product ID</p>
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                      {productInfo.product._id}
                    </code>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Product information not found
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Product ID: {inventory.productId}
                  </p>
                </div>
              )}
            </Card>

            {/* Variant Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Variant Information
              </h2>
              
              {productInfo?.variant ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Variant Name</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {productInfo.variant.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">SKU</p>
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                        {productInfo.variant.sku}
                      </code>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        ${productInfo.variant.price}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Product Stock</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {productInfo.variant.stock}
                      </p>
                    </div>
                  </div>
                  
                  {/* Variant Attributes */}
                  {productInfo.variant.attributes && Object.keys(productInfo.variant.attributes).length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Attributes</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(productInfo.variant.attributes).map(([key, value]) => (
                          <span
                            key={key}
                            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                          >
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Variant information not found
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Variant ID: {inventory.variantId}
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Inventory Details */}
          <div className="space-y-6">
            {/* Inventory Summary */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Inventory Summary
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Quantity</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {inventory.quantity}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockStatus.className}`}>
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {stockStatus.status}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Inventory ID</p>
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                    {inventory._id}
                  </code>
                </div>
              </div>
            </Card>

            {/* Timestamps */}
            {(inventory.createdAt || inventory.updatedAt) && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Timestamps
                </h2>
                <div className="space-y-3">
                  {inventory.createdAt && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Created At</p>
                      <p className="text-gray-900 dark:text-gray-100">
                        {new Date(inventory.createdAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {inventory.updatedAt && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                      <p className="text-gray-900 dark:text-gray-100">
                        {new Date(inventory.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Button
                  onClick={handleEdit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Inventory
                </Button>
                {productInfo?.product && (
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/products/view/${productInfo.product._id}`)}
                    className="w-full"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    View Product
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
