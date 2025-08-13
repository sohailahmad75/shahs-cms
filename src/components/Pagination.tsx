// components/Pagination.tsx
import React from "react";
import Button from "./Button";
import SelectField from "./SelectField";

type Props = {
  page: number;
  perPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  perPageOptions?: number[];
  className?: string;
  disabled?: boolean;
};

function getPageWindow(current: number, totalPages: number, delta = 1) {
  const pages: (number | null)[] = [];
  const set = new Set<number>([1, totalPages]);
  for (let i = current - delta; i <= current + delta; i++) {
    if (i >= 1 && i <= totalPages) set.add(i);
  }
  const sorted = Array.from(set).sort((a, b) => a - b);
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) pages.push(null);
    pages.push(p);
    prev = p;
  }
  return pages;
}

const Pagination: React.FC<Props> = ({
  page,
  perPage,
  total,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 25, 50, 100],
  className = "",
  disabled = false,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, perPage)));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * perPage + 1;
  const end = total === 0 ? 0 : Math.min(safePage * perPage, total);
  const canPrev = !disabled && safePage > 1;
  const canNext = !disabled && safePage < totalPages;
  const pages = getPageWindow(safePage, totalPages, 1);

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      {/* Left: summary + per-page */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          Showing <strong>{start}</strong>–<strong>{end}</strong> of{" "}
          <strong>{total}</strong>
        </span>

        {onPerPageChange && (
          <label className="flex items-center gap-2 text-sm">
            <span className="whitespace-nowrap">Per page</span>
            <SelectField
              value={perPage}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              disabled={disabled}
              options={[
                { label: "10", value: 10 },
                { label: "25", value: 25 },
                { label: "50", value: 50 },
              ]}
              placeholder="Per page"
              name="perPage"
            />
          </label>
        )}
      </div>

      {/* Right: pager controls */}
      <div className="flex items-center gap-1">
        <Button
          disabled={!canPrev}
          onClick={() => onPageChange(1)}
          aria-label="First page"
        >
          ⏮
        </Button>
        <Button
          disabled={!canPrev}
          onClick={() => onPageChange(safePage - 1)}
          aria-label="Previous page"
        >
          Previous
        </Button>

        {pages.map((p, i) =>
          p === null ? (
            <span key={`dots-${i}`} className="px-2 select-none">
              …
            </span>
          ) : (
            <Button
              key={p}
              onClick={() => onPageChange(p)}
              disabled={disabled}
              className={p === safePage ? "bg-gray-900 text-white" : ""}
              aria-current={p === safePage ? "page" : undefined}
            >
              {p}
            </Button>
          ),
        )}

        <Button
          disabled={!canNext}
          onClick={() => onPageChange(safePage + 1)}
          aria-label="Next page"
        >
          Next
        </Button>
        <Button
          disabled={!canNext}
          onClick={() => onPageChange(totalPages)}
          aria-label="Last page"
        >
          ⏭
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
