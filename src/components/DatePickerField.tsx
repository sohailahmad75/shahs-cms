import React, { useEffect, useRef, useState } from "react";
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

    if (startDate && endDate && formatDate(startDate) !== formatDate(endDate)) {
      onChange([formatDate(startDate), formatDate(endDate)]);
      setShow(false);
    }
  };

  const handleSingleDateChange = (date: Date) => {
    onChange(formatDate(date));
    setShow(false);
  };

  // 🔁 Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        readOnly
        name={name}
        className={`w-full px-4 py-2 border rounded-lg transition outline-none cursor-pointer ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-orange-400"}`}
        placeholder={placeholder}
        value={displayValue}
        onClick={() => setShow((prev) => !prev)}
      />
      {show && (
        <div className="absolute z-50 mt-2 bg-white shadow-xl rounded-lg">
          {isRange ? (
            <DateRange
              ranges={[rangeState]}
              onChange={handleRangeChange}
              moveRangeOnFirstSelection={false}
              editableDateInputs
              rangeColors={["#fb923c"]}
            />
          ) : (
            <Calendar
              date={new Date((value as string) || new Date())}
              onChange={handleSingleDateChange}
              color="#fb923c"
            />
          )}
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default DatePickerField;
