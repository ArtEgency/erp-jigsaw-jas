/* ══════════════════════════════════════════════════
   Tenant Page-Form — Shared Constants
   ══════════════════════════════════════════════════ */

export const SA = "#FF6B00";

/* ── Field sx — View mode (read-only, gray bg) ── */
export const VIEW_FIELD = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#F8F8F9", borderRadius: "8px", fontSize: 16,
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(76,78,100,0.22)" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(76,78,100,0.22)" },
  },
  "& .MuiInputLabel-root": { fontSize: 15, color: "#6B7280" },
  "& .MuiFormLabel-asterisk": { color: "#FF4D49" },
};

/* ── Field sx — Edit mode (white bg, focus orange) ── */
export const EDIT_FIELD = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#FFFFFF", borderRadius: "8px", fontSize: 16,
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(76,78,100,0.22)" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: SA },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: SA, borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": { fontSize: 15, color: "#6B7280", "&.Mui-focused": { color: SA } },
  "& .MuiFormLabel-asterisk": { color: "#FF4D49" },
};

/* ── MODAL_TF_SX — TPL-MODAL-SIZE-M standard input (INPUT-M 48px) ── */
export const MODAL_TF_SX = {
  "& .MuiOutlinedInput-root": {
    height: 48, fontSize: 15, fontWeight: 400, color: "#1A1A1A", borderRadius: "8px",
    "& .MuiOutlinedInput-notchedOutline": { borderWidth: "1.5px", borderColor: "#E5E7EB" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#E5E7EB" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderWidth: "1.5px", borderColor: SA },
  },
  "& .MuiInputLabel-root": {
    fontSize: 15, fontWeight: 400, color: "#6B7280",
    "&.Mui-focused": { fontSize: 12, fontWeight: 400, color: SA },
    "&.MuiInputLabel-shrink": { fontSize: 12 },
  },
  "& .MuiOutlinedInput-input": {
    fontSize: 15, fontWeight: 400, color: "#1A1A1A", padding: "12px 14px",
    "&::placeholder": { fontSize: 15, fontWeight: 400 },
  },
  "& .MuiFormLabel-asterisk": { color: "#EF4444", fontWeight: 400 },
};

export const SH = { shrink: true }; // InputLabelProps shorthand

/* ── Status badge colors ── */
export const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  "กำลังใช้งาน": { bg: "#EEFBE5", color: "#3B6D11" },
  "รอยืนยัน": { bg: "#FFF7ED", color: "#C2410C" },
  "รอสร้างธุรกิจ": { bg: "#EFF6FF", color: "#1D4ED8" },
  "ระงับการใช้งาน": { bg: "#FEF2F2", color: "#B91C1C" },
  "หมดอายุ": { bg: "#F5F5F5", color: "#737373" },
};

/* ── Tenant card status colors ── */
export const TENANT_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  "เปิดใช้งาน": { bg: "#E5F7F0", color: "#00AF6C" },
  "รอ Setup Wizard": { bg: "#FFEDE0", color: SA },
  "ระงับ": { bg: "#FEF2F2", color: "#B91C1C" },
};

/* ── Status Permissions ── */
export type PermLevel = "none" | "view" | "edit";
export interface StatusPerm {
  tab1: PermLevel;
  tab2: PermLevel;
  canAddTenant: boolean;
  canResendEmail: boolean;
  canUnlock: boolean;
}

export const STATUS_PERMS: Record<string, StatusPerm> = {
  "รอยืนยัน": { tab1: "view", tab2: "none", canAddTenant: false, canResendEmail: true, canUnlock: false },
  "รอสร้างธุรกิจ": { tab1: "edit", tab2: "edit", canAddTenant: true, canResendEmail: false, canUnlock: false },
  "กำลังใช้งาน": { tab1: "edit", tab2: "edit", canAddTenant: true, canResendEmail: false, canUnlock: false },
  "ระงับการใช้งาน": { tab1: "view", tab2: "view", canAddTenant: false, canResendEmail: false, canUnlock: true },
  "หมดอายุ": { tab1: "view", tab2: "view", canAddTenant: false, canResendEmail: false, canUnlock: false },
};
