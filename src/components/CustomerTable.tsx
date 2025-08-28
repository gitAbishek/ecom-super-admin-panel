import { Eye, Edit, Trash2 } from "lucide-react";
import { getValue } from "@/utils/object";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  status: string;
  [key: string]: unknown;
}

interface CustomerTableProps {
  data: Customer[];
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export default function CustomerTable({ data, onView, onEdit, onDelete }: CustomerTableProps) {
  return (
    <>
      {data.map((customer) => (
        <tr
          key={customer._id}
          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="h-10 w-10 flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {getValue(customer, 'name', 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {getValue(customer, 'name', 'Unknown')}
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900 dark:text-white">
              {getValue(customer, 'email', 'N/A')}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900 dark:text-white">
              {getValue(customer, 'phone', 'N/A')}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {getValue(customer, 'orders', 0)}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              ${getValue(customer, 'totalSpent', 0).toFixed(2)}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                getValue(customer, 'status') === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : getValue(customer, 'status') === 'inactive'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}
            >
              {getValue(customer, 'status', 'Unknown')}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex space-x-2 justify-end">
              <button
                onClick={() => onView(customer)}
                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                title="View Customer"
              >
                <Eye className="h-4 w-4" />
              </button>
              {/* <button
                onClick={() => onEdit(customer)}
                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                title="Edit Customer"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(customer)}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                title="Delete Customer"
              >
                <Trash2 className="h-4 w-4" />
              </button> */}
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
