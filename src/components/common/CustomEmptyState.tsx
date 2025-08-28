import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface CustomEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  showAction?: boolean;
  actionText?: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
}

export default function CustomEmptyState({
  icon,
  title,
  description,
  showAction = false,
  actionText,
  onAction,
  actionIcon
}: CustomEmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon && <div className="mx-auto mb-4 flex justify-center">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      {showAction && actionText && onAction && (
        <Button onClick={onAction} className="bg-blue-600 hover:bg-blue-700 text-white">
          {actionIcon}
          {actionText}
        </Button>
      )}
    </div>
  );
}
