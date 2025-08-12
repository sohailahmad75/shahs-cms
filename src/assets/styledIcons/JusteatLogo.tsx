import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  variant?: "brand" | "mono";
};

const JustEatLogo: React.FC<IconProps> = ({
  size = 18,
  variant = "brand",
  ...props
}) => {
  const isBrand = variant === "brand";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      {/* Brand tile (orange) */}
      {isBrand && (
        <rect x="0" y="0" width="64" height="64" rx="12" fill="#FF8000" />
      )}

      {/* Simplified Just Eat-style “house” mark */}
      {/* For mono: the mark uses currentColor. For brand: it's white on orange. */}
      <path
        d="
          M16 28 L32 16 L48 28
          L48 48
          L38 48 38 36 26 36 26 48 16 48 Z
        "
        fill={isBrand ? "#FFFFFF" : "currentColor"}
      />
      {/* Little fork inside the house (abstract) */}
      <rect
        x="31"
        y="28"
        width="2"
        height="6"
        rx="1"
        fill={isBrand ? "#FFFFFF" : "currentColor"}
      />
      <rect
        x="28"
        y="28"
        width="2"
        height="5"
        rx="1"
        fill={isBrand ? "#FFFFFF" : "currentColor"}
      />
      <rect
        x="34"
        y="28"
        width="2"
        height="5"
        rx="1"
        fill={isBrand ? "#FFFFFF" : "currentColor"}
      />
    </svg>
  );
};

export default JustEatLogo;
