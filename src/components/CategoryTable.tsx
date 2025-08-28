import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Folder, Hash } from "lucide-react";
import type { Category } from "@/hooks/categories.hook";

interface CategoryTableProps {
  data: Category[];
  onView?: (category: Category) => void;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      {data.map((category) => (
        <tr
          key={category._id}
          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <td className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Folder className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {category.name}
                </p>
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <Hash className="h-3 w-3" />
                  <span>{category.slug}</span>
                </div>
              </div>
            </div>
          </td>

          <td className="p-4">
            {category.parent ? (
              <div className="flex items-center space-x-2">
                <Folder className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {category.parent.name}
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Root Category
              </span>
            )}
          </td>

          <td className="p-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {category.children ? category.children.length : 0} subcategories
            </span>
          </td>

          <td className="p-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(category.createdAt).toLocaleDateString()}
            </span>
          </td>

          <td className="p-4">
            <div className="flex items-center justify-end space-x-2">
              {onView && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(category)}
                  className="h-8 w-8 p-0"
                  title="View category"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(category)}
                  className="h-8 w-8 p-0"
                  title="Edit category"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(category);
                  }}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Delete category"
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

export default CategoryTable;
