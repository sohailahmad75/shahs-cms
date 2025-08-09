import React from "react";
import { useTheme } from "../context/themeContext";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: "solid" | "outlined" | "destructive";
  icon?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  type = "button",
  children,
  onClick,
  loading = false,
  disabled = false,
  className = "",
  variant = "solid",
  icon,
  ...props
}) => {
  const { isDarkMode } = useTheme();
  const isDisabled = loading || disabled;

  const baseClasses =
    "flex items-center justify-center gap-2 py-2 px-4 rounded transition duration-200 ease-in-out cursor-pointer text-sm";
  const disabledClasses =
    `${isDarkMode ? "disabled:bg-slate-900" : "disabled:bg-gray-300"}  ${isDarkMode ? "disabled:bg-slate-950 border border-slate-800" : "disabled:border-gray-400"}  disabled:text-gray-600 disabled:cursor-not-allowed`;

  const variantClasses = (() => {
    switch (variant) {
      case "outlined":
        return `border ${loading 
  ? (isDarkMode ? "text-slate-500" : "text-gray-600") 
  : (isDarkMode ? "bg-slate-950 border border-slate-800" : "border-orange-500")
}
border ${loading 
  ? (isDarkMode ? "border-slate-400" : "border-gray-600") 
  : (isDarkMode ? "text-slate-500" : "text-orange-500")
}
 ${isDarkMode ? "bg-slate-900" : "bg-white"} ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-orange-50"}`;
      case "destructive":
        return ` ${isDarkMode ? "bg-slate-900" : "bg-red-500"} bg-red-500 text-white hover:bg-red-600`;
      case "solid":
      default:
        return `${isDarkMode ? "bg-slate-900" : "bg-orange-500"} ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-orange-600"} text-white`;
    }
  })();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses} ${isDisabled ? disabledClasses : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        icon
      )}
      {children}
    </button>
  );
};

export default Button;
