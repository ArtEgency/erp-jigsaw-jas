"use client";

import React from "react";
import Chip from "@mui/material/Chip";

type BadgeVariant = "success" | "error" | "warning" | "info" | "default";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantSx: Record<BadgeVariant, { bgcolor: string; color: string }> = {
  success: { bgcolor: "success.light", color: "success.main" },
  error: { bgcolor: "#FCEBEB", color: "error.main" },
  warning: { bgcolor: "#FAEEDA", color: "#854F0B" },
  info: { bgcolor: "primary.light", color: "primary.main" },
  default: { bgcolor: "#F0F0F0", color: "#666" },
};

export default function Badge({ label, variant = "default" }: BadgeProps) {
  /* MUI theme: success.light = #EAF3DE, success.main = #3B6D11 */
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        ...variantSx[variant],
        fontWeight: 500,
        fontSize: "0.75rem",
        height: 24,
      }}
    />
  );
}
