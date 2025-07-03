import React from "react";
import { CheckIcon } from "lucide-react";

type CheckboxFieldProps = {
  name: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  checked,
  onChange,
  className = "",
}) => {
  return (
    <label className={`flex items-center gap-2 text-sm ${className}`}>
      <div className="relative w-6 h-6">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="opacity-0 absolute inset-0 w-full h-full z-10 cursor-pointer"
        />
        <div
          className={`w-6 h-6 rounded border border-gray-300 flex items-center justify-center transition-all duration-200 ${
            checked ? "bg-orange-500 border-orange-500" : "bg-white"
          }`}
        >
          {checked && (
            <CheckIcon
              size={18}
              color="white"
              className="transition-all duration-200"
            />
          )}
        </div>
      </div>
      <span className="text-gray-700 cursor-pointer">{label}</span>
    </label>
  );
};

export default CheckboxField;
