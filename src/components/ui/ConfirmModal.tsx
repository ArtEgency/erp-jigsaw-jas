"use client";

import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const SA = "#FF6B00";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /** ข้อความที่จะ highlight สีส้ม เช่น "ปิดการใช้งาน" */
  actionText: string;
  /** ข้อความก่อน actionText (default: "คุณต้องการ") */
  prefixText?: string;
  /** ข้อความหลัง actionText (default: "ใช่หรือไม่") */
  suffixText?: string;
  /** ข้อความปุ่มยืนยัน (default: "ใช่") */
  confirmLabel?: string;
  /** ข้อความปุ่มยกเลิก (default: "ไม่ใช่") */
  cancelLabel?: string;
  /** สี primary (default: #FF6B00) */
  color?: string;
}

/**
 * ConfirmModal — Modal ยืนยันการกระทำ ตาม Figma
 * แถบสีบนสุด + ข้อความกลาง + ปุ่ม ไม่ใช่/ใช่
 *
 * Usage:
 * <ConfirmModal
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   onConfirm={handleConfirm}
 *   actionText="ปิดการใช้งาน"
 * />
 */
export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  actionText,
  prefixText = "คุณต้องการ",
  suffixText = "ใช่หรือไม่",
  confirmLabel = "ใช่",
  cancelLabel = "ไม่ใช่",
  color = SA,
}: ConfirmModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "10px",
          overflow: "hidden",
          minWidth: 420,
          maxWidth: 460,
          boxShadow: "0px 0px 20px rgba(76,78,100,0.2)",
        },
      }}
    >
      {/* แถบสีบนสุด */}
      <Box sx={{ height: 50, bgcolor: color, borderRadius: "10px 10px 0 0" }} />

      {/* ปุ่ม X */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 60,
          right: 12,
          color: "#6B7280",
          "&:hover": { color: "#374151" },
        }}
      >
        <CloseIcon sx={{ fontSize: 24 }} />
      </IconButton>

      {/* ข้อความ */}
      <Box sx={{ px: 4, pt: 4, pb: 3, textAlign: "center" }}>
        <Typography sx={{ fontSize: 22, fontWeight: 500, color: "#374151", lineHeight: 1.7 }}>
          {prefixText}
          <br />
          <Box component="span" sx={{ color, fontWeight: 700 }}>
            &ldquo;{actionText}&rdquo;
          </Box>
          {" "}{suffixText}
        </Typography>
      </Box>

      {/* ปุ่ม */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            textTransform: "none",
            fontSize: 15,
            fontWeight: 500,
            color: "#4C4E63",
            borderColor: "#B8B8C2",
            borderRadius: "8px",
            px: 3,
            height: 40,
            "&:hover": { borderColor: "#9CA3AF", bgcolor: "rgba(0,0,0,0.02)" },
          }}
        >
          {cancelLabel}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{
            textTransform: "none",
            fontSize: 15,
            fontWeight: 500,
            bgcolor: color,
            borderRadius: "8px",
            px: 3,
            height: 40,
            boxShadow: "0px 4px 8px -4px rgba(76,78,100,0.42)",
            "&:hover": { bgcolor: color === SA ? "#E65C00" : undefined },
          }}
        >
          {confirmLabel}
        </Button>
      </Box>
    </Dialog>
  );
}
