import React from "react";
import { useTheme } from "../../src/context/themeContext";

type InputFieldProps = {
  type?: string;
  placeholder?: string;
  value: string | number;
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
  darkMode?: boolean;
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
  darkMode = false,
  ...props
}) => {
  const { isDarkMode } = useTheme();
  const finalDarkMode = darkMode || isDarkMode;

  const baseStyles = `w-full text-sm font-semibold outline-none ${finalDarkMode ? "bg-slate-800 text-slate-100 placeholder-slate-400" : "text-secondary-100 bg-transparent"}`;
  const textareaStyles = `${baseStyles}`;

  return (
    <div className={`relative group ${className}`} {...props}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-xs font-semibold mb-1 ${finalDarkMode ? "text-slate-300" : "text-secondary-100"}`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={`flex items-start w-full border rounded-md px-3 py-2 transition-colors duration-200 ${
          error
            ? "border-red-500"
            : finalDarkMode
              ? "border-slate-600 group-focus-within:border-slate-400"
              : "border-gray-300 group-focus-within:border-orange-500"
        } ${finalDarkMode ? "bg-slate-800" : "bg-white"}`}
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
          <div
            className={`absolute right-3 top-3 transition-colors duration-200 ${
              finalDarkMode
                ? "text-slate-400 group-focus-within:text-slate-200"
                : "text-gray-400 group-focus-within:text-orange-500"
            } ${iconContainerClassName || ""}`}
          >
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
