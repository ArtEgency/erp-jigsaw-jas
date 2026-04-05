"use client";

import { MasterAccount } from "@/data/mock";
import { SA, VIEW_FIELD, EDIT_FIELD, StatusPerm } from "./constants";
import {
  Box, Typography, Button, TextField, MenuItem,
  Radio, RadioGroup, FormControlLabel, Stack,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";

interface CustomerFormProps {
  account: MasterAccount;
  form: {
    company: string; customerGroup: string; tenantQuota: string;
    title: string; firstName: string; lastName: string;
    position: string; email: string; phone: string;
  };
  setForm: (form: CustomerFormProps["form"]) => void;
  isEditing: boolean;
  canEdit: boolean;
  perms: StatusPerm;
  statusValue: string;
  onStatusChange: (value: string) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onBack: () => void;
  locale: string;
  t: (key: string) => string;
}

export default function CustomerForm({
  account, form, setForm, isEditing, canEdit, perms,
  statusValue, onStatusChange, onEdit, onCancel, onSave, onBack,
  locale, t,
}: CustomerFormProps) {
  const fieldSx = isEditing && canEdit ? EDIT_FIELD : VIEW_FIELD;
  const readOnly = !(isEditing && canEdit);

  return (
    <>
      <Typography sx={{ fontSize: 20, fontWeight: 700, color: SA, mb: 3 }}>
        {t("onboarding.tabGeneral")}
      </Typography>

      {/* Row 1 */}
      <Stack direction="row" spacing={2.5} sx={{ mb: 2.5 }}>
        <TextField label={t("onboarding.accountCode")} value={account.id} fullWidth InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} required sx={VIEW_FIELD} />
        <TextField label={t("onboarding.companyName")} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} fullWidth InputProps={{ readOnly }} InputLabelProps={{ shrink: true }} required sx={fieldSx} />
        <TextField label={t("onboarding.customerGroup")} value={form.customerGroup} onChange={(e) => setForm({ ...form, customerGroup: e.target.value })} fullWidth InputProps={{ readOnly }} InputLabelProps={{ shrink: true }} required select={isEditing && canEdit} sx={fieldSx}>
          {isEditing && canEdit && ["ทั่วไป", "ขายส่ง", "ขายปลีก", "VIP"].map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
        </TextField>
        <TextField label={t("onboarding.tenantQuota")} value={form.tenantQuota} onChange={(e) => setForm({ ...form, tenantQuota: e.target.value })} fullWidth InputProps={{ readOnly }} InputLabelProps={{ shrink: true }} required sx={fieldSx} />
      </Stack>

      {/* Row 2 */}
      <Stack direction="row" spacing={2.5} sx={{ mb: 2.5 }}>
        <TextField label={t("onboarding.prefix")} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} fullWidth InputProps={{ readOnly }} InputLabelProps={{ shrink: true }} required select={isEditing && canEdit} sx={fieldSx}>
          {isEditing && canEdit && ["นาย", "นาง", "นางสาว"].map((tt) => <MenuItem key={tt} value={tt}>{tt}</MenuItem>)}
        </TextField>
        <TextField label={t("onboarding.firstName")} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} fullWidth InputProps={{ readOnly }} InputLabelProps={{ shrink: true }} required sx={fieldSx} />
        <TextField label={t("onboarding.lastName")} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} fullWidth InputProps={{ readOnly }} InputLabelProps={{ shrink: true }} required sx={fieldSx} />
        <TextField label={t("onboarding.position")} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} fullWidth InputProps={{ readOnly }} InputLabelProps={{ shrink: true }} sx={fieldSx} />
      </Stack>

      {/* Row 3 */}
      <Stack direction="row" spacing={2.5} sx={{ mb: 3 }}>
        <TextField label={t("onboarding.emailLabel")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth InputProps={{ readOnly }} InputLabelProps={{ shrink: true }} sx={fieldSx} />
        <Box sx={{ width: "100%" }}>
          <Stack direction="row" sx={{ width: "100%" }}>
            <Box sx={{
              display: "flex", alignItems: "center", gap: 0.5, px: 1.5,
              bgcolor: isEditing && canEdit ? "#FFF" : "#F8F8F9",
              border: "1px solid rgba(76,78,100,0.22)", borderRadius: "8px 0 0 8px", borderRight: "none",
              fontSize: 15, color: "#374151", whiteSpace: "nowrap",
            }}>
              🇹🇭 +66
            </Box>
            <TextField
              label={t("onboarding.phone")} value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              fullWidth InputProps={{ readOnly }} InputLabelProps={{ shrink: true }}
              sx={{ ...fieldSx, "& .MuiOutlinedInput-root": { ...fieldSx["& .MuiOutlinedInput-root"], borderRadius: "0 8px 8px 0" } }}
            />
          </Stack>
        </Box>
        <TextField label={t("onboarding.registeredAt")} value={`${account.createdAt} - ${account.createdBy}`} fullWidth InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} sx={VIEW_FIELD} />
        <TextField label={t("onboarding.lastUpdatedAt")} value={`${account.updatedAt} - ${account.updatedBy}`} fullWidth InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} sx={VIEW_FIELD} />
      </Stack>

      {/* Status Radio */}
      {canEdit && (
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: 15, color: "#374151", mb: 0.5 }}>{t("onboarding.status")}</Typography>
          <RadioGroup row value={statusValue} onChange={(e) => onStatusChange(e.target.value)}>
            <FormControlLabel value="active" control={<Radio size="small" sx={{ color: SA, "&.Mui-checked": { color: SA } }} />} label={<Typography sx={{ fontSize: 15 }}>{locale === "en" ? "Active" : "เปิดใช้งาน"}</Typography>} />
            <FormControlLabel value="inactive" control={<Radio size="small" sx={{ color: SA, "&.Mui-checked": { color: SA } }} />} label={<Typography sx={{ fontSize: 15 }}>{locale === "en" ? "Inactive" : "ปิดใช้งาน"}</Typography>} />
          </RadioGroup>
        </Box>
      )}

      {/* Super Admin Actions */}
      <Box sx={{ bgcolor: "#FFEDE0", borderRadius: "8px", p: 2.5, mb: 3 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: SA, mb: 1.5 }}>{t("onboarding.saActions")}</Typography>
        <Stack direction="row" spacing={1.5} sx={{ mb: 1.5 }}>
          <Button variant="outlined" startIcon={<MailOutlineIcon sx={{ fontSize: 18 }} />}
            disabled={!perms.canResendEmail && perms.tab1 !== "edit"}
            sx={{ textTransform: "none", fontSize: 15, fontWeight: 500, color: "#374151", borderColor: "#9CA3AF", bgcolor: "#F8F8F9", borderRadius: "8px", height: 42, "&:hover": { borderColor: "#6B7280", bgcolor: "#F0F0F0" } }}>
            {t("onboarding.resetVerifyEmail")}
          </Button>
          <Button variant="outlined" startIcon={<VpnKeyOutlinedIcon sx={{ fontSize: 18 }} />}
            disabled={perms.tab1 === "view" && !perms.canResendEmail}
            sx={{ textTransform: "none", fontSize: 15, fontWeight: 500, color: "#FF4D49", borderColor: "#FF4D49", bgcolor: "#F8F8F9", borderRadius: "8px", height: 42, "&:hover": { borderColor: "#E53935", bgcolor: "#FFF0F0" } }}>
            {t("onboarding.resetPassword")}
          </Button>
        </Stack>
        <Typography sx={{ fontSize: 14, color: "#6B7280" }}>{t("onboarding.contactWillReceiveEmail")}</Typography>
      </Box>

      {/* Footer Buttons */}
      {canEdit && (
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button variant="outlined" onClick={isEditing ? onCancel : onBack}
            sx={{ textTransform: "none", fontSize: 16, fontWeight: 500, color: "#374151", borderColor: "rgba(76,78,100,0.22)", borderRadius: "8px", height: 42, px: 3 }}>
            {t("common.cancel")}
          </Button>
          <Button variant="contained" onClick={isEditing ? onSave : onEdit}
            sx={{ textTransform: "none", fontSize: 16, fontWeight: 500, bgcolor: SA, borderRadius: "8px", height: 42, px: 3, boxShadow: "0px 4px 8px -4px rgba(76,78,100,0.42)", "&:hover": { bgcolor: "#E65C00" } }}>
            {isEditing ? t("common.save") : t("common.edit")}
          </Button>
        </Stack>
      )}
    </>
  );
}
