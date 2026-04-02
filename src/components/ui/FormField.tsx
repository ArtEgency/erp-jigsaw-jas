"use client";

import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { MUTED } from "@/lib/theme";

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
}

export default function FormField<T extends FieldValues>({
  name,
  control,
  label,
  required,
  disabled,
  type = "text",
  placeholder,
  multiline,
  rows = 3,
  maxLength,
  className = "",
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={`relative ${className}`}>
          <div className="field-group">
            {multiline ? (
              <textarea
                {...field}
                value={field.value ?? ""}
                rows={rows}
                maxLength={maxLength}
                disabled={disabled}
                placeholder={placeholder || " "}
                style={{ borderColor: error ? "#E53935" : undefined }}
              />
            ) : (
              <input
                {...field}
                value={field.value ?? ""}
                type={type}
                maxLength={maxLength}
                disabled={disabled}
                placeholder={placeholder || " "}
                style={{ borderColor: error ? "#E53935" : undefined }}
              />
            )}
            <label>
              {label}
              {required && <span className="text-[#E53935] ml-0.5">*</span>}
            </label>
          </div>
          {error && <p className="text-[11px] mt-0.5 ml-1" style={{ color: "#E53935" }}>{error.message}</p>}
          {maxLength && (
            <span className="absolute right-2 bottom-1 text-[10px]" style={{ color: MUTED }}>
              {(field.value?.length || 0)}/{maxLength}
            </span>
          )}
        </div>
      )}
    />
  );
}
