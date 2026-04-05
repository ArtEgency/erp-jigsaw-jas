"use client";

import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import MuiAutocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface Option {
  id: string | number;
  name: string;
}

interface FormAutocompleteProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export default function FormAutocomplete<T extends FieldValues>({
  name,
  control,
  label,
  options,
  required,
  disabled,
  placeholder = "เลือก...",
  className = "",
}: FormAutocompleteProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selected = options.find((o) => String(o.id) === String(field.value)) || null;

        return (
          <MuiAutocomplete
            options={options}
            getOptionLabel={(opt) => opt.name}
            value={selected}
            onChange={(_, newVal) => field.onChange(newVal ? newVal.id : "")}
            disabled={disabled}
            isOptionEqualToValue={(opt, val) => String(opt.id) === String(val.id)}
            noOptionsText="ไม่พบรายการ"
            className={className}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                required={required}
                placeholder={placeholder}
                error={!!error}
                helperText={error?.message}
                InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
              />
            )}
          />
        );
      }}
    />
  );
}
