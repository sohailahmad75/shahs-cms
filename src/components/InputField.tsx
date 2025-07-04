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
  ...props
}) => {
  const baseStyles =
    "w-full outline-none bg-transparent resize-none min-h-[100px]";

  return (
    <div className={`relative group ${className}`} {...props}>
      <div
        className={`flex items-start w-full border rounded px-4 py-2 transition-colors duration-200 ${
          error
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
            className={baseStyles}
          />
        ) : (
          <input
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full outline-none bg-transparent"
          />
        )}
        {icon && (
          <div className="absolute right-3 top-3 text-gray-400 group-focus-within:text-red-500 transition-colors duration-200">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
