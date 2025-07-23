import React from "react";
import type { TagSelectorProps } from "./helper/components.types";

const TagSelector: React.FC<TagSelectorProps> = ({
  value,
  onChange,
  options,
  error,
}) => {
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value === option.value;

          const baseClass =
            "flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition cursor-pointer select-none";

          const finalClass = option.disabled
            ? `${baseClass} bg-gray-100 text-gray-400 cursor-not-allowed`
            : isSelected
              ? `${baseClass} bg-orange-100 border-orange-500 text-white`
              : `${baseClass} border-gray-300 text-gray-700 hover:bg-gray-100`;

          return (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              onClick={() => onChange(option.value)}
              className={finalClass}
            >
              {option.icon}
              {option.label}
            </button>
          );
        })}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default TagSelector;
