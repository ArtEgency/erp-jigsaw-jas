"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { masterAccounts, accountTenants } from "@/data/mock";
import { useLocale } from "@/lib/locale";
import DashboardShell from "@/components/layout/DashboardShell";
import ConfirmModal from "@/components/ui/ConfirmModal";
import GlobalModal from "@/components/ui/GlobalModal";
import PinModal from "@/components/ui/PinModal";
import FormWrapper from "@/components/page-form/FormWrapper";
import CustomerForm from "@/components/page-form/tenant/customer";
import BusinessTab from "@/components/page-form/tenant/business";
import HistoryTab from "@/components/page-form/tenant/history";
import TenantForm from "@/components/page-form/tenant/tenant";
import { SA, STATUS_COLORS, STATUS_PERMS } from "@/components/page-form/tenant/constants";
import {
  Box, Typography, Paper, Chip, Button,
  Tabs, Tab, Stack, IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockOpenIcon from "@mui/icons-material/LockOpen";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { locale, t } = useLocale();
  const [detailTab, setDetailTab] = useState(0);

  const account = masterAccounts.find((a) => a.id === params.id) || masterAccounts[0];
  const statusStyle = STATUS_COLORS[account.status] || { bg: "#F0F0F0", color: "#999" };
  const perms = STATUS_PERMS[account.status] || STATUS_PERMS["หมดอายุ"];
  const myTenants = accountTenants.filter((t) => t.accountId === account.id);
  const canEditTab1 = perms.tab1 === "edit";

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

  /* ── Create Tenant Modal ── */
  const [createTenantOpen, setCreateTenantOpen] = useState(false);
  const tenantMethods = useForm();

  /* ── PIN Modal ── */
  const [pinOpen, setPinOpen] = useState(false);

  const handleStatusChange = (newValue: string) => {
    setPendingStatus(newValue);
    setConfirmOpen(true);
  };

  const handleStatusConfirm = () => {
    setStatusValue(pendingStatus);
    setConfirmOpen(false);
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setForm({
      company: account.company, customerGroup: account.customerGroup,
      tenantQuota: String(account.tenantQuota), title: "นางสาว",
      firstName: account.firstName, lastName: account.lastName,
      position: account.position, email: account.email, phone: account.phone,
    });
    setIsEditing(false);
  };
  const handleSave = () => setIsEditing(false);

  const handleCreateTenant = () => {
    // TODO: API call with tenantMethods.getValues()
    setCreateTenantOpen(false);
  };

  const handlePinSuccess = () => {
    setPinOpen(false);
    // TODO: unlock account via API
  };

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
            {t("onboarding.customer")}
          </Typography>
          <Typography sx={{ color: "#9CA3AF", mx: 0.5 }}>›</Typography>
          <Typography sx={{ color: "#374151", fontWeight: 700, fontSize: 15 }}>
            {t("onboarding.customerInfo")}
          </Typography>
        </Stack>
      </Box>

      {/* ── Header + Status Badge ── */}
      <Box sx={{ px: 3, pt: 1.5, pb: 1, display: "flex", alignItems: "center", gap: 2 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#374151" }}>
          {t("onboarding.customerInfo")}
        </Typography>
        <Chip label={account.status} size="small"
          sx={{ fontWeight: 600, fontSize: 13, bgcolor: statusStyle.bg, color: statusStyle.color, height: 28, px: 1 }} />
        {isEditing && (
          <Chip label={locale === "en" ? "Editing" : "กำลังแก้ไข"} size="small" sx={{ fontWeight: 600, fontSize: 12, bgcolor: "#FFF7ED", color: SA, height: 24 }} />
        )}
        {perms.canUnlock && (
          <Button variant="outlined" startIcon={<LockOpenIcon sx={{ fontSize: 18 }} />}
            onClick={() => setPinOpen(true)}
            sx={{ ml: "auto", textTransform: "none", fontSize: 14, color: "#B91C1C", borderColor: "#B91C1C", borderRadius: "8px", height: 36, "&:hover": { borderColor: "#991B1B", bgcolor: "#FEF2F2" } }}>
            {locale === "en" ? "Unlock" : "ปลดล็อค"}
          </Button>
        )}
      </Box>

      {/* ── Tabs ── */}
      <Box sx={{ px: 3 }}>
        <Tabs value={detailTab} onChange={(_, v) => setDetailTab(v)}
          sx={{
            mb: 2,
            "& .MuiTab-root": { textTransform: "none", fontWeight: 500, fontSize: "1rem", minHeight: 42, borderRadius: "8px", mr: 1, px: 2 },
            "& .Mui-selected": { bgcolor: SA, color: "#fff !important", fontWeight: 600 },
            "& .MuiTabs-indicator": { display: "none" },
          }}>
          <Tab label={t("onboarding.tabGeneral")} />
          <Tab label={`${t("biz.title")} (${account.tenantUsed}/${account.tenantQuota})`} />
          <Tab label={locale === "en" ? "History" : "ประวัติ"} />
        </Tabs>
      </Box>

      {/* ── Tab Content ── */}
      <Box sx={{ px: 3, pb: 4 }}>
        {detailTab === 0 && (
          <Paper sx={{ borderRadius: "10px", p: 3, boxShadow: "0px 2px 10px rgba(76,78,100,0.12)" }}>
            <CustomerForm
              account={account} form={form} setForm={setForm}
              isEditing={isEditing} canEdit={canEditTab1} perms={perms}
              statusValue={statusValue} onStatusChange={handleStatusChange}
              onEdit={handleEdit} onCancel={handleCancel} onSave={handleSave}
              onBack={() => router.push("/tenantlist")}
              locale={locale} t={t}
            />
          </Paper>
        )}

        {detailTab === 1 && (
          <Paper sx={{ borderRadius: "10px", p: 3, boxShadow: "0px 2px 10px rgba(76,78,100,0.12)" }}>
            <BusinessTab
              account={account} myTenants={myTenants} perms={perms}
              onCreateTenant={() => setCreateTenantOpen(true)}
              locale={locale} t={t}
            />
          </Paper>
        )}

        {detailTab === 2 && (
          <Paper sx={{ borderRadius: "10px", p: 3, boxShadow: "0px 2px 10px rgba(76,78,100,0.12)" }}>
            <HistoryTab locale={locale} />
          </Paper>
        )}
      </Box>

      {/* ── Modals ── */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleStatusConfirm}
        actionText={pendingStatus === "active"
          ? (locale === "en" ? "Enable" : "เปิดการใช้งาน")
          : (locale === "en" ? "Disable" : "ปิดการใช้งาน")}
      />

      <GlobalModal
        open={createTenantOpen}
        onClose={() => setCreateTenantOpen(false)}
        onConfirm={handleCreateTenant}
        title={`${t("ctm.title")} - Tenant ${account.tenantUsed + 1}`}
        confirmLabel={t("common.confirm")}
        cancelLabel={t("common.cancel")}
        pinKey="modal_pin_create_tenant"
      >
        <FormWrapper methods={tenantMethods}>
          <TenantForm t={t} />
        </FormWrapper>
      </GlobalModal>

      <PinModal
        open={pinOpen}
        onClose={() => setPinOpen(false)}
        onSuccess={handlePinSuccess}
      />
    </Box>
    </DashboardShell>
  );
}
