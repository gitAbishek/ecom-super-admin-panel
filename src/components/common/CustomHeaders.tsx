import type React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface CustomHeadersProps {
  title: string;
  description: string;
  onAdd?: () => void;
  buttonText?: string;
  onBack?: () => void;
}

const CustomHeaders: React.FC<CustomHeadersProps> = ({
  title,
  description,
  onAdd,
  buttonText = "Add Item",
  onBack,
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
              {/* Use a left arrow icon if available, fallback to text */}
              <span className="sr-only">Back</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
          </div>
        </div>
        {onAdd && (
          <Button onClick={onAdd} className="w-fit">
            <Plus className="h-4 w-4 mr-2" />
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CustomHeaders;
