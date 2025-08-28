interface Props {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}

const CustomLabel: React.FC<Props> = ({ 
  children, 
  required = false, 
  htmlFor, 
  className = "" 
}) => {
  return (
    <label 
      htmlFor={htmlFor}
      className={`block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default CustomLabel;
