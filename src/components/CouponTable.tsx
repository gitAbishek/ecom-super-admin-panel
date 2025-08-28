import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import type { Coupon } from '@/types/coupon';
import { getValue } from '@/utils/object';

export interface CouponTableProps {
  data: Coupon[];
  onView: (coupon: Coupon) => void;
  onEdit: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
}

export default function CouponTable({ data, onView, onEdit, onDelete }: CouponTableProps) {
  return (
    <>
      {data.map((coupon) => (
        <tr key={coupon.id}>
          <td className="px-4 py-2 whitespace-nowrap font-mono font-semibold">{getValue(coupon, 'code') ?? ''}</td>
          <td className="px-4 py-2 whitespace-nowrap">
            {getValue(coupon, 'discountType') === 'percentage' 
              ? `${getValue(coupon, 'discountValue')}%` 
              : `$${Number(getValue(coupon, 'discountValue')).toFixed(2)}`}
          </td>
          <td className="px-4 py-2 whitespace-nowrap capitalize">{getValue(coupon, 'distributionMethod') ?? ''}</td>
          <td className="px-4 py-2 whitespace-nowrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              getValue(coupon, 'isActive') 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {getValue(coupon, 'isActive') ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="px-4 py-2 whitespace-nowrap">{getValue(coupon, 'maxUsage') ?? 'Unlimited'}</td>
          <td className="px-4 py-2 whitespace-nowrap">
            {(() => {
              const conditions = getValue(coupon, 'conditions') as Record<string, unknown>;
              const validTo = getValue(conditions, 'validTo');
              return validTo ? new Date(validTo as string).toLocaleDateString() : 'No expiry';
            })()}
          </td>
          <td className="px-4 py-2 whitespace-nowrap text-right">
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(coupon)}
                className="h-8 w-8 p-0"
                title="View coupon"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(coupon)}
                className="h-8 w-8 p-0"
                title="Edit coupon"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(coupon)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                title="Delete coupon"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
