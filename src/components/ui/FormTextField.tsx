"use client";

import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import TextField from "@mui/material/TextField";

interface FormTextFieldProps<T extends FieldValues> {
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
  size?: "small" | "medium";
  fullWidth?: boolean;
}

export default function FormTextField<T extends FieldValues>({
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
  size = "small",
  fullWidth = true,
}: FormTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          value={field.value ?? ""}
          label={label}
          type={type}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          multiline={multiline}
          rows={multiline ? rows : undefined}
          size={size}
          fullWidth={fullWidth}
          error={!!error}
          helperText={error?.message || (maxLength ? `${(field.value?.length || 0)}/${maxLength}` : undefined)}
          inputProps={{ maxLength }}
          className={className}
          InputLabelProps={{
            shrink: true,
          }}
        />
      )}
    />
  );
}
