"use client";

import { useState } from "react";
import {
  Box, Typography, TextField, MenuItem,
  Checkbox, FormControlLabel, Stack,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { SA, MODAL_TF_SX, SH } from "./constants";

const DEPLOYMENT_TIERS = [
  { key: "Cloud" as const, sub: "Shared" },
  { key: "Dedicated" as const, sub: "Private" },
  { key: "On-premise" as const, sub: "Server ลูกค้า" },
];

const ENTITY_TYPES = [
  "บริษัทจำกัด (บจ.)",
  "บริษัทมหาชนจำกัด (บมจ.)",
  "ห้างหุ้นส่วนจำกัด (หจก.)",
  "ห้างหุ้นส่วนสามัญนิติบุคคล",
  "บุคคลธรรมดา",
];

const BUSINESS_TYPES = [
  "Trading - ซื้อมาขายไป",
  "Service - บริการ",
  "Manufacturing - ผลิต",
  "Food & Beverage - อาหารและเครื่องดื่ม",
  "Logistics - ขนส่ง",
  "Tech - เทคโนโลยี",
];

const CORE_MODULES = [
  "Jigsaw Core Allder Now",
  "Allder Cafe",
  "CarDeler",
  "Manufacturing",
  "Extension",
  "Pug",
];

export interface TenantFormData {
  deploymentTier: "Cloud" | "Dedicated" | "On-premise";
  companyName: string;
  entityType: string;
  businessType: string;
  taxId: string;
  subdomain: string;
  quotas: { user: number; branch: number; warehouse: number; storage: number; auditLog: number; onboarding: number };
  cores: string[];
  contractStart: string;
  contractEnd: string;
  autoRenewal: boolean;
}

interface TenantFormProps {
  t: (key: string) => string;
  onDataChange?: (data: TenantFormData) => void;
}

export default function TenantForm({ t }: TenantFormProps) {
  const [tier, setTier] = useState<"Cloud" | "Dedicated" | "On-premise">("Cloud");
  const [companyName, setCompanyName] = useState("");
  const [entityType, setEntityType] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [taxId, setTaxId] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [quotas, setQuotas] = useState({ user: 10, branch: 1000, warehouse: 10, storage: 10, auditLog: 10, onboarding: 10 });
  const [cores, setCores] = useState<string[]>([]);
  const [contractStart, setContractStart] = useState("");
  const [contractEnd, setContractEnd] = useState("");
  const [autoRenewal, setAutoRenewal] = useState(false);

  const handleCoreToggle = (core: string) => {
    setCores((prev) => prev.includes(core) ? prev.filter((c) => c !== core) : [...prev, core]);
  };

  // Expose form data via ref or callback if needed
  // For now, parent can read via onConfirm pattern

  return (
    <>
      {/* Package Quota */}
      <Typography sx={{ fontSize: 15, fontWeight: 500, color: "#1A1A1A", mb: 1 }}>
        {t("ctm.packageQuota")} <span style={{ color: "#EF4444" }}>*</span>
      </Typography>

      {/* Deployment Tier */}
      <Typography sx={{ fontSize: 15, fontWeight: 500, color: "#1A1A1A", mb: 1 }}>
        {t("ctm.deploymentTier")}
      </Typography>
      <Stack direction="row" spacing="16px" sx={{ mb: "20px" }}>
        {DEPLOYMENT_TIERS.map((d) => (
          <Box key={d.key} onClick={() => setTier(d.key)}
            sx={{
              width: 244, height: 60, borderRadius: "6px", cursor: "pointer", px: 2, display: "flex", flexDirection: "column", justifyContent: "center",
              border: tier === d.key ? "1.5px solid #FFA462" : "1.5px solid #E5E7EB",
              bgcolor: tier === d.key ? "#FFF4EB" : "#FFF",
            }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: tier === d.key ? SA : "#1A1A1A" }}>{d.key}</Typography>
            <Typography sx={{ fontSize: 14, color: "#1A1A1A" }}>{d.sub}</Typography>
          </Box>
        ))}
      </Stack>

      {/* Entity Info */}
      <Typography sx={{ fontSize: 15, fontWeight: 500, color: "#1A1A1A", mb: "16px" }}>
        {t("ctm.entityInfo")}
      </Typography>
      <Stack spacing="20px">
        <TextField label={t("ctm.companyName")} value={companyName} onChange={(e) => setCompanyName(e.target.value)}
          fullWidth required placeholder="กรอกชื่อร้าน / ชื่อบริษัท" sx={MODAL_TF_SX} InputLabelProps={SH} />
        <Stack direction="row" spacing="16px">
          <TextField label={t("ctm.entityType")} value={entityType} onChange={(e) => setEntityType(e.target.value)}
            fullWidth required select sx={MODAL_TF_SX} InputLabelProps={SH}>
            {ENTITY_TYPES.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}
          </TextField>
          <TextField label={t("ctm.businessType")} value={businessType} onChange={(e) => setBusinessType(e.target.value)}
            fullWidth required select sx={MODAL_TF_SX} InputLabelProps={SH}>
            {BUSINESS_TYPES.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
          </TextField>
        </Stack>
        <Stack direction="row" spacing="16px">
          <TextField label={t("ctm.taxId")} value={taxId} onChange={(e) => setTaxId(e.target.value)}
            fullWidth required placeholder="กรอกเลขผู้เสียภาษี" sx={MODAL_TF_SX} InputLabelProps={SH} />
          <Box sx={{ display: "flex", width: "100%" }}>
            <TextField value={subdomain} onChange={(e) => setSubdomain(e.target.value)}
              fullWidth placeholder="subdomain"
              sx={{ ...MODAL_TF_SX, "& .MuiOutlinedInput-root": { ...MODAL_TF_SX["& .MuiOutlinedInput-root"], borderRadius: "8px 0 0 8px" } }}
              InputLabelProps={SH} />
            <Box sx={{
              display: "flex", alignItems: "center", px: 2, bgcolor: "#F8F8F9",
              border: "1.5px solid #E5E7EB", borderRadius: "0 8px 8px 0", borderLeft: "none",
              fontSize: 15, color: "#1A1A1A", whiteSpace: "nowrap", height: 48,
            }}>
              .jigsawerp.com
            </Box>
          </Box>
        </Stack>
      </Stack>

      {/* Resource Quota */}
      <Typography sx={{ fontSize: 15, fontWeight: 500, color: "#1A1A1A", mt: "20px", mb: "16px" }}>
        {t("ctm.resourceQuota")}
      </Typography>
      <Stack spacing="16px">
        {[
          [{ key: "user" as const, label: t("ctm.user"), unit: t("ctm.unitPerson") }, { key: "branch" as const, label: t("ctm.branch"), unit: t("ctm.unitBranch") }],
          [{ key: "warehouse" as const, label: t("ctm.warehouse"), unit: t("ctm.unitWarehouse") }, { key: "storage" as const, label: t("ctm.storage"), unit: t("ctm.unitGB") }],
          [{ key: "auditLog" as const, label: t("ctm.auditLog"), unit: t("ctm.unitMonth") }, { key: "onboarding" as const, label: t("ctm.onboarding"), unit: t("ctm.unitHour") }],
        ].map((row, i) => (
          <Stack direction="row" spacing="16px" key={i}>
            {row.map((f) => (
              <Stack direction="row" alignItems="center" spacing={1} key={f.key} sx={{ flex: 1 }}>
                <TextField label={f.label} value={quotas[f.key]} type="number"
                  onChange={(e) => setQuotas({ ...quotas, [f.key]: Number(e.target.value) })}
                  required sx={{ ...MODAL_TF_SX, width: 205 }} InputLabelProps={SH} />
                <Typography sx={{ fontSize: 15, color: "#1A1A1A" }}>{f.unit}</Typography>
              </Stack>
            ))}
          </Stack>
        ))}
      </Stack>

      {/* Quota Warning */}
      <Box sx={{ bgcolor: "#FFEDE0", borderRadius: "8px", px: 2, py: 1, display: "flex", alignItems: "center", gap: 1, mt: "16px", mb: "20px" }}>
        <WarningAmberIcon sx={{ color: SA, fontSize: 22 }} />
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: SA }}>{t("ctm.quotaWarning")}</Typography>
      </Box>

      {/* Core Modules */}
      <Typography sx={{ fontSize: 15, fontWeight: 500, color: "#1A1A1A", mb: 1 }}>
        {t("ctm.coreModules")}
      </Typography>
      <Box sx={{ mb: "20px" }}>
        {CORE_MODULES.map((core) => (
          <Box key={core} sx={{
            border: "1px solid #E5E7EB", borderRadius: "4px", mb: "6px", width: 260,
            display: "flex", alignItems: "center", justifyContent: "space-between", px: 0.5, height: 40,
          }}>
            <FormControlLabel
              control={<Checkbox size="small" checked={cores.includes(core)} onChange={() => handleCoreToggle(core)}
                sx={{ p: "6px", color: "#D1D5DB", "&.Mui-checked": { color: SA } }} />}
              label={<Typography sx={{ fontSize: 14, color: "#1A1A1A" }}>{core}</Typography>}
              sx={{ m: 0 }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/commerce/settings.svg" alt="settings" width={18} height={18} style={{ opacity: 0.5, marginRight: 6 }} />
          </Box>
        ))}
      </Box>

      {/* Contract */}
      <Typography sx={{ fontSize: 15, fontWeight: 500, color: "#1A1A1A", mb: 1 }}>
        {t("ctm.contract")}
      </Typography>
      <Stack direction="row" spacing="16px" sx={{ mb: "20px" }}>
        <TextField label={t("ctm.contractStart")} type="date" value={contractStart}
          onChange={(e) => setContractStart(e.target.value)}
          required sx={{ ...MODAL_TF_SX, width: 379 }} InputLabelProps={SH} />
        <TextField label={t("ctm.contractEnd")} type="date" value={contractEnd}
          onChange={(e) => setContractEnd(e.target.value)}
          required sx={{ ...MODAL_TF_SX, width: 379 }} InputLabelProps={SH} />
      </Stack>

      {/* Auto-renewal */}
      <Typography sx={{ fontSize: 15, fontWeight: 500, color: "#1A1A1A", mb: 1 }}>
        {t("ctm.autoRenewal")}
      </Typography>
      <TextField label={t("ctm.autoRenewal")} value={autoRenewal ? "yes" : "no"}
        onChange={(e) => setAutoRenewal(e.target.value === "yes")}
        fullWidth required select sx={{ ...MODAL_TF_SX, mb: "20px" }} InputLabelProps={SH}>
        <MenuItem value="no">{t("ctm.noAutoRenewal")}</MenuItem>
        <MenuItem value="yes">{t("ctm.yesAutoRenewal")}</MenuItem>
      </TextField>

      {/* Save Note */}
      <Box sx={{ bgcolor: "#E9FFF7", borderRadius: "8px", px: 2, py: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <CheckCircleOutlineIcon sx={{ color: "#00AF6C", fontSize: 22 }} />
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#00AF6C" }}>{t("ctm.saveNote")}</Typography>
      </Box>
    </>
  );
}
