"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from "next/image";
import SlidePanel from "@/components/layout/SlidePanel";
import FloatingField from "@/components/layout/FloatingField";
import FormDialog from "@/components/ui/FormDialog";
import { masterAccounts, MasterAccount, sampleTenantDetail } from "@/data/mock";
import { useLocale } from "@/lib/locale";
import { useAuth } from "@/lib/auth";
import { TextField, MenuItem, Button, Stack, Alert, Chip, IconButton, LinearProgress, Typography, Box, Tabs, Tab, Radio, RadioGroup, FormControlLabel, ToggleButtonGroup, ToggleButton, Paper, Menu } from "@mui/material";
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
  const [selectedAccount, setSelectedAccount] = useState<MasterAccount>(masterAccounts[0]);
  const [showToast, setShowToast] = useState(false);
  const [meatballAnchor, setMeatballAnchor] = useState<null | HTMLElement>(null);
  const [meatballRow, setMeatballRow] = useState<MasterAccount | null>(null);

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

  const filtered = masterAccounts.filter(
    (a) =>
      a.firstName.includes(search) ||
      a.lastName.includes(search) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase())
  );

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
    <div className="h-[52px] bg-sa-primary flex items-center px-4 gap-3 shrink-0">
      <button onClick={() => setSidebarExpanded(prev => !prev)} className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors cursor-pointer">
        <svg width={20} height={20} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} fill="none"><path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" /></svg>
      </button>
      <div className="text-xs text-white/70 flex-1">
        <strong className="text-white">Server: Prod</strong> | Jigsaw Admin
      </div>
      <div className="flex items-center gap-3">
        <span className="text-white text-sm">&#9993;</span>
        <span className="text-white text-sm relative">
          &#128276;
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-sa-primary" />
        </span>
        <div className="w-px h-5 bg-white/30" />
        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(prev => !prev)}
            className="flex items-center gap-1 text-white text-xs font-medium px-2 py-1 rounded hover:bg-white/10 transition-colors"
          >
            {locale.toUpperCase()} <span className="text-[10px]">▼</span>
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 min-w-[100px]">
              <button
                onClick={() => { setLocale("th"); setLangOpen(false); }}
                className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 transition-colors"
                style={{ color: locale === "th" ? "#FF6B00" : "#333", fontWeight: locale === "th" ? 600 : 400 }}
              >
                TH Thai
              </button>
              <button
                onClick={() => { setLocale("en"); setLangOpen(false); }}
                className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 transition-colors border-t border-gray-100"
                style={{ color: locale === "en" ? "#FF6B00" : "#333", fontWeight: locale === "en" ? 600 : 400 }}
              >
                EN English
              </button>
            </div>
          )}
        </div>
        <div className="w-px h-5 bg-white/30" />
        {/* Profile + Sign Out dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(prev => !prev)}
            className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-1 transition-colors"
          >
            <span className="text-white text-xs font-medium">{user?.name || t("onboarding.adminName")}</span>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-sa-primary border-2 border-white/40">
              {user?.avatar || "สจ"}
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points={profileOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/></svg>
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50 min-w-[240px]" style={{ fontFamily: "'Sarabun', sans-serif" }}>
              {/* User info */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-[#565DFF]/10 border-2 border-[#565DFF]/30 flex items-center justify-center text-sm font-bold text-[#565DFF]">
                  {user?.avatar || "สจ"}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{user?.name || t("onboarding.adminName")}</div>
                  <div className="text-xs text-gray-500">{locale === "en" ? "Administrator" : "ผู้ดูแลระบบ"}</div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#565DFF" strokeWidth="2" className="ml-auto"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              {/* Profile link */}
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Profile
              </button>
              {/* Sign Out */}
              <button
                onClick={() => { setProfileOpen(false); logout(); router.push("/login"); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ─── TOPBAR TA (for email/verify screens) ───
  const TopBarTA = ({ info }: { info: string }) => (
    <div className="h-[52px] bg-brand-primary flex items-center px-4 gap-3 shrink-0">
      <button onClick={() => setSidebarExpanded(prev => !prev)} className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors cursor-pointer">
        <svg width={20} height={20} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} fill="none"><path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" /></svg>
      </button>
      <div className="text-xs text-white/70 flex-1">
        <strong className="text-white">{info}</strong>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-brand-primary border-2 border-white/40">
          สม
        </div>
      </div>
    </div>
  );

  // ─── BREADCRUMB ───
  const Breadcrumb = ({ items }: { items: { label: string; onClick?: () => void }[] }) => (
    <div className="px-5 py-2.5 text-xs text-erp-muted flex items-center gap-1.5 bg-white border-b border-erp-border">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-gray-300">&#8250;</span>}
          {item.onClick ? (
            <button onClick={item.onClick} className="text-sa-primary hover:underline">
              {item.label}
            </button>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );

  // ─── SCREEN META ───
  // ScreenMetaBar removed — was dev-only screen label

  // ═══════════════════ S1: MASTER ACCOUNT LIST ═══════════════════
  const renderS1 = () => (
    <div className="flex flex-col flex-1">
      {renderTopBarSA()}
      <Breadcrumb items={[{ label: t("onboarding.customer") }, { label: t("onboarding.masterAccountList") }]} />
      {/* TPL-DATALIST-STANDARD */}
      <Box sx={{ px: 3, py: 3, flex: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 500, py: 2.5, color: "#374151" }}>
          {t("onboarding.masterAccountList")}
        </Typography>

        <Paper elevation={3} sx={{ borderRadius: "10px", overflow: "hidden" }}>
          {/* Filter Bar */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2.5 }}>
            <Button
              variant="contained"
              startIcon={<FileUploadOutlinedIcon />}
              sx={{ bgcolor: "#FF6B00", "&:hover": { bgcolor: "#E65C00" }, textTransform: "none", whiteSpace: "nowrap" }}
            >
              {t("common.export")}
            </Button>
            <Box sx={{ flex: 1 }} />
            <TextField
              size="small"
              placeholder={t("onboarding.searchCustomer")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 280 }}
            />
            <Button
              variant="contained"
              onClick={() => {
                setAccountForm({ company: "", firstName: "", lastName: "", position: "", customerGroup: "ทั่วไป", email: "", phone: "", tenantQuota: "3" });
                setEmailError(false);
                setAddAccountOpen(true);
              }}
              sx={{ bgcolor: "#FF6B00", "&:hover": { bgcolor: "#E65C00" }, textTransform: "none", whiteSpace: "nowrap" }}
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
                  width: 140,
                  renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="body2" sx={{ color: "#FF6B00", fontWeight: 500, cursor: "pointer" }}>{params.value}</Typography>
                  ),
                },
                {
                  field: "name",
                  headerName: t("onboarding.name"),
                  flex: 1,
                  minWidth: 180,
                  valueGetter: (_value: unknown, row: MasterAccount) => `${row.firstName} ${row.lastName}`,
                  renderCell: (params: GridRenderCellParams) => (
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ height: "100%" }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: "#FF6B00", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.875rem", fontWeight: 600, flexShrink: 0 }}>
                        {(params.value as string)?.charAt(0)}
                      </Box>
                      <Typography variant="body2">{params.value}</Typography>
                    </Stack>
                  ),
                },
                { field: "customerGroup", headerName: t("onboarding.customerGroup"), width: 100 },
                { field: "email", headerName: "Email", width: 200 },
                { field: "phone", headerName: t("onboarding.phoneCol"), width: 130 },
                {
                  field: "emailVerifiedAt",
                  headerName: t("onboarding.emailVerifiedAt"),
                  width: 150,
                  renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="body2" sx={{ color: "#374151" }}>{params.value || "—"}</Typography>
                  ),
                },
                {
                  field: "tenantQuota",
                  headerName: t("onboarding.businessCount"),
                  width: 140,
                  align: "center",
                  headerAlign: "center",
                  renderCell: (params: GridRenderCellParams) => {
                    const row = params.row as MasterAccount;
                    return (
                      <Typography variant="body2">
                        <span style={{ color: "#FF6B00", fontWeight: 600 }}>{row.tenantUsed}</span>
                        <span style={{ color: "#4C4E63" }}>/{row.tenantQuota}</span>
                      </Typography>
                    );
                  },
                },
                {
                  field: "status",
                  headerName: t("onboarding.status"),
                  width: 140,
                  renderCell: (params: GridRenderCellParams) => {
                    const status = params.value as string;
                    return (
                      <Chip
                        label={status}
                        size="small"
                        sx={{
                          fontWeight: 500, fontSize: "0.8rem",
                          ...(status === "เปิดใช้งาน"
                            ? { bgcolor: "rgba(238,251,229,0.98)", color: "#3B6D11" }
                            : status === "รอยืนยัน Email"
                            ? { bgcolor: "#FFF0E5", color: "#FF8228" }
                            : status === "ระงับ Account"
                            ? { bgcolor: "#FFF0E5", color: "#FF8228", border: "1px solid #FF8228" }
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
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#374151",
              },
              "& .MuiDataGrid-cell": {
                fontSize: "0.875rem",
                color: "#374151",
                display: "flex",
                alignItems: "center",
              },
              "& .MuiDataGrid-row:hover": {
                bgcolor: "rgba(255,107,0,0.04)",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #F5F5F7",
              },
              "& .MuiCheckbox-root": {
                color: "#ccc",
                "&.Mui-checked": { color: "#FF6B00" },
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
          <MenuItem onClick={() => { setMeatballAnchor(null); }} sx={{ gap: 1.5, py: 1.5, fontSize: "0.875rem", color: "#FF6B00" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            {t("onboarding.suspendAccount")}
          </MenuItem>
        </Menu>
      </Box>
      {/* Footer — Figma style */}
      <Box sx={{ px: 3, py: 2, fontSize: 14, color: "rgba(76,78,100,0.68)" }}>
        {t("onboarding.footer")}
      </Box>

      {/* === Add Account Modal (FormDialog from Showcase) === */}
      <FormDialog
        open={addAccountOpen}
        onClose={() => setAddAccountOpen(false)}
        title={t("onboarding.createAccount")}
        maxWidth="sm"
        fullWidth
        footer={
          <>
            <Button onClick={() => setAddAccountOpen(false)}>{t("common.cancel")}</Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "#FF6B00", "&:hover": { bgcolor: "#E65C00" } }}
              onClick={() => { setAddAccountOpen(false); go("s3"); }}
            >
              {t("common.save")}
            </Button>
          </>
        }
      >
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label={t("onboarding.companyName")}
            size="small"
            fullWidth
            value={accountForm.company}
            onChange={(e) => setAccountForm({ ...accountForm, company: e.target.value })}
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label={t("onboarding.firstName")}
              size="small"
              fullWidth
              required
              value={accountForm.firstName}
              onChange={(e) => setAccountForm({ ...accountForm, firstName: e.target.value })}
            />
            <TextField
              label={t("onboarding.lastName")}
              size="small"
              fullWidth
              required
              value={accountForm.lastName}
              onChange={(e) => setAccountForm({ ...accountForm, lastName: e.target.value })}
            />
          </Stack>
          <TextField
            label={t("onboarding.position")}
            size="small"
            fullWidth
            required
            value={accountForm.position}
            onChange={(e) => setAccountForm({ ...accountForm, position: e.target.value })}
          />
          <TextField
            label={t("onboarding.customerGroup")}
            size="small"
            fullWidth
            required
            select
            value={accountForm.customerGroup}
            onChange={(e) => setAccountForm({ ...accountForm, customerGroup: e.target.value })}
          >
            <MenuItem value="ทั่วไป">ทั่วไป</MenuItem>
            <MenuItem value="ขายส่ง">ขายส่ง</MenuItem>
            <MenuItem value="ขายปลีก">ขายปลีก</MenuItem>
            <MenuItem value="VIP">VIP</MenuItem>
            <MenuItem value="Founding Partner">Founding Partner</MenuItem>
          </TextField>
          <TextField
            label={t("onboarding.masterEmail")}
            size="small"
            fullWidth
            required
            value={accountForm.email}
            onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
          />
          <TextField
            label={t("onboarding.phone")}
            size="small"
            fullWidth
            required
            value={accountForm.phone}
            onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
            InputProps={{ startAdornment: <span style={{ marginRight: 8, fontSize: 13, color: "#999", whiteSpace: "nowrap" }}>+66</span> }}
          />
          <TextField
            label={t("onboarding.tenantQuota")}
            size="small"
            fullWidth
            required
            type="number"
            value={accountForm.tenantQuota}
            onChange={(e) => setAccountForm({ ...accountForm, tenantQuota: e.target.value })}
            helperText={t("onboarding.tenantQuotaHelp")}
          />
          <Alert severity="info" variant="outlined" sx={{ fontSize: 12 }}>
            {t("onboarding.emailNotice")}
          </Alert>
        </Stack>
      </FormDialog>
    </div>
  );

  // ═══════════════════ S2: CREATE ACCOUNT PANEL ═══════════════════
  const renderS2 = () => (
    <div className="flex flex-col flex-1">
      {renderTopBarSA()}
      <Breadcrumb items={[{ label: "Master Accounts", onClick: () => go("s1") }, { label: t("onboarding.createNew") }]} />
      <div className="px-5 pt-3 pb-2">
        <h1 className="text-xl font-bold text-erp-text">Master Accounts</h1>
      </div>
      <div className="flex-1 relative">
        <SlidePanel
          open={true}
          title={t("onboarding.createAccount")}
          onClose={() => go("s1")}
          headerColor="sa"
          footer={
            <>
              <button onClick={() => go("s1")} className="px-4 py-2 border border-erp-border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                {t("common.cancel")}
              </button>
              <button onClick={() => go("s3")} className="px-4 py-2 bg-sa-primary hover:bg-sa-hover text-white text-sm rounded-lg font-medium transition-colors">
                {t("common.save")}
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <FloatingField label={t("onboarding.companyName")} value={accountForm.company} onChange={(v) => setAccountForm({ ...accountForm, company: v })} variant="sa" />
            <div className="grid grid-cols-2 gap-3">
              <FloatingField label={t("onboarding.firstName")} value={accountForm.firstName} onChange={(v) => setAccountForm({ ...accountForm, firstName: v })} variant="sa" required />
              <FloatingField label={t("onboarding.lastName")} value={accountForm.lastName} onChange={(v) => setAccountForm({ ...accountForm, lastName: v })} variant="sa" required />
            </div>
            <FloatingField label={t("onboarding.position")} value={accountForm.position} onChange={(v) => setAccountForm({ ...accountForm, position: v })} variant="sa" required />
            <div className="field-group sa">
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
              <label>{t("onboarding.customerGroup")} <span className="text-erp-error">*</span></label>
            </div>
            <div>
              <FloatingField label={t("onboarding.masterEmail")} value={accountForm.email} onChange={(v) => setAccountForm({ ...accountForm, email: v })} variant="sa" required />
              {accountForm.email && !emailError && (
                <p className="text-[10px] text-green-600 mt-1 pl-0.5">&#10003; {t("onboarding.emailNotInSystem")}</p>
              )}
            </div>
            <div>
              <p className="text-[11px] text-erp-muted mb-1.5 font-medium">{t("onboarding.phone")} <span className="text-erp-error">*</span></p>
              <div className="flex border-[1.5px] border-erp-border rounded-md overflow-hidden focus-within:border-sa-primary transition-colors">
                <div className="px-2.5 py-2 bg-gray-50 border-r border-erp-border flex items-center gap-1 text-xs text-erp-muted whitespace-nowrap">
                  &#127481;&#127469; +66 &#9662;
                </div>
                <input
                  className="flex-1 px-3 py-2 text-sm outline-none"
                  value={accountForm.phone}
                  onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                />
              </div>
            </div>
            <FloatingField label={t("onboarding.tenantQuota")} value={accountForm.tenantQuota} onChange={(v) => setAccountForm({ ...accountForm, tenantQuota: v })} variant="sa" required type="number" />
            <p className="text-[11px] text-erp-muted -mt-2 pl-0.5">{t("onboarding.tenantQuotaHelp")}</p>
            <div className="p-2.5 bg-[#FF6B00]/10 rounded-md border border-[#FF6B00]/20 text-xs text-sa-primary">
              {t("onboarding.emailNotice")}
            </div>
          </div>
        </SlidePanel>
      </div>
    </div>
  );

  // ═══════════════════ S2e: ERROR STATE ═══════════════════
  const renderS2e = () => (
    <div className="flex flex-col flex-1">
      {renderTopBarSA()}
      <Breadcrumb items={[{ label: "Master Accounts", onClick: () => go("s1") }, { label: t("onboarding.createNew") }]} />
      <div className="px-5 pt-3 pb-2">
        <h1 className="text-xl font-bold text-erp-text">Master Accounts</h1>
      </div>
      <div className="flex-1 relative">
        <SlidePanel
          open={true}
          title={t("onboarding.createAccount")}
          onClose={() => go("s1")}
          headerColor="sa"
          footer={
            <>
              <button onClick={() => go("s1")} className="px-4 py-2 border border-erp-border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                {t("common.cancel")}
              </button>
              <button disabled className="px-4 py-2 bg-sa-primary text-white text-sm rounded-lg font-medium opacity-40 cursor-not-allowed">
                {t("common.save")}
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <FloatingField label={t("onboarding.name")} value="วิภา รัตนพันธ์" onChange={() => {}} variant="sa" required />
            <FloatingField label={t("onboarding.position")} value="CEO" onChange={() => {}} variant="sa" required />
            <div>
              <div className="field-group sa required">
                <input value="wipa@thaimart.co.th" readOnly className="!border-erp-error" />
                <label>{t("onboarding.masterEmail")} <span className="text-erp-error">*</span></label>
              </div>
              <p className="text-[10px] text-erp-error mt-1 pl-0.5">&#10005; {t("onboarding.emailAlreadyExists")}</p>
            </div>
            <div>
              <p className="text-[11px] text-erp-muted mb-1.5 font-medium">{t("onboarding.phone")} <span className="text-erp-error">*</span></p>
              <div className="flex border-[1.5px] border-erp-border rounded-md overflow-hidden">
                <div className="px-2.5 py-2 bg-gray-50 border-r border-erp-border flex items-center gap-1 text-xs text-erp-muted">
                  &#127481;&#127469; +66 &#9662;
                </div>
                <input className="flex-1 px-3 py-2 text-sm outline-none" value="0894567890" readOnly />
              </div>
            </div>
            <FloatingField label="Tenant Quota" value="5" onChange={() => {}} variant="sa" required type="number" />
            <div className="p-2.5 bg-red-50 rounded-md border border-red-200 text-xs text-erp-error">
              &#9888; {t("onboarding.fixBeforeSave")}
            </div>
          </div>
        </SlidePanel>
      </div>
    </div>
  );

  // ═══════════════════ S3: VERIFY EMAIL ═══════════════════
  const renderS3 = () => (
    <div className="flex flex-col flex-1">
      <TopBarTA info="Email Client — somchai@siamgroup.co.th" />
      <div className="flex-1 pt-4 bg-[#f0ede6]">
        <div className="flex items-start justify-center p-5">
          <div className="w-full max-w-[560px]">
            {/* Email client bar */}
            <div className="bg-brand-primary px-3.5 py-2 rounded-t-lg text-[11px] text-white/70">
              &#128231; somchai@siamgroup.co.th &middot; จาก: no-reply@jigsawerp.com
            </div>
            {/* Email card */}
            <div className="bg-white border border-gray-300 rounded-b-lg overflow-hidden">
              <div className="bg-brand-primary px-6 py-5 text-center">
                <div className="text-base font-extrabold text-white tracking-wide">&#129513; ERP JIGSAW</div>
                <div className="text-[11px] text-white/70 mt-0.5">ยืนยันอีเมลของคุณ</div>
              </div>
              <div className="px-6 py-5">
                <div className="text-[11px] text-gray-400 mb-3.5 pb-2.5 border-b border-erp-border">
                  จาก: no-reply@jigsawerp.com &nbsp;&middot;&nbsp; ถึง: somchai@siamgroup.co.th
                </div>
                <div className="text-sm font-semibold mb-2">สวัสดีคุณสมชาย,</div>
                <div className="text-sm text-gray-600 leading-relaxed mb-3">
                  ทีม Jigsaw ได้สร้าง <strong className="text-erp-text">Master Account</strong> สำหรับคุณเรียบร้อยแล้ว<br />
                  กรุณากดปุ่มด้านล่างเพื่อยืนยันอีเมลและตั้งรหัสผ่าน
                </div>
                <div className="text-xs text-gray-400 mb-3">
                  ลิงก์นี้หมดอายุภายใน <strong className="text-gray-600">48 ชั่วโมง</strong> และใช้ได้เพียงครั้งเดียว
                </div>
                <button
                  onClick={() => go("s4")}
                  className="w-full py-3 bg-brand-primary hover:bg-brand-hover text-white rounded-md text-sm font-semibold transition-colors my-4"
                >
                  ยืนยันอีเมลและตั้งรหัสผ่าน
                </button>
                <div className="text-[11px] text-gray-400 text-center mb-2">หรือคัดลอกลิงก์นี้:</div>
                <div className="bg-gray-50 rounded-md px-3 py-2 text-[11px] text-blue-700 font-mono border border-erp-border break-all">
                  verify.jigsawerp.com/activate?token=eyJhbGciOiJIUzI1NiIsIn...
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-erp-border text-[11px] text-gray-400 text-center leading-relaxed">
                หากคุณไม่ได้ร้องขอ Account นี้ กรุณาเพิกเฉย<br />
                มีปัญหา? ติดต่อ support@jigsawerp.com &middot; &copy; 2569 ERP Jigsaw
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ═══════════════════ S4: SET PASSWORD ═══════════════════
  const renderS4 = () => (
    <div className="flex flex-col flex-1">
      <TopBarTA info="verify.jigsawerp.com" />
      <div className="flex-1 bg-erp-bg flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border border-erp-border p-7 w-full max-w-[400px] shadow-lg">
          <div className="w-13 h-13 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3.5 text-xl">
            &#9989;
          </div>
          <h2 className="text-lg font-bold text-center mb-1">{t("onboarding.emailVerified")}</h2>
          <p className="text-xs text-erp-muted text-center leading-relaxed mb-4">
            {t("onboarding.setPasswordDesc")}
          </p>
          <div className="text-center mb-5">
            <span className="inline-block text-[11px] px-3.5 py-1 bg-gray-50 rounded-full text-erp-muted border border-erp-border">
              somchai@siamgroup.co.th
            </span>
          </div>

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
                {r.ok ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: "#E0E0E0" }} />}
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
        </div>
      </div>
    </div>
  );

  // ═══════════════════ S4e: TOKEN EXPIRED ═══════════════════
  const renderS4e = () => (
    <div className="flex flex-col flex-1">
      <TopBarTA info="verify.jigsawerp.com" />
      <div className="flex-1 bg-red-50/50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border border-red-200 p-7 w-full max-w-[400px] shadow-lg">
          <div className="w-13 h-13 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3.5 text-xl">
            &#9888;&#65039;
          </div>
          <h2 className="text-lg font-bold text-center mb-1 text-erp-error">{t("onboarding.linkExpiredTitle")}</h2>
          <p className="text-xs text-erp-muted text-center leading-relaxed mb-4">
            {t("onboarding.linkExpiredDesc")}
          </p>
          <div className="text-xs text-erp-muted text-center mb-5 p-2.5 bg-gray-50 rounded-md">
            {t("onboarding.contactForNewLink")}<br />
            <strong>support@jigsawerp.com</strong>
          </div>
          <button className="w-full py-3 bg-erp-error hover:bg-red-700 text-white rounded-md text-sm font-bold transition-colors">
            {t("onboarding.requestNewLink")}
          </button>
        </div>
      </div>
    </div>
  );

  // ═══════════════════ S5: ACCOUNT DETAIL ═══════════════════
  const renderS5 = () => (
    <div className="flex flex-col flex-1">
      {renderTopBarSA()}
      <Breadcrumb items={[
        { label: "Master Accounts", onClick: () => go("s1") },
        { label: `${selectedAccount.firstName} ${selectedAccount.lastName}` },
      ]} />
      {/* Detail Header */}
      <div className="px-5 bg-white border-b border-erp-border">
        <h1 className="text-xl font-bold pt-3 pb-2.5">{t("onboarding.customerInfo")}</h1>
        <Tabs
          value={detailTab}
          onChange={(_, v) => setDetailTab(v)}
          sx={{
            "& .MuiTab-root": { textTransform: "none", fontSize: 13, fontWeight: 600, minHeight: 40 },
            "& .Mui-selected": { color: "#FF6B00 !important" },
            "& .MuiTabs-indicator": { bgcolor: "#FF6B00" },
          }}
        >
          <Tab label={t("onboarding.tabGeneral")} value="general" />
          <Tab label={`Tenants (${selectedAccount.tenantUsed}/${selectedAccount.tenantQuota})`} value="tenants" />
          <Tab label={t("onboarding.tabContracts")} value="contracts" />
          <Tab label={t("onboarding.tabHistory")} value="history" />
        </Tabs>
      </div>
      {/* Detail Body */}
      <div className="flex-1 p-5 overflow-y-auto">
        {detailTab === "general" && (
          <>
            {/* General Info Card */}
            <div className="bg-white rounded-lg border border-erp-border p-5 mb-3.5">
              <h3 className="text-sm font-bold text-sa-primary mb-3.5">{t("onboarding.tabGeneral")}</h3>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="field-group sa">
                  <input value={selectedAccount.id} readOnly className="!bg-gray-50 !text-blue-700 !font-mono !font-semibold" />
                  <label>{t("onboarding.accountCode")}</label>
                </div>
                <div className="field-group sa">
                  <select defaultValue={selectedAccount.customerGroup}>
                    <option>ทั่วไป</option><option>ขายส่ง</option><option>ขายปลีก</option><option>VIP</option><option>Founding Partner</option>
                  </select>
                  <label>{t("onboarding.customerGroup")} <span className="text-erp-error">*</span></label>
                </div>
                <FloatingField label={t("onboarding.firstName")} value={selectedAccount.firstName} onChange={() => {}} variant="sa" required />
                <FloatingField label={t("onboarding.lastName")} value={selectedAccount.lastName} onChange={() => {}} variant="sa" required />
                <div className="field-group sa">
                  <select><option>นาย</option><option>นาง</option><option>นางสาว</option></select>
                  <label>{t("onboarding.prefix")} <span className="text-erp-error">*</span></label>
                </div>
                <FloatingField label={t("onboarding.position")} value={selectedAccount.position} onChange={() => {}} variant="sa" />
                <FloatingField label={t("onboarding.companyName")} value={selectedAccount.company} onChange={() => {}} variant="sa" />
                <FloatingField label={t("onboarding.emailLabel")} value={selectedAccount.email} onChange={() => {}} variant="sa" required />
                <div>
                  <p className="text-[11px] text-erp-muted mb-1 font-medium">{t("onboarding.phone")}</p>
                  <div className="flex border-[1.5px] border-erp-border rounded-md overflow-hidden">
                    <div className="px-2.5 py-2 bg-gray-50 border-r border-erp-border flex items-center gap-1 text-xs text-erp-muted">
                      &#127481;&#127469; +66 &#9662;
                    </div>
                    <input className="flex-1 px-3 py-2 text-sm outline-none" defaultValue={selectedAccount.phone} />
                  </div>
                </div>
                <div className="field-group sa">
                  <input value={selectedAccount.emailVerifiedAt || "—"} readOnly className="!bg-gray-50 !text-erp-muted" />
                  <label>{t("onboarding.emailVerifiedAt")}</label>
                </div>
                <div className="col-span-2">
                  <Typography variant="caption" sx={{ color: "#777", fontWeight: 500, mb: 0.5, display: "block" }}>{t("onboarding.status")}</Typography>
                  <RadioGroup row value={selectedAccount.status}>
                    <FormControlLabel value="เปิดใช้งาน" control={<Radio size="small" sx={{ color: "#FF6B00", "&.Mui-checked": { color: "#FF6B00" } }} />} label={<Typography variant="body2">{t("onboarding.statusActive")}</Typography>} />
                    <FormControlLabel value="ปิดใช้งาน" control={<Radio size="small" sx={{ color: "#FF6B00", "&.Mui-checked": { color: "#FF6B00" } }} />} label={<Typography variant="body2">{t("onboarding.statusDisabled")}</Typography>} />
                  </RadioGroup>
                </div>
                <div className="field-group sa">
                  <input value={`${selectedAccount.createdAt} — ${selectedAccount.createdBy}`} readOnly className="!bg-gray-50 !text-erp-muted" />
                  <label>{t("onboarding.registeredAt")}</label>
                </div>
                <div className="field-group sa">
                  <input value={`${selectedAccount.updatedAt} — ${selectedAccount.updatedBy}`} readOnly className="!bg-gray-50 !text-erp-muted" />
                  <label>{t("onboarding.lastUpdatedAt")}</label>
                </div>
              </div>

              {/* SA Actions */}
              <div className="mt-3.5 p-3 bg-[#FF6B00]/5 rounded-lg border border-[#FF6B00]/15">
                <p className="text-[11px] font-semibold text-sa-primary mb-2">&#9881; {t("onboarding.saActions")}</p>
                <div className="flex gap-2 flex-wrap">
                  <button className="px-3 py-1.5 bg-white border border-erp-border rounded-md text-xs hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
                    &#128231; {t("onboarding.resetVerifyEmail")}
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-erp-error rounded-md text-xs text-erp-error hover:bg-red-50 flex items-center gap-1.5 transition-colors">
                    &#128273; {t("onboarding.resetPassword")}
                  </button>
                </div>
                <p className="text-[11px] text-erp-muted mt-1.5">{t("onboarding.contactWillReceiveEmail")}</p>
              </div>

              <div className="flex justify-end gap-2.5 mt-3.5">
                <button className="px-4 py-2 border border-erp-border rounded-lg text-sm hover:bg-gray-50 transition-colors">{t("common.cancel")}</button>
                <button className="px-4 py-2 bg-sa-primary hover:bg-sa-hover text-white text-sm rounded-lg font-medium transition-colors">{t("common.save")}</button>
              </div>
            </div>

            {/* Tenant Quota Card */}
            <div className="bg-white rounded-lg border border-erp-border p-5">
              <h3 className="text-sm font-bold text-sa-primary mb-3.5">{t("onboarding.tenantQuotaInfo")}</h3>
              <div className="bg-[#FF6B00]/10 rounded-md px-3 py-2 text-xs text-sa-primary border border-[#FF6B00]/20">
                Tenant Quota: <strong>{selectedAccount.tenantUsed} / {selectedAccount.tenantQuota} บริษัท</strong> &middot; เหลืออีก {selectedAccount.tenantQuota - selectedAccount.tenantUsed} บริษัทที่สามารถสร้างได้
              </div>
              {selectedAccount.tenantUsed === 0 ? (
                <div className="mt-3 flex flex-col items-center justify-center p-6 bg-orange-50 rounded-lg border border-orange-200 gap-2">
                  <p className="text-sm text-orange-600 font-medium">{t("onboarding.noTenantYet")}</p>
                  <button
                    onClick={() => go("s6")}
                    className="mt-1 px-4 py-2 bg-sa-primary hover:bg-sa-hover text-white text-sm rounded-md font-medium transition-colors"
                  >
                    + {t("onboarding.createTenant")}
                  </button>
                </div>
              ) : (
                <div className="mt-3">
                  <button
                    onClick={() => go("s6")}
                    className="w-full flex items-center justify-center gap-2 py-3 border-[1.5px] border-dashed border-sa-primary rounded-lg bg-white text-sm text-sa-primary hover:bg-[#FF6B00]/5 transition-colors"
                  >
                    + สร้าง Tenant ใหม่ภายใต้ Account นี้ (เหลือ {selectedAccount.tenantQuota - selectedAccount.tenantUsed} บริษัท)
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {detailTab === "tenants" && (
          <div className="bg-white rounded-lg border border-erp-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-sa-primary">{t("onboarding.tenantsUnderAccount")}</h3>
              <span className="text-xs text-erp-muted">{selectedAccount.tenantUsed} {t("onboarding.ofCompanies")} {selectedAccount.tenantQuota} {t("onboarding.company")}</span>
            </div>
            <div className="bg-[#FF6B00]/10 rounded-md px-3 py-2 text-xs text-sa-primary border border-[#FF6B00]/20 mb-3">
              จำนวนธุรกิจ (Tenant Quota): <strong>{selectedAccount.tenantUsed} / {selectedAccount.tenantQuota} บริษัท</strong> ใช้ไปแล้ว &middot; เหลืออีก {selectedAccount.tenantQuota - selectedAccount.tenantUsed} บริษัท
            </div>
            {selectedAccount.tenantUsed > 0 && (
              <div className="border border-erp-border rounded-lg p-3.5 flex items-center gap-3 mb-2 hover:border-sa-primary hover:bg-[#FF6B00]/5 cursor-pointer transition-colors">
                <div className="w-8 h-8 rounded-md bg-[#FF6B00]/10 flex items-center justify-center text-xs font-bold text-sa-primary shrink-0">ST</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">บริษัท สยามเทรด จำกัด</div>
                  <div className="text-[11px] text-erp-muted mt-0.5">siamtrade.jigsawerp.com &middot; Cloud &middot; MD-1–11, MD-12</div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  รอ Setup Wizard
                </span>
              </div>
            )}
            <button
              onClick={() => go("s6")}
              className="w-full flex items-center justify-center gap-2 py-3 border-[1.5px] border-dashed border-sa-primary rounded-lg bg-white text-sm text-sa-primary hover:bg-[#FF6B00]/5 transition-colors mt-1"
            >
              + สร้าง Tenant ใหม่ภายใต้ Account นี้ (เหลือ {selectedAccount.tenantQuota - selectedAccount.tenantUsed} บริษัท)
            </button>
          </div>
        )}

        {(detailTab === "contracts" || detailTab === "history") && (
          <div className="bg-white rounded-lg border border-erp-border p-10 text-center">
            <p className="text-erp-muted text-sm">{t("common.noData")}</p>
          </div>
        )}
      </div>
    </div>
  );

  // ═══════════════════ S6: CREATE TENANT FORM ═══════════════════
  const renderS6 = () => (
    <div className="flex flex-col flex-1">
      {renderTopBarSA()}
      <Breadcrumb items={[
        { label: "Master Accounts", onClick: () => go("s1") },
        { label: selectedAccount.firstName, onClick: () => go("s5") },
        { label: t("onboarding.createTenant") },
      ]} />
      <div className="flex-1 relative">
        <SlidePanel
          open={true}
          title={`สร้าง Tenant ใหม่ — Tenant #${selectedAccount.tenantUsed + 1}`}
          onClose={() => go("s5")}
          headerColor="sa"
          width={500}
          footer={
            <>
              <button onClick={() => go("s5")} className="px-4 py-2 border border-erp-border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                {t("common.cancel")}
              </button>
              <button onClick={() => go("s7")} className="px-4 py-2 bg-sa-primary hover:bg-sa-hover text-white text-sm rounded-lg font-medium transition-colors">
                {t("common.save")}
              </button>
            </>
          }
        >
          <div className="space-y-3">
            {/* Section: ข้อมูลนิติบุคคล */}
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-xs font-semibold text-erp-muted whitespace-nowrap">{t("onboarding.entityInfo")}</span>
              <div className="flex-1 h-px bg-erp-border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FloatingField label={t("onboarding.companyNameTh")} value={tenantForm.nameTh} onChange={(v) => setTenantForm({ ...tenantForm, nameTh: v })} variant="sa" required />
              <FloatingField label={t("onboarding.companyNameEn")} value={tenantForm.nameEn} onChange={(v) => setTenantForm({ ...tenantForm, nameEn: v })} variant="sa" required />
              <div className="field-group sa">
                <select value={tenantForm.entityType} onChange={(e) => setTenantForm({ ...tenantForm, entityType: e.target.value })}>
                  <option>บริษัทจำกัด (บจ.)</option><option>ห้างหุ้นส่วนจำกัด (หจก.)</option><option>บริษัทมหาชน (บมจ.)</option>
                </select>
                <label>{t("onboarding.entityType")} <span className="text-erp-error">*</span></label>
              </div>
              <div className="field-group sa">
                <select value={tenantForm.businessType} onChange={(e) => setTenantForm({ ...tenantForm, businessType: e.target.value })}>
                  <option>Trading — ซื้อมาขายไป</option><option>Manufacturing — ผลิต</option><option>Service — บริการ</option>
                </select>
                <label>{t("onboarding.businessType")} <span className="text-erp-error">*</span></label>
              </div>
              <FloatingField label={t("onboarding.taxId")} value={tenantForm.taxId} onChange={(v) => setTenantForm({ ...tenantForm, taxId: v })} variant="sa" required />
              <div>
                <p className="text-[11px] text-erp-muted mb-1 font-medium">Subdomain <span className="text-erp-error">*</span></p>
                <div className="flex border-[1.5px] border-green-500 rounded-md overflow-hidden">
                  <input
                    className="flex-1 px-2.5 py-2 text-sm outline-none"
                    value={tenantForm.subdomain}
                    onChange={(e) => setTenantForm({ ...tenantForm, subdomain: e.target.value })}
                  />
                  <div className="px-2.5 py-2 bg-gray-50 border-l border-erp-border text-xs text-erp-muted whitespace-nowrap">
                    .jigsawerp.com
                  </div>
                </div>
                <p className="text-[10px] text-erp-error mt-1 pl-0.5">&#128274; Lock ถาวรหลัง Save</p>
              </div>
            </div>

            {/* Section: Package & Quota */}
            <div className="flex items-center gap-2.5 mt-4 mb-1">
              <span className="text-xs font-semibold text-erp-muted whitespace-nowrap">Package & Quota</span>
              <div className="flex-1 h-px bg-erp-border" />
            </div>

            {/* Deployment Tier */}
            <div className="bg-gray-50 border border-erp-border rounded-md p-3">
              <p className="text-[11px] font-bold text-erp-muted mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sa-primary" />
                Deployment Tier
              </p>
              <ToggleButtonGroup
                value={tenantForm.tier}
                exclusive
                onChange={(_, v) => v && setTenantForm({ ...tenantForm, tier: v })}
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1 }}
              >
                {(["Cloud", "Dedicated", "On-premise"] as const).map((tier) => {
                  const subs = { Cloud: "Shared · Huawei", Dedicated: "Private · Huawei", "On-premise": "Server ลูกค้า" };
                  return (
                    <ToggleButton key={tier} value={tier} sx={{ textTransform: "none", flexDirection: "column", alignItems: "flex-start", p: 1.5, "&.Mui-selected": { bgcolor: "#FF6B00/10", borderColor: "#FF6B00" } }}>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{tier}</Typography>
                      <Typography variant="caption" sx={{ color: "#999", fontSize: 10 }}>{subs[tier]}</Typography>
                    </ToggleButton>
                  );
                })}
              </ToggleButtonGroup>
            </div>

            {/* Resource Quota */}
            <div className="bg-gray-50 border border-erp-border rounded-md p-3">
              <p className="text-[11px] font-bold text-erp-muted mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sa-primary" />
                Resource Quota
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "quotaUser", label: "User", unit: "คน" },
                  { key: "quotaBranch", label: "Branch", unit: "สาขา" },
                  { key: "quotaWarehouse", label: "Warehouse", unit: "คลัง" },
                  { key: "quotaStorage", label: "Storage", unit: "GB" },
                  { key: "quotaAuditLog", label: "Audit Log", unit: "เดือน" },
                  { key: "quotaOnboarding", label: "Onboarding", unit: "ชม." },
                ].map((q) => (
                  <div key={q.key} className="border border-erp-border rounded-md p-2 bg-white">
                    <div className="text-[10px] text-gray-400 mb-1">{q.label}</div>
                    <div className="flex items-center gap-1">
                      <input
                        className="px-1.5 py-1 border border-erp-border rounded text-xs w-14 outline-none focus:border-sa-primary"
                        value={(tenantForm as unknown as Record<string, string>)[q.key]}
                        onChange={(e) => setTenantForm({ ...tenantForm, [q.key]: e.target.value })}
                      />
                      <span className="text-[11px] text-erp-muted">{q.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5 p-2 bg-orange-50 rounded-md text-[11px] text-orange-600 mt-2 border border-orange-200">
                &#9888; แจ้งเตือนอัตโนมัติที่ 80% และ 100% — ไม่บล็อกการใช้งาน
              </div>
            </div>

            {/* Backup Frequency */}
            <div className="bg-gray-50 border border-erp-border rounded-md p-3">
              <p className="text-[11px] font-bold text-erp-muted mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sa-primary" />
                Backup Frequency
              </p>
              <div className="flex items-center gap-2">
                <input
                  className="px-2 py-1.5 border border-erp-border rounded-md text-xs w-16 outline-none focus:border-sa-primary"
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
              </div>
            </div>

            {/* Modules */}
            <div className="bg-gray-50 border border-erp-border rounded-md p-3">
              <p className="text-[11px] font-bold text-erp-muted mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sa-primary" />
                Modules (สัญญาที่ 1)
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {moduleStates.map((m, i) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      if (m.status === "locked") return;
                      const next = [...moduleStates];
                      next[i] = { ...m, status: m.status === "on" ? "off" : "on" };
                      setModuleStates(next);
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1.5 border rounded-md text-[11px] transition-colors ${
                      m.status === "locked"
                        ? "bg-gray-100 text-erp-muted border-erp-border cursor-default"
                        : m.status === "on"
                        ? "bg-[#FF6B00]/10 border-[#FF6B00]/30 text-sa-primary"
                        : "bg-white text-erp-muted border-erp-border hover:border-sa-primary"
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-sm border-[1.5px] shrink-0 ${
                      m.status === "locked"
                        ? "bg-gray-300 border-gray-300"
                        : m.status === "on"
                        ? "bg-sa-primary border-sa-primary"
                        : "border-erp-border"
                    }`} />
                    <span className="flex-1 text-left">{m.id} {m.name}</span>
                    <span className={`w-4 h-4 rounded-sm flex items-center justify-center text-[10px] ${
                      m.status === "on" ? "bg-[#FF6B00]/20 text-sa-primary" : "bg-gray-100 text-erp-muted"
                    } ${m.status === "off" ? "opacity-30" : ""}`}>
                      &#9881;
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contract */}
            <div className="bg-gray-50 border border-erp-border rounded-md p-3">
              <p className="text-[11px] font-bold text-erp-muted mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sa-primary" />
                {t("onboarding.tabContracts")}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <FloatingField label={t("onboarding.contractStart")} value={tenantForm.contractStart} onChange={(v) => setTenantForm({ ...tenantForm, contractStart: v })} variant="sa" required />
                <FloatingField label={t("onboarding.contractEnd")} value={tenantForm.contractEnd} onChange={(v) => setTenantForm({ ...tenantForm, contractEnd: v })} variant="sa" required />
              </div>
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ color: "#777", fontWeight: 500, mb: 0.5, display: "block" }}>Auto-renewal</Typography>
                <RadioGroup
                  row
                  value={tenantForm.autoRenewal ? "yes" : "no"}
                  onChange={(e) => setTenantForm({ ...tenantForm, autoRenewal: e.target.value === "yes" })}
                >
                  <FormControlLabel value="yes" control={<Radio size="small" sx={{ color: "#FF6B00", "&.Mui-checked": { color: "#FF6B00" } }} />} label={<Typography variant="body2">{t("onboarding.autoRenewalYes")}</Typography>} />
                  <FormControlLabel value="no" control={<Radio size="small" sx={{ color: "#FF6B00", "&.Mui-checked": { color: "#FF6B00" } }} />} label={<Typography variant="body2">{t("onboarding.autoRenewalNo")}</Typography>} />
                </RadioGroup>
              </Box>
              <div className="flex gap-1.5 p-2 bg-green-50 rounded-md text-[11px] text-green-700 mt-3 border border-green-200">
                &#10003; เมื่อกดบันทึก ระบบจะสร้างสัญญาที่ 1 อัตโนมัติ และส่ง Welcome Email ให้ TA
              </div>
            </div>
          </div>
        </SlidePanel>
      </div>
    </div>
  );

  // ═══════════════════ S7: WELCOME EMAIL ═══════════════════
  const renderS7 = () => (
    <div className="flex flex-col flex-1">
      <TopBarTA info="Email Client — somchai@siamgroup.co.th" />
      <div className="flex-1 pt-4 bg-[#f0ede6]">
        <div className="flex items-start justify-center p-5">
          <div className="w-full max-w-[560px]">
            <div className="bg-brand-primary px-3.5 py-2 rounded-t-lg text-[11px] text-white/70">
              &#128231; somchai@siamgroup.co.th &middot; จาก: no-reply@jigsawerp.com
            </div>
            <div className="bg-white border border-gray-300 rounded-b-lg overflow-hidden">
              <div className="bg-green-700 px-6 py-5 text-center">
                <div className="text-base font-extrabold text-white tracking-wide">&#129513; ERP JIGSAW</div>
                <div className="text-[11px] text-white/70 mt-0.5">ยินดีต้อนรับ! ระบบของคุณพร้อมแล้ว &#127881;</div>
              </div>
              <div className="px-6 py-5">
                <div className="text-[11px] text-gray-400 mb-3.5 pb-2.5 border-b border-erp-border">
                  จาก: no-reply@jigsawerp.com &nbsp;&middot;&nbsp; ถึง: somchai@siamgroup.co.th
                </div>
                <div className="text-sm font-semibold mb-2">สวัสดีคุณสมชาย,</div>
                <div className="text-sm text-gray-600 leading-relaxed mb-3">
                  ยินดีต้อนรับสู่ <strong className="text-erp-text">ERP Jigsaw!</strong><br />
                  บัญชีสำหรับ <strong className="text-erp-text">บริษัท สยามเทรด จำกัด</strong> ถูกสร้างเรียบร้อยแล้ว
                </div>
                <div className="bg-gray-50 rounded-md p-3 mb-3 border border-erp-border">
                  <div className="text-[11px] text-gray-400 mb-1.5">ข้อมูล Tenant ของคุณ</div>
                  <div className="text-sm font-bold">บริษัท สยามเทรด จำกัด</div>
                  <div className="bg-gray-100 rounded-md px-3 py-2 text-[11px] text-blue-700 font-mono mt-2 mb-1 border border-erp-border">
                    siamtrade.jigsawerp.com
                  </div>
                  <div className="text-[11px] text-erp-muted">Cloud &middot; MD-1–11 + MD-12 Backoffice &middot; สัญญาที่ 1</div>
                </div>
                <div className="text-sm text-gray-600 leading-relaxed mb-1">
                  กรุณากดปุ่มด้านล่างเพื่อเข้าสู่ระบบและทำ Setup Wizard
                </div>
                <div className="text-xs text-gray-400 mb-3">(ใช้รหัสผ่านที่ตั้งไว้ในขั้นตอนก่อนหน้า)</div>
                <button
                  onClick={() => { setShowToast(true); go("s8"); }}
                  className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-md text-sm font-semibold transition-colors"
                >
                  เข้าสู่ระบบและเริ่ม Setup Wizard &#8594;
                </button>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-erp-border text-[11px] text-gray-400 text-center leading-relaxed">
                มีปัญหา? ติดต่อ support@jigsawerp.com &middot; &copy; 2569 ERP Jigsaw
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ═══════════════════ S8: TENANT LIST (POST-CREATE) ═══════════════════
  const renderS8 = () => (
    <div className="flex flex-col flex-1">
      {renderTopBarSA()}
      {/* Success toast */}
      {showToast && (
        <div className="bg-green-50 text-green-700 border-b border-green-200 px-4 py-2.5 text-xs flex items-center gap-2 shrink-0">
          &#9989; <strong>สร้าง Tenant สำเร็จ!</strong> ส่ง Welcome Email ให้ somchai@siamgroup.co.th แล้ว
        </div>
      )}
      <Breadcrumb items={[
        { label: t("onboarding.masterAccountList"), onClick: () => go("s1") },
        { label: "สมชาย วงศ์ใหญ่" },
      ]} />
      {/* Detail Header */}
      <div className="px-5 bg-white border-b border-erp-border">
        <h1 className="text-xl font-bold pt-3 pb-2.5">{t("onboarding.customerInfo")}</h1>
        <div className="flex gap-0">
          <button className="px-4 py-2 text-sm font-medium text-erp-muted hover:text-erp-text rounded-t transition-colors">
            {t("onboarding.tabGeneral")}
          </button>
          <button className="px-4 py-2 text-sm font-medium bg-sa-primary text-white rounded-t transition-colors">
            Tenants (1/3)
          </button>
          <button className="px-4 py-2 text-sm font-medium text-erp-muted hover:text-erp-text rounded-t transition-colors">
            {t("onboarding.tabContracts")}
          </button>
          <button className="px-4 py-2 text-sm font-medium text-erp-muted hover:text-erp-text rounded-t transition-colors">
            {t("onboarding.tabHistory")}
          </button>
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 p-5">
        <div className="bg-white rounded-lg border border-erp-border p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-sa-primary">{t("onboarding.tenantsUnderAccount")}</h3>
            <span className="text-xs text-erp-muted">1 {t("onboarding.ofCompanies")} 3 {t("onboarding.company")}</span>
          </div>
          <div className="bg-[#FF6B00]/10 rounded-md px-3 py-2 text-xs text-sa-primary border border-[#FF6B00]/20 mb-3">
            จำนวนธุรกิจ (Tenant Quota): <strong>1 / 3 บริษัท</strong> ใช้ไปแล้ว &middot; เหลืออีก 2 บริษัท
          </div>
          {/* Tenant item */}
          <div className="border border-erp-border rounded-lg p-3.5 flex items-center gap-3 mb-2 hover:border-sa-primary hover:bg-[#FF6B00]/5 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-md bg-[#FF6B00]/10 flex items-center justify-center text-xs font-bold text-sa-primary shrink-0">ST</div>
            <div className="flex-1">
              <div className="text-sm font-semibold">บริษัท สยามเทรด จำกัด</div>
              <div className="text-[11px] text-erp-muted mt-0.5">siamtrade.jigsawerp.com &middot; Cloud &middot; MD-1–11, MD-12</div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-600">
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              รอ Setup Wizard
            </span>
          </div>
          <button
            onClick={() => go("s6")}
            className="w-full flex items-center justify-center gap-2 py-3 border-[1.5px] border-dashed border-sa-primary rounded-lg bg-white text-sm text-sa-primary hover:bg-[#FF6B00]/5 transition-colors mt-1"
          >
            + สร้าง Tenant ใหม่ภายใต้ Account นี้ (เหลือ 2 บริษัท)
          </button>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/80 text-green-300 rounded-lg text-[11px]">
          &#10003; F-01 จบ &#8594; F-02 Setup Wizard
        </div>
      </div>
    </div>
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
    <div className="min-h-screen bg-erp-bg flex">
      {/* Sidebar — Figma Menu Drawer (expanded=260px, collapsed=68px icons only) */}
      <div className={`fixed h-screen z-50 bg-white border-r border-gray-200 transition-all duration-300 ${sidebarExpanded ? "w-[260px]" : "w-[68px]"}`}>

        {/* ═══ Collapsed: Icon-only bar (68px) ═══ */}
        {!sidebarExpanded && (
          <div className="w-[68px] h-full flex flex-col items-center py-3 gap-1">
            {/* Logo */}
            <div className="w-10 h-10 rounded-xl bg-sa-primary flex items-center justify-center cursor-pointer mb-0.5" onClick={() => setSidebarExpanded(true)}>
              <span className="text-[7px] font-extrabold text-white leading-tight text-center">JIG<br/>SAW</span>
            </div>
            <span className="text-[8px] font-bold text-sa-primary tracking-wider mb-2">JIGSAW</span>

            {/* Home (active) */}
            <button onClick={() => router.push("/home")} className="w-11 h-11 rounded-lg flex items-center justify-center bg-sa-primary/10 transition-colors" title={t("nav.home")}>
              <img src="/icons/commerce/home.svg" alt="" width={24} height={24} style={{ filter: "brightness(0) saturate(100%) invert(45%) sepia(96%) saturate(1500%) hue-rotate(360deg)" }} />
            </button>

            {/* Divider */}
            <div className="w-6 h-px bg-gray-200 my-1.5" />

            {/* ลูกค้า */}
            <button onClick={() => { setSidebarExpanded(true); setMenuOpen(prev => ({ ...prev, customer: true })); }} className="w-11 h-11 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors" title={t("onboarding.customer")}>
              <img src="/icons/data/user-id.svg" alt="" width={24} height={24} />
            </button>

            {/* รายงาน */}
            <button onClick={() => { setSidebarExpanded(true); setMenuOpen(prev => ({ ...prev, reports: true })); }} className="w-11 h-11 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors" title={locale === "en" ? "Reports" : "รายงาน"}>
              <img src="/icons/data/graph-up.svg" alt="" width={24} height={24} />
            </button>

            {/* Divider */}
            <div className="w-6 h-px bg-gray-200 my-1.5" />

            {/* ตั้งค่า */}
            <button onClick={() => { setSidebarExpanded(true); setMenuOpen(prev => ({ ...prev, settings: true })); }} className="w-11 h-11 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors" title={t("nav.settings")}>
              <img src="/icons/commerce/settings.svg" alt="" width={24} height={24} />
            </button>
          </div>
        )}

        {/* ═══ Expanded: Full menu (260px) ═══ */}
        {sidebarExpanded && (
        <div className="w-[260px] h-full flex flex-col">
          {/* Logo + Collapse */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
              <div className="w-8 h-8 rounded-lg bg-sa-primary flex items-center justify-center">
                <span className="text-[7px] font-extrabold text-white leading-tight text-center">JIG<br/>SAW</span>
              </div>
              <span className="text-lg font-extrabold tracking-wider text-sa-primary">JIGSAW</span>
            </div>
            <button onClick={() => setSidebarExpanded(false)} className="text-gray-400 hover:text-gray-600 text-sm">&laquo;</button>
          </div>

          {/* Menu Items — Sarabun Regular 16px */}
          <div className="flex-1 overflow-y-auto py-2 px-3" style={{ fontFamily: "'Sarabun', sans-serif" }}>
            {/* ภาพรวม — icon: home.svg → ไป /home (ไม่ highlight เพราะอยู่หน้า onboarding) */}
            <button
              onClick={() => router.push("/home")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors text-gray-700 hover:bg-gray-50"
              style={{ fontSize: 16, fontWeight: 400 }}
            >
              <img src="/icons/commerce/home.svg" alt="" width={24} height={24} />
              <span className="flex-1 text-left">{t("nav.home")}</span>
              <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">New</span>
            </button>

            {/* Section: เมนู */}
            <div className="text-xs text-gray-400 font-normal px-3 mt-3 mb-1.5" style={{ fontSize: 12 }}>
              {locale === "en" ? "Menu" : "เมนู"}
            </div>

            {/* ลูกค้า — icon: user-id.svg */}
            <div className="mb-1">
              <button
                onClick={() => setMenuOpen(prev => ({ ...prev, customer: !prev.customer }))}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                style={{ fontSize: 16, fontWeight: 400 }}
              >
                <img src="/icons/data/user-id.svg" alt="" width={24} height={24} />
                <span className="flex-1 text-left">{t("onboarding.customer")}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${menuOpen.customer ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {menuOpen.customer && (
                <div className="ml-10 mt-0.5 space-y-0.5">
                  <button onClick={() => go("s1")} className={`w-full text-left px-3 py-1.5 rounded transition-colors ${screen === "s1" ? "text-sa-primary" : "text-gray-500 hover:text-gray-700"}`} style={{ fontSize: 16, fontWeight: 400 }}>
                    • {t("onboarding.masterAccountList")}
                  </button>
                  <button onClick={() => go("s5")} className={`w-full text-left px-3 py-1.5 rounded transition-colors ${screen === "s5" ? "text-sa-primary" : "text-gray-500 hover:text-gray-700"}`} style={{ fontSize: 16, fontWeight: 400 }}>
                    • {locale === "en" ? "All Contracts" : "สัญญาทั้งหมด"}
                  </button>
                </div>
              )}
            </div>

            {/* รายงาน — icon: graph-up.svg — collapsible */}
            <div className="mb-1">
              <button
                onClick={() => setMenuOpen(prev => ({ ...prev, reports: !prev.reports }))}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                style={{ fontSize: 16, fontWeight: 400 }}
              >
                <img src="/icons/data/graph-up.svg" alt="" width={24} height={24} />
                <span className="flex-1 text-left">{locale === "en" ? "Reports" : "รายงาน"}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${menuOpen.reports ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {menuOpen.reports && (
                <div className="ml-10 mt-0.5 space-y-0.5">
                  <button onClick={() => alert(locale === "en" ? "Reports page coming soon" : "หน้ารายงาน กำลังพัฒนา")} className="w-full text-left px-3 py-1.5 rounded text-gray-500 hover:text-gray-700 transition-colors" style={{ fontSize: 16, fontWeight: 400 }}>
                    • {locale === "en" ? "All Reports" : "รายงานทั้งหมด"}
                  </button>
                </div>
              )}
            </div>

            {/* Section: ตั้งค่า */}
            <div className="text-xs text-gray-400 font-normal px-3 mt-3 mb-1.5" style={{ fontSize: 12 }}>
              {t("nav.settings")}
            </div>

            {/* ตั้งค่า — icon: settings.svg — collapsible */}
            <div className="mb-1">
              <button
                onClick={() => setMenuOpen(prev => ({ ...prev, settings: !prev.settings }))}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                style={{ fontSize: 16, fontWeight: 400 }}
              >
                <img src="/icons/commerce/settings.svg" alt="" width={24} height={24} />
                <span className="flex-1 text-left">{t("nav.settings")}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${menuOpen.settings ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {menuOpen.settings && (
                <div className="ml-10 mt-0.5 space-y-0.5">
                  <button onClick={() => alert(locale === "en" ? "User Management coming soon" : "จัดการผู้ใช้งาน กำลังพัฒนา")} className="w-full text-left px-3 py-1.5 rounded text-gray-500 hover:text-gray-700 transition-colors" style={{ fontSize: 16, fontWeight: 400 }}>
                    • {locale === "en" ? "User Management" : "จัดการผู้ใช้งาน"}
                  </button>
                  <button onClick={() => alert(locale === "en" ? "Customer Groups coming soon" : "กลุ่มลูกค้า กำลังพัฒนา")} className="w-full text-left px-3 py-1.5 rounded text-gray-500 hover:text-gray-700 transition-colors" style={{ fontSize: 16, fontWeight: 400 }}>
                    • {locale === "en" ? "Customer Groups" : "กลุ่มลูกค้า"}
                  </button>
                </div>
              )}
            </div>

            {/* Component Showcase link (dev only) */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => router.push("/component-showcase")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                style={{ fontSize: 14, fontWeight: 400 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                Component Showcase
              </button>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Main content */}
      {/* Hamburger is now inside TopBar */}

      <div className={`flex-1 flex flex-col min-h-screen bg-erp-bg transition-all duration-300 ${sidebarExpanded ? "ml-[260px]" : "ml-[68px]"}`}>
        {/* Outside click overlay — กดข้างนอก sidebar จะหุบ */}
        {sidebarExpanded && (
          <div className="fixed inset-0 z-[45]" onClick={() => setSidebarExpanded(false)} />
        )}
        {screens[screen]()}
      </div>
    </div>
  );
}
