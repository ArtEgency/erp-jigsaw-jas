"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { masterAccounts } from "@/data/mock";
import { useLocale } from "@/lib/locale";
import DashboardShell from "@/components/layout/DashboardShell";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  Box, Typography, Paper, Chip, Button, TextField, MenuItem,
  Tabs, Tab, Radio, RadioGroup, FormControlLabel, Stack, IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";

const SA = "#FF6B00";

/* ── Field sx — View mode (read-only, gray bg) ── */
const VIEW_FIELD = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#F8F8F9", borderRadius: "8px", fontSize: 16,
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(76,78,100,0.22)" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(76,78,100,0.22)" },
  },
  "& .MuiInputLabel-root": { fontSize: 15, color: "#6B7280" },
  "& .MuiFormLabel-asterisk": { color: "#FF4D49" },
};

/* ── Field sx — Edit mode (white bg, focus orange) ── */
const EDIT_FIELD = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#FFFFFF", borderRadius: "8px", fontSize: 16,
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(76,78,100,0.22)" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: SA },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: SA, borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": { fontSize: 15, color: "#6B7280", "&.Mui-focused": { color: SA } },
  "& .MuiFormLabel-asterisk": { color: "#FF4D49" },
};

/* ── Status badge colors ── */
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  "กำลังใช้งาน": { bg: "#EEFBE5", color: "#3B6D11" },
  "รอยืนยัน": { bg: "#FFF7ED", color: "#C2410C" },
  "รอสร้างธุรกิจ": { bg: "#EFF6FF", color: "#1D4ED8" },
  "ระงับการใช้งาน": { bg: "#FEF2F2", color: "#B91C1C" },
  "หมดอายุ": { bg: "#F5F5F5", color: "#737373" },
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { locale } = useLocale();
  const [detailTab, setDetailTab] = useState(0);

  const account = masterAccounts.find((a) => a.id === params.id) || masterAccounts[0];
  const statusStyle = STATUS_COLORS[account.status] || { bg: "#F0F0F0", color: "#999" };

  /* ── Edit Mode state ── */
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    company: account.company,
    customerGroup: account.customerGroup,
    tenantQuota: String(account.tenantQuota),
    title: "นางสาว",
    firstName: account.firstName,
    lastName: account.lastName,
    position: account.position,
    email: account.email,
    phone: account.phone,
  });

  /* ── Toggle status confirm ── */
  const isActive = account.status === "กำลังใช้งาน";
  const [statusValue, setStatusValue] = useState(isActive ? "active" : "inactive");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");

  const handleStatusChange = (newValue: string) => {
    setPendingStatus(newValue);
    setConfirmOpen(true);
  };

  const handleStatusConfirm = () => {
    setStatusValue(pendingStatus);
    setConfirmOpen(false);
    // TODO: API call to update status
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    // Reset form to original values
    setForm({
      company: account.company,
      customerGroup: account.customerGroup,
      tenantQuota: String(account.tenantQuota),
      title: "นางสาว",
      firstName: account.firstName,
      lastName: account.lastName,
      position: account.position,
      email: account.email,
      phone: account.phone,
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    // TODO: API call to save
    setIsEditing(false);
  };

  const fieldSx = isEditing ? EDIT_FIELD : VIEW_FIELD;
  const readOnly = !isEditing;

  return (
    <DashboardShell>
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7F7F9" }}>
      {/* ── Breadcrumb ── */}
      <Box sx={{ px: 3, pt: 2 }}>
        <Stack direction="row" alignItems="center" gap={0.5} sx={{ fontSize: 15 }}>
          <IconButton size="small" onClick={() => router.push("/tenantlist")} sx={{ mr: 0.5 }}>
            <ArrowBackIcon sx={{ fontSize: 20, color: "#6B7280" }} />
          </IconButton>
          <Typography sx={{ color: "#6B7280", fontSize: 15, cursor: "pointer" }} onClick={() => router.push("/tenantlist")}>
            {locale === "en" ? "Customers" : "ลูกค้า"}
          </Typography>
          <Typography sx={{ color: "#9CA3AF", mx: 0.5 }}>›</Typography>
          <Typography sx={{ color: "#374151", fontWeight: 700, fontSize: 15 }}>
            {locale === "en" ? "Customer Info" : "ข้อมูลลูกค้า"}
          </Typography>
        </Stack>
      </Box>

      {/* ── Header + Status Badge ── */}
      <Box sx={{ px: 3, pt: 1.5, pb: 1, display: "flex", alignItems: "center", gap: 2 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#374151" }}>
          {locale === "en" ? "Customer Info" : "ข้อมูลลูกค้า"}
        </Typography>
        <Chip
          label={account.status}
          size="small"
          sx={{ fontWeight: 600, fontSize: 13, bgcolor: statusStyle.bg, color: statusStyle.color, height: 28, px: 1 }}
        />
        {isEditing && (
          <Chip label={locale === "en" ? "Editing" : "กำลังแก้ไข"} size="small" sx={{ fontWeight: 600, fontSize: 12, bgcolor: "#FFF7ED", color: SA, height: 24 }} />
        )}
      </Box>

      {/* ── Tabs ── */}
      <Box sx={{ px: 3 }}>
        <Tabs
          value={detailTab}
          onChange={(_, v) => setDetailTab(v)}
          sx={{
            mb: 2,
            "& .MuiTab-root": { textTransform: "none", fontWeight: 500, fontSize: "1rem", minHeight: 42, borderRadius: "8px", mr: 1, px: 2 },
            "& .Mui-selected": { bgcolor: SA, color: "#fff !important", fontWeight: 600 },
            "& .MuiTabs-indicator": { display: "none" },
          }}
        >
          <Tab label={locale === "en" ? "General Info" : "ข้อมูลทั่วไป"} />
          <Tab label={locale === "en" ? `Business Info (${account.tenantUsed}/${account.tenantQuota})` : `ข้อมูลธุรกิจ (${account.tenantUsed}/${account.tenantQuota})`} />
          <Tab label={locale === "en" ? "History" : "ประวัติ"} />
        </Tabs>
      </Box>

      {/* ── Tab Content ── */}
      <Box sx={{ px: 3, pb: 4 }}>
        {detailTab === 0 && (
          <Paper sx={{ borderRadius: "10px", p: 3, boxShadow: "0px 2px 10px rgba(76,78,100,0.12)" }}>
            {/* Section Title */}
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: SA, mb: 3 }}>
              {locale === "en" ? "General Info" : "ข้อมูลทั่วไป"}
            </Typography>

            {/* Row 1 — 4 cols */}
            <Stack direction="row" spacing={2.5} sx={{ mb: 2.5 }}>
              <TextField label={locale === "en" ? "Account ID" : "รหัส Account"} value={account.id} fullWidth InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} required sx={VIEW_FIELD} />
              <TextField label={locale === "en" ? "Company Name" : "ชื่อร้าน / ชื่อบริษัท"} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} fullWidth InputProps={{ readOnly }} InputLabelProps={{ shrink: true }} required sx={fieldSx} />
              <TextField label={locale === "en" ? "Customer Group" : "กลุ่มลูกค้า"} value={form.customerGroup} onChange={(e) => setForm({ ...form, customerGroup: e.target.value })} fullWidth InputProps={{ readOnly }} InputLabelProps={{ shrink: true }} required select={isEditing} sx={fieldSx}>
                {isEditing && ["ทั่วไป", "ขายส่ง", "ขายปลีก", "VIP"].map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
              </TextField>
              <TextField label={locale === "en" ? "Tenant Quota" : "จำนวนธุรกิจ"} value={form.tenantQuota} onChange={(e) => setForm({ ...form, tenantQuota: e.target.value })} fullWidth InputProps={{ readOnly }} InputLabelProps={{ shrink: true }} required sx={fieldSx} />
            </Stack>

            {/* Row 2 — 4 cols */}
            <Stack direction="row" spacing={2.5} sx={{ mb: 2.5 }}>
              <TextField label={locale === "en" ? "Title" : "คำนำหน้า"} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} fullWidth InputProps={{ readOnly }} InputLabelProps={{ shrink: true }} required select={isEditing} sx={fieldSx}>
                {isEditing && ["นาย", "นาง", "นางสาว"].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
              <TextField label={locale === "en" ? "First Name" : "ชื่อ"} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} fullWidth InputProps={{ readOnly }} InputLabelProps={{ shrink: true }} required sx={fieldSx} />
              <TextField label={locale === "en" ? "Last Name" : "นามสกุล"} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} fullWidth InputProps={{ readOnly }} InputLabelProps={{ shrink: true }} required sx={fieldSx} />
              <TextField label={locale === "en" ? "Position" : "ตำแหน่ง"} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} fullWidth InputProps={{ readOnly }} InputLabelProps={{ shrink: true }} sx={fieldSx} />
            </Stack>

            {/* Row 3 — 4 cols */}
            <Stack direction="row" spacing={2.5} sx={{ mb: 3 }}>
              <TextField label={locale === "en" ? "Email" : "อีเมล"} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth InputProps={{ readOnly }} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              <Box sx={{ width: "100%" }}>
                <Stack direction="row" sx={{ width: "100%" }}>
                  <Box sx={{
                    display: "flex", alignItems: "center", gap: 0.5, px: 1.5,
                    bgcolor: isEditing ? "#FFF" : "#F8F8F9",
                    border: "1px solid rgba(76,78,100,0.22)", borderRadius: "8px 0 0 8px", borderRight: "none",
                    fontSize: 15, color: "#374151", whiteSpace: "nowrap",
                  }}>
                    🇹🇭 +66
                  </Box>
                  <TextField
                    label={locale === "en" ? "Phone" : "เบอร์โทรศัพท์"}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    fullWidth
                    InputProps={{ readOnly }}
                    InputLabelProps={{ shrink: true }}
                    sx={{ ...fieldSx, "& .MuiOutlinedInput-root": { ...fieldSx["& .MuiOutlinedInput-root"], borderRadius: "0 8px 8px 0" } }}
                  />
                </Stack>
              </Box>
              <TextField label={locale === "en" ? "Registration Date" : "วันที่ลงทะเบียน"} value={`${account.createdAt} - ${account.createdBy}`} fullWidth InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} sx={VIEW_FIELD} />
              <TextField label={locale === "en" ? "Last Modified" : "วันที่แก้ไขล่าสุด"} value={`${account.updatedAt} - ${account.updatedBy}`} fullWidth InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} sx={VIEW_FIELD} />
            </Stack>

            {/* Status Radio — ทำได้ทั้ง View/Edit mode แต่ต้อง confirm */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: 15, color: "#374151", mb: 0.5 }}>
                {locale === "en" ? "Status" : "สถานะ"}
              </Typography>
              <RadioGroup
                row
                value={statusValue}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <FormControlLabel value="active" control={<Radio size="small" sx={{ color: SA, "&.Mui-checked": { color: SA } }} />} label={<Typography sx={{ fontSize: 15 }}>{locale === "en" ? "Active" : "เปิดใช้งาน"}</Typography>} />
                <FormControlLabel value="inactive" control={<Radio size="small" sx={{ color: SA, "&.Mui-checked": { color: SA } }} />} label={<Typography sx={{ fontSize: 15 }}>{locale === "en" ? "Inactive" : "ปิดใช้งาน"}</Typography>} />
              </RadioGroup>
            </Box>

            {/* Super Admin Actions */}
            <Box sx={{ bgcolor: "#FFEDE0", borderRadius: "8px", p: 2.5, mb: 3 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: SA, mb: 1.5 }}>
                {locale === "en" ? "Super Admin Actions" : "การดำเนินการของ Super Admin"}
              </Typography>
              <Stack direction="row" spacing={1.5} sx={{ mb: 1.5 }}>
                <Button variant="outlined" startIcon={<MailOutlineIcon sx={{ fontSize: 18 }} />} sx={{ textTransform: "none", fontSize: 15, fontWeight: 500, color: "#374151", borderColor: "#9CA3AF", bgcolor: "#F8F8F9", borderRadius: "8px", height: 42, "&:hover": { borderColor: "#6B7280", bgcolor: "#F0F0F0" } }}>
                  Reset Email ยืนยัน
                </Button>
                <Button variant="outlined" startIcon={<VpnKeyOutlinedIcon sx={{ fontSize: 18 }} />} sx={{ textTransform: "none", fontSize: 15, fontWeight: 500, color: "#FF4D49", borderColor: "#FF4D49", bgcolor: "#F8F8F9", borderRadius: "8px", height: 42, "&:hover": { borderColor: "#E53935", bgcolor: "#FFF0F0" } }}>
                  Reset รหัสผ่าน
                </Button>
              </Stack>
              <Typography sx={{ fontSize: 14, color: "#6B7280" }}>
                {locale === "en" ? "Contact will receive an email with an action link" : "ผู้ติดต่อจะได้รับ Email พร้อมลิงก์ดำเนินการ"}
              </Typography>
            </Box>

            {/* Footer Buttons — View: ยกเลิก+แก้ไข / Edit: ยกเลิก+บันทึก */}
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button
                variant="outlined"
                onClick={isEditing ? handleCancel : () => router.push("/tenantlist")}
                sx={{ textTransform: "none", fontSize: 16, fontWeight: 500, color: "#374151", borderColor: "rgba(76,78,100,0.22)", borderRadius: "8px", height: 42, px: 3 }}
              >
                {locale === "en" ? "Cancel" : "ยกเลิก"}
              </Button>
              <Button
                variant="contained"
                onClick={isEditing ? handleSave : handleEdit}
                sx={{ textTransform: "none", fontSize: 16, fontWeight: 500, bgcolor: SA, borderRadius: "8px", height: 42, px: 3, boxShadow: "0px 4px 8px -4px rgba(76,78,100,0.42)", "&:hover": { bgcolor: "#E65C00" } }}
              >
                {isEditing
                  ? (locale === "en" ? "Save" : "บันทึก")
                  : (locale === "en" ? "Edit" : "แก้ไข")}
              </Button>
            </Stack>
          </Paper>
        )}

        {detailTab === 1 && (
          <Paper sx={{ borderRadius: "10px", p: 3, boxShadow: "0px 2px 10px rgba(76,78,100,0.12)" }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: SA, mb: 2 }}>
              {locale === "en" ? "Business Info" : "ข้อมูลธุรกิจ"}
            </Typography>
            <Typography sx={{ fontSize: 15, color: "#9CA3AF" }}>
              {account.tenantUsed === 0
                ? (locale === "en" ? "No business created yet" : "ยังไม่มีธุรกิจที่สร้าง")
                : `${account.tenantUsed} / ${account.tenantQuota} ${locale === "en" ? "businesses" : "ธุรกิจ"}`}
            </Typography>
          </Paper>
        )}

        {detailTab === 2 && (
          <Paper sx={{ borderRadius: "10px", p: 3, boxShadow: "0px 2px 10px rgba(76,78,100,0.12)" }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: SA, mb: 2 }}>
              {locale === "en" ? "History" : "ประวัติ"}
            </Typography>
            <Typography sx={{ fontSize: 15, color: "#9CA3AF" }}>
              {locale === "en" ? "No activity yet" : "ยังไม่มีประวัติ"}
            </Typography>
          </Paper>
        )}
      </Box>

      {/* ── Confirm Modal — Toggle Status ── */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); }}
        onConfirm={handleStatusConfirm}
        actionText={pendingStatus === "active"
          ? (locale === "en" ? "Enable" : "เปิดการใช้งาน")
          : (locale === "en" ? "Disable" : "ปิดการใช้งาน")}
      />
    </Box>
    </DashboardShell>
  );
}
