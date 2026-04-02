"use client";

import React from "react";
import { BORDER, MUTED, TENANT_PRIMARY } from "@/lib/theme";

interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export default function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 25, 50, 100],
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Generate visible page numbers
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    }
  }

  return (
    <div className="flex items-center justify-end px-5 py-3" style={{ borderTop: `1px solid ${BORDER}` }}>
      <div className="flex items-center gap-4 text-sm">
        <span style={{ color: "#9294A1" }}>จำนวนรายการต่อหน้า</span>
        {onPageSizeChange && (
          <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border-0 text-sm font-medium" style={{ color: "#4C4E63" }}>
            {pageSizeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        <span style={{ color: "#9294A1" }}>{from}-{to} of {total}</span>
        <div className="flex items-center gap-1.5">
          <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}
            className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-xs"
            style={{ color: page <= 1 ? "#ccc" : MUTED }}>&lt;</button>
          {pages.map((p, i) => {
            // Insert ellipsis
            const prev = pages[i - 1];
            const showEllipsis = prev && p - prev > 1;
            return (
              <React.Fragment key={p}>
                {showEllipsis && <span className="text-xs" style={{ color: MUTED }}>...</span>}
                <button onClick={() => onPageChange(p)}
                  className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-xs"
                  style={{
                    background: p === page ? TENANT_PRIMARY : "transparent",
                    color: p === page ? "#fff" : "#4C4E63",
                  }}>
                  {p}
                </button>
              </React.Fragment>
            );
          })}
          <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}
            className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-xs"
            style={{ color: page >= totalPages ? "#ccc" : MUTED }}>&gt;</button>
        </div>
      </div>
    </div>
  );
}
