import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

interface Props {
  defaultValue?: string;
  name: string;
  placeHolder: string;
  type: string;
  required?: boolean;
  disabled?: boolean;
}

const CustomInput: React.FC<Props> = ({
  defaultValue,
  name,
  placeHolder,
  type,
  required,
  disabled,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  useEffect(() => {
    if (defaultValue) {
      setValue(name, defaultValue);
    }
  }, [defaultValue, name, setValue]);

  const validationRules: Record<string, unknown> = {};

  if (required) {
    validationRules.required = "This field is required";
  }

  if (type === "email") {
    validationRules.pattern = {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Invalid email address",
    };
  }

  if (type === "number") {
    validationRules.valueAsNumber = true;
    validationRules.validate = (value: string | number) => {
      if (value === "" || value === null || value === undefined) return true; // Allow empty for non-required fields
      const num = Number(value);
      if (isNaN(num)) return "Please enter a valid number";
      return true;
    };
  }

  return (
    <div className="flex flex-col gap-2 w-full rounded-md   ">
      <input
        type={type}
        defaultValue={defaultValue}
        disabled={disabled}
        className={`w-full outline-none py-2 px-4 rounded-md text-sm transition placeholder-gray-400 dark:placeholder-gray-500 ${
          disabled 
            ? 'text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 cursor-not-allowed' 
            : 'text-slate-900 dark:text-slate-100 bg-white dark:bg-[#182235] border border-gray-400 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800'
        }`}
        placeholder={placeHolder}
        {...register(name, validationRules)}
      />
      {required && errors[name] && (
        <span className="text-red-500 text-sm">
          {errors[name]?.message?.toString()}
        </span>
      )}
    </div>
  );
};

export default CustomInput;
