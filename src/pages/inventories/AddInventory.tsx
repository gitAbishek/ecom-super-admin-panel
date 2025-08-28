import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { ArrowLeft, Package, CheckSquare, Square, Loader2 } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAddInventory } from "../../hooks/inventories.hook";
import { useGetAllProducts } from "../../hooks/product.hook";
import { showErrorMessage, showSuccessMessage } from "../../utils/toast";
import { getValue } from "../../utils/object";
import { CustomSearchableSelect } from "../../components/form";

// Form data interface
interface InventoryFormData {
  productId: string;
  variantId: string;
  quantity: number;
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
  variants: ProductVariant[];
}

export default function AddInventory() {
  const navigate = useNavigate();
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const { mutateAsync: addInventory, isPending } = useAddInventory();
  const { data: productsData, isLoading: isLoadingProducts } =
    useGetAllProducts();

  const methods = useForm<InventoryFormData>({
    defaultValues: {
      productId: "",
      variantId: "",
      quantity: 0,
    },
  });

  // Extract products from response
  const products = useMemo(() => {
    if (!productsData) return [];

    const responseData = productsData as unknown as {
      products?: { results?: Product[] };
      results?: Product[];
    };

    return responseData?.products?.results || responseData?.results || [];
  }, [productsData]);

  // Create product options for the searchable select
  const productOptions = useMemo(() => {
    return products.map((product) => ({
      value: product._id,
      label: `${product.name} (${product.variants.length} variant${
        product.variants.length !== 1 ? "s" : ""
      })`,
    }));
  }, [products]);

  // Get selected product and its variants
  const selectedProduct = useMemo(() => {
    return products.find((product) => product._id === selectedProductId);
  }, [products, selectedProductId]);

  // Create variant options for the searchable select
  const variantOptions = useMemo(() => {
    if (!selectedProduct) return [];

    return selectedProduct.variants.map((variant) => ({
      value: variant.sku,
      label: `${variant.name} - $${variant.price} (SKU: ${variant.sku}) - Stock: ${variant.stock}`,
    }));
  }, [selectedProduct]);

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    methods.setValue("productId", productId);
    methods.setValue("variantId", ""); // Reset variant selection
  };

  const handleVariantSelect = (variantSku: string) => {
    const currentVariantId = methods.getValues("variantId");
    if (currentVariantId === variantSku) {
      methods.setValue("variantId", ""); // Deselect if already selected
    } else {
      methods.setValue("variantId", variantSku);
    }
  };

  const onSubmit: SubmitHandler<InventoryFormData> = async (data) => {
    if (!data.productId) {
      showErrorMessage("Please select a product");
      return;
    }
    if (!data.variantId) {
      showErrorMessage("Please select a variant");
      return;
    }
    if (!data.quantity || data.quantity <= 0 || isNaN(data.quantity)) {
      showErrorMessage("Please enter a valid quantity");
      return;
    }

    try {
      const reqData = {
        productId: data.productId,
        quantity: Number(data.quantity),
        variantId: data.variantId,
      };
      console.log({ reqData });

      const response = await addInventory(reqData);
      showSuccessMessage(getValue(response, "message") || "Inventory added successfully!");
      navigate("/inventories");
    } catch (error) {
      showErrorMessage(
        getValue(error, "message") ||
          "Failed to add inventory. Please try again."
      );
    }
  };

  if (isLoadingProducts) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-gray-600 dark:text-gray-300">
            Loading products...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate("/inventories")}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Add Inventory
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Add inventory for a product variant
            </p>
          </div>
        </div>

        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Selection */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Select Product
            </h2>

            {products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No products available. Please add products first.
                </p>
                <Button
                  type="button"
                  onClick={() => navigate("/products/add")}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Product
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Choose Product
                  </label>
                  <CustomSearchableSelect
                    options={productOptions}
                    value={selectedProductId}
                    onChange={handleProductSelect}
                    placeholder="Search and select a product..."
                    searchPlaceholder="Type to search products..."
                    noOptionsMessage="No products found"
                    className="w-full"
                  />
                </div>

                {selectedProduct && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Selected Product: {selectedProduct.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedProduct.variants.length} variant
                      {selectedProduct.variants.length !== 1 ? "s" : ""}{" "}
                      available
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Variant Selection */}
          {selectedProduct && selectedProduct.variants.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Select Variant
              </h2>

              <div className="space-y-6">
                {/* Quick Variant Selection Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quick Select Variant
                  </label>
                  <CustomSearchableSelect
                    options={variantOptions}
                    value={methods.watch("variantId")}
                    onChange={(variantSku) =>
                      methods.setValue("variantId", variantSku)
                    }
                    placeholder="Search and select a variant..."
                    searchPlaceholder="Type to search variants..."
                    noOptionsMessage="No variants found"
                    className="w-full"
                  />
                </div>

                {/* Detailed Variant Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Or Browse Variants
                  </label>
                  <div className="space-y-3">
                    {selectedProduct.variants.map((variant) => (
                      <div
                        key={variant.sku}
                        onClick={() => handleVariantSelect(variant.sku)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-sm ${
                          methods.watch("variantId") === variant.sku
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {methods.watch("variantId") === variant.sku ? (
                            <CheckSquare className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                          ) : (
                            <Square className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                {variant.name}
                              </h3>
                              <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                                ${variant.price}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 mt-2">
                              <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                {variant.sku}
                              </code>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Current Stock: {variant.stock}
                              </span>
                            </div>

                            {/* Variant Attributes */}
                            {variant.attributes &&
                              Object.keys(variant.attributes).length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {Object.entries(variant.attributes).map(
                                    ([key, value]) => (
                                      <span
                                        key={key}
                                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded"
                                      >
                                        {key}: {String(value)}
                                      </span>
                                    )
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Quantity Input */}
          {selectedProduct && methods.watch("variantId") && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Quantity
              </h2>

              <div className="max-w-xs">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Inventory Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  {...methods.register("quantity", {
                    required: "Quantity is required",
                    min: { value: 1, message: "Quantity must be at least 1" },
                    valueAsNumber: true,
                  })}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter quantity"
                />
                {methods.formState.errors.quantity && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {methods.formState.errors.quantity.message}
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/inventories")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isPending ||
                !methods.getValues("productId") ||
                !methods.getValues("variantId")
              }
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                "Add Inventory"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
