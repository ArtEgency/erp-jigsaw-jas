"use client";

import { MasterAccount, AccountTenant } from "@/data/mock";
import { SA, TENANT_STATUS_COLORS, StatusPerm } from "./constants";
import { Box, Typography, Button, Chip, Stack } from "@mui/material";

interface BusinessTabProps {
  account: MasterAccount;
  myTenants: AccountTenant[];
  perms: StatusPerm;
  onCreateTenant: () => void;
  locale: string;
  t: (key: string) => string;
}

export default function BusinessTab({ account, myTenants, perms, onCreateTenant, locale, t }: BusinessTabProps) {
  const quotaRemaining = account.tenantQuota - account.tenantUsed;
  const quotaFull = quotaRemaining <= 0;

  return (
    <>
      <Typography sx={{ fontSize: 20, fontWeight: 700, color: SA, mb: 2 }}>
        {t("biz.title")}
      </Typography>

      {/* Status Button — "ยังไม่เปิดใช้งาน" */}
      {perms.tab2 === "none" && (
        <Button variant="contained" disabled
          sx={{ textTransform: "none", fontSize: 16, fontWeight: 500, bgcolor: SA, color: "#fff", borderRadius: "8px", height: 42, mb: 2, "&.Mui-disabled": { bgcolor: SA, color: "#fff", opacity: 0.8 } }}>
          {t("biz.notActivated")}
        </Button>
      )}

      {/* Quota Bar */}
      <Box sx={{ bgcolor: "#FFEDE0", borderRadius: "8px", px: 2.5, py: 1.5, mb: 3, display: "flex", gap: 1.5, alignItems: "center" }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: SA }}>
          {t("biz.tenantQuota")} : {account.tenantUsed}/{account.tenantQuota} {t("biz.companies")}
        </Typography>
        <Typography sx={{ fontSize: 15, color: "#6B7280" }}>
          {t("biz.remaining")} {quotaRemaining} {t("biz.canCreate")}
        </Typography>
      </Box>

      {/* Content: Empty or Cards */}
      {myTenants.length === 0 ? (
        <Box sx={{
          bgcolor: "#FFF", borderRadius: "8px", p: 3, textAlign: "center",
          boxShadow: "0px 2px 10px rgba(76,78,100,0.12)", minHeight: 148,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
        }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#374151" }}>
            {t("biz.noTenant")}
          </Typography>
          {perms.canAddTenant && !quotaFull && (
            <Button variant="contained" onClick={onCreateTenant}
              sx={{ textTransform: "none", fontSize: 15, fontWeight: 500, bgcolor: SA, borderRadius: "8px", height: 42, px: 3, boxShadow: "0px 4px 8px -4px rgba(76,78,100,0.42)", "&:hover": { bgcolor: "#E65C00" } }}>
              {t("biz.createTenant")}
            </Button>
          )}
        </Box>
      ) : (
        <Stack direction="row" spacing={2.5} sx={{ flexWrap: "wrap" }}>
          {myTenants.map((tenant) => {
            const tStatus = TENANT_STATUS_COLORS[tenant.status] || { bg: "#F5F5F5", color: "#737373" };
            return (
              <Box key={tenant.id} sx={{
                width: 540, bgcolor: "#FFF", borderRadius: "14px", p: 2,
                boxShadow: "0px 2px 10px rgba(76,78,100,0.12)",
                display: "flex", gap: 2, alignItems: "center", mb: 2,
              }}>
                <Box sx={{
                  width: 120, height: 120, bgcolor: "#F2F2F2", borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#1B5E20", textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.3 }}>
                    {tenant.logoText}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#374151", mb: 0.5 }}>{tenant.nameTh}</Typography>
                  <Typography sx={{ fontSize: 14, color: "#374151", mb: 1.5 }}>
                    {tenant.subdomain}.jigsawerp.com · {tenant.deploymentTier}
                  </Typography>
                  <Chip
                    label={locale === "en"
                      ? (tenant.status === "เปิดใช้งาน" ? "Active" : tenant.status === "รอ Setup Wizard" ? "Setup Wizard" : "Suspended")
                      : tenant.status}
                    size="small"
                    sx={{ fontWeight: 600, fontSize: 11, bgcolor: tStatus.bg, color: tStatus.color, height: 26, borderRadius: "50px" }}
                  />
                </Box>
              </Box>
            );
          })}

          {perms.canAddTenant && !quotaFull && (
            <Box onClick={onCreateTenant}
              sx={{
                width: 540, minHeight: 138, borderRadius: "14px", cursor: "pointer",
                border: `1.5px dashed ${SA}`, bgcolor: "#FFF",
                display: "flex", alignItems: "center", justifyContent: "center", mb: 2,
                "&:hover": { bgcolor: "#FFF8F3" },
              }}>
              <Typography sx={{ fontSize: 22, fontWeight: 700, color: SA }}>{t("biz.addBusiness")}</Typography>
            </Box>
          )}

          {perms.canAddTenant && quotaFull && (
            <Box sx={{
              width: 540, minHeight: 138, borderRadius: "14px",
              border: "1.5px dashed #CCC", bgcolor: "#FAFAFA",
              display: "flex", alignItems: "center", justifyContent: "center", mb: 2, opacity: 0.6,
            }}>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#999" }}>{t("biz.quotaFull")}</Typography>
            </Box>
          )}
        </Stack>
      )}
    </>
  );
}
