import React from "react";
import { useTheme } from "../../src/context/themeContext";

// export interface Column<T> {
//   key: keyof T | "actions" | "index";
//   label: string;
//   render?: (value: T[keyof T], row: T, index?: number) => React.ReactNode;
//   className?: string;
// }

export interface Column<T> {
  key: keyof T | "actions" | "index";
  label: string;
  render?: (value: T[keyof T], row: T, index?: number) => React.ReactNode;
  renderHeader?: () => React.ReactNode; 
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
      className={`border-2 border-dashed rounded-md py-8 px-4 ${isDarkMode ? "border-slate-700" : "border-slate-300"
        }`}
    >
      <p className={`text-lg font-medium mb-2 ${isDarkMode ? "text-slate-300" : "text-slate-800"}`}>
        {emptyStateMessage}
      </p>
      <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
        {emptyStateSubMessage}
      </p>
    </div>
  );

  return (
    <div>

      <div
        className={`hidden md:block rounded-lg border overflow-auto ${isDarkMode
            ? "border-slate-700 bg-slate-900"
            : "border-slate-200 bg-white"
          }`}
        style={{ maxHeight, minHeight }}
      >
        <table className={`min-w-full table-auto ${tableClassName || ""}`}>
          <thead
            className={`sticky top-0 z-10 border-b ${isDarkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-slate-100 border-slate-200"
              } ${headerClassName || ""}`}
          >
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-600"
                    } ${col.className || ""}`}
                >
                  {col.renderHeader ? col.renderHeader() : col.label}

                </th>
              ))}
            </tr>
          </thead>

          <tbody
            className={`divide-y ${isDarkMode
                ? "bg-slate-900 divide-slate-800"
                : "bg-white divide-slate-200"
              }`}
          >
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-6 text-center italic"
                >
                  {EmptyState}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={String(row[rowKey] as unknown as string)}
                  className={`${rowClassName || ""} ${isDarkMode
                      ? "hover:bg-slate-800 text-slate-300"
                      : "hover:bg-gray-50 text-slate-700"
                    }`}
                >
                  {columns.map((col, idx) => (
                    <td
                      key={idx}
                      className="px-4 py-4 text-sm"
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


      <div className="md:hidden space-y-4">
        {data.length === 0 ? (
          <div className={`rounded-lg border p-6 text-center ${isDarkMode
              ? "border-slate-700 bg-slate-900 text-slate-400"
              : "border-slate-200 bg-white text-slate-500"
            }`}>
            {EmptyState}
          </div>
        ) : (
          data.map((row, index) => (
            <div
              key={String(row[rowKey] as unknown as string)}
              className={`rounded-lg border p-4 ${isDarkMode
                  ? "border-slate-700 bg-slate-900"
                  : "border-slate-200 bg-white"
                }`}
            >
              {columns.map((col, idx) => (
                <div key={idx} className="flex justify-between py-1 gap-4">
                  <span className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"
                    }`}>
                    {col.label}
                  </span>
                  <span className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-800"
                    }`}>
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