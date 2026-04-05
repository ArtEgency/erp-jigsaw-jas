"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import {
  Dialog, Box, Typography, IconButton, Button, Stack, Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SA = "#FF6B00";

interface GlobalModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pinKey?: string;
  children: React.ReactNode;
}

export default function GlobalModal({
  open, onClose, onConfirm, title,
  confirmLabel = "ยืนยัน", cancelLabel = "ยกเลิก",
  pinKey = "modal_pin_global",
  children,
}: GlobalModalProps) {
  /* ── Draggable + Fullscreen + Pin — TPL-MODAL-SIZE-M ── */
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const paperRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button") || isFullscreen) return;
    dragging.current = true;
    const paper = paperRef.current;
    if (paper) {
      const rect = paper.getBoundingClientRect();
      offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    e.preventDefault();
  }, [isFullscreen]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y }); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  useEffect(() => {
    if (open) {
      setIsFullscreen(false);
      const saved = localStorage.getItem(pinKey);
      if (saved) {
        try {
          const { x, y } = JSON.parse(saved);
          setPos({ x: Math.min(Math.max(0, x), window.innerWidth - 400), y: Math.min(Math.max(0, y), window.innerHeight - 200) });
          setIsPinned(true);
        } catch { setPos(null); setIsPinned(false); }
      } else { setPos(null); setIsPinned(false); }
    }
  }, [open, pinKey]);

  const handlePin = () => {
    if (isPinned) { localStorage.removeItem(pinKey); setIsPinned(false); }
    else if (pos) { localStorage.setItem(pinKey, JSON.stringify(pos)); setIsPinned(true); }
  };

  const handleExpand = () => {
    setIsFullscreen(prev => !prev);
    if (!isFullscreen) setPos(null);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullScreen={isFullscreen}
      PaperProps={{
        ref: paperRef,
        sx: {
          ...(!isFullscreen ? {
            width: 820, minHeight: 507, borderRadius: "8px", overflow: "hidden",
            resize: "both", minWidth: 400, maxWidth: "95vw", maxHeight: "95vh",
            ...(pos ? { position: "fixed", left: pos.x, top: pos.y, margin: 0 } : {}),
          } : {
            borderRadius: 0, overflow: "hidden",
          }),
        },
      }}
    >
      {/* ── Header — 52px, draggable, 4 buttons ── */}
      <Box
        onMouseDown={handleMouseDown}
        sx={{
          bgcolor: SA, px: 3, height: 52, display: "flex", alignItems: "center", justifyContent: "space-between",
          ...(!isFullscreen ? { cursor: "move", userSelect: "none" } : { userSelect: "none" }),
          flexShrink: 0,
        }}
      >
        <Typography sx={{ color: "#fff", fontSize: 18, fontWeight: 600 }}>{title}</Typography>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title={isFullscreen ? "ย่อกลับ" : "ขยายเต็มจอ"}>
            <IconButton size="small" sx={{ color: "#fff" }} onClick={handleExpand}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/modal/expand.svg" alt="expand" width={20} height={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title={isPinned ? "ยกเลิก Pin" : "จำตำแหน่ง"}>
            <IconButton size="small" sx={{ color: "#fff", opacity: isPinned ? 1 : 0.6 }} onClick={handlePin}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/modal/pin.svg" alt="pin" width={20} height={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="เปิดหน้าต่างใหม่">
            <IconButton size="small" sx={{ color: "#fff" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/modal/popout.svg" alt="popout" width={20} height={20} />
            </IconButton>
          </Tooltip>
          <IconButton size="small" sx={{ color: "#fff" }} onClick={onClose}>
            <CloseIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Stack>
      </Box>

      {/* ── Body — padding 28px, scroll ── */}
      <Box sx={{ p: "28px", overflowY: "auto", flex: 1 }}>
        {children}
      </Box>

      {/* ── Footer — borderTop ── */}
      <Box sx={{ px: "28px", py: 2, display: "flex", justifyContent: "flex-end", gap: 1.5, borderTop: "1px solid #F0F0F0", flexShrink: 0 }}>
        <Button variant="outlined" onClick={onClose}
          sx={{ textTransform: "none", fontSize: 14, fontWeight: 600, height: 40, color: SA, borderColor: SA, "&:hover": { borderColor: "#CC5500", color: "#CC5500", bgcolor: "rgba(255,107,0,0.04)" } }}>
          {cancelLabel}
        </Button>
        {onConfirm && (
          <Button variant="contained" onClick={onConfirm}
            sx={{ bgcolor: SA, "&:hover": { bgcolor: "#CC5500" }, textTransform: "none", fontSize: 14, fontWeight: 600, height: 40 }}>
            {confirmLabel}
          </Button>
        )}
      </Box>
    </Dialog>
  );
}
