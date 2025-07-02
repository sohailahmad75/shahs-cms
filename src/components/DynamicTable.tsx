// components/ui/DynamicTable.tsx
import React from "react";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
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
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {data.map((row) => (
            <tr key={String(row[rowKey])} className={rowClassName}>
              {columns.map((col, idx) => (
                <td
                  key={idx}
                  className="px-4 py-2 text-sm text-slate-800 dark:text-slate-100"
                >
                  {col.render
                    ? col.render(row[col.key], row)
                    : (row[col.key] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
