"use client";

import React from "react";
import { TENANT_PRIMARY, TENANT_HOVER, TENANT_LIGHT, BORDER, MUTED } from "@/lib/theme";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

const sizeMap: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-2.5 text-base",
};

const variantStyles: Record<ButtonVariant, { base: React.CSSProperties; hover: React.CSSProperties }> = {
  primary: {
    base: { background: TENANT_PRIMARY, color: "#fff", border: "none" },
    hover: { background: TENANT_HOVER },
  },
  outline: {
    base: { background: "transparent", color: TENANT_PRIMARY, border: `1px solid ${TENANT_PRIMARY}` },
    hover: { background: TENANT_LIGHT },
  },
  ghost: {
    base: { background: "transparent", color: MUTED, border: `1px solid ${BORDER}` },
    hover: { borderColor: TENANT_PRIMARY, color: TENANT_PRIMARY },
  },
  danger: {
    base: { background: "#E53935", color: "#fff", border: "none" },
    hover: { background: "#C62828" },
  },
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  const vs = variantStyles[variant];

  return (
    <button
      className={`rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2 ${sizeMap[size]} ${className}`}
      style={{ ...vs.base, opacity: disabled || loading ? 0.6 : 1, cursor: disabled || loading ? "not-allowed" : "pointer" }}
      disabled={disabled || loading}
      onMouseEnter={(e) => { if (!disabled && !loading) Object.assign(e.currentTarget.style, vs.hover); }}
      onMouseLeave={(e) => { if (!disabled && !loading) Object.assign(e.currentTarget.style, vs.base); }}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeLinecap="round" />
        </svg>
      )}
      {icon && !loading && icon}
      {children}
    </button>
  );
}
