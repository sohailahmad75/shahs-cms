import React from "react";

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
  return (
    <div className="overflow-x-auto rounded border border-gray-200">
      <table className={`min-w-full text-sm text-left ${tableClassName || ""}`}>
        <thead
          className={`bg-orange-500 hover:bg-orange-600 text-white ${headerClassName || ""}`}
        >
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`px-4 py-3 font-semibold ${col.className || "text-left"}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-gray-500"
              >
                <div className="border-2 border-dashed border-gray-300 rounded-md py-8 px-4">
                  <p className="text-lg font-medium mb-2">No data available</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={String(row[rowKey])}
                className={`hover:bg-orange-50 transition ${rowClassName || ""}`}
              >
                {columns.map((col, idx) => (
                  <td
                    key={idx}
                    className="px-4 py-3 border-t border-gray-200"
                  >
                    {col.key === "actions"
                      ? col.render?.(undefined as T[keyof T], row, index) ?? null
                      : col.key === "index"
                        ? col.render?.(undefined as T[keyof T], row, index) ?? null
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
