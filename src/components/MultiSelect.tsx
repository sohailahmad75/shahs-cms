import React, { useEffect, useRef, useState } from "react";
import { CheckIcon } from "lucide-react";
import ArrowIcon from "../assets/styledIcons/ArrowIcon";

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
  error,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [labelWidth, setLabelWidth] = useState(0);

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label);

  const displayText =
    value.length === 0
      ? placeholder
      : selectedLabels.length <= 2
        ? selectedLabels.join(", ")
        : `${selectedLabels.slice(0, 2).join(", ")} +${selectedLabels.length - 2} more`;

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
      setLabelWidth(labelRef.current.offsetWidth + 48); // add icon/padding
    }
  }, [displayText]);

  const toggleValue = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <div className="relative inline-block w-full max-w-full" ref={dropdownRef}>
      {/* Hidden span to calculate width */}
      <span
        ref={labelRef}
        className="absolute opacity-0 pointer-events-none whitespace-nowrap"
      >
        {displayText}
      </span>

      {/* Trigger */}
      <div
        className={`flex items-center justify-between border rounded px-4 py-2 cursor-pointer transition-colors duration-200 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        onClick={() => setOpen((prev) => !prev)}
        style={{
          width: Math.min(Math.max(labelWidth, 140), 280), // clamp width
        }}
      >
        <span
          className={`truncate ${value.length ? "text-gray-800" : "text-gray-400"}`}
        >
          {displayText}
        </span>
        <ArrowIcon
          size={18}
          className={`ml-2 transition-transform ${
            open ? "rotate-180 text-orange-500" : "text-gray-400"
          }`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 p-2 mt-1 w-full bg-white border border-gray-200 rounded shadow-md max-h-60 overflow-y-auto animate-fadeIn min-w-[140px]">
          {options.map((opt) => {
            const isSelected = value.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggleValue(opt.value)}
                className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-orange-50 text-sm text-gray-800 rounded"
              >
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors duration-200 ${
                    isSelected
                      ? "bg-orange-500 border-orange-500"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && <CheckIcon size={16} color="white" />}
                </div>
                <span className="capitalize">{opt.label}</span>
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
