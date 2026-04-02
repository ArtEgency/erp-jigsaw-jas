"use client";

import React from "react";
import { GREEN, GREEN_L, RED, RED_L, AMBER, AMBER_L, TENANT_PRIMARY, TENANT_LIGHT } from "@/lib/theme";

type BadgeVariant = "success" | "error" | "warning" | "info" | "default";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; color: string }> = {
  success: { bg: GREEN_L, color: GREEN },
  error: { bg: RED_L, color: RED },
  warning: { bg: AMBER_L, color: AMBER },
  info: { bg: TENANT_LIGHT, color: TENANT_PRIMARY },
  default: { bg: "#F0F0F0", color: "#666" },
};

export default function Badge({ label, variant = "default", className = "" }: BadgeProps) {
  const s = variantStyles[variant];
  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{ background: s.bg, color: s.color }}>
      {label}
    </span>
  );
}
