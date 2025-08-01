import React, { useState, useRef, useEffect } from "react";
import ArrowIcon from "../assets/styledIcons/ArrowIcon";

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
  disabled?: boolean;
};

const SelectField: React.FC<SelectFieldProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  name,
  error,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const [labelWidth, setLabelWidth] = useState(0);
  const labelRef = useRef<HTMLSpanElement>(null);
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

  useEffect(() => {
    if (labelRef.current) {
      setLabelWidth(labelRef.current.offsetWidth + 48); // + icon and padding
    }
  }, [value]);

  return (
    <div className="relative inline-block w-full max-w-full" ref={dropdownRef}>
      {/* Hidden span to calculate label width */}
      <span
        ref={labelRef}
        className="absolute opacity-0 pointer-events-none whitespace-nowrap"
      >
        {selectedOption?.label || placeholder}
      </span>

      {/* Trigger box */}
      <div
        className={`flex items-center justify-between border rounded px-4 py-2 transition-colors duration-200 w-full ${
          error ? "border-orange-100" : "border-gray-300"
        } ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-400" : "cursor-pointer"}`}
        onClick={() => !disabled && setOpen((prev) => !prev)} // ✅ prevent open
      >
        <span
          className={`truncate ${value ? "text-gray-800" : "text-gray-400"}`}
        >
          {selectedOption?.label || placeholder}
        </span>
        <ArrowIcon
          size={18}
          className={`ml-2 transition-transform ${
            open ? "rotate-180 text-orange-500" : "text-gray-400"
          } ${disabled ? "opacity-50" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {open && !disabled && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded shadow-md max-h-60 overflow-y-auto animate-fadeIn w-full p-2">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                className={`px-4 py-2 cursor-pointer transition duration-150 rounded text-sm mb-1 ${
                  isSelected
                    ? "bg-orange-500 text-white font-medium"
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
