"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import type { SlideProps } from "@mui/material/Slide";

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

/* ── Slide transition ── */
function SlideDown(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

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

  const handleClose = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning }}>
      {children}
      {toasts.map((t, index) => (
        <Snackbar
          key={t.id}
          open
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          TransitionComponent={SlideDown}
          sx={{ top: `${(index * 60) + 16}px !important` }}
          onClose={() => handleClose(t.id)}
        >
          <Alert
            severity={t.type}
            variant="filled"
            onClose={() => handleClose(t.id)}
            sx={{
              fontWeight: 500,
              fontSize: "0.875rem",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            {t.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
}

/* ── Hook ── */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
