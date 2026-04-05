"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { SA_PRIMARY, BORDER, BG } from "@/lib/theme";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, locale, setLocale } = useLocale();
  const [langOpen, setLangOpen] = useState(false);

  const userName = user?.name || t("onboarding.adminName");

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: BG, display: "flex" }}>
      {/* Sidebar — collapsed icon bar (68px) matching Figma */}
      <Box sx={{ position: "fixed", height: "100vh", zIndex: 50, bgcolor: "white", borderRight: `1px solid ${BORDER}`, width: 68 }}>
        <Box sx={{ width: 68, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", py: 1.5, gap: 0.5 }}>
          {/* Logo */}
          <Box
            onClick={() => router.push("/home")}
            sx={{ width: 40, height: 40, borderRadius: 3, bgcolor: SA_PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", mb: 0.25 }}
          >
            <Box component="span" sx={{ fontSize: 7, fontWeight: 800, color: "white", lineHeight: 1.2, textAlign: "center" }}>JIG<br/>SAW</Box>
          </Box>
          <Box component="span" sx={{ fontSize: 8, fontWeight: 700, color: SA_PRIMARY, letterSpacing: "0.1em", mb: 1 }}>JIGSAW</Box>

          {/* Home (active) */}
          <Box
            component="button" onClick={() => router.push("/home")} title={t("nav.home")}
            sx={{ width: 44, height: 44, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: `${SA_PRIMARY}1A`, border: "none", cursor: "pointer", "&:hover": { bgcolor: `${SA_PRIMARY}33` } }}
          >
            <img src="/icons/commerce/home.svg" alt="" width={24} height={24} />
          </Box>

          {/* Divider */}
          <Box sx={{ width: 24, height: 1, bgcolor: BORDER, my: 0.75 }} />

          {/* Customer */}
          <Box
            component="button" onClick={() => router.push("/tenantlist")} title={t("onboarding.customer")}
            sx={{ width: 44, height: 44, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", bgcolor: "transparent", "&:hover": { bgcolor: "#f5f5f5" } }}
          >
            <img src="/icons/data/user-id.svg" alt="" width={24} height={24} />
          </Box>

          {/* Reports */}
          <Box
            component="button" title={locale === "en" ? "Reports" : "รายงาน"}
            sx={{ width: 44, height: 44, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", bgcolor: "transparent", "&:hover": { bgcolor: "#f5f5f5" } }}
          >
            <img src="/icons/data/graph-up.svg" alt="" width={24} height={24} />
          </Box>

          {/* Divider */}
          <Box sx={{ width: 24, height: 1, bgcolor: BORDER, my: 0.75 }} />

          {/* Settings */}
          <Box
            component="button" title={t("nav.settings")}
            sx={{ width: 44, height: 44, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", bgcolor: "transparent", "&:hover": { bgcolor: "#f5f5f5" } }}
          >
            <img src="/icons/commerce/settings.svg" alt="" width={24} height={24} />
          </Box>
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: BG, ml: "68px" }}>
        {/* TopBar */}
        <Box sx={{ height: 52, bgcolor: SA_PRIMARY, display: "flex", alignItems: "center", px: 2, gap: 1.5, flexShrink: 0 }}>
          <Box sx={{ width: 20 }} />
          <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.7)", flex: 1 }}>
            <Box component="strong" sx={{ color: "white" }}>Server: Prod</Box> | Admin v.1.0.01
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box component="span" sx={{ color: "white", fontSize: 14 }}>&#9993;</Box>
            <Box component="span" sx={{ color: "white", fontSize: 14, position: "relative" }}>
              &#128276;
              <Box component="span" sx={{ position: "absolute", top: -4, right: -4, width: 8, height: 8, bgcolor: "#E53935", borderRadius: "50%", border: `2px solid ${SA_PRIMARY}` }} />
            </Box>
            <Box sx={{ width: 1, height: 20, bgcolor: "rgba(255,255,255,0.3)" }} />
            {/* Language Switcher */}
            <Box sx={{ position: "relative" }}>
              <Box
                component="button" onClick={() => setLangOpen(prev => !prev)}
                sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "white", fontSize: 12, fontWeight: 500, px: 1, py: 0.5, borderRadius: 1, border: "none", cursor: "pointer", bgcolor: "transparent", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
              >
                {locale.toUpperCase()} <Box component="span" sx={{ fontSize: 10 }}>▼</Box>
              </Box>
              {langOpen && (
                <Box sx={{ position: "absolute", right: 0, top: "100%", mt: 0.5, bgcolor: "white", borderRadius: 2, boxShadow: 4, border: `1px solid ${BORDER}`, overflow: "hidden", zIndex: 50, minWidth: 100 }}>
                  <Box component="button" onClick={() => { setLocale("th"); setLangOpen(false); }}
                    sx={{ width: "100%", px: 1.5, py: 1, textAlign: "left", fontSize: 12, border: "none", cursor: "pointer", bgcolor: "transparent", color: locale === "th" ? SA_PRIMARY : "#333", fontWeight: locale === "th" ? 600 : 400, "&:hover": { bgcolor: "#fafafa" } }}>TH Thai</Box>
                  <Box component="button" onClick={() => { setLocale("en"); setLangOpen(false); }}
                    sx={{ width: "100%", px: 1.5, py: 1, textAlign: "left", fontSize: 12, border: "none", cursor: "pointer", bgcolor: "transparent", color: locale === "en" ? SA_PRIMARY : "#333", fontWeight: locale === "en" ? 600 : 400, borderTop: "1px solid #f5f5f5", "&:hover": { bgcolor: "#fafafa" } }}>EN English</Box>
                </Box>
              )}
            </Box>
            <Box sx={{ width: 1, height: 20, bgcolor: "rgba(255,255,255,0.3)" }} />
            <Box component="span" sx={{ color: "white", fontSize: 12, fontWeight: 500 }}>{userName}</Box>
            <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: SA_PRIMARY, border: "2px solid rgba(255,255,255,0.4)" }}>
              {user?.avatar || "สจ"}
            </Box>
          </Box>
        </Box>

        {/* Breadcrumb */}
        <Box sx={{ px: 2.5, py: 1.25, fontSize: 12, color: "#999" }}>
          {t("nav.home")}
        </Box>

        {/* Title */}
        <Box sx={{ px: 2.5, pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
            {t("nav.home")}
          </Typography>
        </Box>

        {/* Welcome Card */}
        <Box sx={{ flex: 1, px: 3, pb: 3 }}>
          <Paper sx={{ borderRadius: 2.5, boxShadow: "0px 2px 10px rgba(76,78,100,0.12)", p: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
            <Image
              src="/images/welcome-illustration.png"
              alt="Welcome"
              width={240}
              height={200}
              style={{ marginBottom: 16 }}
              priority
            />
            <Typography variant="h6" sx={{ fontWeight: 400, color: "#333" }}>
              {locale === "en" ? "Hello" : "สวัสดีคุณ"} , <Box component="span" sx={{ color: SA_PRIMARY, fontWeight: 600 }}>{userName}</Box>
            </Typography>
          </Paper>
        </Box>

        {/* Footer */}
        <Box sx={{ px: 3, py: 2, fontSize: 14, color: "rgba(76,78,100,0.68)" }}>
          {t("onboarding.footer")}
        </Box>
      </Box>
    </Box>
  );
}
