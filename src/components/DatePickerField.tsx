import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

type Props = {
  value: string | [string, string];
  onChange: (val: string | [string, string]) => void;
  name: string;
  isRange?: boolean;
  error?: string;
  placeholder?: string;
};

const DatePickerField: React.FC<Props> = ({
  value,
  onChange,
  name,
  isRange = false,
  error,
  placeholder = "Select date",
}) => {
  const [show, setShow] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const [rangeState, setRangeState] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  // show value in input
  const displayValue = isRange
    ? Array.isArray(value)
      ? `${formatDate(value[0])} - ${formatDate(value[1])}`
      : ""
    : formatDate(value as string);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, []);

  useEffect(() => {
    if (show) updateDropdownPosition();
  }, [show]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      
      <input
        readOnly
        name={name}
        className={`w-full px-4 py-2 border rounded-lg transition outline-none cursor-pointer ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
          }`}
        placeholder={placeholder}
        value={displayValue}
        onClick={() => setShow((prev) => !prev)}
      />

      {show &&
        createPortal(
          <div
            ref={dropdownRef}
            className="absolute z-50 mt-2 bg-white shadow-xl rounded-lg p-3"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
          >
            {isRange ? (
              <div className="flex gap-4">
               
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">From date:</label>
                  <input
                    readOnly
                    value={rangeState.startDate ? formatDate(rangeState.startDate) : ""}
                    className="px-3 py-2 border rounded-md cursor-pointer focus:border-blue-500 outline-none"
                  />
                  <Calendar
                    date={rangeState.startDate || new Date()}
                    onChange={(date: Date) => {
                      setRangeState((prev) => ({ ...prev, startDate: date }));
                      if (rangeState.endDate) {
                        onChange([formatDate(date), formatDate(rangeState.endDate)]);
                      }
                    }}
                    color="#3b82f6"
                  />
                </div>

            
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">To date:</label>
                  <input
                    readOnly
                    value={rangeState.endDate ? formatDate(rangeState.endDate) : ""}
                    className="px-3 py-2 border rounded-md cursor-pointer focus:border-blue-500 outline-none"
                  />
                  <Calendar
                    date={rangeState.endDate || new Date()}
                    onChange={(date: Date) => {
                      setRangeState((prev) => ({ ...prev, endDate: date }));
                      if (rangeState.startDate) {
                        onChange([formatDate(rangeState.startDate), formatDate(date)]);
                      }
                    }}
                    color="#3b82f6"
                  />
                </div>
              </div>
            ) : (
              <Calendar
                date={value ? new Date(value as string) : new Date()}
                onChange={(date: Date) => {
                  const formatted = formatDate(date);
                  onChange(formatted);
                  setShow(false);
                }}
                color="#3b82f6"
              />
            )}
          </div>,
          document.body
        )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default DatePickerField;
