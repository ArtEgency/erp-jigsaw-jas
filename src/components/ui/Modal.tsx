"use client";

import React, { useEffect, useRef } from "react";
import { BORDER, TEXT, MUTED } from "@/lib/theme";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
  footer?: React.ReactNode;
}

export default function Modal({ open, onClose, title, children, width = "540px", footer }: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={backdropRef} className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}>
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden" style={{ width, maxWidth: "95vw", maxHeight: "90vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BORDER }}>
          <h2 className="text-base font-bold" style={{ color: TEXT }}>{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-lg"
            style={{ color: MUTED }}>&times;</button>
        </div>
        {/* Body */}
        <div className="p-5 overflow-y-auto" style={{ maxHeight: "calc(90vh - 130px)" }}>
          {children}
        </div>
        {/* Footer */}
        {footer && (
          <div className="px-5 py-3 border-t flex items-center justify-end gap-3" style={{ borderColor: BORDER }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
