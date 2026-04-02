"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from "next/image";
import SlidePanel from "@/components/layout/SlidePanel";
import FloatingField from "@/components/layout/FloatingField";
import FormDialog from "@/components/ui/FormDialog";
import { masterAccounts, MasterAccount, sampleTenantDetail } from "@/data/mock";
import { TextField, MenuItem, Button, Stack, Alert, Chip, IconButton, LinearProgress, Typography, Box } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type Screen = "s1" | "s2" | "s2e" | "s3" | "s4" | "s4e" | "s5" | "s6" | "s7" | "s8";

// customerGroupColors moved to MUI Chip sx inline

const allModules = sampleTenantDetail.modules;

export default function OnboardingPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("s1");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<MasterAccount>(masterAccounts[0]);
  const [showToast, setShowToast] = useState(false);

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
    { label: "อย่างน้อย 8 ตัวอักษร", ok: password.length >= 8 },
    { label: "มีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว", ok: /[A-Z]/.test(password) },
    { label: "มีตัวเลขอย่างน้อย 1 ตัว", ok: /[0-9]/.test(password) },
    { label: "มีอักขระพิเศษอย่างน้อย 1 ตัว", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const pwStrength = pwChecks.filter((c) => c.ok).length;

  // ─── TOPBAR SA ───
  const renderTopBarSA = () => (
    <div className="h-[52px] bg-sa-primary flex items-center px-4 gap-3 shrink-0">
      <div className="w-5" /> {/* spacer — hamburger toggle is the floating button */}
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
        <span className="text-white text-xs font-medium">สลิษา จิตดี</span>
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-sa-primary border-2 border-white/40">
          สจ
        </div>
      </div>
    </div>
  );

  // ─── TOPBAR TA (for email/verify screens) ───
  const TopBarTA = ({ info }: { info: string }) => (
    <div className="h-[52px] bg-brand-primary flex items-center px-4 gap-3 shrink-0">
      <span className="text-white/80 text-lg">&#9776;</span>
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
      <Breadcrumb items={[{ label: "ลูกค้า" }, { label: "รายชื่อลูกค้า" }]} />
      <div className="px-5 pt-3 pb-2">
        <h1 className="text-xl font-bold text-erp-text">รายชื่อลูกค้า</h1>
      </div>
      <div className="flex-1 px-5 pb-5">
        {/* Toolbar */}
        <div className="flex items-center gap-2.5 mb-3 flex-wrap">
          <Button variant="outlined" size="small" startIcon={<FileUploadOutlinedIcon />} sx={{ fontSize: 12 }}>
            ส่งออกรายงาน
          </Button>
          <div className="flex-1" />
          <TextField
            size="small"
            placeholder="ค้นหารายชื่อลูกค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 240, "& .MuiInputBase-input": { fontSize: 12 } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: "#999" }} /></InputAdornment> }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              setAccountForm({ company: "", firstName: "", lastName: "", position: "", customerGroup: "ทั่วไป", email: "", phone: "", tenantQuota: "3" });
              setEmailError(false);
              setAddAccountOpen(true);
            }}
            sx={{ bgcolor: "#FF6B00", "&:hover": { bgcolor: "#E65C00" }, fontWeight: 600, fontSize: 12 }}
          >
            + เพิ่มลูกค้า
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-erp-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white border-b border-erp-border">
                <th className="px-3.5 py-3 text-left text-[11px] font-semibold text-erp-muted whitespace-nowrap">รหัส Account</th>
                <th className="px-3.5 py-3 text-left text-[11px] font-semibold text-erp-muted">ชื่อ-นามสกุล</th>
                <th className="px-3.5 py-3 text-left text-[11px] font-semibold text-erp-muted">กลุ่มลูกค้า</th>
                <th className="px-3.5 py-3 text-left text-[11px] font-semibold text-erp-muted">อีเมล (Master Email)</th>
                <th className="px-3.5 py-3 text-left text-[11px] font-semibold text-erp-muted">เบอร์โทรศัพท์</th>
                <th className="px-3.5 py-3 text-left text-[11px] font-semibold text-erp-muted">วันที่ยืนยัน Email</th>
                <th className="px-3.5 py-3 text-left text-[11px] font-semibold text-erp-muted">จำนวนธุรกิจ</th>
                <th className="px-3.5 py-3 text-left text-[11px] font-semibold text-erp-muted">สถานะ</th>
                <th className="px-3.5 py-3 text-left text-[11px] font-semibold text-erp-muted">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-gray-50 hover:bg-[#f8f6ff] cursor-pointer transition-colors"
                  onClick={() => { setSelectedAccount(a); setDetailTab("general"); go("s5"); }}
                >
                  <td className="px-3.5 py-3">
                    <span className="font-mono text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      {a.id}
                    </span>
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="font-semibold text-erp-text">{a.firstName} {a.lastName}</div>
                    <div className="text-[11px] text-erp-muted">{a.position}</div>
                  </td>
                  <td className="px-3.5 py-3">
                    <Chip
                      label={a.customerGroup}
                      size="small"
                      sx={{
                        fontSize: 11, fontWeight: 500, "& .MuiChip-label": { px: 1 },
                        ...(a.customerGroup === "ขายส่ง" ? { bgcolor: "#F3E8FF", color: "#6B21A8" } :
                            a.customerGroup === "ขายปลีก" ? { bgcolor: "#ECFDF5", color: "#166534" } :
                            a.customerGroup === "VIP" ? { bgcolor: "#EFF6FF", color: "#1E40AF" } :
                            { bgcolor: "#FFF7ED", color: "#C2410C" })
                      }}
                    />
                  </td>
                  <td className="px-3.5 py-3 text-xs text-gray-500">{a.email}</td>
                  <td className="px-3.5 py-3 text-xs">{a.phone}</td>
                  <td className="px-3.5 py-3 text-xs text-erp-muted">{a.emailVerifiedAt || "—"}</td>
                  <td className="px-3.5 py-3">
                    <span className="font-semibold text-sa-primary">{a.tenantUsed}</span>
                    <span className="text-erp-muted">/{a.tenantQuota}</span>
                  </td>
                  <td className="px-3.5 py-3">
                    <Chip
                      label={a.status}
                      size="small"
                      variant="outlined"
                      color={a.status === "เปิดใช้งาน" ? "success" : a.status === "รอยืนยัน Email" ? "error" : "default"}
                      sx={{ fontSize: 11, fontWeight: 600, "& .MuiChip-label": { px: 1 } }}
                    />
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="flex items-center gap-0.5">
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); setSelectedAccount(a); setDetailTab("general"); go("s5"); }}
                        sx={{ color: "#999", "&:hover": { color: "#FF6B00" } }}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                        sx={{ color: "#999", "&:hover": { color: "#FF6B00" } }}
                      >
                        <MoreVertIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex items-center justify-end gap-2 px-3.5 py-2.5 border-t border-erp-border text-xs text-erp-muted">
            <span>จำนวนรายการต่อหน้า</span>
            <select className="px-1.5 py-0.5 border border-erp-border rounded text-[11px]">
              <option>6</option><option>12</option><option>25</option>
            </select>
            <span className="mx-1">1–{filtered.length} of {filtered.length}</span>
            <button className="w-6 h-6 rounded border border-erp-border bg-white flex items-center justify-center text-xs hover:bg-gray-50">&#8249;</button>
            <button className="w-6 h-6 rounded border border-sa-primary bg-sa-primary text-white flex items-center justify-center text-xs">1</button>
            <button className="w-6 h-6 rounded border border-erp-border bg-white flex items-center justify-center text-xs hover:bg-gray-50">&#8250;</button>
          </div>
        </div>
      </div>
      <div className="px-5 py-2.5 text-[11px] text-gray-400 border-t border-erp-border bg-white text-center">
        &copy; 2569, Made with &#10084; by ERP Jigsaw
      </div>

      {/* === Add Account Modal (FormDialog from Showcase) === */}
      <FormDialog
        open={addAccountOpen}
        onClose={() => setAddAccountOpen(false)}
        title="สร้าง Master Account"
        maxWidth="sm"
        fullWidth
        footer={
          <>
            <Button onClick={() => setAddAccountOpen(false)}>ยกเลิก</Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "#FF6B00", "&:hover": { bgcolor: "#E65C00" } }}
              onClick={() => { setAddAccountOpen(false); go("s3"); }}
            >
              บันทึก
            </Button>
          </>
        }
      >
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="ชื่อบริษัท / ห้างร้าน"
            size="small"
            fullWidth
            value={accountForm.company}
            onChange={(e) => setAccountForm({ ...accountForm, company: e.target.value })}
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="ชื่อ"
              size="small"
              fullWidth
              required
              value={accountForm.firstName}
              onChange={(e) => setAccountForm({ ...accountForm, firstName: e.target.value })}
            />
            <TextField
              label="นามสกุล"
              size="small"
              fullWidth
              required
              value={accountForm.lastName}
              onChange={(e) => setAccountForm({ ...accountForm, lastName: e.target.value })}
            />
          </Stack>
          <TextField
            label="ตำแหน่ง"
            size="small"
            fullWidth
            required
            value={accountForm.position}
            onChange={(e) => setAccountForm({ ...accountForm, position: e.target.value })}
          />
          <TextField
            label="กลุ่มลูกค้า"
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
            label="อีเมล (Master Email)"
            size="small"
            fullWidth
            required
            value={accountForm.email}
            onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
          />
          <TextField
            label="เบอร์โทรศัพท์"
            size="small"
            fullWidth
            required
            value={accountForm.phone}
            onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
            InputProps={{ startAdornment: <span style={{ marginRight: 8, fontSize: 13, color: "#999", whiteSpace: "nowrap" }}>+66</span> }}
          />
          <TextField
            label="จำนวนธุรกิจ (Tenant Quota)"
            size="small"
            fullWidth
            required
            type="number"
            value={accountForm.tenantQuota}
            onChange={(e) => setAccountForm({ ...accountForm, tenantQuota: e.target.value })}
            helperText="จำนวน Tenant สูงสุดที่สร้างได้ภายใต้ Account นี้"
          />
          <Alert severity="info" variant="outlined" sx={{ fontSize: 12 }}>
            ระบบจะส่ง Email ยืนยันตัวตนให้ผู้ติดต่อทันที
          </Alert>
        </Stack>
      </FormDialog>
    </div>
  );

  // ═══════════════════ S2: CREATE ACCOUNT PANEL ═══════════════════
  const renderS2 = () => (
    <div className="flex flex-col flex-1">
      {renderTopBarSA()}
      <Breadcrumb items={[{ label: "Master Accounts", onClick: () => go("s1") }, { label: "สร้างใหม่" }]} />
      <div className="px-5 pt-3 pb-2">
        <h1 className="text-xl font-bold text-erp-text">Master Accounts</h1>
      </div>
      <div className="flex-1 relative">
        <SlidePanel
          open={true}
          title="สร้าง Master Account"
          onClose={() => go("s1")}
          headerColor="sa"
          footer={
            <>
              <button onClick={() => go("s1")} className="px-4 py-2 border border-erp-border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                ยกเลิก
              </button>
              <button onClick={() => go("s3")} className="px-4 py-2 bg-sa-primary hover:bg-sa-hover text-white text-sm rounded-lg font-medium transition-colors">
                บันทึก
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <FloatingField label="ชื่อบริษัท / ห้างร้าน" value={accountForm.company} onChange={(v) => setAccountForm({ ...accountForm, company: v })} variant="sa" />
            <div className="grid grid-cols-2 gap-3">
              <FloatingField label="ชื่อ" value={accountForm.firstName} onChange={(v) => setAccountForm({ ...accountForm, firstName: v })} variant="sa" required />
              <FloatingField label="นามสกุล" value={accountForm.lastName} onChange={(v) => setAccountForm({ ...accountForm, lastName: v })} variant="sa" required />
            </div>
            <FloatingField label="ตำแหน่ง" value={accountForm.position} onChange={(v) => setAccountForm({ ...accountForm, position: v })} variant="sa" required />
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
              <label>กลุ่มลูกค้า <span className="text-erp-error">*</span></label>
            </div>
            <div>
              <FloatingField label="อีเมล (Master Email)" value={accountForm.email} onChange={(v) => setAccountForm({ ...accountForm, email: v })} variant="sa" required />
              {accountForm.email && !emailError && (
                <p className="text-[10px] text-green-600 mt-1 pl-0.5">&#10003; ยังไม่มีในระบบ &middot; ใช้เป็น login หลักของ Account นี้</p>
              )}
            </div>
            <div>
              <p className="text-[11px] text-erp-muted mb-1.5 font-medium">เบอร์โทรศัพท์ <span className="text-erp-error">*</span></p>
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
            <FloatingField label="จำนวนธุรกิจ (Tenant Quota)" value={accountForm.tenantQuota} onChange={(v) => setAccountForm({ ...accountForm, tenantQuota: v })} variant="sa" required type="number" />
            <p className="text-[11px] text-erp-muted -mt-2 pl-0.5">จำนวน Tenant สูงสุดที่สร้างได้ภายใต้ Account นี้</p>
            <div className="p-2.5 bg-[#FF6B00]/10 rounded-md border border-[#FF6B00]/20 text-xs text-sa-primary">
              ระบบจะส่ง Email ยืนยันตัวตนให้ผู้ติดต่อทันที
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
      <Breadcrumb items={[{ label: "Master Accounts", onClick: () => go("s1") }, { label: "สร้างใหม่" }]} />
      <div className="px-5 pt-3 pb-2">
        <h1 className="text-xl font-bold text-erp-text">Master Accounts</h1>
      </div>
      <div className="flex-1 relative">
        <SlidePanel
          open={true}
          title="สร้าง Master Account"
          onClose={() => go("s1")}
          headerColor="sa"
          footer={
            <>
              <button onClick={() => go("s1")} className="px-4 py-2 border border-erp-border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                ยกเลิก
              </button>
              <button disabled className="px-4 py-2 bg-sa-primary text-white text-sm rounded-lg font-medium opacity-40 cursor-not-allowed">
                บันทึก
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <FloatingField label="ชื่อ-นามสกุล" value="วิภา รัตนพันธ์" onChange={() => {}} variant="sa" required />
            <FloatingField label="ตำแหน่ง" value="CEO" onChange={() => {}} variant="sa" required />
            <div>
              <div className="field-group sa required">
                <input value="wipa@thaimart.co.th" readOnly className="!border-erp-error" />
                <label>อีเมล (Master Email) <span className="text-erp-error">*</span></label>
              </div>
              <p className="text-[10px] text-erp-error mt-1 pl-0.5">&#10005; อีเมลนี้มีในระบบแล้ว</p>
            </div>
            <div>
              <p className="text-[11px] text-erp-muted mb-1.5 font-medium">เบอร์โทรศัพท์ <span className="text-erp-error">*</span></p>
              <div className="flex border-[1.5px] border-erp-border rounded-md overflow-hidden">
                <div className="px-2.5 py-2 bg-gray-50 border-r border-erp-border flex items-center gap-1 text-xs text-erp-muted">
                  &#127481;&#127469; +66 &#9662;
                </div>
                <input className="flex-1 px-3 py-2 text-sm outline-none" value="0894567890" readOnly />
              </div>
            </div>
            <FloatingField label="Tenant Quota" value="5" onChange={() => {}} variant="sa" required type="number" />
            <div className="p-2.5 bg-red-50 rounded-md border border-red-200 text-xs text-erp-error">
              &#9888; กรุณาแก้ไขข้อมูลให้ถูกต้องก่อนบันทึก
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
          <h2 className="text-lg font-bold text-center mb-1">ยืนยันอีเมลสำเร็จ!</h2>
          <p className="text-xs text-erp-muted text-center leading-relaxed mb-4">
            กรุณาตั้งรหัสผ่านเพื่อเริ่มใช้งาน Master Account
          </p>
          <div className="text-center mb-5">
            <span className="inline-block text-[11px] px-3.5 py-1 bg-gray-50 rounded-full text-erp-muted border border-erp-border">
              somchai@siamgroup.co.th
            </span>
          </div>

          {/* Password field (MUI) */}
          <TextField
            label="รหัสผ่านใหม่"
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
          {pwStrength === 4 && <Typography variant="caption" sx={{ color: "success.main", fontWeight: 600, display: "block", mb: 1 }}>รหัสผ่านแข็งแกร่ง</Typography>}

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
            label="ยืนยันรหัสผ่าน"
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
            ตั้งรหัสผ่านและเริ่มใช้งาน
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
          <h2 className="text-lg font-bold text-center mb-1 text-erp-error">ลิงก์นี้ใช้งานไม่ได้แล้ว</h2>
          <p className="text-xs text-erp-muted text-center leading-relaxed mb-4">
            ลิงก์อาจหมดอายุแล้ว (48 ชั่วโมง)<br />หรืออาจถูกใช้งานไปแล้ว
          </p>
          <div className="text-xs text-erp-muted text-center mb-5 p-2.5 bg-gray-50 rounded-md">
            กรุณาติดต่อทีม Jigsaw เพื่อขอลิงก์ใหม่<br />
            <strong>support@jigsawerp.com</strong>
          </div>
          <button className="w-full py-3 bg-erp-error hover:bg-red-700 text-white rounded-md text-sm font-bold transition-colors">
            ขอลิงก์ใหม่
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
        <h1 className="text-xl font-bold pt-3 pb-2.5">ข้อมูลลูกค้า</h1>
        <div className="flex gap-0">
          {(["general", "tenants", "contracts", "history"] as const).map((tab) => {
            const labels = {
              general: "ข้อมูลทั่วไป",
              tenants: `Tenants (${selectedAccount.tenantUsed}/${selectedAccount.tenantQuota})`,
              contracts: "สัญญา",
              history: "ประวัติ",
            };
            return (
              <button
                key={tab}
                onClick={() => setDetailTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
                  detailTab === tab
                    ? "bg-sa-primary text-white"
                    : "text-erp-muted hover:text-erp-text"
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>
      {/* Detail Body */}
      <div className="flex-1 p-5 overflow-y-auto">
        {detailTab === "general" && (
          <>
            {/* General Info Card */}
            <div className="bg-white rounded-lg border border-erp-border p-5 mb-3.5">
              <h3 className="text-sm font-bold text-sa-primary mb-3.5">ข้อมูลทั่วไป</h3>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="field-group sa">
                  <input value={selectedAccount.id} readOnly className="!bg-gray-50 !text-blue-700 !font-mono !font-semibold" />
                  <label>รหัส Account</label>
                </div>
                <div className="field-group sa">
                  <select defaultValue={selectedAccount.customerGroup}>
                    <option>ทั่วไป</option><option>ขายส่ง</option><option>ขายปลีก</option><option>VIP</option><option>Founding Partner</option>
                  </select>
                  <label>กลุ่มลูกค้า <span className="text-erp-error">*</span></label>
                </div>
                <FloatingField label="ชื่อ" value={selectedAccount.firstName} onChange={() => {}} variant="sa" required />
                <FloatingField label="นามสกุล" value={selectedAccount.lastName} onChange={() => {}} variant="sa" required />
                <div className="field-group sa">
                  <select><option>นาย</option><option>นาง</option><option>นางสาว</option></select>
                  <label>คำนำหน้า <span className="text-erp-error">*</span></label>
                </div>
                <FloatingField label="ตำแหน่ง" value={selectedAccount.position} onChange={() => {}} variant="sa" />
                <FloatingField label="ชื่อบริษัท / ห้างร้าน" value={selectedAccount.company} onChange={() => {}} variant="sa" />
                <FloatingField label="อีเมล" value={selectedAccount.email} onChange={() => {}} variant="sa" required />
                <div>
                  <p className="text-[11px] text-erp-muted mb-1 font-medium">เบอร์โทรศัพท์</p>
                  <div className="flex border-[1.5px] border-erp-border rounded-md overflow-hidden">
                    <div className="px-2.5 py-2 bg-gray-50 border-r border-erp-border flex items-center gap-1 text-xs text-erp-muted">
                      &#127481;&#127469; +66 &#9662;
                    </div>
                    <input className="flex-1 px-3 py-2 text-sm outline-none" defaultValue={selectedAccount.phone} />
                  </div>
                </div>
                <div className="field-group sa">
                  <input value={selectedAccount.emailVerifiedAt || "—"} readOnly className="!bg-gray-50 !text-erp-muted" />
                  <label>วันที่ยืนยัน Email</label>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] text-erp-muted mb-1.5 font-medium">สถานะ</p>
                  <div className="flex gap-5">
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedAccount.status === "เปิดใช้งาน" ? "border-sa-primary" : "border-erp-border"}`}>
                        {selectedAccount.status === "เปิดใช้งาน" && <span className="w-2 h-2 rounded-full bg-sa-primary" />}
                      </span>
                      เปิดใช้งาน
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedAccount.status === "ปิดใช้งาน" ? "border-sa-primary" : "border-erp-border"}`}>
                        {selectedAccount.status === "ปิดใช้งาน" && <span className="w-2 h-2 rounded-full bg-sa-primary" />}
                      </span>
                      ปิดใช้งาน
                    </label>
                  </div>
                </div>
                <div className="field-group sa">
                  <input value={`${selectedAccount.createdAt} — ${selectedAccount.createdBy}`} readOnly className="!bg-gray-50 !text-erp-muted" />
                  <label>วันที่ลงทะเบียน</label>
                </div>
                <div className="field-group sa">
                  <input value={`${selectedAccount.updatedAt} — ${selectedAccount.updatedBy}`} readOnly className="!bg-gray-50 !text-erp-muted" />
                  <label>วันที่แก้ไขล่าสุด</label>
                </div>
              </div>

              {/* SA Actions */}
              <div className="mt-3.5 p-3 bg-[#FF6B00]/5 rounded-lg border border-[#FF6B00]/15">
                <p className="text-[11px] font-semibold text-sa-primary mb-2">&#9881; การดำเนินการของ Super Admin</p>
                <div className="flex gap-2 flex-wrap">
                  <button className="px-3 py-1.5 bg-white border border-erp-border rounded-md text-xs hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
                    &#128231; Reset Email ยืนยัน
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-erp-error rounded-md text-xs text-erp-error hover:bg-red-50 flex items-center gap-1.5 transition-colors">
                    &#128273; Reset รหัสผ่าน
                  </button>
                </div>
                <p className="text-[11px] text-erp-muted mt-1.5">ผู้ติดต่อจะได้รับ Email พร้อมลิงก์ดำเนินการ</p>
              </div>

              <div className="flex justify-end gap-2.5 mt-3.5">
                <button className="px-4 py-2 border border-erp-border rounded-lg text-sm hover:bg-gray-50 transition-colors">ยกเลิก</button>
                <button className="px-4 py-2 bg-sa-primary hover:bg-sa-hover text-white text-sm rounded-lg font-medium transition-colors">บันทึก</button>
              </div>
            </div>

            {/* Tenant Quota Card */}
            <div className="bg-white rounded-lg border border-erp-border p-5">
              <h3 className="text-sm font-bold text-sa-primary mb-3.5">ข้อมูล Tenant Quota</h3>
              <div className="bg-[#FF6B00]/10 rounded-md px-3 py-2 text-xs text-sa-primary border border-[#FF6B00]/20">
                Tenant Quota: <strong>{selectedAccount.tenantUsed} / {selectedAccount.tenantQuota} บริษัท</strong> &middot; เหลืออีก {selectedAccount.tenantQuota - selectedAccount.tenantUsed} บริษัทที่สามารถสร้างได้
              </div>
              {selectedAccount.tenantUsed === 0 ? (
                <div className="mt-3 flex flex-col items-center justify-center p-6 bg-orange-50 rounded-lg border border-orange-200 gap-2">
                  <p className="text-sm text-orange-600 font-medium">ยังไม่มี Tenant ภายใต้ Account นี้</p>
                  <button
                    onClick={() => go("s6")}
                    className="mt-1 px-4 py-2 bg-sa-primary hover:bg-sa-hover text-white text-sm rounded-md font-medium transition-colors"
                  >
                    + สร้าง Tenant ใหม่
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
              <h3 className="text-sm font-bold text-sa-primary">Tenants ภายใต้ Account นี้</h3>
              <span className="text-xs text-erp-muted">{selectedAccount.tenantUsed} จาก {selectedAccount.tenantQuota} บริษัท</span>
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
            <p className="text-erp-muted text-sm">ยังไม่มีข้อมูล</p>
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
        { label: "สร้าง Tenant" },
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
                ยกเลิก
              </button>
              <button onClick={() => go("s7")} className="px-4 py-2 bg-sa-primary hover:bg-sa-hover text-white text-sm rounded-lg font-medium transition-colors">
                บันทึก
              </button>
            </>
          }
        >
          <div className="space-y-3">
            {/* Section: ข้อมูลนิติบุคคล */}
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-xs font-semibold text-erp-muted whitespace-nowrap">ข้อมูลนิติบุคคล</span>
              <div className="flex-1 h-px bg-erp-border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FloatingField label="ชื่อบริษัท (TH)" value={tenantForm.nameTh} onChange={(v) => setTenantForm({ ...tenantForm, nameTh: v })} variant="sa" required />
              <FloatingField label="ชื่อบริษัท (EN)" value={tenantForm.nameEn} onChange={(v) => setTenantForm({ ...tenantForm, nameEn: v })} variant="sa" required />
              <div className="field-group sa">
                <select value={tenantForm.entityType} onChange={(e) => setTenantForm({ ...tenantForm, entityType: e.target.value })}>
                  <option>บริษัทจำกัด (บจ.)</option><option>ห้างหุ้นส่วนจำกัด (หจก.)</option><option>บริษัทมหาชน (บมจ.)</option>
                </select>
                <label>ประเภทนิติบุคคล <span className="text-erp-error">*</span></label>
              </div>
              <div className="field-group sa">
                <select value={tenantForm.businessType} onChange={(e) => setTenantForm({ ...tenantForm, businessType: e.target.value })}>
                  <option>Trading — ซื้อมาขายไป</option><option>Manufacturing — ผลิต</option><option>Service — บริการ</option>
                </select>
                <label>ประเภทธุรกิจ <span className="text-erp-error">*</span></label>
              </div>
              <FloatingField label="เลขผู้เสียภาษี" value={tenantForm.taxId} onChange={(v) => setTenantForm({ ...tenantForm, taxId: v })} variant="sa" required />
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
              <div className="grid grid-cols-3 gap-2">
                {(["Cloud", "Dedicated", "On-premise"] as const).map((tier) => {
                  const subs = { Cloud: "Shared · Huawei", Dedicated: "Private · Huawei", "On-premise": "Server ลูกค้า" };
                  return (
                    <button
                      key={tier}
                      onClick={() => setTenantForm({ ...tenantForm, tier })}
                      className={`border rounded-md p-2.5 text-left transition-colors ${
                        tenantForm.tier === tier
                          ? "border-sa-primary bg-[#FF6B00]/10"
                          : "border-erp-border bg-white hover:border-sa-primary"
                      }`}
                    >
                      <div className="text-xs font-semibold">{tier}</div>
                      <div className="text-[10px] text-erp-muted mt-0.5">{subs[tier]}</div>
                    </button>
                  );
                })}
              </div>
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
                <div className="flex border border-erp-border rounded-md overflow-hidden">
                  {(["ชั่วโมง", "วัน"] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setTenantForm({ ...tenantForm, backupUnit: u })}
                      className={`px-3 py-1.5 text-[11px] transition-colors ${
                        tenantForm.backupUnit === u
                          ? "bg-sa-primary text-white"
                          : "bg-white text-erp-muted hover:bg-gray-50"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
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
                สัญญา
              </p>
              <div className="grid grid-cols-2 gap-3">
                <FloatingField label="วันเริ่มสัญญา" value={tenantForm.contractStart} onChange={(v) => setTenantForm({ ...tenantForm, contractStart: v })} variant="sa" required />
                <FloatingField label="วันหมดสัญญา" value={tenantForm.contractEnd} onChange={(v) => setTenantForm({ ...tenantForm, contractEnd: v })} variant="sa" required />
              </div>
              <div className="mt-3">
                <p className="text-[11px] text-erp-muted mb-1.5 font-medium">Auto-renewal</p>
                <div className="flex gap-5">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${tenantForm.autoRenewal ? "border-sa-primary" : "border-erp-border"}`}>
                      {tenantForm.autoRenewal && <span className="w-2 h-2 rounded-full bg-sa-primary" />}
                    </span>
                    ต่ออายุอัตโนมัติ
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!tenantForm.autoRenewal ? "border-sa-primary" : "border-erp-border"}`}>
                      {!tenantForm.autoRenewal && <span className="w-2 h-2 rounded-full bg-sa-primary" />}
                    </span>
                    ไม่ต่ออายุอัตโนมัติ
                  </label>
                </div>
              </div>
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
        { label: "รายชื่อลูกค้า", onClick: () => go("s1") },
        { label: "สมชาย วงศ์ใหญ่" },
      ]} />
      {/* Detail Header */}
      <div className="px-5 bg-white border-b border-erp-border">
        <h1 className="text-xl font-bold pt-3 pb-2.5">ข้อมูลลูกค้า</h1>
        <div className="flex gap-0">
          <button className="px-4 py-2 text-sm font-medium text-erp-muted hover:text-erp-text rounded-t transition-colors">
            ข้อมูลทั่วไป
          </button>
          <button className="px-4 py-2 text-sm font-medium bg-sa-primary text-white rounded-t transition-colors">
            Tenants (1/3)
          </button>
          <button className="px-4 py-2 text-sm font-medium text-erp-muted hover:text-erp-text rounded-t transition-colors">
            สัญญา
          </button>
          <button className="px-4 py-2 text-sm font-medium text-erp-muted hover:text-erp-text rounded-t transition-colors">
            ประวัติ
          </button>
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 p-5">
        <div className="bg-white rounded-lg border border-erp-border p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-sa-primary">Tenants ภายใต้ Account นี้</h3>
            <span className="text-xs text-erp-muted">1 จาก 3 บริษัท</span>
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

  const navItems: { id: Screen; num: string; label: string; section?: string }[] = [
    { id: "s1", num: "01", label: "Master Account List", section: "Step 1 — SA สร้าง Account" },
    { id: "s2", num: "02", label: "ฟอร์มสร้าง Account" },
    { id: "s2e", num: "02e", label: "Error — Email ซ้ำ" },
    { id: "s3", num: "03", label: "Email: Verify", section: "Step 2 — TA ยืนยัน Email" },
    { id: "s4", num: "04", label: "ตั้ง Password" },
    { id: "s4e", num: "04e", label: "Token หมดอายุ" },
    { id: "s5", num: "05", label: "Account Detail", section: "Step 3 — SA สร้าง Tenant" },
    { id: "s6", num: "06", label: "ฟอร์มสร้าง Tenant" },
    { id: "s7", num: "07", label: "Email: Welcome" },
    { id: "s8", num: "08", label: "Tenant List (Done)" },
  ];

  return (
    <div className="min-h-screen bg-erp-bg flex">
      {/* Sidebar — Icon Bar + Expandable Nav */}
      <div className={`fixed h-screen z-50 flex transition-all duration-300 ${sidebarExpanded ? "w-[272px]" : "w-[52px]"}`}>
        {/* Icon Bar (always visible) */}
        <div className="w-[52px] bg-[#2D2D2D] flex flex-col items-center shrink-0">
          <div className="w-[52px] h-14 bg-sa-primary flex items-center justify-center cursor-pointer" onClick={() => router.push("/")}>
            <span className="text-[9px] font-extrabold text-white text-center leading-tight tracking-wider">JIG<br />SAW</span>
          </div>
          <div className="mt-1 flex flex-col gap-0.5">
            {/* Page menu item (first) */}
            <div
              className="w-11 h-10 flex items-center justify-center rounded-md cursor-pointer text-sm transition-colors bg-[#FF6B00]/15 text-sa-primary"
              title="Page"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            {/* Component Showcase link */}
            <div
              className="w-11 h-10 flex items-center justify-center rounded-md cursor-pointer text-sm transition-colors text-gray-500 hover:bg-[#3a3a3a] hover:text-white"
              title="Component Showcase"
              onClick={() => router.push("/component-showcase")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            {/* Nav icons (SVG) */}
            {[
              { title: "Home", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
              { title: "Recent", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
              { title: "Clipboard", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg> },
              { title: "Mail", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg> },
              { title: "Users", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, active: true },
              { title: "Tags", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
              { title: "Charts", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
            ].map((item, i) => (
              <div
                key={i}
                className={`w-11 h-10 flex items-center justify-center rounded-md cursor-pointer text-sm transition-colors ${
                  item.active ? "bg-[#FF6B00]/15 text-sa-primary" : "text-gray-500 hover:bg-[#3a3a3a] hover:text-white"
                }`}
                title={item.title}
              >
                {item.svg}
              </div>
            ))}
          </div>
          <div className="flex-1" />
          <div className="mb-2 flex flex-col gap-0.5">
            <div className="w-11 h-10 flex items-center justify-center rounded-md cursor-pointer text-sm text-gray-500 hover:bg-[#3a3a3a] hover:text-white" title="Settings">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </div>
            <div className="w-11 h-10 flex items-center justify-center rounded-md cursor-pointer text-sm text-gray-500 hover:bg-[#3a3a3a] hover:text-white" title="More">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </div>
          </div>
        </div>

        {/* Expandable Nav Panel (Screen Index / Page list) */}
        <div className={`bg-[#12121f] overflow-hidden transition-all duration-300 ${sidebarExpanded ? "w-[220px] opacity-100" : "w-0 opacity-0"}`}>
          <div className="w-[220px] h-full overflow-y-auto">
            <div className="px-3 py-2 pb-3 border-b border-[#2a2a3e] bg-[#0e0e1a]">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Page — F-01 Wireframe
              </div>
              <div className="text-[10px] text-gray-600 mt-0.5">ERP Jigsaw — Onboarding ({navItems.length} screens)</div>
            </div>
            <div className="py-1.5">
              {navItems.map((item) => (
                <div key={item.id}>
                  {item.section && (
                    <div className="px-3 pt-2 pb-1 text-[9px] font-semibold text-gray-500 uppercase tracking-wider">
                      {item.section}
                    </div>
                  )}
                  <button
                    onClick={() => go(item.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs border-l-2 transition-colors ${
                      screen === item.id
                        ? "text-white bg-[#1a1a2e] border-l-sa-primary"
                        : "text-gray-500 border-transparent hover:text-gray-300 hover:bg-[#1a1a2e]"
                    }`}
                  >
                    <span className="font-mono text-[10px] w-5 opacity-70">{item.num}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.id === "s8" && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-sa-primary text-white">&#10003;</span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-h-screen bg-erp-bg transition-all duration-300 ${sidebarExpanded ? "ml-[272px]" : "ml-[52px]"}`}>
        {/* Floating hamburger toggle — always mounted by React */}
        <button
          type="button"
          onClick={() => setSidebarExpanded(prev => !prev)}
          className="fixed z-[60] w-8 h-8 flex items-center justify-center text-white/80 hover:text-white text-lg transition-colors"
          style={{ top: 10, left: sidebarExpanded ? 284 : 64 }}
          title={sidebarExpanded ? "หุบเมนู" : "กางเมนู"}
        >
          &#9776;
        </button>
        {screens[screen]()}
      </div>
    </div>
  );
}
