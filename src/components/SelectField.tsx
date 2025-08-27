import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import ArrowIcon from "../assets/styledIcons/ArrowIcon";

type Option = {
  label: string;
  value: string | number;
};

type SelectFieldProps = {
  value: string | number;
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Update dropdown position relative to input + scroll
  const updateDropdownPosition = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  // Handle clicks outside and update position on resize/scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true); // capture scroll in parent containers

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, []);

  useEffect(() => {
    if (open) updateDropdownPosition();
  }, [open]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Input Box */}
      <div
        className={`flex items-center justify-between border rounded px-4 py-2 transition-colors duration-200 w-full ${error ? "border-orange-100" : "border-gray-300"
          } ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-400" : "cursor-pointer"}`}
        onClick={() => !disabled && setOpen((prev) => !prev)}
      >
        <span className={`truncate ${selectedOption ? "text-gray-800" : "text-gray-400"}`}>
          {selectedOption?.label || placeholder}
        </span>
        <ArrowIcon
          size={18}
          className={`ml-2 transition-transform ${open ? "rotate-180 text-orange-500" : "text-gray-400"} ${disabled ? "opacity-50" : ""
            }`}
        />
      </div>

      {/* Dropdown rendered in portal */}
      {open &&
        !disabled &&
        createPortal(
          <div
            ref={dropdownRef}
            className="absolute z-50 bg-white border border-gray-200 rounded shadow-md max-h-60 overflow-y-auto animate-fadeIn p-2"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
            }}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <div
                  key={opt.value}
                  className={`px-4 py-2 cursor-pointer transition duration-150 rounded text-sm mb-1 ${isSelected ? "bg-orange-500 text-white font-medium" : "text-gray-700 hover:bg-orange-50"
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
          </div>,
          document.body
        )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SelectField;
