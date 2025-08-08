import React from "react";

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
  const isDisabled = loading || disabled;

  const baseClasses =
    "flex items-center justify-center gap-2 py-2 px-4 rounded transition duration-200 ease-in-out cursor-pointer text-sm";
  const disabledClasses =
    "disabled:bg-gray-300 disabled:text-gray-600 disabled:border-gray-400 disabled:cursor-not-allowed";

  const variantClasses = (() => {
    switch (variant) {
      case "outlined":
        return `border ${loading ? "text-gray-600 border-gray-600" : "border-orange-500 text-orange-500"} bg-white hover:bg-orange-50`;
      case "destructive":
        return `bg-red-500 text-white hover:bg-red-600`;
      case "solid":
      default:
        return `bg-orange-500 text-white hover:bg-orange-600`;
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
