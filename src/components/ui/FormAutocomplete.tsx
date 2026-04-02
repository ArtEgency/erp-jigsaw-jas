"use client";

import React, { useState, useRef, useEffect } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { BORDER, TEXT, MUTED, TENANT_PRIMARY, TENANT_LIGHT } from "@/lib/theme";

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
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selected = options.find((o) => String(o.id) === String(field.value));
        return (
          <div ref={wrapRef} className={`relative ${className}`}>
            <div className="field-group">
              <input
                value={open ? search : selected?.name || ""}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={!open}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => { setOpen(true); setSearch(""); }}
                style={{ borderColor: error ? "#E53935" : undefined, cursor: disabled ? "default" : "pointer" }}
              />
              <label>
                {label}
                {required && <span className="text-[#E53935] ml-0.5">*</span>}
              </label>
              {/* Arrow icon */}
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs"
                style={{ color: MUTED }}>{open ? "\u25B2" : "\u25BC"}</span>
            </div>

            {/* Dropdown */}
            {open && !disabled && (
              <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border max-h-[200px] overflow-y-auto"
                style={{ borderColor: BORDER }}>
                {filtered.length === 0 ? (
                  <div className="px-3 py-2 text-sm" style={{ color: MUTED }}>ไม่พบรายการ</div>
                ) : filtered.map((opt) => (
                  <button key={opt.id} type="button"
                    className="w-full text-left px-3 py-2 text-sm transition-colors"
                    style={{
                      color: String(opt.id) === String(field.value) ? TENANT_PRIMARY : TEXT,
                      background: String(opt.id) === String(field.value) ? TENANT_LIGHT : "transparent",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = TENANT_LIGHT; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = String(opt.id) === String(field.value) ? TENANT_LIGHT : "transparent"; }}
                    onClick={() => { field.onChange(opt.id); setOpen(false); setSearch(""); }}>
                    {opt.name}
                  </button>
                ))}
              </div>
            )}

            {error && <p className="text-[11px] mt-0.5 ml-1" style={{ color: "#E53935" }}>{error.message}</p>}
          </div>
        );
      }}
    />
  );
}
