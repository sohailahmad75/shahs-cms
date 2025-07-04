import React from "react";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: "solid" | "outlined";
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
    "flex items-center justify-center gap-2 py-2 px-4 rounded transition duration-200 ease-in-out cursor-pointer";
  const disabledClasses =
    "disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed";

  const solidClasses = "bg-orange-500 text-white hover:bg-orange-600";
  const outlinedClasses = `border ${loading ? "text-gray-600 border-gray-600" : "border-orange-500 text-orange-500"}   bg-white hover:bg-orange-50`;

  const variantClasses =
    variant === "outlined" ? outlinedClasses : solidClasses;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className} text-sm`}
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
