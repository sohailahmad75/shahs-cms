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

  const parseISO = (s?: string) => (s ? new Date(s) : new Date());
  const toISO = (d: Date) => d.toISOString().split("T")[0];

  // nice display string (keeps onChange as ISO)
  const fmt = (d?: Date) =>
    d
      ? new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(d)
      : "";

  // range state mirrors the incoming value
  const [rangeState, setRangeState] = useState({
    startDate:
      isRange && Array.isArray(value) ? parseISO(value[0]) : new Date(),
    endDate: isRange && Array.isArray(value) ? parseISO(value[1]) : new Date(),
    key: "selection",
  });

  useEffect(() => {
    if (isRange && Array.isArray(value)) {
      setRangeState({
        startDate: parseISO(value[0]),
        endDate: parseISO(value[1]),
        key: "selection",
      });
    }
  }, [isRange, value]);

  const displayValue = isRange
    ? Array.isArray(value) && value[0] && value[1]
      ? `${fmt(parseISO(value[0]))} – ${fmt(parseISO(value[1]))}`
      : ""
    : typeof value === "string" && value
      ? fmt(parseISO(value))
      : "";

  const handleRangeChange = (ranges: any) => {
    const sel = ranges.selection;
    setRangeState(sel);
    const { startDate, endDate } = sel || {};
    if (startDate && endDate && toISO(startDate) !== toISO(endDate)) {
      onChange([toISO(startDate), toISO(endDate)]);
      setShow(false);
    }
  };

  const handleSingleDateChange = (date: Date) => {
    onChange(toISO(date));
    setShow(false);
  };

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShow(false);
      }
    };
    if (show) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show]);

  // keyboard affordances
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Escape") setShow(false);
    if (e.key === "Enter" || e.key === " ") setShow((p) => !p);
    if (e.key === "ArrowDown") setShow(true);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        readOnly
        name={name}
        className={`w-full px-4 py-2 border rounded-lg transition outline-none cursor-pointer ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-orange-400"
        }`}
        placeholder={placeholder}
        value={displayValue}
        onClick={() => setShow((prev) => !prev)}
        onKeyDown={handleKeyDown}
      />

      {show && (
        <div
          className="absolute z-50 mt-2 bg-white shadow-xl rounded-lg border border-gray-200
                     max-h-[340px] overflow-auto min-w-[280px] max-w-[320px] p-2"
        >
          {isRange ? (
            <div
              className="origin-top-left scale-95"
              style={{ transformOrigin: "top left" }}
            >
              <DateRange
                className="shahs-date"
                ranges={[rangeState]}
                onChange={handleRangeChange}
                moveRangeOnFirstSelection={false}
                showDateDisplay={false}
                editableDateInputs={false}
                months={1}
                direction="horizontal"
                monthDisplayFormat="MMM yyyy"
                weekdayDisplayFormat="EE"
                fixedHeight
                rangeColors={["#fb923c"]}
              />
            </div>
          ) : (
            <div
              className="origin-top-left scale-95"
              style={{ transformOrigin: "top left" }}
            >
              <Calendar
                className="shahs-date"
                date={
                  typeof value === "string" && value
                    ? parseISO(value)
                    : new Date()
                }
                onChange={handleSingleDateChange}
                color="#fb923c"
              />
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default DatePickerField;
