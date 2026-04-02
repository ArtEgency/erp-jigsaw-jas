"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { GREEN, GREEN_L, RED, RED_L, AMBER, AMBER_L } from "@/lib/theme";

/* ── Types ── */
type ToastType = "success" | "error" | "warning";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
  showWarning: (msg: string) => void;
}

/* ── Context ── */
const ToastContext = createContext<ToastContextValue | null>(null);

const typeStyles: Record<ToastType, { bg: string; color: string; border: string; icon: string }> = {
  success: { bg: GREEN_L, color: GREEN, border: GREEN, icon: "\u2713" },
  error: { bg: RED_L, color: RED, border: RED, icon: "\u2717" },
  warning: { bg: AMBER_L, color: AMBER, border: AMBER, icon: "!" },
};

/* ── Provider ── */
let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const showSuccess = useCallback((msg: string) => addToast(msg, "success"), [addToast]);
  const showError = useCallback((msg: string) => addToast(msg, "error"), [addToast]);
  const showWarning = useCallback((msg: string) => addToast(msg, "warning"), [addToast]);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => {
          const s = typeStyles[t.type];
          return (
            <div key={t.id}
              className="px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 animate-[slideIn_0.3s_ease]"
              style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}33` }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
                style={{ background: s.color }}>{s.icon}</span>
              {t.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

/* ── Hook ── */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
