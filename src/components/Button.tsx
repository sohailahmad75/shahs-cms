import React from "react";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean | undefined;
  disabled?: boolean;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  type = "button",
  children,
  onClick,
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const isDisabled = loading || disabled;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`flex items-center justify-center gap-2 bg-orange-500 text-white py-2 px-4 rounded transition duration-200 ease-in-out cursor-pointer hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 text-white"
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
