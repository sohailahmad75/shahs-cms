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
  emptyStateMessage?: string;
  emptyStateSubMessage?: string;
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
}: DynamicTableProps<T>) {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`relative h-full w-full flex-shrink-0 overflow-auto rounded-lg border ${isDarkMode ? "border-slate-700 bg-slate-900" : "border-gray-200 bg-white"} [scrollbar-width:_thin]`}>
      <table className={`table min-w-full ${tableClassName || ""}`}>
        <thead className={`table-header ${isDarkMode ? "bg-slate-800 border-b border-slate-700" : "bg-gray-100 border-b border-gray-200"} ${headerClassName || ""}`}>
          <tr className="table-row">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-600"} ${col.className || ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`table-body ${isDarkMode ? "bg-slate-900 divide-slate-700" : "bg-white divide-gray-200"}`}>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="p-6 text-center italic text-slate-500 dark:text-slate-400"
              >
                <div className={`border-2 border-dashed rounded-md py-8 px-4 ${isDarkMode ? "border-slate-700" : "border-slate-300"}`}>
                  <p className="text-lg font-medium mb-2">{emptyStateMessage}</p>
                  <p className="text-sm">
                    {emptyStateSubMessage}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            data?.map((row, index) => (
              <tr 
                key={String(row[rowKey])} 
                className={`table-row ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-50"} ${
                  index !== data.length - 1 ? (isDarkMode ? "border-b border-slate-700" : "border-b border-gray-200") : ""
                } ${rowClassName || ""}`}
              >
                {columns.map((col, idx) => (
                  <td
                    key={idx}
                    className={`px-4 py-3 text-sm ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
                  >
                    {col.key === "actions"
                      ? (col.render?.(undefined as T[keyof T], row, index) ?? null)
                      : col.key === "index"
                        ? (col.render?.(undefined as T[keyof T], row, index) ?? null)
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