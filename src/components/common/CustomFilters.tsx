import type React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search, Filter } from "lucide-react";

// Filter option interface
interface FilterOption {
  value: string;
  label: string;
}

// Search filter configuration
interface SearchFilter {
  type: 'search';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

// Select filter configuration
interface SelectFilter {
  type: 'select';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
}

// Union type for filter configurations
type FilterConfig = SearchFilter | SelectFilter;

interface CustomFiltersProps {
  filters: FilterConfig[];
  showFilterButton?: boolean;
  onFilterClick?: () => void;
}

const CustomFilters: React.FC<CustomFiltersProps> = ({
  filters,
  showFilterButton = true,
  onFilterClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Render filters */}
      {filters.map((filter, index) => (
        <div key={index} className={filter.type === 'search' ? 'flex-1' : ''}>
          {filter.type === 'search' ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={filter.placeholder}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="pl-10"
              />
            </div>
          ) : (
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}

      {/* Optional Filter Button */}
      {showFilterButton && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={onFilterClick}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomFilters;
