"use client";

import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { TENANT_PRIMARY, TEXT } from "@/lib/theme";

interface FormSwitchProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export default function FormSwitch<T extends FieldValues>({
  name,
  control,
  label,
  disabled,
  className = "",
}: FormSwitchProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label className={`inline-flex items-center gap-3 cursor-pointer select-none ${disabled ? "opacity-50 cursor-default" : ""} ${className}`}>
          <button
            type="button"
            role="switch"
            aria-checked={!!field.value}
            disabled={disabled}
            onClick={() => field.onChange(!field.value)}
            className="relative w-10 h-5 rounded-full transition-colors"
            style={{ background: field.value ? TENANT_PRIMARY : "#ccc" }}
          >
            <div
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
              style={{ left: field.value ? 22 : 2 }}
            />
          </button>
          {label && <span className="text-sm" style={{ color: TEXT }}>{label}</span>}
        </label>
      )}
    />
  );
}
