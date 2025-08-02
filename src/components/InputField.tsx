import React from "react";

type InputFieldProps = {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  icon?: React.ReactNode;
  error?: string;
  name: string;
  className?: string;
  iconContainerClassName?: string;
  label?: string;
  rows?: number;
  required?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  icon,
  error,
  name,
  className = "",
  iconContainerClassName = "",
  label,
  rows = 3,
  required = false,
  ...props
}) => {
  const baseStyles = "w-full outline-none bg-transparent";
  const textareaStyles = `${baseStyles} resize-none min-h-[100px]`;

  return (
    <div className={`relative group ${className}`} {...props}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={`flex items-start w-full border rounded px-4 py-2 transition-colors duration-200 ${error
            ? "border-red-500"
            : "border-gray-300 group-focus-within:border-red-500"
          }`}
      >
        {type === "textarea" ? (
          <textarea
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={textareaStyles}
            rows={rows}
          />
        ) : (
          <input
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={baseStyles}
            required={required}
          />
        )}
        {icon && (
          <div className={`absolute right-3 top-3 text-gray-400 group-focus-within:text-red-500 transition-colors duration-200 ${iconContainerClassName || ''}`}>
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;