import React from "react";
import { CheckIcon } from "lucide-react";

type CheckboxFieldProps = {
  name: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  size?: string;
  labelClassName?: string;
};

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  checked,
  onChange,
  className = "",
  size = "6",
  labelClassName = "",
}) => {
  return (
    <label className={`flex items-center gap-2 text-sm ${className}`}>
      <div className={`relative w-${size} h-${size}`}>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="opacity-0 absolute inset-0 w-full h-full z-10 cursor-pointer"
        />
        <div
          className={`w-${size} h-${size} rounded border border-gray-300 flex items-center justify-center transition-all duration-200 ${
            checked ? "bg-orange-500 border-orange-500" : "bg-white"
          }`}
        >
          {checked && (
            <CheckIcon
              size={Math.round(Number(size) * 3)}
              color="white"
              className="transition-all duration-200"
            />
          )}
        </div>
      </div>
      <span className={`text-gray-700 cursor-pointer ${labelClassName}`}>
        {label}
      </span>
    </label>
  );
};

export default CheckboxField;
