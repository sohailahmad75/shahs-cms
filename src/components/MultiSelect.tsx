import React, { useEffect, useRef, useState } from "react";
import { CheckIcon } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type MultiSelectProps = {
  value: string[]; // array of selected values
  onChange: (value: string[]) => void;
  options: Option[];
  placeholder?: string;
  name?: string;
  error?: string;
};

const MultiSelect: React.FC<MultiSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select options",
  name,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleValue = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`flex items-center justify-between w-full border rounded px-4 py-2 cursor-pointer transition-colors duration-200 ${
          error
            ? "border-red-500"
            : "border-gray-300 group-focus-within:border-orange-500"
        }`}
        onClick={() => setOpen(!open)}
      >
        <span
          className={`${
            value.length ? "text-gray-800" : "text-gray-400"
          } truncate`}
        >
          {value.length === 0
            ? placeholder
            : selectedLabels.length <= 2
              ? selectedLabels.join(", ")
              : `${selectedLabels.slice(0, 2).join(", ")} +${
                  selectedLabels.length - 2
                } more`}
        </span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${
            open ? "rotate-180 text-orange-500" : "text-gray-400"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L10 9.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 12z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded shadow-md max-h-60 overflow-y-auto animate-fadeIn">
          {options.map((opt) => {
            const isSelected = value.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggleValue(opt.value)}
                className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-orange-50 text-sm text-gray-800"
              >
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors duration-200 ${
                    isSelected
                      ? "bg-orange-500 border-orange-500"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <CheckIcon
                      size={16}
                      color="white"
                      className="transition-transform duration-200"
                    />
                  )}
                </div>
                <span>{opt.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default MultiSelect;
