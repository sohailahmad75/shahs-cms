import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import ArrowIcon from "../assets/styledIcons/ArrowIcon";
import { useTheme } from "../context/themeContext"; // Import the theme context

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
  darkMode?: boolean; // Add dark mode prop
};

const SelectField: React.FC<SelectFieldProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  name,
  error,
  disabled,
  darkMode = false, // Default to false
}) => {
  const { isDarkMode: themeDarkMode } = useTheme(); // Get theme from context
  const finalDarkMode = darkMode || themeDarkMode; // Use prop if provided, otherwise use context

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
        className={`flex items-center justify-between border rounded px-4 py-2 transition-colors duration-200 w-full ${error
            ? "border-red-500"
            : finalDarkMode
              ? "border-slate-600 focus-within:border-slate-400"
              : "border-gray-300 focus-within:border-orange-500"
          } ${disabled
            ? finalDarkMode
              ? "bg-slate-700 cursor-not-allowed text-slate-400"
              : "bg-gray-100 cursor-not-allowed text-gray-400"
            : finalDarkMode
              ? "bg-slate-800 cursor-pointer text-slate-200"
              : "bg-white cursor-pointer text-gray-800"
          }`}
        onClick={() => !disabled && setOpen((prev) => !prev)}
      >
        <span className={`truncate ${selectedOption
            ? finalDarkMode ? "text-slate-200" : "text-gray-800"
            : finalDarkMode ? "text-slate-400" : "text-gray-400"
          }`}>
          {selectedOption?.label || placeholder}
        </span>
        <ArrowIcon
          size={18}
          className={`ml-2 transition-transform ${open
              ? "rotate-180 " + (finalDarkMode ? "text-slate-200" : "text-orange-500")
              : finalDarkMode ? "text-slate-400" : "text-gray-400"
            } ${disabled ? "opacity-50" : ""}`}
        />
      </div>

      {/* Dropdown rendered in portal */}
      {open &&
        !disabled &&
        createPortal(
          <div
            ref={dropdownRef}
            className={`absolute z-50 border rounded shadow-md max-h-60 overflow-y-auto animate-fadeIn p-2 ${finalDarkMode
                ? "bg-slate-800 border-slate-600"
                : "bg-white border-gray-200"
              }`}
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
                  className={`px-4 py-2 cursor-pointer transition duration-150 rounded text-sm mb-1 ${isSelected
                      ? finalDarkMode
                        ? "bg-slate-950 text-white font-medium"
                        : "bg-orange-500 text-white font-medium"
                      : finalDarkMode
                        ? "text-slate-200 hover:bg-slate-700"
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
          </div>,
          document.body
        )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SelectField;