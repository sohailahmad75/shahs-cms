import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DateRange, Calendar } from "react-date-range";
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
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const [rangeState, setRangeState] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const displayValue = isRange
    ? Array.isArray(value)
      ? `${value[0]} - ${value[1]}`
      : ""
    : (value as string);

  const handleRangeChange = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setRangeState(ranges.selection);

    if (startDate && endDate) {
      onChange([formatDate(startDate), formatDate(endDate)]);
      setShow(false);
    }


  };

  const handleSingleDateChange = (date: Date) => {
    onChange(formatDate(date));
    setShow(false);
  };

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

  return (<div className="relative w-full" ref={wrapperRef}>
    <input
      readOnly
      name={name}
      className={`w-full px-4 py-2 border rounded-lg transition outline-none cursor-pointer ${error
          ? "border-orange-100 focus:border-orange-100"
          : "border-gray-300 focus:border-orange-100"
        }`}
      placeholder={placeholder}
      value={displayValue}
      onClick={() => setShow((prev) => !prev)}
    />


    {show &&
      createPortal(
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-2 bg-white shadow-xl rounded-lg"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            
          }}
        >
          {isRange ? (
            <DateRange
              ranges={[rangeState]}
              onChange={handleRangeChange}
              moveRangeOnFirstSelection={false}
              editableDateInputs
              rangeColors={["#FF4F04"]}
            />
          ) : (
            <Calendar
              date={value ? new Date(value as string) : new Date()}
              onChange={handleSingleDateChange}
              color="#FF4F04"
            />
          )}
        </div>,
        document.body
      )}

    {error && <p className="text-orange-100 text-sm mt-1">{error}</p>}
  </div>


  );
};

export default DatePickerField;
