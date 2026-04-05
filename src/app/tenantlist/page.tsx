"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from "next/image";
import SlidePanel from "@/components/layout/SlidePanel";
import FloatingField from "@/components/layout/FloatingField";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import FormDialog from "@/components/ui/FormDialog";
import { masterAccounts, MasterAccount, sampleTenantDetail } from "@/data/mock";
import { useLocale } from "@/lib/locale";
import { useAuth } from "@/lib/auth";
import { SA_PRIMARY, SA_HOVER, BORDER, MUTED, TEXT, BG } from "@/lib/theme";
import { TextField, MenuItem, Button, Stack, Chip, IconButton, LinearProgress, Typography, Box, Tabs, Tab, Radio, RadioGroup, FormControlLabel, ToggleButtonGroup, ToggleButton, Paper, Menu, Dialog, DialogContent, DialogActions, Tooltip } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type Screen = "s1" | "s2" | "s2e" | "s3" | "s4" | "s4e" | "s5" | "s6" | "s7" | "s8";

// customerGroupColors moved to MUI Chip sx inline

const allModules = sampleTenantDetail.modules;

/* ── TPL-MODAL-SIZE-M TextField sx ── */
const MODAL_FIELD_SX = {
  "& .MuiOutlinedInput-root": {
    height: 48, fontSize: 15, fontWeight: 400, color: "#1A1A1A", borderRadius: "8px",
    "& .MuiOutlinedInput-notchedOutline": { borderWidth: "1.5px", borderColor: "#E5E7EB" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#E5E7EB" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderWidth: "1.5px", borderColor: SA_PRIMARY },
  },
  "& .MuiInputLabel-root": {
    fontSize: 15, fontWeight: 400, color: "#6B7280",
    "&.Mui-focused": { fontSize: 12, fontWeight: 400, color: SA_PRIMARY },
    "&.MuiInputLabel-shrink": { fontSize: 12 },
  },
  "& .MuiOutlinedInput-input": {
    fontSize: 15, fontWeight: 400, color: "#1A1A1A", padding: "12px 14px",
    "&::placeholder": { fontSize: 15, fontWeight: 400 },
  },
  "& .MuiFormLabel-asterisk": { color: "#EF4444", fontWeight: 400 },
};

export default function OnboardingPage() {
  const router = useRouter();
  const { t, locale, setLocale } = useLocale();
  const { user, logout } = useAuth();
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState<Record<string, boolean>>({ customer: true, settings: false, reports: false });
  const [screen, setScreen] = useState<Screen>("s1");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState<MasterAccount>(masterAccounts[0]);
  const [showToast, setShowToast] = useState(false);
  const [meatballAnchor, setMeatballAnchor] = useState<null | HTMLElement>(null);
  const [meatballRow, setMeatballRow] = useState<MasterAccount | null>(null);

  // Modal drag + 4-button state
  const [modalPos, setModalPos] = useState<{ x: number; y: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const modalDragging = useRef(false);
  const modalOffset = useRef({ x: 0, y: 0 });
  const modalPaperRef = useRef<HTMLDivElement>(null);
  const PINKEY = "modal_pin_addCustomer";

  const handleModalDragDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button") || isFullscreen) return;
    modalDragging.current = true;
    const paper = modalPaperRef.current;
    if (paper) {
      const rect = paper.getBoundingClientRect();
      modalOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    e.preventDefault();
  }, [isFullscreen]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (modalDragging.current) setModalPos({ x: e.clientX - modalOffset.current.x, y: e.clientY - modalOffset.current.y }); };
    const onUp = () => { modalDragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  // BroadcastChannel listener for Pop out
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ch = new BroadcastChannel("customer_channel");
    ch.onmessage = () => {
      // Refresh page data when pop-out saves (in real app, refetch from API)
      window.location.reload();
    };
    return () => ch.close();
  }, []);

  const handleOpenAddAccount = () => {
    setIsFullscreen(false);
    setIsDirty(false);
    // Restore pinned position
    const saved = localStorage.getItem(PINKEY);
    if (saved) {
      try {
        const { x, y } = JSON.parse(saved);
        setModalPos({ x: Math.min(Math.max(0, x), window.innerWidth - 400), y: Math.min(Math.max(0, y), window.innerHeight - 200) });
        setIsPinned(true);
      } catch { setModalPos(null); setIsPinned(false); }
    } else {
      setModalPos(null);
      setIsPinned(false);
    }
    setAccountForm({ company: "", firstName: "", lastName: "", position: "", customerGroup: "ทั่วไป", email: "", phone: "", tenantQuota: "3" });
    setEmailError(false);
    setAddAccountOpen(true);
  };

  const handleModalPin = () => {
    if (isPinned) { localStorage.removeItem(PINKEY); setIsPinned(false); }
    else if (modalPos) { localStorage.setItem(PINKEY, JSON.stringify(modalPos)); setIsPinned(true); }
  };

  const handleModalExpand = () => {
    setIsFullscreen(prev => !prev);
    if (!isFullscreen) setModalPos(null);
  };

  const handleModalPopout = () => {
    setAddAccountOpen(false);
    const w = 820, h = 700;
    const left = Math.round((window.screen.width - w) / 2);
    const top = Math.round((window.screen.height - h) / 2);
    window.open(
      "/tenantlist/add-customer",
      "addCustomerPopup",
      `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no,scrollbars=yes,resizable=yes`
    );
  };

  const handleModalClose = () => {
    if (isDirty) {
      if (!window.confirm("คุณกรอกข้อมูลไปแล้ว ต้องการปิดโดยไม่บันทึกหรือไม่?")) return;
    }
    setAddAccountOpen(false);
  };

  const handleFormChange = (field: string, value: string) => {
    setAccountForm(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  // S2 form state
  const [accountForm, setAccountForm] = useState({
    company: "", firstName: "", lastName: "", position: "",
    customerGroup: "ทั่วไป", email: "", phone: "", tenantQuota: "3",
  });
  const [emailError, setEmailError] = useState(false);

  // S6 tenant form state
  const [tenantForm, setTenantForm] = useState({
    nameTh: "", nameEn: "", entityType: "บริษัทจำกัด (บจ.)",
    businessType: "Trading — ซื้อมาขายไป", taxId: "", subdomain: "",
    tier: "Cloud" as "Cloud" | "Dedicated" | "On-premise",
    quotaUser: "20", quotaBranch: "3", quotaWarehouse: "5",
    quotaStorage: "20", quotaAuditLog: "12", quotaOnboarding: "10",
    backupFreq: "1", backupUnit: "วัน",
    contractStart: "01/04/2569", contractEnd: "31/03/2570",
    autoRenewal: false,
  });
  const [moduleStates, setModuleStates] = useState(
    allModules.map((m) => ({ ...m }))
  );

  // S4 password state
  const [password, setPassword] = useState("Jigsaw@2569");
  const [confirmPassword, setConfirmPassword] = useState("Jigsaw@2569");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // S5 active tab
  const [detailTab, setDetailTab] = useState<"general" | "tenants" | "contracts" | "history">("general");

  const go = (s: Screen) => {
    setScreen(s);
    window.scrollTo(0, 0);
  };

  const STATUS_MAP = ["", "รอยืนยัน", "รอสร้างธุรกิจ", "กำลังใช้งาน", "ระงับการใช้งาน", "หมดอายุ"];
  const filtered = masterAccounts.filter((a) => {
    // tab filter (0 = ทั้งหมด)
    if (statusTab > 0 && a.status !== STATUS_MAP[statusTab]) return false;
    // search filter
    if (search) {
      const q = search.toLowerCase();
      return (
        a.firstName.toLowerCase().includes(q) ||
        a.lastName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Password strength
  const pwChecks = [
    { label: t("onboarding.pwMin8"), ok: password.length >= 8 },
    { label: t("onboarding.pwUppercase"), ok: /[A-Z]/.test(password) },
    { label: t("onboarding.pwNumber"), ok: /[0-9]/.test(password) },
    { label: t("onboarding.pwSpecial"), ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const pwStrength = pwChecks.filter((c) => c.ok).length;

  // ─── TOPBAR SA ───
  const renderTopBarSA = () => (
    <Box sx={{ height: 52, bgcolor: SA_PRIMARY, display: "flex", alignItems: "center", px: 2, gap: 1.5, flexShrink: 0, position: "relative", zIndex: 50, overflow: "visible" }}>
      <Box component="button" onClick={() => setSidebarExpanded(prev => !prev)} sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }, borderRadius: 2, p: 0.75, transition: "background 200ms", cursor: "pointer", border: "none", background: "none" }}>
        <svg width={20} height={20} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} fill="none"><path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" /></svg>
      </Box>
      <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.7)", flex: 1 }}>
        <strong style={{ color: "white" }}>Server: Prod</strong> | Jigsaw Admin
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box component="span" sx={{ color: "white", fontSize: 14 }}>&#9993;</Box>
        <Box component="span" sx={{ color: "white", fontSize: 14, position: "relative" }}>
          &#128276;
          <Box component="span" sx={{ position: "absolute", top: -4, right: -4, width: 8, height: 8, bgcolor: "#EF4444", borderRadius: "50%", border: `1px solid ${SA_PRIMARY}` }} />
        </Box>
        <Box sx={{ width: "1px", height: 20, bgcolor: "rgba(255,255,255,0.3)" }} />
        {/* Language Switcher */}
        <Box sx={{ position: "relative" }}>
          <Box
            component="button"
            onClick={() => setLangOpen(prev => !prev)}
            sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "white", fontSize: 12, fontWeight: 500, px: 1, py: 0.5, borderRadius: 1, "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }, transition: "background 200ms", border: "none", background: "none", cursor: "pointer" }}
          >
            {locale.toUpperCase()} <Box component="span" sx={{ fontSize: 10 }}>▼</Box>
          </Box>
          {langOpen && (
            <Box sx={{ position: "absolute", right: 0, top: "100%", mt: 0.5, bgcolor: "white", borderRadius: 2, boxShadow: 6, border: `1px solid ${BORDER}`, overflow: "hidden", zIndex: 50, minWidth: 100 }}>
              <Box
                component="button"
                onClick={() => { setLocale("th"); setLangOpen(false); }}
                sx={{ width: "100%", px: 1.5, py: 1, textAlign: "left", fontSize: 12, "&:hover": { bgcolor: "#F9FAFB" }, transition: "background 200ms", border: "none", background: "none", cursor: "pointer" }}
                style={{ color: locale === "th" ? SA_PRIMARY : TEXT, fontWeight: locale === "th" ? 600 : 400 }}
              >
                TH Thai
              </Box>
              <Box
                component="button"
                onClick={() => { setLocale("en"); setLangOpen(false); }}
                sx={{ width: "100%", px: 1.5, py: 1, textAlign: "left", fontSize: 12, "&:hover": { bgcolor: "#F9FAFB" }, transition: "background 200ms", borderTop: "1px solid #F3F4F6", border: "none", borderTopStyle: "solid", borderTopWidth: 1, borderTopColor: "#F3F4F6", background: "none", cursor: "pointer" }}
                style={{ color: locale === "en" ? SA_PRIMARY : TEXT, fontWeight: locale === "en" ? 600 : 400 }}
              >
                EN English
              </Box>
            </Box>
          )}
        </Box>
        <Box sx={{ width: "1px", height: 20, bgcolor: "rgba(255,255,255,0.3)" }} />
        {/* Profile + Sign Out dropdown */}
        <Box sx={{ position: "relative" }}>
          <Box
            component="button"
            onClick={() => setProfileOpen(prev => !prev)}
            sx={{ display: "flex", alignItems: "center", gap: 1, "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }, borderRadius: 2, px: 1, py: 0.5, transition: "background 200ms", border: "none", background: "none", cursor: "pointer" }}
          >
            <Box component="span" sx={{ color: "white", fontSize: 12, fontWeight: 500 }}>{user?.name || t("onboarding.adminName")}</Box>
            <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: SA_PRIMARY, border: "2px solid rgba(255,255,255,0.4)" }}>
              {user?.avatar || "สจ"}
            </Box>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points={profileOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/></svg>
          </Box>
          {profileOpen && (
            <Box sx={{ position: "absolute", right: 0, top: "100%", mt: 0.5, bgcolor: "white", borderRadius: 3, boxShadow: 6, border: `1px solid ${BORDER}`, overflow: "hidden", zIndex: 50, minWidth: 240 }} style={{ fontFamily: "'Sarabun', sans-serif" }}>
              {/* User info */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.5, borderBottom: "1px solid #F3F4F6" }}>
                <Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: "rgba(86,93,255,0.1)", border: "2px solid rgba(86,93,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#565DFF" }}>
                  {user?.avatar || "สจ"}
                </Box>
                <Box>
                  <Box sx={{ fontSize: 14, fontWeight: 600, color: "#1F2937" }}>{user?.name || t("onboarding.adminName")}</Box>
                  <Box sx={{ fontSize: 12, color: "#6B7280" }}>{locale === "en" ? "Administrator" : "ผู้ดูแลระบบ"}</Box>
                </Box>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#565DFF" strokeWidth="2" style={{ marginLeft: "auto" }}><polyline points="20 6 9 17 4 12"/></svg>
              </Box>
              {/* Profile link */}
              <Box component="button" sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.25, fontSize: 14, color: "#374151", "&:hover": { bgcolor: "#F9FAFB" }, transition: "background 200ms", borderBottom: "1px solid #F3F4F6", border: "none", borderBottomStyle: "solid", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", background: "none", cursor: "pointer" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Profile
              </Box>
              {/* Sign Out */}
              <Box
                component="button"
                onClick={() => { setProfileOpen(false); logout(); router.push("/login"); }}
                sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.25, fontSize: 14, color: "#EF4444", "&:hover": { bgcolor: "#FEF2F2" }, transition: "background 200ms", border: "none", background: "none", cursor: "pointer" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign Out
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );

  // ─── TOPBAR TA (for email/verify screens) ───
  const TopBarTA = ({ info }: { info: string }) => (
    <Box sx={{ height: 52, bgcolor: "var(--brand-primary, #565DFF)", display: "flex", alignItems: "center", px: 2, gap: 1.5, flexShrink: 0 }}>
      <Box component="button" onClick={() => setSidebarExpanded(prev => !prev)} sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }, borderRadius: 2, p: 0.75, transition: "background 200ms", cursor: "pointer", border: "none", background: "none" }}>
        <svg width={20} height={20} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} fill="none"><path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" /></svg>
      </Box>
      <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.7)", flex: 1 }}>
        <strong style={{ color: "white" }}>{info}</strong>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--brand-primary, #565DFF)", border: "2px solid rgba(255,255,255,0.4)" }}>
          สม
        </Box>
      </Box>
    </Box>
  );

  // ─── BREADCRUMB ───
  const Breadcrumb = ({ items }: { items: { label: string; onClick?: () => void }[] }) => (
    <Box sx={{ px: 2.5, py: 1.25, fontSize: 12, color: MUTED, display: "flex", alignItems: "center", gap: 0.75, bgcolor: "white", borderBottom: `1px solid ${BORDER}` }}>
      {items.map((item, i) => (
        <Box component="span" key={i} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          {i > 0 && <Box component="span" sx={{ color: "#D1D5DB" }}>&#8250;</Box>}
          {item.onClick ? (
            <Box component="button" onClick={item.onClick} sx={{ color: SA_PRIMARY, "&:hover": { textDecoration: "underline" }, border: "none", background: "none", cursor: "pointer", fontSize: 12 }}>
              {item.label}
            </Box>
          ) : (
            <Box component="span">{item.label}</Box>
          )}
        </Box>
      ))}
    </Box>
  );

  // ─── SCREEN META ───
  // ScreenMetaBar removed — was dev-only screen label

  // ═══════════════════ S1: MASTER ACCOUNT LIST ═══════════════════
  const renderS1 = () => (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {renderTopBarSA()}
      <Breadcrumb items={[{ label: t("onboarding.customer") }, { label: t("onboarding.masterAccountList") }]} />
      {/* TPL-DATALIST-STANDARD */}
      <Box sx={{ px: 3, py: 3, flex: 1 }}>
        {/* Page Title — 22px / 700 / #1A1A1A */}
        <Typography sx={{ fontSize: 22, fontWeight: 700, py: 2.5, color: "#1A1A1A" }}>
          {t("onboarding.masterAccountList")}
        </Typography>

        {/* Sub-tabs — pill style */}
        <Tabs
          value={statusTab}
          onChange={(_, v) => setStatusTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 2,
            "& .MuiTab-root": {
              textTransform: "none", fontWeight: 500, fontSize: "0.9rem",
              minHeight: 38, borderRadius: "8px", mr: 0.5, px: 2,
            },
            "& .Mui-selected": {
              bgcolor: SA_PRIMARY, color: "#fff !important", fontWeight: 600,
            },
            "& .MuiTabs-indicator": { display: "none" },
          }}
        >
          <Tab label={locale === "en" ? "All Customers" : "ลูกค้าทั้งหมด"} />
          <Tab label={locale === "en" ? "Pending Verify" : "รอยืนยัน"} />
          <Tab label={locale === "en" ? "Pending Business" : "รอสร้างธุรกิจ"} />
          <Tab label={locale === "en" ? "Active" : "กำลังใช้งาน"} />
          <Tab label={locale === "en" ? "Suspended" : "ระงับการใช้งาน"} />
          <Tab label={locale === "en" ? "Expired" : "หมดอายุ"} />
        </Tabs>

        <Paper elevation={3} sx={{ borderRadius: "10px", overflow: "hidden" }}>
          {/* Filter Bar — TPL-DATALIST-STANDARD */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2.5 }}>
            <Button
              variant="outlined"
              startIcon={<FileUploadOutlinedIcon />}
              sx={{ color: SA_PRIMARY, borderColor: SA_PRIMARY, "&:hover": { borderColor: SA_HOVER, bgcolor: "rgba(255,107,0,0.04)" }, textTransform: "none", whiteSpace: "nowrap", fontSize: 13, fontWeight: 600, height: 36 }}
            >
              {t("common.export")}
            </Button>

            <TextField
              select value="" label={locale === "en" ? "Select Group" : "เลือกกลุ่ม"} size="small"
              sx={{ minWidth: 180 }} InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="">{locale === "en" ? "All" : "ทั้งหมด"}</MenuItem>
              <MenuItem value="ขายส่ง">{locale === "en" ? "Wholesale" : "ขายส่ง"}</MenuItem>
              <MenuItem value="ขายปลีก">{locale === "en" ? "Retail" : "ขายปลีก"}</MenuItem>
            </TextField>

            <TextField
              select value="" label={locale === "en" ? "Select Position" : "เลือกตำแหน่ง"} size="small"
              sx={{ minWidth: 180 }} InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="">{locale === "en" ? "All" : "ทั้งหมด"}</MenuItem>
              <MenuItem value="ผู้จัดการทั่วไป">{locale === "en" ? "General Manager" : "ผู้จัดการทั่วไป"}</MenuItem>
              <MenuItem value="CEO">CEO</MenuItem>
            </TextField>

            <Box sx={{ flex: 1 }} />

            <TextField
              size="small"
              placeholder={t("onboarding.searchCustomer")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 280, "& .MuiOutlinedInput-root": { height: 40, fontSize: 14 }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E5E7EB" } }}
            />
            <Button
              variant="contained"
              startIcon={<span style={{ fontSize: 18 }}>+</span>}
              onClick={handleOpenAddAccount}
              sx={{ bgcolor: SA_PRIMARY, "&:hover": { bgcolor: SA_HOVER }, textTransform: "none", whiteSpace: "nowrap", fontSize: 13, fontWeight: 600, height: 36 }}
            >
              {t("onboarding.addCustomerShort")}
            </Button>
          </Stack>
          {/* DataGrid — TPL-DATALIST-STANDARD */}
          <DataGrid
            rows={filtered}
            columns={(() => {
              const cols: GridColDef[] = [
                {
                  field: "id",
                  headerName: t("onboarding.accountCode"),
                  width: 150,
                  renderCell: (params: GridRenderCellParams) => (
                    <Typography
                      onClick={(e) => { e.stopPropagation(); router.push(`/tenantlist/${params.value}`); }}
                      sx={{ fontSize: 14, fontWeight: 500, color: SA_PRIMARY, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                    >{params.value}</Typography>
                  ),
                },
                {
                  field: "name",
                  headerName: t("onboarding.name"),
                  width: 260,
                  valueGetter: (_value: unknown, row: MasterAccount) => `${row.firstName} ${row.lastName}`,
                  renderCell: (params: GridRenderCellParams) => (
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ height: "100%" }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: SA_PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
                        {(params.value as string)?.charAt(0)}
                      </Box>
                      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "2px", py: 1 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A", lineHeight: 1.3 }}>{params.value}</Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#6B7280", lineHeight: 1.2 }}>{(params.row as MasterAccount).position}</Typography>
                      </Box>
                    </Stack>
                  ),
                },
                { field: "customerGroup", headerName: t("onboarding.customerGroup"), width: 110 },
                { field: "email", headerName: "Email", flex: 1, minWidth: 180 },
                { field: "phone", headerName: t("onboarding.phoneCol"), width: 140 },
                {
                  field: "emailVerifiedAt",
                  headerName: t("onboarding.emailVerifiedAt"),
                  width: 160,
                  renderCell: (params: GridRenderCellParams) => (
                    <Typography sx={{ fontSize: 14, fontWeight: 400, color: "#1A1A1A" }}>{params.value || "—"}</Typography>
                  ),
                },
                {
                  field: "tenantQuota",
                  headerName: t("onboarding.businessCount"),
                  width: 150,
                  align: "center",
                  headerAlign: "center",
                  renderCell: (params: GridRenderCellParams) => {
                    const row = params.row as MasterAccount;
                    return (
                      <Typography sx={{ fontSize: 14 }}>
                        <span style={{ color: SA_PRIMARY, fontWeight: 600 }}>{row.tenantUsed}</span>
                        <span style={{ color: "#1A1A1A" }}>/{row.tenantQuota}</span>
                      </Typography>
                    );
                  },
                },
                {
                  field: "status",
                  headerName: t("onboarding.status"),
                  width: 160,
                  renderCell: (params: GridRenderCellParams) => {
                    const status = params.value as string;
                    return (
                      <Chip
                        label={status}
                        size="small"
                        sx={{
                          fontWeight: 500, fontSize: 12, height: 24,
                          ...(status === "กำลังใช้งาน"
                            ? { bgcolor: "#EEFBE5", color: "#3B6D11" }
                            : status === "รอยืนยัน"
                            ? { bgcolor: "#FFF7ED", color: "#C2410C" }
                            : status === "รอสร้างธุรกิจ"
                            ? { bgcolor: "#EFF6FF", color: "#1D4ED8" }
                            : status === "ระงับการใช้งาน"
                            ? { bgcolor: "#FEF2F2", color: "#B91C1C" }
                            : status === "หมดอายุ"
                            ? { bgcolor: "#F5F5F5", color: "#737373" }
                            : { bgcolor: "#F0F0F0", color: "#999" }),
                        }}
                      />
                    );
                  },
                },
                {
                  field: "actions",
                  headerName: t("onboarding.actions"),
                  width: 100,
                  sortable: false,
                  filterable: false,
                  renderCell: (params: GridRenderCellParams) => {
                    const row = params.row as MasterAccount;
                    return (
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton size="small" sx={{ p: 0 }} onClick={(e) => { e.stopPropagation(); setSelectedAccount(row); setDetailTab("general"); go("s5"); }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/icons/actions/edit.svg" alt="edit" width={28} height={28} />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); setMeatballAnchor(e.currentTarget); setMeatballRow(row); }} sx={{ width: 28, height: 28 }}>
                          <MoreVertIcon sx={{ fontSize: 18, color: "#93A1B8" }} />
                        </IconButton>
                      </Stack>
                    );
                  },
                },
              ];
              return cols;
            })()}
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            getRowHeight={() => 60}
            onRowClick={(params, event) => {
              const target = (event as React.MouseEvent).target as HTMLElement;
              if (target.closest("button") || target.closest("a")) return;
              const row = params.row as MasterAccount;
              setSelectedAccount(row);
              setDetailTab("general");
              go("s5");
            }}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "#F5F5F7",
                fontSize: 13,
                fontWeight: 600,
                color: "#6B7280",
              },
              "& .MuiDataGrid-cell": {
                fontSize: 14,
                fontWeight: 400,
                color: "#1A1A1A",
                display: "flex",
                alignItems: "center",
              },
              "& .MuiDataGrid-row:hover": {
                bgcolor: "rgba(255,107,0,0.04)",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #F5F5F7",
                "& .MuiTablePagination-root": { fontSize: 13, color: "#6B7280" },
                "& .MuiTablePagination-selectLabel": { fontSize: 13, color: "#6B7280" },
                "& .MuiTablePagination-displayedRows": { fontSize: 13, color: "#6B7280" },
              },
              "& .MuiCheckbox-root": {
                color: "#ccc",
                "&.Mui-checked": { color: SA_PRIMARY },
              },
            }}
          />
        </Paper>

        {/* TPL-MEATBALL-MENU */}
        <Menu
          anchorEl={meatballAnchor}
          open={Boolean(meatballAnchor)}
          onClose={() => setMeatballAnchor(null)}
          PaperProps={{ elevation: 3, sx: { borderRadius: "5px", width: 227, mt: 0.5 } }}
        >
          <MenuItem onClick={() => { setMeatballAnchor(null); }} sx={{ gap: 1.5, py: 1.5, fontSize: "0.875rem", color: "#374151" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            {t("onboarding.resendEmail")}
          </MenuItem>
          <MenuItem onClick={() => { setMeatballAnchor(null); }} sx={{ gap: 1.5, py: 1.5, fontSize: "0.875rem", color: "#374151" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            {t("onboarding.resetPassword")}
          </MenuItem>
          <MenuItem onClick={() => { setMeatballAnchor(null); if (meatballRow) { setSelectedAccount(meatballRow); setDetailTab("general"); go("s5"); } }} sx={{ gap: 1.5, py: 1.5, fontSize: "0.875rem", color: "#374151" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            {t("onboarding.editData")}
          </MenuItem>
          <MenuItem onClick={() => { setMeatballAnchor(null); }} sx={{ gap: 1.5, py: 1.5, fontSize: "0.875rem", color: SA_PRIMARY }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={SA_PRIMARY} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            {t("onboarding.suspendAccount")}
          </MenuItem>
        </Menu>
      </Box>
      {/* Footer — Figma style */}
      <Box sx={{ px: 3, py: 2, fontSize: 14, color: "rgba(76,78,100,0.68)" }}>
        {t("onboarding.footer")}
      </Box>

      {/* === Add Account Modal — TPL-MODAL-SIZE-M with 4 buttons === */}
      <Dialog
        open={addAccountOpen}
        onClose={handleModalClose}
        maxWidth={false}
        fullScreen={isFullscreen}
        PaperProps={{
          ref: modalPaperRef,
          sx: {
            ...(!isFullscreen ? {
              width: 820, minHeight: 507, borderRadius: "8px", overflow: "hidden",
              resize: "both", minWidth: 400, maxWidth: "95vw", maxHeight: "95vh",
              ...(modalPos ? { position: "fixed", left: modalPos.x, top: modalPos.y, margin: 0 } : {}),
            } : { borderRadius: 0, overflow: "hidden" }),
          },
        }}
      >
        {/* Header — 52px #FF6B00 draggable + 4 buttons */}
        <Box
          onMouseDown={handleModalDragDown}
          sx={{
            bgcolor: SA_PRIMARY, px: 3, height: 52, display: "flex", alignItems: "center", justifyContent: "space-between",
            ...(!isFullscreen ? { cursor: "move", userSelect: "none" } : { userSelect: "none" }),
          }}
        >
          <Typography sx={{ color: "white", fontWeight: 600, fontSize: 18 }}>{t("onboarding.createAccount")}</Typography>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title={isFullscreen ? "ย่อกลับ" : "ขยายเต็มจอ"}>
              <IconButton size="small" sx={{ color: "white" }} onClick={handleModalExpand}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/modal/expand.svg" alt="expand" width={20} height={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title={isPinned ? "ยกเลิก Pin" : "จำตำแหน่ง"}>
              <IconButton size="small" sx={{ color: "white", opacity: isPinned ? 1 : 0.6 }} onClick={handleModalPin}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/modal/pin.svg" alt="pin" width={20} height={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title="เปิดหน้าต่างใหม่">
              <IconButton size="small" sx={{ color: "white" }} onClick={handleModalPopout}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/modal/popout.svg" alt="popout" width={20} height={20} />
              </IconButton>
            </Tooltip>
            <IconButton size="small" sx={{ color: "white" }} onClick={handleModalClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </IconButton>
          </Stack>
        </Box>
        {/* Body — padding 28px */}
        <DialogContent sx={{ p: "28px", pt: "28px !important" }}>
          <Stack spacing="20px">
            <TextField
              label={t("onboarding.companyName")} required fullWidth
              placeholder={locale === "en" ? "Enter company name" : "กรอกชื่อร้าน / ชื่อบริษัท"}
              value={accountForm.company} onChange={(e) => handleFormChange("company", e.target.value)}
              sx={MODAL_FIELD_SX} InputLabelProps={{ shrink: true }}
            />
            <Stack direction="row" spacing="16px">
              <TextField
                label={t("onboarding.firstName")} required fullWidth
                placeholder={locale === "en" ? "Enter first name" : "กรอกชื่อ"}
                value={accountForm.firstName} onChange={(e) => handleFormChange("firstName", e.target.value)}
                sx={MODAL_FIELD_SX} InputLabelProps={{ shrink: true }}
              />
              <TextField
                label={t("onboarding.lastName")} required fullWidth
                placeholder={locale === "en" ? "Enter last name" : "กรอกนามสกุล"}
                value={accountForm.lastName} onChange={(e) => handleFormChange("lastName", e.target.value)}
                sx={MODAL_FIELD_SX} InputLabelProps={{ shrink: true }}
              />
            </Stack>
            <Stack direction="row" spacing="16px">
              <TextField
                label={t("onboarding.position")} required fullWidth
                placeholder={locale === "en" ? "Enter position" : "กรอกตำแหน่ง"}
                value={accountForm.position} onChange={(e) => handleFormChange("position", e.target.value)}
                sx={MODAL_FIELD_SX} InputLabelProps={{ shrink: true }}
              />
              <TextField
                label={t("onboarding.customerGroup")} required select fullWidth
                value={accountForm.customerGroup} onChange={(e) => handleFormChange("customerGroup", e.target.value)}
                sx={MODAL_FIELD_SX} InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="ทั่วไป">{locale === "en" ? "General" : "ทั่วไป"}</MenuItem>
                <MenuItem value="ขายส่ง">{locale === "en" ? "Wholesale" : "ขายส่ง"}</MenuItem>
                <MenuItem value="ขายปลีก">{locale === "en" ? "Retail" : "ขายปลีก"}</MenuItem>
                <MenuItem value="VIP">VIP</MenuItem>
              </TextField>
            </Stack>
            <Stack direction="row" spacing="16px">
              <TextField
                label={t("onboarding.tenantQuota")} required fullWidth
                value={accountForm.tenantQuota} onChange={(e) => handleFormChange("tenantQuota", e.target.value)}
                sx={MODAL_FIELD_SX} InputLabelProps={{ shrink: true }}
              />
              <TextField
                label={t("onboarding.phone")} required fullWidth
                placeholder={locale === "en" ? "Enter phone number" : "กรอกเบอร์โทร"}
                value={accountForm.phone} onChange={(e) => handleFormChange("phone", e.target.value)}
                sx={MODAL_FIELD_SX} InputLabelProps={{ shrink: true }}
                InputProps={{ startAdornment: <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 1, whiteSpace: "nowrap", fontSize: 15, color: "#374151" }}>🇹🇭 +66</Box> }}
              />
            </Stack>
            <Stack direction="row" spacing="16px" alignItems="flex-start">
              <TextField
                label={t("onboarding.masterEmail")} required fullWidth
                placeholder={locale === "en" ? "Enter email" : "กรอกอีเมล"}
                value={accountForm.email} onChange={(e) => handleFormChange("email", e.target.value)}
                sx={{ flex: 1, ...MODAL_FIELD_SX }} InputLabelProps={{ shrink: true }}
              />
              <Box sx={{
                flex: 1, minHeight: 48, display: "flex", alignItems: "center", gap: 1,
                bgcolor: "#FEF3C7", borderRadius: "8px", px: 2, py: 1.5,
                fontSize: 13, fontWeight: 400, color: "#92400E",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                {t("onboarding.emailNotice")}
              </Box>
            </Stack>
          </Stack>
        </DialogContent>
        {/* Footer */}
        <DialogActions sx={{ px: "28px", py: 2, borderTop: "1px solid #F0F0F0" }}>
          <Button variant="outlined" onClick={handleModalClose} sx={{ textTransform: "none", fontSize: 14, fontWeight: 600, height: 40, color: SA_PRIMARY, borderColor: SA_PRIMARY, "&:hover": { borderColor: SA_HOVER, color: SA_HOVER, bgcolor: "rgba(255,107,0,0.04)" } }}>
            {t("common.cancel")}
          </Button>
          <Button variant="contained" onClick={() => { setAddAccountOpen(false); setIsDirty(false); go("s3"); }} sx={{ bgcolor: SA_PRIMARY, "&:hover": { bgcolor: SA_HOVER }, textTransform: "none", fontSize: 14, fontWeight: 600, height: 40 }}>
            {t("common.save")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  // ═══════════════════ S2: CREATE ACCOUNT PANEL ═══════════════════
  const renderS2 = () => (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {renderTopBarSA()}
      <Breadcrumb items={[{ label: "Master Accounts", onClick: () => go("s1") }, { label: t("onboarding.createNew") }]} />
      <Box sx={{ px: 2.5, pt: 1.5, pb: 1 }}>
        <Box component="h1" sx={{ fontSize: 20, fontWeight: 700, color: TEXT }}>Master Accounts</Box>
      </Box>
      <Box sx={{ flex: 1, position: "relative" }}>
        <SlidePanel
          open={true}
          title={t("onboarding.createAccount")}
          onClose={() => go("s1")}
          headerColor="sa"
          footer={
            <>
              <Box component="button" onClick={() => go("s1")} sx={{ px: 2, py: 1, border: `1px solid ${BORDER}`, borderRadius: 2, fontSize: 14, "&:hover": { bgcolor: "#F9FAFB" }, transition: "background 200ms", background: "none", cursor: "pointer" }}>
                {t("common.cancel")}
              </Box>
              <Box component="button" onClick={() => go("s3")} sx={{ px: 2, py: 1, bgcolor: SA_PRIMARY, "&:hover": { bgcolor: SA_HOVER }, color: "white", fontSize: 14, borderRadius: 2, fontWeight: 500, transition: "background 200ms", border: "none", cursor: "pointer" }}>
                {t("common.save")}
              </Box>
            </>
          }
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FloatingField label={t("onboarding.companyName")} value={accountForm.company} onChange={(v) => setAccountForm({ ...accountForm, company: v })} variant="sa" />
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
              <FloatingField label={t("onboarding.firstName")} value={accountForm.firstName} onChange={(v) => setAccountForm({ ...accountForm, firstName: v })} variant="sa" required />
              <FloatingField label={t("onboarding.lastName")} value={accountForm.lastName} onChange={(v) => setAccountForm({ ...accountForm, lastName: v })} variant="sa" required />
            </Box>
            <FloatingField label={t("onboarding.position")} value={accountForm.position} onChange={(v) => setAccountForm({ ...accountForm, position: v })} variant="sa" required />
            <Box sx={{ position: "relative", "& select, & input": { width: "100%", height: 48, px: 1.75, py: 1.5, fontSize: 15, borderRadius: 1, border: `1.5px solid ${BORDER}`, color: TEXT, outline: "none", bgcolor: "white", "&:focus": { borderColor: SA_PRIMARY } }, "& label": { position: "absolute", top: -8, left: 12, px: 0.5, fontSize: 12, color: MUTED, bgcolor: "white" } }}>
              <select
                value={accountForm.customerGroup}
                onChange={(e) => setAccountForm({ ...accountForm, customerGroup: e.target.value })}
              >
                <option value="ทั่วไป">ทั่วไป</option>
                <option value="ขายส่ง">ขายส่ง</option>
                <option value="ขายปลีก">ขายปลีก</option>
                <option value="VIP">VIP</option>
                <option value="Founding Partner">Founding Partner</option>
              </select>
              <label>{t("onboarding.customerGroup")} <Box component="span" sx={{ color: "#E53935" }}>*</Box></label>
            </Box>
            <Box>
              <FloatingField label={t("onboarding.masterEmail")} value={accountForm.email} onChange={(v) => setAccountForm({ ...accountForm, email: v })} variant="sa" required />
              {accountForm.email && !emailError && (
                <Box component="p" sx={{ fontSize: 10, color: "#16A34A", mt: 0.5, pl: 0.25 }}>&#10003; {t("onboarding.emailNotInSystem")}</Box>
              )}
            </Box>
            <Box>
              <Box component="p" sx={{ fontSize: 11, color: MUTED, mb: 0.75, fontWeight: 500 }}>{t("onboarding.phone")} <Box component="span" sx={{ color: "#E53935" }}>*</Box></Box>
              <Box sx={{ display: "flex", border: `1.5px solid ${BORDER}`, borderRadius: 1, overflow: "hidden", "&:focus-within": { borderColor: SA_PRIMARY }, transition: "border-color 200ms" }}>
                <Box sx={{ px: 1.25, py: 1, bgcolor: "#F9FAFB", borderRight: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 0.5, fontSize: 12, color: MUTED, whiteSpace: "nowrap" }}>
                  &#127481;&#127469; +66 &#9662;
                </Box>
                <input
                  style={{ flex: 1, padding: "8px 12px", fontSize: 14, outline: "none", border: "none" }}
                  value={accountForm.phone}
                  onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                />
              </Box>
            </Box>
            <FloatingField label={t("onboarding.tenantQuota")} value={accountForm.tenantQuota} onChange={(v) => setAccountForm({ ...accountForm, tenantQuota: v })} variant="sa" required type="number" />
            <Box component="p" sx={{ fontSize: 11, color: MUTED, mt: -1, pl: 0.25 }}>{t("onboarding.tenantQuotaHelp")}</Box>
            <Box sx={{ p: 1.25, bgcolor: "rgba(255,107,0,0.1)", borderRadius: 1, border: "1px solid rgba(255,107,0,0.2)", fontSize: 12, color: SA_PRIMARY }}>
              {t("onboarding.emailNotice")}
            </Box>
          </Box>
        </SlidePanel>
      </Box>
    </Box>
  );

  // ═══════════════════ S2e: ERROR STATE ═══════════════════
  const renderS2e = () => (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {renderTopBarSA()}
      <Breadcrumb items={[{ label: "Master Accounts", onClick: () => go("s1") }, { label: t("onboarding.createNew") }]} />
      <Box sx={{ px: 2.5, pt: 1.5, pb: 1 }}>
        <Box component="h1" sx={{ fontSize: 20, fontWeight: 700, color: TEXT }}>Master Accounts</Box>
      </Box>
      <Box sx={{ flex: 1, position: "relative" }}>
        <SlidePanel
          open={true}
          title={t("onboarding.createAccount")}
          onClose={() => go("s1")}
          headerColor="sa"
          footer={
            <>
              <Box component="button" onClick={() => go("s1")} sx={{ px: 2, py: 1, border: `1px solid ${BORDER}`, borderRadius: 2, fontSize: 14, "&:hover": { bgcolor: "#F9FAFB" }, transition: "background 200ms", background: "none", cursor: "pointer" }}>
                {t("common.cancel")}
              </Box>
              <Box component="button" sx={{ px: 2, py: 1, bgcolor: SA_PRIMARY, color: "white", fontSize: 14, borderRadius: 2, fontWeight: 500, opacity: 0.4, cursor: "not-allowed", border: "none" }} disabled>
                {t("common.save")}
              </Box>
            </>
          }
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FloatingField label={t("onboarding.name")} value="วิภา รัตนพันธ์" onChange={() => {}} variant="sa" required />
            <FloatingField label={t("onboarding.position")} value="CEO" onChange={() => {}} variant="sa" required />
            <Box>
              <Box sx={{ position: "relative", "& input": { width: "100%", height: 48, px: 1.75, py: 1.5, fontSize: 15, borderRadius: 1, border: `1.5px solid #E53935`, color: TEXT, outline: "none", bgcolor: "white" }, "& label": { position: "absolute", top: -8, left: 12, px: 0.5, fontSize: 12, color: "#E53935", bgcolor: "white" } }}>
                <input value="wipa@thaimart.co.th" readOnly style={{ borderColor: "#E53935" }} />
                <label>{t("onboarding.masterEmail")} <Box component="span" sx={{ color: "#E53935" }}>*</Box></label>
              </Box>
              <Box component="p" sx={{ fontSize: 10, color: "#E53935", mt: 0.5, pl: 0.25 }}>&#10005; {t("onboarding.emailAlreadyExists")}</Box>
            </Box>
            <Box>
              <Box component="p" sx={{ fontSize: 11, color: MUTED, mb: 0.75, fontWeight: 500 }}>{t("onboarding.phone")} <Box component="span" sx={{ color: "#E53935" }}>*</Box></Box>
              <Box sx={{ display: "flex", border: `1.5px solid ${BORDER}`, borderRadius: 1, overflow: "hidden" }}>
                <Box sx={{ px: 1.25, py: 1, bgcolor: "#F9FAFB", borderRight: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 0.5, fontSize: 12, color: MUTED }}>
                  &#127481;&#127469; +66 &#9662;
                </Box>
                <input style={{ flex: 1, padding: "8px 12px", fontSize: 14, outline: "none", border: "none" }} value="0894567890" readOnly />
              </Box>
            </Box>
            <FloatingField label="Tenant Quota" value="5" onChange={() => {}} variant="sa" required type="number" />
            <Box sx={{ p: 1.25, bgcolor: "#FEF2F2", borderRadius: 1, border: "1px solid #FECACA", fontSize: 12, color: "#E53935" }}>
              &#9888; {t("onboarding.fixBeforeSave")}
            </Box>
          </Box>
        </SlidePanel>
      </Box>
    </Box>
  );

  // ═══════════════════ S3: VERIFY EMAIL ═══════════════════
  const renderS3 = () => (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <TopBarTA info="Email Client — somchai@siamgroup.co.th" />
      <Box sx={{ flex: 1, pt: 2, bgcolor: "#f0ede6" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "center", p: 2.5 }}>
          <Box sx={{ width: "100%", maxWidth: 560 }}>
            {/* Email client bar */}
            <Box sx={{ bgcolor: "var(--brand-primary, #565DFF)", px: 1.75, py: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8, fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
              &#128231; somchai@siamgroup.co.th &middot; จาก: no-reply@jigsawerp.com
            </Box>
            {/* Email card */}
            <Box sx={{ bgcolor: "white", border: "1px solid #D1D5DB", borderBottomLeftRadius: 8, borderBottomRightRadius: 8, overflow: "hidden" }}>
              <Box sx={{ bgcolor: "var(--brand-primary, #565DFF)", px: 3, py: 2.5, textAlign: "center" }}>
                <Box sx={{ fontSize: 16, fontWeight: 800, color: "white", letterSpacing: 1 }}>&#129513; ERP JIGSAW</Box>
                <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.7)", mt: 0.25 }}>ยืนยันอีเมลของคุณ</Box>
              </Box>
              <Box sx={{ px: 3, py: 2.5 }}>
                <Box sx={{ fontSize: 11, color: "#9CA3AF", mb: 1.75, pb: 1.25, borderBottom: `1px solid ${BORDER}` }}>
                  จาก: no-reply@jigsawerp.com &nbsp;&middot;&nbsp; ถึง: somchai@siamgroup.co.th
                </Box>
                <Box sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>สวัสดีคุณสมชาย,</Box>
                <Box sx={{ fontSize: 14, color: "#4B5563", lineHeight: 1.7, mb: 1.5 }}>
                  ทีม Jigsaw ได้สร้าง <strong style={{ color: TEXT }}>Master Account</strong> สำหรับคุณเรียบร้อยแล้ว<br />
                  กรุณากดปุ่มด้านล่างเพื่อยืนยันอีเมลและตั้งรหัสผ่าน
                </Box>
                <Box sx={{ fontSize: 12, color: "#9CA3AF", mb: 1.5 }}>
                  ลิงก์นี้หมดอายุภายใน <strong style={{ color: "#4B5563" }}>48 ชั่วโมง</strong> และใช้ได้เพียงครั้งเดียว
                </Box>
                <Box
                  component="button"
                  onClick={() => go("s4")}
                  sx={{ width: "100%", py: 1.5, bgcolor: "var(--brand-primary, #565DFF)", "&:hover": { bgcolor: "var(--brand-hover, #4048CC)" }, color: "white", borderRadius: 1, fontSize: 14, fontWeight: 600, transition: "background 200ms", my: 2, border: "none", cursor: "pointer" }}
                >
                  ยืนยันอีเมลและตั้งรหัสผ่าน
                </Box>
                <Box sx={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", mb: 1 }}>หรือคัดลอกลิงก์นี้:</Box>
                <Box sx={{ bgcolor: "#F9FAFB", borderRadius: 1, px: 1.5, py: 1, fontSize: 11, color: "#1D4ED8", fontFamily: "monospace", border: `1px solid ${BORDER}`, wordBreak: "break-all" }}>
                  verify.jigsawerp.com/activate?token=eyJhbGciOiJIUzI1NiIsIn...
                </Box>
              </Box>
              <Box sx={{ px: 3, py: 1.5, bgcolor: "#F9FAFB", borderTop: `1px solid ${BORDER}`, fontSize: 11, color: "#9CA3AF", textAlign: "center", lineHeight: 1.7 }}>
                หากคุณไม่ได้ร้องขอ Account นี้ กรุณาเพิกเฉย<br />
                มีปัญหา? ติดต่อ support@jigsawerp.com &middot; &copy; 2569 ERP Jigsaw
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  // ═══════════════════ S4: SET PASSWORD ═══════════════════
  const renderS4 = () => (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <TopBarTA info="verify.jigsawerp.com" />
      <Box sx={{ flex: 1, bgcolor: BG, display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
        <Box sx={{ bgcolor: "white", borderRadius: 3, border: `1px solid ${BORDER}`, p: 3.5, width: "100%", maxWidth: 400, boxShadow: 6 }}>
          <Box sx={{ width: 52, height: 52, borderRadius: "50%", bgcolor: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1.75, fontSize: 20 }}>
            &#9989;
          </Box>
          <Box component="h2" sx={{ fontSize: 18, fontWeight: 700, textAlign: "center", mb: 0.5 }}>{t("onboarding.emailVerified")}</Box>
          <Box component="p" sx={{ fontSize: 12, color: MUTED, textAlign: "center", lineHeight: 1.7, mb: 2 }}>
            {t("onboarding.setPasswordDesc")}
          </Box>
          <Box sx={{ textAlign: "center", mb: 2.5 }}>
            <Box component="span" sx={{ display: "inline-block", fontSize: 11, px: 1.75, py: 0.5, bgcolor: "#F9FAFB", borderRadius: "9999px", color: MUTED, border: `1px solid ${BORDER}` }}>
              somchai@siamgroup.co.th
            </Box>
          </Box>

          {/* Password field (MUI) */}
          <TextField
            label={t("onboarding.newPassword")}
            size="small"
            fullWidth
            required
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            color={pwStrength === 4 ? "success" : "primary"}
            sx={{ mb: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPw(!showPw)} edge="end">
                    {showPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Strength bar (MUI LinearProgress) */}
          <LinearProgress
            variant="determinate"
            value={pwStrength * 25}
            color={pwStrength >= 3 ? "success" : pwStrength >= 2 ? "warning" : "error"}
            sx={{ height: 4, borderRadius: 2, mb: 0.5 }}
          />
          {pwStrength === 4 && <Typography variant="caption" sx={{ color: "success.main", fontWeight: 600, display: "block", mb: 1 }}>{t("onboarding.pwStrong")}</Typography>}

          {/* Rules */}
          <Box sx={{ bgcolor: "#F9F9F9", borderRadius: 1, p: 1.5, mb: 2 }}>
            {pwChecks.map((r, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.3, color: r.ok ? "success.main" : "#999" }}>
                {r.ok ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: BORDER }} />}
                <Typography variant="caption">{r.label}</Typography>
              </Box>
            ))}
          </Box>

          {/* Confirm password (MUI) */}
          <TextField
            label={t("onboarding.confirmPassword")}
            size="small"
            fullWidth
            required
            type={showConfirmPw ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            color={confirmPassword && confirmPassword === password ? "success" : "primary"}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowConfirmPw(!showConfirmPw)} edge="end">
                    {showConfirmPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={() => go("s5")}
            sx={{ bgcolor: "#565DFF", "&:hover": { bgcolor: "#4349E0" }, py: 1.2, fontWeight: 700, textTransform: "none" }}
          >
            {t("onboarding.setPasswordBtn")}
          </Button>
        </Box>
      </Box>
    </Box>
  );

  // ═══════════════════ S4e: TOKEN EXPIRED ═══════════════════
  const renderS4e = () => (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <TopBarTA info="verify.jigsawerp.com" />
      <Box sx={{ flex: 1, bgcolor: "rgba(254,242,242,0.5)", display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
        <Box sx={{ bgcolor: "white", borderRadius: 3, border: "1px solid #FECACA", p: 3.5, width: "100%", maxWidth: 400, boxShadow: 6 }}>
          <Box sx={{ width: 52, height: 52, borderRadius: "50%", bgcolor: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1.75, fontSize: 20 }}>
            &#9888;&#65039;
          </Box>
          <Box component="h2" sx={{ fontSize: 18, fontWeight: 700, textAlign: "center", mb: 0.5, color: "#E53935" }}>{t("onboarding.linkExpiredTitle")}</Box>
          <Box component="p" sx={{ fontSize: 12, color: MUTED, textAlign: "center", lineHeight: 1.7, mb: 2 }}>
            {t("onboarding.linkExpiredDesc")}
          </Box>
          <Box sx={{ fontSize: 12, color: MUTED, textAlign: "center", mb: 2.5, p: 1.25, bgcolor: "#F9FAFB", borderRadius: 1 }}>
            {t("onboarding.contactForNewLink")}<br />
            <strong>support@jigsawerp.com</strong>
          </Box>
          <Box component="button" sx={{ width: "100%", py: 1.5, bgcolor: "#E53935", "&:hover": { bgcolor: "#B91C1C" }, color: "white", borderRadius: 1, fontSize: 14, fontWeight: 700, transition: "background 200ms", border: "none", cursor: "pointer" }}>
            {t("onboarding.requestNewLink")}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  // ═══════════════════ S5: ACCOUNT DETAIL ═══════════════════
  const renderS5 = () => (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {renderTopBarSA()}
      <Breadcrumb items={[
        { label: "Master Accounts", onClick: () => go("s1") },
        { label: `${selectedAccount.firstName} ${selectedAccount.lastName}` },
      ]} />
      {/* Detail Header */}
      <Box sx={{ px: 2.5, bgcolor: "white", borderBottom: `1px solid ${BORDER}` }}>
        <Box component="h1" sx={{ fontSize: 20, fontWeight: 700, pt: 1.5, pb: 1.25 }}>{t("onboarding.customerInfo")}</Box>
        <Tabs
          value={detailTab}
          onChange={(_, v) => setDetailTab(v)}
          sx={{
            "& .MuiTab-root": { textTransform: "none", fontSize: 13, fontWeight: 600, minHeight: 40 },
            "& .Mui-selected": { color: `${SA_PRIMARY} !important` },
            "& .MuiTabs-indicator": { bgcolor: SA_PRIMARY },
          }}
        >
          <Tab label={t("onboarding.tabGeneral")} value="general" />
          <Tab label={`Tenants (${selectedAccount.tenantUsed}/${selectedAccount.tenantQuota})`} value="tenants" />
          <Tab label={t("onboarding.tabContracts")} value="contracts" />
          <Tab label={t("onboarding.tabHistory")} value="history" />
        </Tabs>
      </Box>
      {/* Detail Body */}
      <Box sx={{ flex: 1, p: 2.5, overflowY: "auto" }}>
        {detailTab === "general" && (
          <>
            {/* General Info Card */}
            <Box sx={{ bgcolor: "white", borderRadius: 2, border: `1px solid ${BORDER}`, p: 2.5, mb: 1.75 }}>
              <Box component="h3" sx={{ fontSize: 14, fontWeight: 700, color: SA_PRIMARY, mb: 1.75 }}>{t("onboarding.tabGeneral")}</Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.75 }}>
                <Box sx={{ position: "relative", "& select, & input": { width: "100%", height: 48, px: 1.75, py: 1.5, fontSize: 15, borderRadius: 1, border: `1.5px solid ${BORDER}`, color: TEXT, outline: "none", bgcolor: "white", "&:focus": { borderColor: SA_PRIMARY } }, "& label": { position: "absolute", top: -8, left: 12, px: 0.5, fontSize: 12, color: MUTED, bgcolor: "white" } }}>
                  <input value={selectedAccount.id} readOnly style={{ backgroundColor: "#F9FAFB", color: "#1D4ED8", fontFamily: "monospace", fontWeight: 600 }} />
                  <label>{t("onboarding.accountCode")}</label>
                </Box>
                <Box sx={{ position: "relative", "& select, & input": { width: "100%", height: 48, px: 1.75, py: 1.5, fontSize: 15, borderRadius: 1, border: `1.5px solid ${BORDER}`, color: TEXT, outline: "none", bgcolor: "white", "&:focus": { borderColor: SA_PRIMARY } }, "& label": { position: "absolute", top: -8, left: 12, px: 0.5, fontSize: 12, color: MUTED, bgcolor: "white" } }}>
                  <select defaultValue={selectedAccount.customerGroup}>
                    <option>ทั่วไป</option><option>ขายส่ง</option><option>ขายปลีก</option><option>VIP</option><option>Founding Partner</option>
                  </select>
                  <label>{t("onboarding.customerGroup")} <Box component="span" sx={{ color: "#E53935" }}>*</Box></label>
                </Box>
                <FloatingField label={t("onboarding.firstName")} value={selectedAccount.firstName} onChange={() => {}} variant="sa" required />
                <FloatingField label={t("onboarding.lastName")} value={selectedAccount.lastName} onChange={() => {}} variant="sa" required />
                <Box sx={{ position: "relative", "& select, & input": { width: "100%", height: 48, px: 1.75, py: 1.5, fontSize: 15, borderRadius: 1, border: `1.5px solid ${BORDER}`, color: TEXT, outline: "none", bgcolor: "white", "&:focus": { borderColor: SA_PRIMARY } }, "& label": { position: "absolute", top: -8, left: 12, px: 0.5, fontSize: 12, color: MUTED, bgcolor: "white" } }}>
                  <select><option>นาย</option><option>นาง</option><option>นางสาว</option></select>
                  <label>{t("onboarding.prefix")} <Box component="span" sx={{ color: "#E53935" }}>*</Box></label>
                </Box>
                <FloatingField label={t("onboarding.position")} value={selectedAccount.position} onChange={() => {}} variant="sa" />
                <FloatingField label={t("onboarding.companyName")} value={selectedAccount.company} onChange={() => {}} variant="sa" />
                <FloatingField label={t("onboarding.emailLabel")} value={selectedAccount.email} onChange={() => {}} variant="sa" required />
                <Box>
                  <Box component="p" sx={{ fontSize: 11, color: MUTED, mb: 0.5, fontWeight: 500 }}>{t("onboarding.phone")}</Box>
                  <Box sx={{ display: "flex", border: `1.5px solid ${BORDER}`, borderRadius: 1, overflow: "hidden" }}>
                    <Box sx={{ px: 1.25, py: 1, bgcolor: "#F9FAFB", borderRight: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 0.5, fontSize: 12, color: MUTED }}>
                      &#127481;&#127469; +66 &#9662;
                    </Box>
                    <input style={{ flex: 1, padding: "8px 12px", fontSize: 14, outline: "none", border: "none" }} defaultValue={selectedAccount.phone} />
                  </Box>
                </Box>
                <Box sx={{ position: "relative", "& select, & input": { width: "100%", height: 48, px: 1.75, py: 1.5, fontSize: 15, borderRadius: 1, border: `1.5px solid ${BORDER}`, color: TEXT, outline: "none", bgcolor: "white", "&:focus": { borderColor: SA_PRIMARY } }, "& label": { position: "absolute", top: -8, left: 12, px: 0.5, fontSize: 12, color: MUTED, bgcolor: "white" } }}>
                  <input value={selectedAccount.emailVerifiedAt || "—"} readOnly style={{ backgroundColor: "#F9FAFB", color: MUTED }} />
                  <label>{t("onboarding.emailVerifiedAt")}</label>
                </Box>
                <Box sx={{ gridColumn: "span 2" }}>
                  <Typography variant="caption" sx={{ color: MUTED, fontWeight: 500, mb: 0.5, display: "block" }}>{t("onboarding.status")}</Typography>
                  <RadioGroup row value={selectedAccount.status}>
                    <FormControlLabel value="กำลังใช้งาน" control={<Radio size="small" sx={{ color: SA_PRIMARY, "&.Mui-checked": { color: SA_PRIMARY } }} />} label={<Typography variant="body2">{locale === "en" ? "Active" : "กำลังใช้งาน"}</Typography>} />
                    <FormControlLabel value="ระงับการใช้งาน" control={<Radio size="small" sx={{ color: SA_PRIMARY, "&.Mui-checked": { color: SA_PRIMARY } }} />} label={<Typography variant="body2">{locale === "en" ? "Suspended" : "ระงับการใช้งาน"}</Typography>} />
                  </RadioGroup>
                </Box>
                <Box sx={{ position: "relative", "& select, & input": { width: "100%", height: 48, px: 1.75, py: 1.5, fontSize: 15, borderRadius: 1, border: `1.5px solid ${BORDER}`, color: TEXT, outline: "none", bgcolor: "white", "&:focus": { borderColor: SA_PRIMARY } }, "& label": { position: "absolute", top: -8, left: 12, px: 0.5, fontSize: 12, color: MUTED, bgcolor: "white" } }}>
                  <input value={`${selectedAccount.createdAt} — ${selectedAccount.createdBy}`} readOnly style={{ backgroundColor: "#F9FAFB", color: MUTED }} />
                  <label>{t("onboarding.registeredAt")}</label>
                </Box>
                <Box sx={{ position: "relative", "& select, & input": { width: "100%", height: 48, px: 1.75, py: 1.5, fontSize: 15, borderRadius: 1, border: `1.5px solid ${BORDER}`, color: TEXT, outline: "none", bgcolor: "white", "&:focus": { borderColor: SA_PRIMARY } }, "& label": { position: "absolute", top: -8, left: 12, px: 0.5, fontSize: 12, color: MUTED, bgcolor: "white" } }}>
                  <input value={`${selectedAccount.updatedAt} — ${selectedAccount.updatedBy}`} readOnly style={{ backgroundColor: "#F9FAFB", color: MUTED }} />
                  <label>{t("onboarding.lastUpdatedAt")}</label>
                </Box>
              </Box>

              {/* SA Actions */}
              <Box sx={{ mt: 1.75, p: 1.5, bgcolor: "rgba(255,107,0,0.05)", borderRadius: 2, border: "1px solid rgba(255,107,0,0.15)" }}>
                <Box component="p" sx={{ fontSize: 11, fontWeight: 600, color: SA_PRIMARY, mb: 1 }}>&#9881; {t("onboarding.saActions")}</Box>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Box component="button" sx={{ px: 1.5, py: 0.75, bgcolor: "white", border: `1px solid ${BORDER}`, borderRadius: 1, fontSize: 12, "&:hover": { bgcolor: "#F9FAFB" }, display: "flex", alignItems: "center", gap: 0.75, transition: "background 200ms", cursor: "pointer" }}>
                    &#128231; {t("onboarding.resetVerifyEmail")}
                  </Box>
                  <Box component="button" sx={{ px: 1.5, py: 0.75, bgcolor: "white", border: "1px solid #E53935", borderRadius: 1, fontSize: 12, color: "#E53935", "&:hover": { bgcolor: "#FEF2F2" }, display: "flex", alignItems: "center", gap: 0.75, transition: "background 200ms", cursor: "pointer" }}>
                    &#128273; {t("onboarding.resetPassword")}
                  </Box>
                </Box>
                <Box component="p" sx={{ fontSize: 11, color: MUTED, mt: 0.75 }}>{t("onboarding.contactWillReceiveEmail")}</Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.25, mt: 1.75 }}>
                <Box component="button" sx={{ px: 2, py: 1, border: `1px solid ${BORDER}`, borderRadius: 2, fontSize: 14, "&:hover": { bgcolor: "#F9FAFB" }, transition: "background 200ms", background: "none", cursor: "pointer" }}>{t("common.cancel")}</Box>
                <Box component="button" sx={{ px: 2, py: 1, bgcolor: SA_PRIMARY, "&:hover": { bgcolor: SA_HOVER }, color: "white", fontSize: 14, borderRadius: 2, fontWeight: 500, transition: "background 200ms", border: "none", cursor: "pointer" }}>{t("common.save")}</Box>
              </Box>
            </Box>

            {/* Tenant Quota Card */}
            <Box sx={{ bgcolor: "white", borderRadius: 2, border: `1px solid ${BORDER}`, p: 2.5 }}>
              <Box component="h3" sx={{ fontSize: 14, fontWeight: 700, color: SA_PRIMARY, mb: 1.75 }}>{t("onboarding.tenantQuotaInfo")}</Box>
              <Box sx={{ bgcolor: "rgba(255,107,0,0.1)", borderRadius: 1, px: 1.5, py: 1, fontSize: 12, color: SA_PRIMARY, border: "1px solid rgba(255,107,0,0.2)" }}>
                Tenant Quota: <strong>{selectedAccount.tenantUsed} / {selectedAccount.tenantQuota} บริษัท</strong> &middot; เหลืออีก {selectedAccount.tenantQuota - selectedAccount.tenantUsed} บริษัทที่สามารถสร้างได้
              </Box>
              {selectedAccount.tenantUsed === 0 ? (
                <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 3, bgcolor: "#FFF7ED", borderRadius: 2, border: "1px solid #FDBA74", gap: 1 }}>
                  <Box component="p" sx={{ fontSize: 14, color: "#EA580C", fontWeight: 500 }}>{t("onboarding.noTenantYet")}</Box>
                  <Box
                    component="button"
                    onClick={() => go("s6")}
                    sx={{ mt: 0.5, px: 2, py: 1, bgcolor: SA_PRIMARY, "&:hover": { bgcolor: SA_HOVER }, color: "white", fontSize: 14, borderRadius: 1, fontWeight: 500, transition: "background 200ms", border: "none", cursor: "pointer" }}
                  >
                    + {t("onboarding.createTenant")}
                  </Box>
                </Box>
              ) : (
                <Box sx={{ mt: 1.5 }}>
                  <Box
                    component="button"
                    onClick={() => go("s6")}
                    sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 1, py: 1.5, border: `1.5px dashed ${SA_PRIMARY}`, borderRadius: 2, bgcolor: "white", fontSize: 14, color: SA_PRIMARY, "&:hover": { bgcolor: "rgba(255,107,0,0.05)" }, transition: "background 200ms", cursor: "pointer" }}
                  >
                    + สร้าง Tenant ใหม่ภายใต้ Account นี้ (เหลือ {selectedAccount.tenantQuota - selectedAccount.tenantUsed} บริษัท)
                  </Box>
                </Box>
              )}
            </Box>
          </>
        )}

        {detailTab === "tenants" && (
          <Box sx={{ bgcolor: "white", borderRadius: 2, border: `1px solid ${BORDER}`, p: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
              <Box component="h3" sx={{ fontSize: 14, fontWeight: 700, color: SA_PRIMARY }}>{t("onboarding.tenantsUnderAccount")}</Box>
              <Box component="span" sx={{ fontSize: 12, color: MUTED }}>{selectedAccount.tenantUsed} {t("onboarding.ofCompanies")} {selectedAccount.tenantQuota} {t("onboarding.company")}</Box>
            </Box>
            <Box sx={{ bgcolor: "rgba(255,107,0,0.1)", borderRadius: 1, px: 1.5, py: 1, fontSize: 12, color: SA_PRIMARY, border: "1px solid rgba(255,107,0,0.2)", mb: 1.5 }}>
              จำนวนธุรกิจ (Tenant Quota): <strong>{selectedAccount.tenantUsed} / {selectedAccount.tenantQuota} บริษัท</strong> ใช้ไปแล้ว &middot; เหลืออีก {selectedAccount.tenantQuota - selectedAccount.tenantUsed} บริษัท
            </Box>
            {selectedAccount.tenantUsed > 0 && (
              <Box sx={{ border: `1px solid ${BORDER}`, borderRadius: 2, p: 1.75, display: "flex", alignItems: "center", gap: 1.5, mb: 1, "&:hover": { borderColor: SA_PRIMARY, bgcolor: "rgba(255,107,0,0.05)" }, cursor: "pointer", transition: "all 200ms" }}>
                <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: "rgba(255,107,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: SA_PRIMARY, flexShrink: 0 }}>ST</Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ fontSize: 14, fontWeight: 600 }}>บริษัท สยามเทรด จำกัด</Box>
                  <Box sx={{ fontSize: 11, color: MUTED, mt: 0.25 }}>siamtrade.jigsawerp.com &middot; Cloud &middot; MD-1–11, MD-12</Box>
                </Box>
                <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.25, py: 0.5, borderRadius: "9999px", fontSize: 11, fontWeight: 600, bgcolor: "#FFF7ED", color: "#EA580C" }}>
                  <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "currentColor" }} />
                  รอ Setup Wizard
                </Box>
              </Box>
            )}
            <Box
              component="button"
              onClick={() => go("s6")}
              sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 1, py: 1.5, border: `1.5px dashed ${SA_PRIMARY}`, borderRadius: 2, bgcolor: "white", fontSize: 14, color: SA_PRIMARY, "&:hover": { bgcolor: "rgba(255,107,0,0.05)" }, transition: "background 200ms", mt: 0.5, cursor: "pointer" }}
            >
              + สร้าง Tenant ใหม่ภายใต้ Account นี้ (เหลือ {selectedAccount.tenantQuota - selectedAccount.tenantUsed} บริษัท)
            </Box>
          </Box>
        )}

        {(detailTab === "contracts" || detailTab === "history") && (
          <Box sx={{ bgcolor: "white", borderRadius: 2, border: `1px solid ${BORDER}`, p: 5, textAlign: "center" }}>
            <Box component="p" sx={{ color: MUTED, fontSize: 14 }}>{t("common.noData")}</Box>
          </Box>
        )}
      </Box>
    </Box>
  );

  // ═══════════════════ S6: CREATE TENANT FORM ═══════════════════
  const renderS6 = () => (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {renderTopBarSA()}
      <Breadcrumb items={[
        { label: "Master Accounts", onClick: () => go("s1") },
        { label: selectedAccount.firstName, onClick: () => go("s5") },
        { label: t("onboarding.createTenant") },
      ]} />
      <Box sx={{ flex: 1, position: "relative" }}>
        <SlidePanel
          open={true}
          title={`สร้าง Tenant ใหม่ — Tenant #${selectedAccount.tenantUsed + 1}`}
          onClose={() => go("s5")}
          headerColor="sa"
          width={500}
          footer={
            <>
              <Box component="button" onClick={() => go("s5")} sx={{ px: 2, py: 1, border: `1px solid ${BORDER}`, borderRadius: 2, fontSize: 14, "&:hover": { bgcolor: "#F9FAFB" }, transition: "background 200ms", background: "none", cursor: "pointer" }}>
                {t("common.cancel")}
              </Box>
              <Box component="button" onClick={() => go("s7")} sx={{ px: 2, py: 1, bgcolor: SA_PRIMARY, "&:hover": { bgcolor: SA_HOVER }, color: "white", fontSize: 14, borderRadius: 2, fontWeight: 500, transition: "background 200ms", border: "none", cursor: "pointer" }}>
                {t("common.save")}
              </Box>
            </>
          }
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {/* Section: ข้อมูลนิติบุคคล */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 0.5 }}>
              <Box component="span" sx={{ fontSize: 12, fontWeight: 600, color: MUTED, whiteSpace: "nowrap" }}>{t("onboarding.entityInfo")}</Box>
              <Box sx={{ flex: 1, height: "1px", bgcolor: BORDER }} />
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
              <FloatingField label={t("onboarding.companyNameTh")} value={tenantForm.nameTh} onChange={(v) => setTenantForm({ ...tenantForm, nameTh: v })} variant="sa" required />
              <FloatingField label={t("onboarding.companyNameEn")} value={tenantForm.nameEn} onChange={(v) => setTenantForm({ ...tenantForm, nameEn: v })} variant="sa" required />
              <Box sx={{ position: "relative", "& select, & input": { width: "100%", height: 48, px: 1.75, py: 1.5, fontSize: 15, borderRadius: 1, border: `1.5px solid ${BORDER}`, color: TEXT, outline: "none", bgcolor: "white", "&:focus": { borderColor: SA_PRIMARY } }, "& label": { position: "absolute", top: -8, left: 12, px: 0.5, fontSize: 12, color: MUTED, bgcolor: "white" } }}>
                <select value={tenantForm.entityType} onChange={(e) => setTenantForm({ ...tenantForm, entityType: e.target.value })}>
                  <option>บริษัทจำกัด (บจ.)</option><option>ห้างหุ้นส่วนจำกัด (หจก.)</option><option>บริษัทมหาชน (บมจ.)</option>
                </select>
                <label>{t("onboarding.entityType")} <Box component="span" sx={{ color: "#E53935" }}>*</Box></label>
              </Box>
              <Box sx={{ position: "relative", "& select, & input": { width: "100%", height: 48, px: 1.75, py: 1.5, fontSize: 15, borderRadius: 1, border: `1.5px solid ${BORDER}`, color: TEXT, outline: "none", bgcolor: "white", "&:focus": { borderColor: SA_PRIMARY } }, "& label": { position: "absolute", top: -8, left: 12, px: 0.5, fontSize: 12, color: MUTED, bgcolor: "white" } }}>
                <select value={tenantForm.businessType} onChange={(e) => setTenantForm({ ...tenantForm, businessType: e.target.value })}>
                  <option>Trading — ซื้อมาขายไป</option><option>Manufacturing — ผลิต</option><option>Service — บริการ</option>
                </select>
                <label>{t("onboarding.businessType")} <Box component="span" sx={{ color: "#E53935" }}>*</Box></label>
              </Box>
              <FloatingField label={t("onboarding.taxId")} value={tenantForm.taxId} onChange={(v) => setTenantForm({ ...tenantForm, taxId: v })} variant="sa" required />
              <Box>
                <Box component="p" sx={{ fontSize: 11, color: MUTED, mb: 0.5, fontWeight: 500 }}>Subdomain <Box component="span" sx={{ color: "#E53935" }}>*</Box></Box>
                <Box sx={{ display: "flex", border: "1.5px solid #22C55E", borderRadius: 1, overflow: "hidden" }}>
                  <input
                    style={{ flex: 1, padding: "8px 10px", fontSize: 14, outline: "none", border: "none" }}
                    value={tenantForm.subdomain}
                    onChange={(e) => setTenantForm({ ...tenantForm, subdomain: e.target.value })}
                  />
                  <Box sx={{ px: 1.25, py: 1, bgcolor: "#F9FAFB", borderLeft: `1px solid ${BORDER}`, fontSize: 12, color: MUTED, whiteSpace: "nowrap" }}>
                    .jigsawerp.com
                  </Box>
                </Box>
                <Box component="p" sx={{ fontSize: 10, color: "#E53935", mt: 0.5, pl: 0.25 }}>&#128274; Lock ถาวรหลัง Save</Box>
              </Box>
            </Box>

            {/* Section: Package & Quota */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mt: 2, mb: 0.5 }}>
              <Box component="span" sx={{ fontSize: 12, fontWeight: 600, color: MUTED, whiteSpace: "nowrap" }}>Package & Quota</Box>
              <Box sx={{ flex: 1, height: "1px", bgcolor: BORDER }} />
            </Box>

            {/* Deployment Tier */}
            <Box sx={{ bgcolor: "#F9FAFB", border: `1px solid ${BORDER}`, borderRadius: 1, p: 1.5 }}>
              <Box component="p" sx={{ fontSize: 11, fontWeight: 700, color: MUTED, mb: 1, display: "flex", alignItems: "center", gap: 0.75 }}>
                <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: SA_PRIMARY }} />
                Deployment Tier
              </Box>
              <ToggleButtonGroup
                value={tenantForm.tier}
                exclusive
                onChange={(_, v) => v && setTenantForm({ ...tenantForm, tier: v })}
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1 }}
              >
                {(["Cloud", "Dedicated", "On-premise"] as const).map((tier) => {
                  const subs = { Cloud: "Shared · Huawei", Dedicated: "Private · Huawei", "On-premise": "Server ลูกค้า" };
                  return (
                    <ToggleButton key={tier} value={tier} sx={{ textTransform: "none", flexDirection: "column", alignItems: "flex-start", p: 1.5, "&.Mui-selected": { bgcolor: "#FF6B00/10", borderColor: SA_PRIMARY } }}>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{tier}</Typography>
                      <Typography variant="caption" sx={{ color: "#999", fontSize: 10 }}>{subs[tier]}</Typography>
                    </ToggleButton>
                  );
                })}
              </ToggleButtonGroup>
            </Box>

            {/* Resource Quota */}
            <Box sx={{ bgcolor: "#F9FAFB", border: `1px solid ${BORDER}`, borderRadius: 1, p: 1.5 }}>
              <Box component="p" sx={{ fontSize: 11, fontWeight: 700, color: MUTED, mb: 1, display: "flex", alignItems: "center", gap: 0.75 }}>
                <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: SA_PRIMARY }} />
                Resource Quota
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1 }}>
                {[
                  { key: "quotaUser", label: "User", unit: "คน" },
                  { key: "quotaBranch", label: "Branch", unit: "สาขา" },
                  { key: "quotaWarehouse", label: "Warehouse", unit: "คลัง" },
                  { key: "quotaStorage", label: "Storage", unit: "GB" },
                  { key: "quotaAuditLog", label: "Audit Log", unit: "เดือน" },
                  { key: "quotaOnboarding", label: "Onboarding", unit: "ชม." },
                ].map((q) => (
                  <Box key={q.key} sx={{ border: `1px solid ${BORDER}`, borderRadius: 1, p: 1, bgcolor: "white" }}>
                    <Box sx={{ fontSize: 10, color: "#9CA3AF", mb: 0.5 }}>{q.label}</Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <input
                        style={{ padding: "4px 6px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 12, width: 56, outline: "none" }}
                        value={(tenantForm as unknown as Record<string, string>)[q.key]}
                        onChange={(e) => setTenantForm({ ...tenantForm, [q.key]: e.target.value })}
                      />
                      <Box component="span" sx={{ fontSize: 11, color: MUTED }}>{q.unit}</Box>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: "flex", gap: 0.75, p: 1, bgcolor: "#FFF7ED", borderRadius: 1, fontSize: 11, color: "#EA580C", mt: 1, border: "1px solid #FDBA74" }}>
                &#9888; แจ้งเตือนอัตโนมัติที่ 80% และ 100% — ไม่บล็อกการใช้งาน
              </Box>
            </Box>

            {/* Backup Frequency */}
            <Box sx={{ bgcolor: "#F9FAFB", border: `1px solid ${BORDER}`, borderRadius: 1, p: 1.5 }}>
              <Box component="p" sx={{ fontSize: 11, fontWeight: 700, color: MUTED, mb: 1, display: "flex", alignItems: "center", gap: 0.75 }}>
                <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: SA_PRIMARY }} />
                Backup Frequency
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <input
                  style={{ padding: "6px 8px", border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12, width: 64, outline: "none" }}
                  value={tenantForm.backupFreq}
                  onChange={(e) => setTenantForm({ ...tenantForm, backupFreq: e.target.value })}
                />
                <ToggleButtonGroup
                  value={tenantForm.backupUnit}
                  exclusive
                  onChange={(_, v) => v && setTenantForm({ ...tenantForm, backupUnit: v })}
                  size="small"
                >
                  <ToggleButton value="ชั่วโมง" sx={{ textTransform: "none", fontSize: 11, px: 2 }}>ชั่วโมง</ToggleButton>
                  <ToggleButton value="วัน" sx={{ textTransform: "none", fontSize: 11, px: 2 }}>วัน</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>

            {/* Modules */}
            <Box sx={{ bgcolor: "#F9FAFB", border: `1px solid ${BORDER}`, borderRadius: 1, p: 1.5 }}>
              <Box component="p" sx={{ fontSize: 11, fontWeight: 700, color: MUTED, mb: 1, display: "flex", alignItems: "center", gap: 0.75 }}>
                <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: SA_PRIMARY }} />
                Modules (สัญญาที่ 1)
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0.75 }}>
                {moduleStates.map((m, i) => (
                  <Box
                    component="button"
                    key={m.id}
                    onClick={() => {
                      if (m.status === "locked") return;
                      const next = [...moduleStates];
                      next[i] = { ...m, status: m.status === "on" ? "off" : "on" };
                      setModuleStates(next);
                    }}
                    sx={{
                      display: "flex", alignItems: "center", gap: 0.75, px: 1, py: 0.75, border: "1px solid", borderRadius: 1, fontSize: 11, transition: "all 200ms", cursor: m.status === "locked" ? "default" : "pointer", background: "none",
                      ...(m.status === "locked"
                        ? { bgcolor: "#F3F4F6", color: MUTED, borderColor: BORDER }
                        : m.status === "on"
                        ? { bgcolor: "rgba(255,107,0,0.1)", borderColor: "rgba(255,107,0,0.3)", color: SA_PRIMARY }
                        : { bgcolor: "white", color: MUTED, borderColor: BORDER, "&:hover": { borderColor: SA_PRIMARY } }),
                    }}
                  >
                    <Box component="span" sx={{
                      width: 12, height: 12, borderRadius: "2px", border: "1.5px solid", flexShrink: 0,
                      ...(m.status === "locked"
                        ? { bgcolor: "#D1D5DB", borderColor: "#D1D5DB" }
                        : m.status === "on"
                        ? { bgcolor: SA_PRIMARY, borderColor: SA_PRIMARY }
                        : { borderColor: BORDER }),
                    }} />
                    <Box component="span" sx={{ flex: 1, textAlign: "left" }}>{m.id} {m.name}</Box>
                    <Box component="span" sx={{
                      width: 16, height: 16, borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10,
                      ...(m.status === "on" ? { bgcolor: "rgba(255,107,0,0.2)", color: SA_PRIMARY } : { bgcolor: "#F3F4F6", color: MUTED }),
                      ...(m.status === "off" ? { opacity: 0.3 } : {}),
                    }}>
                      &#9881;
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Contract */}
            <Box sx={{ bgcolor: "#F9FAFB", border: `1px solid ${BORDER}`, borderRadius: 1, p: 1.5 }}>
              <Box component="p" sx={{ fontSize: 11, fontWeight: 700, color: MUTED, mb: 1, display: "flex", alignItems: "center", gap: 0.75 }}>
                <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: SA_PRIMARY }} />
                {t("onboarding.tabContracts")}
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                <FloatingField label={t("onboarding.contractStart")} value={tenantForm.contractStart} onChange={(v) => setTenantForm({ ...tenantForm, contractStart: v })} variant="sa" required />
                <FloatingField label={t("onboarding.contractEnd")} value={tenantForm.contractEnd} onChange={(v) => setTenantForm({ ...tenantForm, contractEnd: v })} variant="sa" required />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ color: MUTED, fontWeight: 500, mb: 0.5, display: "block" }}>Auto-renewal</Typography>
                <RadioGroup
                  row
                  value={tenantForm.autoRenewal ? "yes" : "no"}
                  onChange={(e) => setTenantForm({ ...tenantForm, autoRenewal: e.target.value === "yes" })}
                >
                  <FormControlLabel value="yes" control={<Radio size="small" sx={{ color: SA_PRIMARY, "&.Mui-checked": { color: SA_PRIMARY } }} />} label={<Typography variant="body2">{t("onboarding.autoRenewalYes")}</Typography>} />
                  <FormControlLabel value="no" control={<Radio size="small" sx={{ color: SA_PRIMARY, "&.Mui-checked": { color: SA_PRIMARY } }} />} label={<Typography variant="body2">{t("onboarding.autoRenewalNo")}</Typography>} />
                </RadioGroup>
              </Box>
              <Box sx={{ display: "flex", gap: 0.75, p: 1, bgcolor: "#F0FDF4", borderRadius: 1, fontSize: 11, color: "#15803D", mt: 1.5, border: "1px solid #BBF7D0" }}>
                &#10003; เมื่อกดบันทึก ระบบจะสร้างสัญญาที่ 1 อัตโนมัติ และส่ง Welcome Email ให้ TA
              </Box>
            </Box>
          </Box>
        </SlidePanel>
      </Box>
    </Box>
  );

  // ═══════════════════ S7: WELCOME EMAIL ═══════════════════
  const renderS7 = () => (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <TopBarTA info="Email Client — somchai@siamgroup.co.th" />
      <Box sx={{ flex: 1, pt: 2, bgcolor: "#f0ede6" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "center", p: 2.5 }}>
          <Box sx={{ width: "100%", maxWidth: 560 }}>
            <Box sx={{ bgcolor: "var(--brand-primary, #565DFF)", px: 1.75, py: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8, fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
              &#128231; somchai@siamgroup.co.th &middot; จาก: no-reply@jigsawerp.com
            </Box>
            <Box sx={{ bgcolor: "white", border: "1px solid #D1D5DB", borderBottomLeftRadius: 8, borderBottomRightRadius: 8, overflow: "hidden" }}>
              <Box sx={{ bgcolor: "#15803D", px: 3, py: 2.5, textAlign: "center" }}>
                <Box sx={{ fontSize: 16, fontWeight: 800, color: "white", letterSpacing: 1 }}>&#129513; ERP JIGSAW</Box>
                <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.7)", mt: 0.25 }}>ยินดีต้อนรับ! ระบบของคุณพร้อมแล้ว &#127881;</Box>
              </Box>
              <Box sx={{ px: 3, py: 2.5 }}>
                <Box sx={{ fontSize: 11, color: "#9CA3AF", mb: 1.75, pb: 1.25, borderBottom: `1px solid ${BORDER}` }}>
                  จาก: no-reply@jigsawerp.com &nbsp;&middot;&nbsp; ถึง: somchai@siamgroup.co.th
                </Box>
                <Box sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>สวัสดีคุณสมชาย,</Box>
                <Box sx={{ fontSize: 14, color: "#4B5563", lineHeight: 1.7, mb: 1.5 }}>
                  ยินดีต้อนรับสู่ <strong style={{ color: TEXT }}>ERP Jigsaw!</strong><br />
                  บัญชีสำหรับ <strong style={{ color: TEXT }}>บริษัท สยามเทรด จำกัด</strong> ถูกสร้างเรียบร้อยแล้ว
                </Box>
                <Box sx={{ bgcolor: "#F9FAFB", borderRadius: 1, p: 1.5, mb: 1.5, border: `1px solid ${BORDER}` }}>
                  <Box sx={{ fontSize: 11, color: "#9CA3AF", mb: 0.75 }}>ข้อมูล Tenant ของคุณ</Box>
                  <Box sx={{ fontSize: 14, fontWeight: 700 }}>บริษัท สยามเทรด จำกัด</Box>
                  <Box sx={{ bgcolor: "#F3F4F6", borderRadius: 1, px: 1.5, py: 1, fontSize: 11, color: "#1D4ED8", fontFamily: "monospace", mt: 1, mb: 0.5, border: `1px solid ${BORDER}` }}>
                    siamtrade.jigsawerp.com
                  </Box>
                  <Box sx={{ fontSize: 11, color: MUTED }}>Cloud &middot; MD-1–11 + MD-12 Backoffice &middot; สัญญาที่ 1</Box>
                </Box>
                <Box sx={{ fontSize: 14, color: "#4B5563", lineHeight: 1.7, mb: 0.5 }}>
                  กรุณากดปุ่มด้านล่างเพื่อเข้าสู่ระบบและทำ Setup Wizard
                </Box>
                <Box sx={{ fontSize: 12, color: "#9CA3AF", mb: 1.5 }}>(ใช้รหัสผ่านที่ตั้งไว้ในขั้นตอนก่อนหน้า)</Box>
                <Box
                  component="button"
                  onClick={() => { setShowToast(true); go("s8"); }}
                  sx={{ width: "100%", py: 1.5, bgcolor: "#15803D", "&:hover": { bgcolor: "#166534" }, color: "white", borderRadius: 1, fontSize: 14, fontWeight: 600, transition: "background 200ms", border: "none", cursor: "pointer" }}
                >
                  เข้าสู่ระบบและเริ่ม Setup Wizard &#8594;
                </Box>
              </Box>
              <Box sx={{ px: 3, py: 1.5, bgcolor: "#F9FAFB", borderTop: `1px solid ${BORDER}`, fontSize: 11, color: "#9CA3AF", textAlign: "center", lineHeight: 1.7 }}>
                มีปัญหา? ติดต่อ support@jigsawerp.com &middot; &copy; 2569 ERP Jigsaw
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  // ═══════════════════ S8: TENANT LIST (POST-CREATE) ═══════════════════
  const renderS8 = () => (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {renderTopBarSA()}
      {/* Success toast */}
      {showToast && (
        <Box sx={{ bgcolor: "#F0FDF4", color: "#15803D", borderBottom: "1px solid #BBF7D0", px: 2, py: 1.25, fontSize: 12, display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
          &#9989; <strong>สร้าง Tenant สำเร็จ!</strong> ส่ง Welcome Email ให้ somchai@siamgroup.co.th แล้ว
        </Box>
      )}
      <Breadcrumb items={[
        { label: t("onboarding.masterAccountList"), onClick: () => go("s1") },
        { label: "สมชาย วงศ์ใหญ่" },
      ]} />
      {/* Detail Header */}
      <Box sx={{ px: 2.5, bgcolor: "white", borderBottom: `1px solid ${BORDER}` }}>
        <Box component="h1" sx={{ fontSize: 20, fontWeight: 700, pt: 1.5, pb: 1.25 }}>{t("onboarding.customerInfo")}</Box>
        <Box sx={{ display: "flex", gap: 0 }}>
          <Box component="button" sx={{ px: 2, py: 1, fontSize: 14, fontWeight: 500, color: MUTED, "&:hover": { color: TEXT }, borderTopLeftRadius: 8, borderTopRightRadius: 8, transition: "color 200ms", border: "none", background: "none", cursor: "pointer" }}>
            {t("onboarding.tabGeneral")}
          </Box>
          <Box component="button" sx={{ px: 2, py: 1, fontSize: 14, fontWeight: 500, bgcolor: SA_PRIMARY, color: "white", borderTopLeftRadius: 8, borderTopRightRadius: 8, transition: "background 200ms", border: "none", cursor: "pointer" }}>
            Tenants (1/3)
          </Box>
          <Box component="button" sx={{ px: 2, py: 1, fontSize: 14, fontWeight: 500, color: MUTED, "&:hover": { color: TEXT }, borderTopLeftRadius: 8, borderTopRightRadius: 8, transition: "color 200ms", border: "none", background: "none", cursor: "pointer" }}>
            {t("onboarding.tabContracts")}
          </Box>
          <Box component="button" sx={{ px: 2, py: 1, fontSize: 14, fontWeight: 500, color: MUTED, "&:hover": { color: TEXT }, borderTopLeftRadius: 8, borderTopRightRadius: 8, transition: "color 200ms", border: "none", background: "none", cursor: "pointer" }}>
            {t("onboarding.tabHistory")}
          </Box>
        </Box>
      </Box>
      {/* Body */}
      <Box sx={{ flex: 1, p: 2.5 }}>
        <Box sx={{ bgcolor: "white", borderRadius: 2, border: `1px solid ${BORDER}`, p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Box component="h3" sx={{ fontSize: 14, fontWeight: 700, color: SA_PRIMARY }}>{t("onboarding.tenantsUnderAccount")}</Box>
            <Box component="span" sx={{ fontSize: 12, color: MUTED }}>1 {t("onboarding.ofCompanies")} 3 {t("onboarding.company")}</Box>
          </Box>
          <Box sx={{ bgcolor: "rgba(255,107,0,0.1)", borderRadius: 1, px: 1.5, py: 1, fontSize: 12, color: SA_PRIMARY, border: "1px solid rgba(255,107,0,0.2)", mb: 1.5 }}>
            จำนวนธุรกิจ (Tenant Quota): <strong>1 / 3 บริษัท</strong> ใช้ไปแล้ว &middot; เหลืออีก 2 บริษัท
          </Box>
          {/* Tenant item */}
          <Box sx={{ border: `1px solid ${BORDER}`, borderRadius: 2, p: 1.75, display: "flex", alignItems: "center", gap: 1.5, mb: 1, "&:hover": { borderColor: SA_PRIMARY, bgcolor: "rgba(255,107,0,0.05)" }, cursor: "pointer", transition: "all 200ms" }}>
            <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: "rgba(255,107,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: SA_PRIMARY, flexShrink: 0 }}>ST</Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ fontSize: 14, fontWeight: 600 }}>บริษัท สยามเทรด จำกัด</Box>
              <Box sx={{ fontSize: 11, color: MUTED, mt: 0.25 }}>siamtrade.jigsawerp.com &middot; Cloud &middot; MD-1–11, MD-12</Box>
            </Box>
            <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.25, py: 0.5, borderRadius: "9999px", fontSize: 11, fontWeight: 600, bgcolor: "#FFF7ED", color: "#EA580C" }}>
              <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "currentColor" }} />
              รอ Setup Wizard
            </Box>
          </Box>
          <Box
            component="button"
            onClick={() => go("s6")}
            sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 1, py: 1.5, border: `1.5px dashed ${SA_PRIMARY}`, borderRadius: 2, bgcolor: "white", fontSize: 14, color: SA_PRIMARY, "&:hover": { bgcolor: "rgba(255,107,0,0.05)" }, transition: "background 200ms", mt: 0.5, cursor: "pointer" }}
          >
            + สร้าง Tenant ใหม่ภายใต้ Account นี้ (เหลือ 2 บริษัท)
          </Box>
        </Box>

        <Box sx={{ mt: 2, display: "inline-flex", alignItems: "center", gap: 1, px: 1.5, py: 0.75, bgcolor: "rgba(20,83,45,0.8)", color: "#86EFAC", borderRadius: 2, fontSize: 11 }}>
          &#10003; F-01 จบ &#8594; F-02 Setup Wizard
        </Box>
      </Box>
    </Box>
  );

  // ═══════════════════ RENDER ROUTER ═══════════════════
  const screens: Record<Screen, () => JSX.Element> = {
    s1: renderS1, s2: renderS2, s2e: renderS2e, s3: renderS3,
    s4: renderS4, s4e: renderS4e, s5: renderS5, s6: renderS6,
    s7: renderS7, s8: renderS8,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navItems: { id: Screen; num: string; label: string; section?: string }[] = [
    { id: "s1", num: "01", label: t("onboarding.navMasterList"), section: t("onboarding.navStep1") },
    { id: "s2", num: "02", label: t("onboarding.navCreateForm") },
    { id: "s2e", num: "02e", label: t("onboarding.navErrorEmail") },
    { id: "s3", num: "03", label: t("onboarding.navEmailVerify"), section: t("onboarding.navStep2") },
    { id: "s4", num: "04", label: t("onboarding.navSetPassword") },
    { id: "s4e", num: "04e", label: t("onboarding.navTokenExpired") },
    { id: "s5", num: "05", label: t("onboarding.navAccountDetail"), section: t("onboarding.navStep3") },
    { id: "s6", num: "06", label: t("onboarding.navCreateTenantForm") },
    { id: "s7", num: "07", label: t("onboarding.navEmailWelcome") },
    { id: "s8", num: "08", label: t("onboarding.navTenantDone") },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: BG, display: "flex" }}>
      {/* Sidebar — Figma Menu Drawer (expanded=260px, collapsed=68px icons only) */}
      <Box sx={{ position: "fixed", height: "100vh", zIndex: 50, bgcolor: "white", borderRight: `1px solid ${BORDER}`, transition: "all 300ms", width: sidebarExpanded ? 260 : 68 }}>

        {/* === Collapsed: Icon-only bar (68px) === */}
        {!sidebarExpanded && (
          <Box sx={{ width: 68, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", py: 1.5, gap: 0.5 }}>
            {/* Logo */}
            <Box sx={{ width: 40, height: 40, borderRadius: 3, bgcolor: SA_PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", mb: 0.25 }} onClick={() => setSidebarExpanded(true)}>
              <Box component="span" sx={{ fontSize: 7, fontWeight: 800, color: "white", lineHeight: 1.2, textAlign: "center" }}>JIG<br/>SAW</Box>
            </Box>
            <Box component="span" sx={{ fontSize: 8, fontWeight: 700, color: SA_PRIMARY, letterSpacing: 2, mb: 1 }}>JIGSAW</Box>

            {/* Home (active) */}
            <Box component="button" onClick={() => router.push("/home")} sx={{ width: 44, height: 44, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(255,107,0,0.1)", transition: "background 200ms", border: "none", cursor: "pointer" }} title={t("nav.home")}>
              <img src="/icons/commerce/home.svg" alt="" width={24} height={24} style={{ filter: "brightness(0) saturate(100%) invert(45%) sepia(96%) saturate(1500%) hue-rotate(360deg)" }} />
            </Box>

            {/* Divider */}
            <Box sx={{ width: 24, height: "1px", bgcolor: BORDER, my: 0.75 }} />

            {/* ลูกค้า */}
            <Box component="button" onClick={() => { setSidebarExpanded(true); setMenuOpen(prev => ({ ...prev, customer: true })); }} sx={{ width: 44, height: 44, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", "&:hover": { bgcolor: "#F3F4F6" }, transition: "background 200ms", border: "none", cursor: "pointer", background: "none" }} title={t("onboarding.customer")}>
              <img src="/icons/data/user-id.svg" alt="" width={24} height={24} />
            </Box>

            {/* รายงาน */}
            <Box component="button" onClick={() => { setSidebarExpanded(true); setMenuOpen(prev => ({ ...prev, reports: true })); }} sx={{ width: 44, height: 44, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", "&:hover": { bgcolor: "#F3F4F6" }, transition: "background 200ms", border: "none", cursor: "pointer", background: "none" }} title={locale === "en" ? "Reports" : "รายงาน"}>
              <img src="/icons/data/graph-up.svg" alt="" width={24} height={24} />
            </Box>

            {/* Divider */}
            <Box sx={{ width: 24, height: "1px", bgcolor: BORDER, my: 0.75 }} />

            {/* ตั้งค่า */}
            <Box component="button" onClick={() => { setSidebarExpanded(true); setMenuOpen(prev => ({ ...prev, settings: true })); }} sx={{ width: 44, height: 44, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", "&:hover": { bgcolor: "#F3F4F6" }, transition: "background 200ms", border: "none", cursor: "pointer", background: "none" }} title={t("nav.settings")}>
              <img src="/icons/commerce/settings.svg" alt="" width={24} height={24} />
            </Box>
          </Box>
        )}

        {/* === Expanded: Full menu (260px) === */}
        {sidebarExpanded && (
        <Box sx={{ width: 260, height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Logo + Collapse */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1.5, borderBottom: "1px solid #F3F4F6" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }} onClick={() => router.push("/")}>
              <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: SA_PRIMARY, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Box component="span" sx={{ fontSize: 7, fontWeight: 800, color: "white", lineHeight: 1.2, textAlign: "center" }}>JIG<br/>SAW</Box>
              </Box>
              <Box component="span" sx={{ fontSize: 18, fontWeight: 800, letterSpacing: 2, color: SA_PRIMARY }}>JIGSAW</Box>
            </Box>
            <Box component="button" onClick={() => setSidebarExpanded(false)} sx={{ color: "#9CA3AF", "&:hover": { color: "#4B5563" }, fontSize: 14, border: "none", background: "none", cursor: "pointer" }}>&laquo;</Box>
          </Box>

          {/* Menu Items — Sarabun Regular 16px */}
          <Box sx={{ flex: 1, overflowY: "auto", py: 1, px: 1.5 }} style={{ fontFamily: "'Sarabun', sans-serif" }}>
            {/* ภาพรวม — icon: home.svg */}
            <Box
              component="button"
              onClick={() => router.push("/home")}
              sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1.25, borderRadius: 2, mb: 0.5, transition: "background 200ms", color: "#374151", "&:hover": { bgcolor: "#F9FAFB" }, border: "none", background: "none", cursor: "pointer" }}
              style={{ fontSize: 16, fontWeight: 400 }}
            >
              <img src="/icons/commerce/home.svg" alt="" width={24} height={24} />
              <Box component="span" sx={{ flex: 1, textAlign: "left" }}>{t("nav.home")}</Box>
              <Box component="span" sx={{ fontSize: 10, bgcolor: "#EF4444", color: "white", px: 0.75, py: 0.25, borderRadius: "9999px", fontWeight: 700 }}>New</Box>
            </Box>

            {/* Section: เมนู */}
            <Box sx={{ fontSize: 12, color: "#9CA3AF", fontWeight: 400, px: 1.5, mt: 1.5, mb: 0.75 }}>
              {locale === "en" ? "Menu" : "เมนู"}
            </Box>

            {/* ลูกค้า — icon: user-id.svg */}
            <Box sx={{ mb: 0.5 }}>
              <Box
                component="button"
                onClick={() => setMenuOpen(prev => ({ ...prev, customer: !prev.customer }))}
                sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1.25, borderRadius: 2, color: "#374151", "&:hover": { bgcolor: "#F9FAFB" }, transition: "background 200ms", border: "none", background: "none", cursor: "pointer" }}
                style={{ fontSize: 16, fontWeight: 400 }}
              >
                <img src="/icons/data/user-id.svg" alt="" width={24} height={24} />
                <Box component="span" sx={{ flex: 1, textAlign: "left" }}>{t("onboarding.customer")}</Box>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transition: "transform 200ms", transform: menuOpen.customer ? "rotate(180deg)" : "none" }}><polyline points="6 9 12 15 18 9"/></svg>
              </Box>
              {menuOpen.customer && (
                <Box sx={{ ml: 5, mt: 0.25, display: "flex", flexDirection: "column", gap: 0.25 }}>
                  <Box component="button" onClick={() => go("s1")} sx={{ width: "100%", textAlign: "left", px: 1.5, py: 0.75, borderRadius: 1, transition: "color 200ms", color: screen === "s1" ? SA_PRIMARY : "#6B7280", "&:hover": { color: "#374151" }, border: "none", background: "none", cursor: "pointer" }} style={{ fontSize: 16, fontWeight: 400 }}>
                    • {t("onboarding.masterAccountList")}
                  </Box>
                  <Box component="button" onClick={() => go("s5")} sx={{ width: "100%", textAlign: "left", px: 1.5, py: 0.75, borderRadius: 1, transition: "color 200ms", color: screen === "s5" ? SA_PRIMARY : "#6B7280", "&:hover": { color: "#374151" }, border: "none", background: "none", cursor: "pointer" }} style={{ fontSize: 16, fontWeight: 400 }}>
                    • {locale === "en" ? "All Contracts" : "สัญญาทั้งหมด"}
                  </Box>
                </Box>
              )}
            </Box>

            {/* รายงาน — icon: graph-up.svg — collapsible */}
            <Box sx={{ mb: 0.5 }}>
              <Box
                component="button"
                onClick={() => setMenuOpen(prev => ({ ...prev, reports: !prev.reports }))}
                sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1.25, borderRadius: 2, color: "#374151", "&:hover": { bgcolor: "#F9FAFB" }, transition: "background 200ms", border: "none", background: "none", cursor: "pointer" }}
                style={{ fontSize: 16, fontWeight: 400 }}
              >
                <img src="/icons/data/graph-up.svg" alt="" width={24} height={24} />
                <Box component="span" sx={{ flex: 1, textAlign: "left" }}>{locale === "en" ? "Reports" : "รายงาน"}</Box>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transition: "transform 200ms", transform: menuOpen.reports ? "rotate(180deg)" : "none" }}><polyline points="6 9 12 15 18 9"/></svg>
              </Box>
              {menuOpen.reports && (
                <Box sx={{ ml: 5, mt: 0.25, display: "flex", flexDirection: "column", gap: 0.25 }}>
                  <Box component="button" onClick={() => alert(locale === "en" ? "Reports page coming soon" : "หน้ารายงาน กำลังพัฒนา")} sx={{ width: "100%", textAlign: "left", px: 1.5, py: 0.75, borderRadius: 1, color: "#6B7280", "&:hover": { color: "#374151" }, transition: "color 200ms", border: "none", background: "none", cursor: "pointer" }} style={{ fontSize: 16, fontWeight: 400 }}>
                    • {locale === "en" ? "All Reports" : "รายงานทั้งหมด"}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Section: ตั้งค่า */}
            <Box sx={{ fontSize: 12, color: "#9CA3AF", fontWeight: 400, px: 1.5, mt: 1.5, mb: 0.75 }}>
              {t("nav.settings")}
            </Box>

            {/* ตั้งค่า — icon: settings.svg — collapsible */}
            <Box sx={{ mb: 0.5 }}>
              <Box
                component="button"
                onClick={() => setMenuOpen(prev => ({ ...prev, settings: !prev.settings }))}
                sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1.25, borderRadius: 2, color: "#374151", "&:hover": { bgcolor: "#F9FAFB" }, transition: "background 200ms", border: "none", background: "none", cursor: "pointer" }}
                style={{ fontSize: 16, fontWeight: 400 }}
              >
                <img src="/icons/commerce/settings.svg" alt="" width={24} height={24} />
                <Box component="span" sx={{ flex: 1, textAlign: "left" }}>{t("nav.settings")}</Box>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transition: "transform 200ms", transform: menuOpen.settings ? "rotate(180deg)" : "none" }}><polyline points="6 9 12 15 18 9"/></svg>
              </Box>
              {menuOpen.settings && (
                <Box sx={{ ml: 5, mt: 0.25, display: "flex", flexDirection: "column", gap: 0.25 }}>
                  <Box component="button" onClick={() => alert(locale === "en" ? "User Management coming soon" : "จัดการผู้ใช้งาน กำลังพัฒนา")} sx={{ width: "100%", textAlign: "left", px: 1.5, py: 0.75, borderRadius: 1, color: "#6B7280", "&:hover": { color: "#374151" }, transition: "color 200ms", border: "none", background: "none", cursor: "pointer" }} style={{ fontSize: 16, fontWeight: 400 }}>
                    • {locale === "en" ? "User Management" : "จัดการผู้ใช้งาน"}
                  </Box>
                  <Box component="button" onClick={() => alert(locale === "en" ? "Customer Groups coming soon" : "กลุ่มลูกค้า กำลังพัฒนา")} sx={{ width: "100%", textAlign: "left", px: 1.5, py: 0.75, borderRadius: 1, color: "#6B7280", "&:hover": { color: "#374151" }, transition: "color 200ms", border: "none", background: "none", cursor: "pointer" }} style={{ fontSize: 16, fontWeight: 400 }}>
                    • {locale === "en" ? "Customer Groups" : "กลุ่มลูกค้า"}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Component Showcase ย้ายไป erp-jigsaw-design แล้ว */}
          </Box>
        </Box>
        )}
      </Box>

      {/* Main content */}
      {/* Hamburger is now inside TopBar */}

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: BG, transition: "all 300ms", ml: sidebarExpanded ? "260px" : "68px" }}>
        {/* Outside click overlay — กดข้างนอก sidebar จะหุบ */}
        {sidebarExpanded && (
          <Box sx={{ position: "fixed", inset: 0, zIndex: 45 }} onClick={() => setSidebarExpanded(false)} />
        )}
        {screens[screen]()}
      </Box>
    </Box>
  );
}
