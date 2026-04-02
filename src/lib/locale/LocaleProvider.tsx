"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import th from "./dictionaries/th";
import en from "./dictionaries/en";

/* ── Types ── */
export type Locale = "th" | "en";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string;
}

/* ── Dictionaries ── */
const dictionaries: Record<Locale, Record<string, string>> = { th, en };

/* ── Storage key ── */
const LOCALE_KEY = "erp_jigsaw_locale";

/* ── Context ── */
const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

/* ── Provider ── */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("th");

  // Restore locale from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (stored && dictionaries[stored]) {
      setLocaleState(stored);
    }
  }, []);

  // Update html lang attribute when locale changes
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_KEY, newLocale);
  }, []);

  // Translation function
  const t = useCallback(
    (key: string, fallback?: string): string => {
      const dict = dictionaries[locale];
      return dict[key] ?? fallback ?? key;
    },
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

/* ── Hook ── */
export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
