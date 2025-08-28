import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Package } from 'lucide-react';

interface InventoryItem {
  _id: string;
  productId: string;
  variantId: string;
  quantity: number;
  productName?: string;
  variantName?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface InventoryTableProps {
  data: InventoryItem[];
  onView?: (inventory: InventoryItem) => void;
  onEdit?: (inventory: InventoryItem) => void;
  onDelete?: (inventory: InventoryItem) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
}) => {
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
    } else if (quantity <= 10) {
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
    }
    return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
  };

  const getStockLabel = (quantity: number) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= 10) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <>
      {data.map((inventory) => (
        <tr key={inventory._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <td className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {inventory.productName || inventory.productId}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ID: {inventory.productId}
                </p>
              </div>
            </div>
          </td>
          
          <td className="p-4">
            <div>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {inventory.variantName || inventory.variantId}
              </p>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded mt-1 inline-block">
                {inventory.variantId}
              </code>
            </div>
          </td>
          
          <td className="p-4">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {inventory.quantity}
            </div>
          </td>
          
          <td className="p-4">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatus(inventory.quantity)}`}>
              {getStockLabel(inventory.quantity)}
            </span>
          </td>
          
          <td className="p-4">
            <div className="flex items-center justify-end space-x-2">
              {onView && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(inventory)}
                  className="h-8 w-8 p-0"
                  title="View inventory"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(inventory)}
                  className="h-8 w-8 p-0"
                  title="Edit inventory"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(inventory)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                  title="Delete inventory"
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

export default InventoryTable;
