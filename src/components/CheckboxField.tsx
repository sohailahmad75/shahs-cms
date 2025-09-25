import React, { useId } from "react";
import { CheckIcon } from "lucide-react";
import { useTheme } from "../context/themeContext";

type CheckboxFieldProps = {
  name: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  size?: number; // px
  labelClassName?: string;
  disabled?: boolean;
};

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  checked,
  onChange,
  className = "",
  size = 20,
  labelClassName = "",
  disabled = false,
}) => {
  const { isDarkMode } = useTheme();
  const id = useId();
  const boxPx = `${size}px`;

  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-2 text-sm select-none cursor-pointer ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
    >
      {/* Accessible, focusable input (hidden visually) */}
      <input
        id={id}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer sr-only"
      />

      {/* Visual box */}
      <span
        aria-hidden
        style={{ width: boxPx, height: boxPx }}
        className={[
          "inline-flex items-center justify-center rounded border transition-colors duration-200",
          isDarkMode
            ? "border-slate-600 peer-focus-visible:ring-2 peer-focus-visible:ring-slate-400"
            : "border-gray-300 peer-focus-visible:ring-2 peer-focus-visible:ring-orange-400",
          checked
            ? isDarkMode
              ? "bg-slate-950 border-slate-700"
              : "bg-orange-500 border-orange-500"
            : isDarkMode
              ? "bg-slate-800"
              : "bg-white",
        ].join(" ")}
      >
        {checked && (
          <CheckIcon
            // ~60% of box size feels right
            size={Math.round(size * 0.6)}
            color="white"
            className="transition-transform duration-150"
          />
        )}
      </span>

      {/* Label text */}
      <span
        className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} ${labelClassName}`}
      >
        {label}
      </span>
    </label>
  );
};

export default CheckboxField;
