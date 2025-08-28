import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface Props {
  name: string;
  options: Option[];
  placeHolder?: string;
  required?: boolean;
  defaultValue?: string;
}

const CustomSelectWithSearch: React.FC<Props> = ({
  name,
  options,
  placeHolder,
  required,
  defaultValue,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (defaultValue) setValue(name, defaultValue);
  }, [defaultValue, name, setValue]);

  return (
    <div className="flex flex-col gap-2 w-full rounded-md">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-2 px-3 py-2 border border-gray-400 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-[#182235] text-slate-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-gray-500"
      />
      <select
        {...register(name, { required })}
        className="bg-white dark:bg-[#182235] border border-gray-400 dark:border-gray-600 text-sm rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 block w-full p-2.5 dark:text-white transition placeholder-gray-400 dark:placeholder-gray-500"
        defaultValue={defaultValue || ""}
      >
        {placeHolder && <option value="">{placeHolder}</option>}
        {filteredOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {required && errors[name] && (
        <span className="text-red-500 text-sm">
          {errors[name]?.message?.toString() || "This field is required"}
        </span>
      )}
    </div>
  );
};

export default CustomSelectWithSearch;
