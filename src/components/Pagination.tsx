// components/Pagination.tsx
import React from "react";
import SelectField from "./SelectField";
import ArrowIcon from "../assets/styledIcons/ArrowIcon";
import ForwardEndIcon from "../assets/styledIcons/ForwardEndIcon";
import { useTheme } from "../context/themeContext";

type Props = {
  page: number;
  perPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  perPageOptions?: number[];
  className?: string;
  disabled?: boolean;
  leftTitle?: string; // e.g. "Total Arrivals"
};

// 👉 exactly one before & one after (handles edges)
function getPageWindow(current: number, totalPages: number) {
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (current <= 1) return [1, 2];
  if (current >= totalPages) return [totalPages - 1, totalPages];
  return [current - 1, current, current + 1];
}

const Pagination: React.FC<Props> = ({
  page,
  perPage,
  total,
  onPageChange,
  onPerPageChange,
  perPageOptions = [5, 10, 25, 50, 100],
  className = "",
  disabled = false,
  leftTitle,
}) => {
    const { isDarkMode } = useTheme();
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, perPage)));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const start = total === 0 ? 0 : (safePage - 1) * perPage + 1;
  const end = total === 0 ? 0 : Math.min(safePage * perPage, total);

  const canPrev = !disabled && safePage > 1;
  const canNext = !disabled && safePage < totalPages;

  const pages = getPageWindow(safePage, totalPages);

  const numberBtnBase =
    "h-8 min-w-8 px-2 text-sm rounded-md border transition select-none flex justify-center items-center " +
    "cursor-pointer focus:outline-none ";
  const numberBtn = `${numberBtnBase}
   ${isDarkMode
      ? "border-slate-700 bg-slate-900 text-slate-100" 
      : "border-gray-300 bg-white hover:bg-orange-50"
    }
  border-gray-300 bg-white hover:bg-orange-50`;
  const numberBtnActive = `${numberBtnBase} 
  ${isDarkMode
      ? "border-slate-700 bg-slate-950 text-slate-100" 
      : "border-orange-500 bg-orange-500 text-white"
    }
  border-orange-500 bg-orange-500 text-white`;
  const chevronBtn = `
  h-8 min-w-8 px-2 text-sm rounded-md border flex justify-center items-center 
  cursor-pointer focus:outline-none transition 
  disabled:opacity-40 disabled:cursor-not-allowed
  ${isDarkMode 
    ? "border-slate-700 bg-slate-800 text-gray-100 hover:bg-slate-500" 
    : "border-gray-300 bg-white text-gray-800 hover:bg-orange-50" 
  }
`;


  return (
    <div
       className={`
    w-full rounded-xl border p-4 md:p-3 flex gap-3 mt-3 flex-wrap 
    justify-center md:justify-between items-center md:flex-nowrap
    ${isDarkMode
      ? "border-slate-700 bg-slate-900 text-slate-100" 
      : "border-gray-200 bg-white text-gray-800"
    }
    ${className}
  `}
    >
      {/* Left label */}
      <div className="text-sm text-gray-700 order-3 md:order-1">
        {leftTitle ? (
          <span>
            {leftTitle}: <strong>{total}</strong>
          </span>
        ) : (
          <span className="text-gray-600">
            Showing <span>{start}</span>–<span>{end}</span> of{" "}
            <span>{total}</span>
          </span>
        )}
      </div>

      <div
        className="w-100 justify-center md:w-auto flex items-center gap-1 overflow-x-auto whitespace-nowrap self-center order-1 md:order-2"
        style={{ scrollbarWidth: "none" }} // firefox
      >
        <button
          type="button"
          className={chevronBtn}
          disabled={!canPrev}
          onClick={() => onPageChange(1)}
          aria-label="First page"
        >
          <ForwardEndIcon className="rotate-180" size={10} />
        </button>
        <button
          type="button"
          className={chevronBtn}
          disabled={!canPrev}
          onClick={() => onPageChange(safePage - 1)}
          aria-label="Previous page"
        >
          <ArrowIcon className="rotate-90" size={12} />
        </button>

        {/* only [prev, current, next] */}
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={p === safePage ? numberBtnActive : numberBtn}
            aria-current={p === safePage ? "page" : undefined}
            disabled={disabled}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          className={chevronBtn}
          disabled={!canNext}
          onClick={() => onPageChange(safePage + 1)}
          aria-label="Next page"
        >
          <ArrowIcon className="rotate-270" size={12} />
        </button>
        <button
          type="button"
          className={chevronBtn}
          disabled={!canNext}
          onClick={() => onPageChange(totalPages)}
          aria-label="Last page"
        >
          <ForwardEndIcon size={10} />
        </button>
      </div>
      {/* Pager + per-page */}
      {onPerPageChange && (
        <label className="flex items-center gap-2 text-sm text-gray-600 order-2 md:order-3">
          <span className="whitespace-nowrap">Show per Page:</span>
          <SelectField
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            disabled={disabled}
            options={perPageOptions.map((v) => ({
              label: String(v),
              value: v,
            }))}
            placeholder="Per page"
            name="perPage"
          />
        </label>
      )}
    </div>
  );
};

export default Pagination;
