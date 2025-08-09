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
}

export function DynamicTable<T>({
  data,
  columns,
  rowKey,
  tableClassName,
  headerClassName,
  rowClassName,
}: DynamicTableProps<T>) {
  const { isDarkMode } = useTheme();
  return (
    <div className="overflow-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table className={`min-w-full table-auto ${tableClassName || ""}`}>
        <thead
          className={`bg-slate-100 dark:bg-slate-800 ${headerClassName || ""}`}
        >
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`px-4 py-2 text-left text-sm font-medium text-slate-600 dark:text-slate-300 ${col.className || ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${isDarkMode ? "bg-slate-950" : "bg-white"} divide-slate-200 dark:divide-slate-700`}>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="p-6 text-center italic text-slate-500 dark:text-slate-400"
              >
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md py-8 px-4">
                  <p className="text-lg font-medium mb-2">No data available</p>
                  <p className="text-sm">
                    There are currently no records to display. Try adding some
                    data or adjusting your filters.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            data?.map((row, index) => (
              <tr key={String(row[rowKey])} className={rowClassName}>
                {columns.map((col, idx) => (
                  <td
                    key={idx}
                    className="px-4 py-4 text-sm text-slate-800 dark:text-slate-100"
                  >
                    {col.key === "actions"
                      ? (col.render?.(undefined as T[keyof T], row, index) ??
                        null)
                      : col.key === "index"
                        ? (col.render?.(undefined as T[keyof T], row, index) ??
                          null)
                        : col.render
                          ? col.render(row[col.key], row, index)
                          : (row[col.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
