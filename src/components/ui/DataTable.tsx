"use client";

import React from "react";
import { TEXT, MUTED, TENANT_PRIMARY, TENANT_LIGHT } from "@/lib/theme";

/* ── Types ── */
export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (row: T, idx: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  emptyText?: string;
  onRowClick?: (row: T) => void;
  /** Show checkbox column */
  selectable?: boolean;
  selectedKeys?: Set<string | number>;
  onSelect?: (keys: Set<string | number>) => void;
}

export default function DataTable<T>({
  columns,
  data,
  rowKey,
  emptyText = "ไม่พบข้อมูล",
  onRowClick,
  selectable,
  selectedKeys,
  onSelect,
}: DataTableProps<T>) {
  const allKeys = new Set(data.map(rowKey));
  const allSelected = selectedKeys && allKeys.size > 0 && Array.from(allKeys).every((k) => selectedKeys.has(k));

  const toggleAll = () => {
    if (!onSelect) return;
    if (allSelected) {
      onSelect(new Set());
    } else {
      onSelect(new Set(allKeys));
    }
  };

  const toggleRow = (key: string | number) => {
    if (!onSelect || !selectedKeys) return;
    const next = new Set(selectedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelect(next);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" style={{ color: TEXT }}>
        <thead>
          <tr style={{ background: "#F5F5F7" }}>
            {selectable && (
              <th className="w-[40px] px-2 py-3" style={{ borderBottom: `1px solid #F5F5F7`, borderTop: `1px solid #F5F5F7` }}>
                <input type="checkbox" checked={allSelected || false} onChange={toggleAll}
                  className="w-4 h-4 rounded" style={{ accentColor: TENANT_PRIMARY }} />
              </th>
            )}
            {columns.map((col, i) => (
              <th key={col.key}
                className="px-5 py-3.5 font-medium text-[15px] whitespace-nowrap"
                style={{
                  textAlign: col.align || "left",
                  width: col.width,
                  color: "#374151",
                  borderBottom: `1px solid #F5F5F7`,
                  borderTop: `1px solid #F5F5F7`,
                }}>
                <div className="flex items-center gap-2">
                  {col.header}
                  {i < columns.length - 1 && <div className="w-[2px] h-[14px] ml-auto" style={{ background: "rgba(76,78,100,0.12)" }} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="text-center py-10" style={{ color: MUTED }}>
                {emptyText}
              </td>
            </tr>
          ) : data.map((row, idx) => {
            const key = rowKey(row);
            const isSelected = selectedKeys?.has(key);
            return (
              <tr key={key}
                className="transition-colors"
                style={{
                  borderBottom: `1px solid rgba(76,78,100,0.12)`,
                  background: isSelected ? TENANT_LIGHT : "transparent",
                  cursor: onRowClick ? "pointer" : "default",
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#F8F8FF"; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                onClick={() => onRowClick?.(row)}>
                {selectable && (
                  <td className="w-[40px] px-2 py-3" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={isSelected || false} onChange={() => toggleRow(key)}
                      className="w-4 h-4 rounded" style={{ accentColor: TENANT_PRIMARY }} />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3" style={{ textAlign: col.align || "left" }}>
                    {col.render ? col.render(row, idx) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
