import { useFormContext } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface Props {
  name: string;
  options: Option[];
  required?: boolean;
}

const CustomMultiSelectCheckbox: React.FC<Props> = ({ name, options, required }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const selectedValues = watch(name) || [];

  const handleCheckboxChange = (optionValue: string) => {
    const currentValues = selectedValues;
    const isSelected = currentValues.includes(optionValue);
    
    if (isSelected) {
      // Remove from selection
      const newValues = currentValues.filter((value: string) => value !== optionValue);
      setValue(name, newValues);
    } else {
      // Add to selection
      setValue(name, [...currentValues, optionValue]);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full rounded-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 select-none">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      
      {/* Hidden input for form registration */}
      <input
        type="hidden"
        {...register(name, { required })}
        value={selectedValues}
      />
      
      {required && errors[name] && (
        <span className="text-red-500 text-sm">
          {errors[name]?.message?.toString() || "Please select at least one category"}
        </span>
      )}
    </div>
  );
};

export default CustomMultiSelectCheckbox;
