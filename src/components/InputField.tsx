import React from "react";

type InputFieldProps = {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  error?: string;
  name?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  icon,
  error,
  name,
}) => {
  return (
    <div className="mb-4 relative group">
      <div
        className={`flex items-center w-full border rounded px-4 pr-12 py-2 transition-colors duration-200 ${
          error
            ? "border-primary-100"
            : "border-gray-300 group-focus-within:border-orange-500"
        }`}
      >
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full outline-none bg-transparent"
        />
        {icon && (
          <div className="absolute right-3 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-primary-100 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
