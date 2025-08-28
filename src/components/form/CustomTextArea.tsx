import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

interface Props {
  defaultValue?: string;
  name: string;
  placeHolder: string;
  required?: boolean;
  rows?: number;
}

const CustomTextArea: React.FC<Props> = ({
  defaultValue,
  name,
  placeHolder,
  required,
  rows = 4,
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

  const validationRules: { [key: string]: string } = {};
  if (required) {
    validationRules.required = "This field is required";
  }

  return (
    <div className="flex flex-col gap-2 w-full rounded-md">
      <textarea
        rows={rows}
        defaultValue={defaultValue}
        className="w-full outline-none py-2 px-4 rounded-md text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-[#182235] border border-gray-400 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition placeholder-gray-400 dark:placeholder-gray-500"
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

export default CustomTextArea;
