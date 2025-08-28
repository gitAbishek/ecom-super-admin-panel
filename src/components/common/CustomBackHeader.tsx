import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';

interface CustomBackHeaderProps {
  onBack: () => void;
  title: string;
  description?: string;
  editButton?: {
    onEdit: () => void;
    text: string;
    icon?: ReactNode;
  };
}

export default function CustomBackHeader({ onBack, title, description, editButton }: CustomBackHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onBack}
        className="flex items-center space-x-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Button>
      
      {/* Title, description, and optional edit button */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        
        {editButton && (
          <Button
            variant="default"
            size="sm"
            onClick={editButton.onEdit}
            className="flex items-center space-x-2 ml-4"
          >
            {editButton.icon}
            <span>{editButton.text}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
