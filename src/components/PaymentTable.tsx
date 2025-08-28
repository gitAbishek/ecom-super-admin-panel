import { Eye, Edit, Trash2 } from "lucide-react";
import { getValue } from "@/utils/object";

interface Payment {
  _id: string;
  customer: string;
  amount: number;
  method: string;
  status: string;
  date: string;
  [key: string]: unknown;
}

interface PaymentTableProps {
  data: Payment[];
  onView: (payment: Payment) => void;
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
}

export default function PaymentTable({ data, onView, onEdit, onDelete }: PaymentTableProps) {
  // Safety check to ensure data is an array
  const payments = Array.isArray(data) ? data : [];

  return (
    <>
      {payments.map((payment) => (
        <tr
          key={payment._id}
          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              #{getValue(payment, 'paymentId', '').slice(0, 8)}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900 dark:text-white">
              {getValue(payment, 'customer', 'Unknown')}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              ${getValue(payment, 'amount', 0).toFixed(2)}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900 dark:text-white">
              {getValue(payment, 'method', 'N/A')}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                getValue(payment, 'status') === 'completed'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : getValue(payment, 'status') === 'pending'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}
            >
              {getValue(payment, 'status', 'Unknown')}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900 dark:text-white">
              {new Date(getValue(payment, 'date', '')).toLocaleDateString()}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex space-x-2 justify-end">
              <button
                onClick={() => onView(payment)}
                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                title="View Payment"
              >
                <Eye className="h-4 w-4" />
              </button>
              {/* <button
                onClick={() => onEdit(payment)}
                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                title="Edit Payment"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(payment)}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                title="Delete Payment"
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
