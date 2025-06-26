import React, { useState, useRef, useEffect } from "react";

type Option = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  options: Option[];
  placeholder?: string;
  name?: string;
  error?: string;
};

const SelectField: React.FC<SelectFieldProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  name,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

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

  return (
    <div className="relative " ref={dropdownRef}>
      <div
        className={`flex items-center justify-between w-full border rounded px-4 py-2 cursor-pointer transition-colors duration-200 ${
          error
            ? "border-orange-100"
            : "border-gray-300 group-focus-within:border-orange-500"
        }`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={`${value ? "text-gray-800" : "text-gray-400"}`}>
          {selectedOption?.label || placeholder}
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
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                className={`px-4 py-2 cursor-pointer transition-colors duration-150 ${
                  isSelected
                    ? "bg-orange-100 text-white font-medium "
                    : "text-gray-700 hover:bg-orange-50"
                }`}
                onClick={() => {
                  onChange({
                    target: {
                      name,
                      value: opt.value,
                    },
                  } as React.ChangeEvent<never>);
                  setOpen(false);
                }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="text-primary-100 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SelectField;
