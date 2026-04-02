"use client";

import React, { useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { BORDER, TEXT, MUTED, TENANT_PRIMARY } from "@/lib/theme";

const LANGUAGES = [
  { code: "th", label: "TH", flag: "\uD83C\uDDF9\uD83C\uDDED" },
  { code: "en", label: "EN", flag: "\uD83C\uDDEC\uD83C\uDDE7" },
  { code: "zh", label: "CN", flag: "\uD83C\uDDE8\uD83C\uDDF3" },
  { code: "ja", label: "JP", flag: "\uD83C\uDDEF\uD83C\uDDF5" },
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
  const [activeLang, setActiveLang] = useState("th");

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const values: Record<string, string> = field.value || {};

        const handleChange = (lang: string, val: string) => {
          field.onChange({ ...values, [lang]: val });
        };

        return (
          <div className={className}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium" style={{ color: MUTED }}>
                {label}
                {required && <span className="text-[#E53935] ml-0.5">*</span>}
              </label>
              {/* Language tabs */}
              <div className="flex items-center gap-0.5">
                {LANGUAGES.map((lang) => (
                  <button key={lang.code} type="button"
                    className="px-2 py-0.5 rounded text-[11px] font-medium transition-colors"
                    style={{
                      background: activeLang === lang.code ? TENANT_PRIMARY : "transparent",
                      color: activeLang === lang.code ? "#fff" : MUTED,
                    }}
                    onClick={() => setActiveLang(lang.code)}>
                    {lang.flag} {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {multiline ? (
              <textarea
                value={values[activeLang] || ""}
                onChange={(e) => handleChange(activeLang, e.target.value)}
                disabled={disabled}
                rows={rows}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
                style={{ borderColor: error ? "#E53935" : BORDER, color: TEXT }}
                onFocus={(e) => { e.currentTarget.style.borderColor = TENANT_PRIMARY; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = error ? "#E53935" : BORDER; }}
                placeholder={`${label} (${LANGUAGES.find((l) => l.code === activeLang)?.label})`}
              />
            ) : (
              <input
                value={values[activeLang] || ""}
                onChange={(e) => handleChange(activeLang, e.target.value)}
                disabled={disabled}
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
                style={{ borderColor: error ? "#E53935" : BORDER, color: TEXT }}
                onFocus={(e) => { e.currentTarget.style.borderColor = TENANT_PRIMARY; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = error ? "#E53935" : BORDER; }}
                placeholder={`${label} (${LANGUAGES.find((l) => l.code === activeLang)?.label})`}
              />
            )}

            {/* Language fill indicator */}
            <div className="flex items-center gap-1 mt-1">
              {LANGUAGES.map((lang) => (
                <span key={lang.code} className="w-2 h-2 rounded-full"
                  style={{ background: values[lang.code]?.trim() ? "#10B981" : "#D1D5DB" }}
                  title={`${lang.label}: ${values[lang.code] ? "filled" : "empty"}`} />
              ))}
            </div>

            {error && <p className="text-[11px] mt-0.5" style={{ color: "#E53935" }}>{error.message}</p>}
          </div>
        );
      }}
    />
  );
}
