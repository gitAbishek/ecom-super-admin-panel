import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Package, Tag, DollarSign, Trash2 } from 'lucide-react';
import type { ProductType } from '@/types/product';



interface ProductTableProps {
  data: ProductType[];
  onView?: (product: ProductType) => void;
  onEdit?: (product: ProductType) => void;
  onDelete?: (product: ProductType) => void;
}

const statusColors = {
  'Active': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  'Inactive': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  'Out of Stock': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
};

const ProductTable: React.FC<ProductTableProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      {data.map((product) => (
        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <td className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {product.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                  {product.description}
                </p>
              </div>
            </div>
          </td>
          
          <td className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {/* ${product.price.toFixed(2)} */}
              </span>
            </div>
          </td>
          
          <td className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {product.stock} units
              </span>
            </div>
          </td>
          
          <td className="p-4">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {product.category}
              </span>
            </div>
          </td>
          
          <td className="p-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              statusColors[product.status as keyof typeof statusColors] || statusColors['Inactive']
            }`}>
              {product.status}
            </span>
          </td>
          
          <td className="p-4">
            <div className="flex items-center justify-end space-x-2">
              {onView && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(product)}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(product)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(product)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default ProductTable;
