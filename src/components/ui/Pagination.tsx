"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MuiPagination from "@mui/material/Pagination";

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

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        px: 2.5,
        py: 1.5,
        borderTop: 1,
        borderColor: "divider",
        gap: 2,
      }}
    >
      <Typography variant="body2" sx={{ color: "#9294A1" }}>
        จำนวนรายการต่อหน้า
      </Typography>

      {onPageSizeChange && (
        <Select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          size="small"
          variant="standard"
          disableUnderline
          sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#4C4E63" }}
        >
          {pageSizeOptions.map((s) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </Select>
      )}

      <Typography variant="body2" sx={{ color: "#9294A1" }}>
        {from}-{to} of {total}
      </Typography>

      <MuiPagination
        count={totalPages}
        page={page}
        onChange={(_, p) => onPageChange(p)}
        size="small"
        shape="rounded"
        sx={{
          "& .MuiPaginationItem-root": {
            fontSize: "0.75rem",
            minWidth: 26,
            height: 26,
          },
          "& .Mui-selected": {
            bgcolor: "primary.main",
            color: "#fff",
            "&:hover": { bgcolor: "primary.dark" },
          },
        }}
      />
    </Box>
  );
}
