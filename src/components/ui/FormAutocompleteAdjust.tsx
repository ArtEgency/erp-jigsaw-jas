"use client";

import React, { useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import MuiAutocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "@mui/material/Link";

interface Option {
  id: string | number;
  name: string;
}

interface FormAutocompleteAdjustProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  /** Callback to create a new item — returns the new option */
  onCreateNew?: (name: string) => Promise<Option>;
  /** Route path for the "manage" link */
  managePath?: string;
  manageLabel?: string;
  createNewLabel?: string;
  allowCreate?: boolean;
  allowManage?: boolean;
}

const filter = createFilterOptions<Option>();

export default function FormAutocompleteAdjust<T extends FieldValues>({
  name,
  control,
  label,
  options,
  required,
  disabled,
  placeholder = "เลือก...",
  className = "",
  onCreateNew,
  managePath,
  manageLabel = "จัดการรายการ",
  createNewLabel = "สร้างรายการใหม่",
  allowCreate = false,
  allowManage = false,
}: FormAutocompleteAdjustProps<T>) {
  const [creating, setCreating] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selected = options.find((o) => String(o.id) === String(field.value)) || null;

        const handleCreate = async (newName: string) => {
          if (!onCreateNew || !newName.trim()) return;
          setCreating(true);
          try {
            const newOpt = await onCreateNew(newName.trim());
            field.onChange(newOpt.id);
            setInputValue("");
          } finally {
            setCreating(false);
          }
        };

        return (
          <MuiAutocomplete
            options={options}
            getOptionLabel={(opt) => opt.name}
            value={selected}
            inputValue={inputValue}
            onInputChange={(_, val) => setInputValue(val)}
            onChange={(_, newVal) => {
              if (newVal && (newVal as Option & { isNew?: boolean }).id === "__create__") {
                handleCreate(inputValue);
              } else {
                field.onChange(newVal ? newVal.id : "");
              }
            }}
            disabled={disabled || creating}
            isOptionEqualToValue={(opt, val) => String(opt.id) === String(val.id)}
            noOptionsText="ไม่พบรายการ"
            className={className}
            size="small"
            filterOptions={(opts, params) => {
              const filtered = filter(opts, params);
              return filtered;
            }}
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
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {creating && <CircularProgress size={18} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            ListboxProps={{
              sx: { maxHeight: 240 },
            }}
            renderOption={(props, opt) => (
              <Box component="li" {...props} key={opt.id}>
                <Typography variant="body2">{opt.name}</Typography>
              </Box>
            )}
            PaperComponent={({ children, ...paperProps }) => (
              <Box
                {...paperProps}
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 8,
                  border: 1,
                  borderColor: "divider",
                  overflow: "hidden",
                }}
              >
                {children}
                {(allowCreate || allowManage) && (
                  <>
                    <Divider />
                    <Box sx={{ px: 1.5, py: 1 }}>
                      {allowCreate && inputValue.trim() && (
                        <Box
                          component="button"
                          type="button"
                          disabled={creating}
                          onClick={() => handleCreate(inputValue)}
                          sx={{
                            width: "100%",
                            textAlign: "left",
                            py: 0.75,
                            px: 1,
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: "primary.main",
                            bgcolor: "transparent",
                            border: "none",
                            borderRadius: 1,
                            cursor: "pointer",
                            "&:hover": { bgcolor: "primary.light" },
                          }}
                        >
                          {creating ? "กำลังสร้าง..." : `+ ${createNewLabel} "${inputValue.trim()}"`}
                        </Box>
                      )}
                      {allowManage && managePath && (
                        <Link
                          href={managePath}
                          underline="none"
                          sx={{
                            display: "block",
                            py: 0.75,
                            px: 1,
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: "primary.dark",
                            borderRadius: 1,
                            "&:hover": { bgcolor: "primary.light" },
                          }}
                        >
                          {manageLabel} →
                        </Link>
                      )}
                    </Box>
                  </>
                )}
              </Box>
            )}
          />
        );
      }}
    />
  );
}
