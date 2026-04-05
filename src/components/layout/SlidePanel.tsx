"use client";

import { useEffect, useState, ReactNode } from "react";
import { Box } from "@mui/material";
import { SA_PRIMARY, TENANT_PRIMARY, BORDER } from "@/lib/theme";

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

  const headerBg = headerColor === "sa" ? SA_PRIMARY : TENANT_PRIMARY;

  return (
    <>
      <Box
        onClick={onClose}
        sx={{
          position: "fixed", inset: 0, bgcolor: "rgba(0,0,0,0.3)", zIndex: 50,
          transition: "opacity 300ms", opacity: animate ? 1 : 0,
        }}
      />

      <Box
        sx={{
          position: "fixed", top: 0, right: 0, bottom: 0, width, bgcolor: "white", zIndex: 50,
          boxShadow: 8, display: "flex", flexDirection: "column",
          transition: "transform 300ms", transform: animate ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <Box sx={{ height: 52, bgcolor: headerBg, display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, flexShrink: 0 }}>
          <Box component="span" sx={{ color: "white", fontWeight: 600, fontSize: 14 }}>{title}</Box>
          <Box
            component="button" onClick={onClose}
            sx={{ color: "white", border: "none", cursor: "pointer", bgcolor: "transparent", borderRadius: 1, p: 0.5, fontSize: 18, transition: "background 200ms", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}
          >
            ✕
          </Box>
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>{children}</Box>

        {footer && (
          <Box sx={{ borderTop: `1px solid ${BORDER}`, p: 2, display: "flex", justifyContent: "flex-end", gap: 1.5, flexShrink: 0 }}>
            {footer}
          </Box>
        )}
      </Box>
    </>
  );
}
