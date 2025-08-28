import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import type { Campaign } from '@/types/campaign';
import { getValue } from '@/utils/object';

export interface CampaignTableProps {
  data: Campaign[];
  onView: (campaign: Campaign) => void;
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
}

export default function CampaignTable({ data, onView, onEdit, onDelete }: CampaignTableProps) {
  return (
    <>
      {data.map((campaign) => (
        <tr key={campaign.id}>
          <td className="px-4 py-2 whitespace-nowrap">{getValue(campaign, 'name') ?? ''}</td>
          <td className="px-4 py-2 whitespace-nowrap capitalize">{getValue(campaign, 'campaignType') ?? ''}</td>
          <td className="px-4 py-2 whitespace-nowrap">
            {getValue(campaign, 'discountType') === 'percentage' 
              ? `${getValue(campaign, 'discountValue')}%` 
              : `$${Number(getValue(campaign, 'discountValue')).toFixed(2)}`}
          </td>
          <td className="px-4 py-2 whitespace-nowrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              getValue(campaign, 'isActive') 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {getValue(campaign, 'isActive') ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="px-4 py-2 whitespace-nowrap">
            {getValue(campaign, 'validTo') ? new Date(getValue(campaign, 'validTo')).toLocaleDateString() : ''}
          </td>
          <td className="px-4 py-2 whitespace-nowrap text-right">
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(campaign)}
                className="h-8 w-8 p-0"
                title="View campaign"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(campaign)}
                className="h-8 w-8 p-0"
                title="Edit campaign"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(campaign)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                title="Delete campaign"
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
