import React from "react";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: "solid" | "outlined"; // <-- NEW
};

const Button: React.FC<ButtonProps> = ({
  type = "button",
  children,
  onClick,
  loading = false,
  disabled = false,
  className = "",
  variant = "solid", // <-- Default to solid
  ...props
}) => {
  const isDisabled = loading || disabled;

  const baseClasses =
    "flex items-center justify-center gap-2 py-2 px-4 rounded transition duration-200 ease-in-out cursor-pointer";
  const disabledClasses =
    "disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed";

  const solidClasses = "bg-orange-500 text-white hover:bg-orange-600";
  const outlinedClasses =
    "border border-orange-500 text-orange-500 bg-white hover:bg-orange-50";

  const variantClasses =
    variant === "outlined" ? outlinedClasses : solidClasses;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className={`animate-spin h-5 w-5 ${
            variant === "outlined" ? "text-orange-500" : "text-white"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
      )}
      {loading ? "" : children}
    </button>
  );
};

export default Button;
