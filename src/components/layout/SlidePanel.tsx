"use client";

import { useEffect, useState, ReactNode } from "react";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  headerColor?: "tenant" | "sa";
  width?: number;
}

export default function SlidePanel({ open, title, onClose, children, footer, headerColor = "tenant", width = 420 }: Props) {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimate(true));
      });
    } else {
      setAnimate(false);
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!visible) return null;

  const headerBg = headerColor === "sa" ? "bg-sa-primary" : "bg-brand-primary";

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-50 transition-opacity duration-300 ${
          animate ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        style={{ width: `${width}px` }}
        className={`fixed top-0 right-0 bottom-0 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          animate ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className={`h-[52px] ${headerBg} flex items-center justify-between px-4 shrink-0`}>
          <span className="text-white font-semibold text-sm">{title}</span>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded p-1 text-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {footer && (
          <div className="border-t border-erp-border p-4 flex justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
