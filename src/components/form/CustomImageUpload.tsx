import { useFormContext } from "react-hook-form";

interface Props {
  name: string;
  multiple?: boolean;
  required?: boolean;
}

const CustomImageUpload: React.FC<Props> = ({ name, multiple, required }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col gap-2 w-full rounded-md">
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        {...register(name, { required })}
        className="block w-full text-sm text-slate-900 dark:text-slate-100 border border-gray-400 dark:border-gray-600 bg-white dark:bg-[#182235] rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:bg-[#182235] transition placeholder-gray-400 dark:placeholder-gray-500"
      />
      {required && errors[name] && (
        <span className="text-red-500 text-sm">
          {errors[name]?.message?.toString() || "This field is required"}
        </span>
      )}
    </div>
  );
};

export default CustomImageUpload;
