"use client";

import { useState, useMemo, type ReactNode } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

export interface DataTableColumn<T> {
  /** Unique key for the column (used as data accessor if render is not provided) */
  key: string;
  /** Column header label */
  label: string;
  /** Whether this column is sortable */
  sortable?: boolean;
  /** Custom render function for cell content */
  render?: (row: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  /** Column definitions */
  columns: DataTableColumn<T>[];
  /** Data rows */
  data: T[];
  /** Whether data is loading */
  loading?: boolean;
  /** Number of skeleton rows to show when loading */
  skeletonRows?: number;
  /** Message or element shown when no data */
  emptyMessage?: string;
  /** Empty state icon */
  emptyIcon?: ReactNode;
  /** Row key extractor */
  rowKey?: (row: T, index: number) => string;
}

type SortDir = "asc" | "desc";

/**
 * Generic sortable data table for admin management views.
 *
 * @example
 * <DataTable
 *   columns={[
 *     { key: "name", label: "Name", sortable: true },
 *     { key: "status", label: "Status", render: (row) => <Badge variant="success">{row.status}</Badge> },
 *   ]}
 *   data={users}
 *   loading={isLoading}
 * />
 */
export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  skeletonRows = 5,
  emptyMessage = "No data found",
  emptyIcon,
  rowKey,
}: DataTableProps<T>) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: string) => {
    if (sortCol === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(key);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    if (!sortCol) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortCol];
      const bVal = b[sortCol];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = typeof aVal === "string"
        ? aVal.localeCompare(bVal as string)
        : (aVal as number) - (bVal as number);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortCol, sortDir]);

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          {/* Header */}
          <thead>
            <tr className="border-b border-white/5">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[.12em] text-zinc-500"
                >
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="inline-flex items-center gap-1.5 hover:text-white transition cursor-pointer"
                    >
                      {col.label}
                      {sortCol === col.key ? (
                        sortDir === "asc" ? (
                          <ChevronUp className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-primary" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3.5 w-3.5 opacity-30" />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {loading
              ? Array.from({ length: skeletonRows }, (_, i) => (
                  <tr key={`skel-${i}`} className="border-b border-white/5 animate-pulse">
                    {columns.map((col) => (
                      <td key={col.key} className="px-5 py-4">
                        <div className="h-4 w-3/4 rounded bg-white/5" />
                      </td>
                    ))}
                  </tr>
                ))
              : sorted.length === 0
              ? (
                <tr>
                  <td colSpan={columns.length} className="py-16">
                    <div className="flex flex-col items-center text-center">
                      {emptyIcon && <div className="mb-4 text-zinc-700">{emptyIcon}</div>}
                      <p className="text-zinc-500 font-semibold">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              )
              : sorted.map((row, i) => (
                  <tr
                    key={rowKey ? rowKey(row, i) : (row.id as string) ?? i}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-5 py-4 text-sm text-white">
                        {col.render
                          ? col.render(row, i)
                          : (row[col.key] as ReactNode) ?? "–"}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
