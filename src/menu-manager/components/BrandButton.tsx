import React from "react";
import { useTheme } from "../../context/themeContext";
import UberIcon from "../../assets/styledIcons/UberIcon";
import DeliverooIcon from "../../assets/styledIcons/DeliverooLogo";
import JustEatIcon from "../../assets/styledIcons/JustEatIcon";

type Brand = "uber" | "deliveroo" | "justeat";
type Variant = "solid" | "outlined";

type BrandButtonProps = {
  brand: Brand;
  children?: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: Variant;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode; // optional override
};

const BRAND_STYLES: Record<
  Brand,
  {
    solid: { bg: string; hover: string; text: string; ring: string };
    outlined: { border: string; text: string; hover: string; bg: string };
    iconDefault: React.ReactNode;
  }
> = {
  uber: {
    solid: {
      bg: "bg-[#142328]",
      hover: "hover:bg-[#0f1b1f]",
      text: "text-[#06c167]",
      ring: "focus:ring-[#06c167]/40",
    },
    outlined: {
      border: "border border-[#142328]",
      text: "text-[#142328]",
      hover: "hover:bg-[#142328] hover:text-white",
      bg: "bg-transparent",
    },
    iconDefault: <UberIcon />,
  },
  deliveroo: {
    solid: {
      bg: "bg-[#00CCBC]",
      hover: "hover:bg-[#00b3a5] ",
      text: "text-white",
      ring: "focus:ring-[#00CCBC]/40",
    },
    outlined: {
      border: "border border-[#018f83]",
      text: "text-[#018f83]",
      hover: "hover:bg-[#018f83] hover:text-white",
      bg: "bg-transparent",
    },
    iconDefault: <DeliverooIcon />,
  },
  justeat: {
    solid: {
      bg: "bg-[#FF8000]",
      hover: "hover:bg-[#e67300]",
      text: "text-white",
      ring: "focus:ring-[#FF8000]/40",
    },
    outlined: {
      border: "border border-[#FF8000]",
      text: "text-[#FF8000]",
      hover: "hover:bg-[#FF8000] hover:text-white",
      bg: "bg-transparent",
    },
    iconDefault: <JustEatIcon />,
  },
};

const BrandButton: React.FC<BrandButtonProps> = ({
  brand,
  children,
  onClick,
  loading = false,
  disabled = false,
  className = "",
  variant = "solid",
  type = "button",
  icon,
}) => {
  const { isDarkMode } = useTheme();
  const isDisabled = loading || disabled;
  const b = BRAND_STYLES[brand];

  const base =
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";
  const solid = `${b.solid.bg} ${b.solid.hover} ${b.solid.text} ${b.solid.ring} ${isDarkMode ? "focus:ring-offset-slate-900" : "focus:ring-offset-white"}`;
  const outlined = `${b.outlined.bg} ${b.outlined.border} ${b.outlined.text} ${b.outlined.hover} ${isDarkMode ? "" : ""}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={`${base} ${variant === "solid" ? solid : outlined} ${className}`}
    >
      {loading ? (
        <span className="w-4 h-4 inline-block border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        (icon ?? b.iconDefault)
      )}
      <span>{children}</span>
    </button>
  );
};

export default BrandButton;
