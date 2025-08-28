import { Button } from '@/components/ui/button';
import { Eye, Edit } from 'lucide-react';
import type { Order } from '@/types/order';
import { getValue } from '@/utils/object';

export interface OrderTableProps {
  data: Order[];
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
}

export default function OrderTable({ data, onView, onEdit }: OrderTableProps) {
  return (
    <>
      {data.map((order) => (
        <tr key={order.id}>
          <td className="px-4 py-2 whitespace-nowrap">{getValue(order, 'customer') ?? ''}</td>
          <td className="px-4 py-2 whitespace-nowrap">{getValue(order, 'status') ?? ''}</td>
          <td className="px-4 py-2 whitespace-nowrap">${Number(getValue(order, 'total')).toFixed(2)}</td>
          <td className="px-4 py-2 whitespace-nowrap">{getValue(order, 'createdAt') ? new Date(getValue(order, 'createdAt')).toLocaleString() : ''}</td>
          <td className="px-4 py-2 whitespace-nowrap text-right">
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(order)}
                className="h-8 w-8 p-0"
                title="View order"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(order)}
                className="h-8 w-8 p-0"
                title="Edit order"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
