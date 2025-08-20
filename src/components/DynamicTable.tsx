import React from "react";
import { useTheme } from "../../src/context/themeContext";

export interface Column<T> {
  key: keyof T | "actions" | "index";
  label: string;
  render?: (value: T[keyof T], row: T, index?: number) => React.ReactNode;
  className?: string;
}

interface DynamicTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: keyof T;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  maxHeight?: string;
  emptyStateMessage?: string;
  emptyStateSubMessage?: string;
  minHeight?: string;
}

export function DynamicTable<T>({
  data,
  columns,
  rowKey,
  tableClassName,
  headerClassName,
  rowClassName,
  emptyStateMessage = "No data available",
  emptyStateSubMessage = "There are currently no records to display. Try adding some data or adjusting your filters.",
  maxHeight = "800px",
  minHeight = "400px",
}: DynamicTableProps<T>) {
  const { isDarkMode } = useTheme();

  const EmptyState = (
    <div
      className={`border-2 border-dashed rounded-md py-8 px-4 ${
        isDarkMode ? "border-slate-700" : "border-slate-300"
      }`}
    >
      <p className="text-lg font-medium mb-2">{emptyStateMessage}</p>
      <p className="text-sm">{emptyStateSubMessage}</p>
    </div>
  );

  return (
    <div>
      {/* Desktop / Tablet Table View */}
      <div
        className={`hidden md:block rounded-lg border overflow-auto ${
          isDarkMode
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
        style={{ maxHeight, minHeight }}
      >
        <table className={`min-w-full table-auto ${tableClassName || ""}`}>
          <thead
            className={`bg-slate-100 dark:bg-slate-800 sticky top-0 z-10 border-b ${
              isDarkMode ? "border-slate-700" : "border-slate-200"
            } ${headerClassName || ""}`}
          >
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-3 text-left text-sm font-medium ${
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  } ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody
            className={`divide-y ${
              isDarkMode
                ? "bg-slate-900 divide-slate-700"
                : "bg-white divide-slate-200"
            }`}
          >
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-6 text-center italic text-slate-500 dark:text-slate-400"
                >
                  {EmptyState}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={String(row[rowKey] as unknown as string)}
                  className={`${rowClassName || ""} ${
                    isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-50"
                  }`}
                >
                  {columns.map((col, idx) => (
                    <td
                      key={idx}
                      className={`px-4 py-4 text-sm ${
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      {col.key === "actions"
                        ? (col.render?.(undefined as T[keyof T], row, index) ??
                          null)
                        : col.key === "index"
                          ? (col.render?.(
                              undefined as T[keyof T],
                              row,
                              index,
                            ) ?? null)
                          : col.render
                            ? col.render(row[col.key], row, index)
                            : (row[col.key] as unknown as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.length === 0 ? (
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-6 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
            {EmptyState}
          </div>
        ) : (
          data.map((row, index) => (
            <div
              key={String(row[rowKey] as unknown as string)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-900"
            >
              {columns.map((col, idx) => (
                <div key={idx} className="flex justify-between py-1 gap-4">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {col.label}
                  </span>
                  <span className="text-sm text-slate-800 dark:text-slate-100">
                    {col.key === "actions"
                      ? (col.render?.(undefined as T[keyof T], row, index) ??
                        null)
                      : col.key === "index"
                        ? (col.render?.(undefined as T[keyof T], row, index) ??
                          null)
                        : col.render
                          ? col.render(row[col.key], row, index)
                          : (row[col.key] as unknown as React.ReactNode)}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
