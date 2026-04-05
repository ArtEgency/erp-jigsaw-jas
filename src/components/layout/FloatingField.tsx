"use client";

import React from "react";
import TextField from "@mui/material/TextField";

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
  textarea?: boolean;
  required?: boolean;
  maxLength?: number;
  variant?: "tenant" | "sa";
}

export default function FloatingField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  textarea = false,
  required = false,
  maxLength,
  variant = "tenant",
}: Props) {
  const focusColor = variant === "sa" ? "#FF6B00" : undefined; // sa = orange, tenant = default primary

  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type={type}
      disabled={disabled}
      required={required}
      multiline={textarea}
      rows={textarea ? 3 : undefined}
      size="small"
      fullWidth
      inputProps={{ maxLength }}
      helperText={maxLength ? `${value.length}/${maxLength}` : undefined}
      InputLabelProps={{ shrink: true }}
      sx={
        focusColor
          ? {
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: focusColor,
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: focusColor,
              },
            }
          : undefined
      }
    />
  );
}
