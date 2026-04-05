"use client";

import React, { useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";

const LANGUAGES = [
  { code: "th", label: "TH", flag: "🇹🇭" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "zh", label: "CN", flag: "🇨🇳" },
  { code: "ja", label: "JP", flag: "🇯🇵" },
];

/**
 * MultiLanguageInput stores value as Record<string, string>
 * e.g. { th: "สินค้า", en: "Product", zh: "产品", ja: "商品" }
 */
interface MultiLanguageInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  className?: string;
}

export default function MultiLanguageInput<T extends FieldValues>({
  name,
  control,
  label,
  required,
  disabled,
  multiline,
  rows = 2,
  className = "",
}: MultiLanguageInputProps<T>) {
  const [activeLang, setActiveLang] = useState(0);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const values: Record<string, string> = field.value || {};
        const langCode = LANGUAGES[activeLang].code;

        const handleChange = (lang: string, val: string) => {
          field.onChange({ ...values, [lang]: val });
        };

        return (
          <Box className={className}>
            {/* Header: label + language tabs */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 500, color: "text.secondary" }}>
                {label}
                {required && (
                  <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>*</Box>
                )}
              </Typography>

              <Tabs
                value={activeLang}
                onChange={(_, v) => setActiveLang(v)}
                sx={{
                  minHeight: 0,
                  "& .MuiTabs-indicator": { height: 2 },
                  "& .MuiTab-root": {
                    minHeight: 0,
                    minWidth: 0,
                    px: 1,
                    py: 0.25,
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                  },
                }}
              >
                {LANGUAGES.map((lang) => (
                  <Tab key={lang.code} label={`${lang.flag} ${lang.label}`} />
                ))}
              </Tabs>
            </Box>

            {/* Input */}
            <TextField
              value={values[langCode] || ""}
              onChange={(e) => handleChange(langCode, e.target.value)}
              disabled={disabled}
              multiline={multiline}
              rows={multiline ? rows : undefined}
              size="small"
              fullWidth
              error={!!error}
              placeholder={`${label} (${LANGUAGES[activeLang].label})`}
              InputLabelProps={{ shrink: true }}
            />

            {/* Language fill indicator */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
              {LANGUAGES.map((lang) => (
                <Box
                  key={lang.code}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: values[lang.code]?.trim() ? "#10B981" : "#D1D5DB",
                  }}
                  title={`${lang.label}: ${values[lang.code] ? "filled" : "empty"}`}
                />
              ))}
            </Box>

            {error && (
              <Typography variant="caption" sx={{ color: "error.main", mt: 0.25 }}>
                {error.message}
              </Typography>
            )}
          </Box>
        );
      }}
    />
  );
}
