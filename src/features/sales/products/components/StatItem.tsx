import React from "react";
import LowStockIcon from "../../../../assets/styledIcons/LowStockIcon";
import StockOut from "../../../../assets/styledIcons/StockOut";
import CloseIcon from "../../../../assets/styledIcons/CloseIcon";

type StatKind = "LOW" | "OUT" | null;

type StockStatsHeaderProps = {
  lowCount: number;
  outCount: number;
  activeStat?: StatKind;
  onChange?: (next: StatKind) => void;
  className?: string;
};

export const StockStatsHeader: React.FC<StockStatsHeaderProps> = ({
  lowCount,
  outCount,
  activeStat,
  onChange,
  className = "",
}) => {
  const [internal, setInternal] = React.useState<StatKind>(null);
  const isControlled = typeof activeStat !== "undefined";
  const value = isControlled ? activeStat : internal;
  const setValue = (v: StatKind) =>
    isControlled ? onChange?.(v) : setInternal(v);

  const toggle = (stat: Exclude<StatKind, null>) =>
    setValue(value === stat ? null : stat);

  return (
    <div
      className={`flex items-center justify-center gap-6 sm:gap-10 md:gap-16 ${className}`}
    >
      <StatItem
        title="Low stock"
        count={lowCount}
        isActive={value === "LOW"}
        isDimmed={value === "OUT"}
        onClick={() => toggle("LOW")}
        bgClass="bg-amber-500"
        ringClass="ring-amber-900/30"
        countColor="text-amber-600"
        countDimColor="text-amber-300"
        renderIcon={(size) => (
          <LowStockIcon size={size} color="#fff" secondaryColor="#fff" />
        )}
        onClear={() => setValue(null)}
      />

      <div className="hidden md:block h-14 w-px bg-slate-200" />

      <StatItem
        title="Out of stock"
        count={outCount}
        isActive={value === "OUT"}
        isDimmed={value === "LOW"}
        onClick={() => toggle("OUT")}
        bgClass="bg-rose-600"
        ringClass="ring-rose-900/25"
        countColor="text-rose-600"
        countDimColor="text-rose-300"
        renderIcon={(size) => <StockOut size={size} color="#fff" />}
        onClear={() => setValue(null)}
      />
    </div>
  );
};

type StatItemProps = {
  title: string;
  count: number | string;
  isActive: boolean;
  isDimmed: boolean;
  onClick: () => void;
  onClear: () => void;
  bgClass: string;
  ringClass: string;
  countColor: string;
  countDimColor: string;
  renderIcon: (size: number) => React.ReactNode;
};

const StatItem: React.FC<StatItemProps> = ({
  title,
  count,
  isActive,
  isDimmed,
  onClick,
  onClear,
  bgClass,
  ringClass,
  countColor,
  countDimColor,
  renderIcon,
}) => {
  return (
    <div className="flex items-start gap-1 sm:gap-2">
      <button
        type="button"
        aria-pressed={isActive}
        onClick={onClick}
        className="group flex items-center gap-3 sm:gap-4 px-1 py-1 rounded-lg transition cursor-pointer"
      >
        <span
          className={[
            "relative grid place-items-center rounded-full text-white",
            "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20",
            "ring-2",
            ringClass,
            bgClass,
            "shadow-[inset_0_-8px_14px_rgba(0,0,0,.14),0_8px_16px_rgba(0,0,0,.10)]",
            "transition-all duration-200 will-change-transform",
            isDimmed
              ? "opacity-40 blur-[1px] grayscale"
              : "group-hover:scale-[1.01]",
          ].join(" ")}
        >
          <span className="pointer-events-none absolute inset-0 rounded-full bg-white/10" />
          <span className="md:hidden">{renderIcon(24)}</span>
          <span className="hidden md:block">{renderIcon(34)}</span>
        </span>

        <div className="text-left">
          <h2
            className={[
              "leading-none font-semibold",
              "text-2xl sm:text-[26px] md:text-3xl",
              isDimmed ? countDimColor : countColor,
            ].join(" ")}
          >
            {count}
          </h2>
          <p
            className={[
              "mt-1 uppercase tracking-widest",
              "text-[10px] sm:text-xs",
              isDimmed ? "text-slate-400" : "text-slate-500",
            ].join(" ")}
          >
            {title}
          </p>
        </div>
      </button>

      {isActive && (
        <button
          type="button"
          onClick={onClear}
          aria-label={`Clear ${title} filter`}
          className="ml-1 grid h-6 w-6 place-items-center rounded-full cursor-pointer text-slate-400 hover:text-slate-600 hover:border-slate-400 transition"
          title="Clear"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};
