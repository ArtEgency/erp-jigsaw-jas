"use client";

import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import MuiSwitch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";

interface FormSwitchProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  disabled?: boolean;
}

export default function FormSwitch<T extends FieldValues>({
  name,
  control,
  label,
  disabled,
}: FormSwitchProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          disabled={disabled}
          control={
            <MuiSwitch
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "primary.main",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  bgcolor: "primary.main",
                },
              }}
            />
          }
          label={
            label ? (
              <Typography variant="body2" sx={{ color: "text.primary" }}>
                {label}
              </Typography>
            ) : undefined
          }
        />
      )}
    />
  );
}
