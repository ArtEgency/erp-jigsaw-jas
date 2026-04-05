"use client";

import React from "react";
import MuiButton from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const sizeMap: Record<ButtonSize, { px: number; py: number; fontSize: string }> = {
  sm: { px: 1.5, py: 0.75, fontSize: "0.75rem" },
  md: { px: 2, py: 1, fontSize: "0.875rem" },
  lg: { px: 3, py: 1.25, fontSize: "1rem" },
};

const variantSx: Record<ButtonVariant, object> = {
  primary: {
    bgcolor: "primary.main",
    color: "#fff",
    "&:hover": { bgcolor: "primary.dark" },
  },
  outline: {
    borderColor: "primary.main",
    color: "primary.main",
    "&:hover": { bgcolor: "primary.light" },
  },
  ghost: {
    borderColor: "divider",
    color: "text.secondary",
    "&:hover": { borderColor: "primary.main", color: "primary.main" },
  },
  danger: {
    bgcolor: "#E53935",
    color: "#fff",
    "&:hover": { bgcolor: "#C62828" },
  },
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const s = sizeMap[size];
  const muiVariant = variant === "primary" || variant === "danger" ? "contained" : "outlined";

  return (
    <MuiButton
      variant={muiVariant}
      disabled={disabled || loading}
      disableElevation
      sx={{
        px: s.px,
        py: s.py,
        fontSize: s.fontSize,
        borderRadius: 2,
        fontWeight: 500,
        gap: 1,
        minWidth: 0,
        ...variantSx[variant],
      }}
      startIcon={
        loading ? <CircularProgress size={16} color="inherit" /> : icon || undefined
      }
      {...(rest as React.ComponentProps<typeof MuiButton>)}
    >
      {children}
    </MuiButton>
  );
}
