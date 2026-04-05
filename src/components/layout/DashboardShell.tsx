"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import { useLocale } from "@/lib/locale";
import { useAuth } from "@/lib/auth";
import { SA_PRIMARY, SA_LIGHT, BORDER, TEXT, BG } from "@/lib/theme";

/**
 * DashboardShell — Sidebar + TopBar + Main Content wrapper
 */
export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { locale, setLocale, t } = useLocale();
  const { user, logout } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState<Record<string, boolean>>({ customer: true, settings: false, reports: false });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: BG, display: "flex" }}>
      {/* Sidebar */}
      <Box
        sx={{
          position: "fixed", height: "100vh", zIndex: 50,
          bgcolor: "white", borderRight: `1px solid ${BORDER}`,
          transition: "width 300ms", width: sidebarExpanded ? 260 : 68,
        }}
      >
        {/* Collapsed (68px) */}
        {!sidebarExpanded && (
          <Box sx={{ width: 68, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", py: 1.5, gap: 0.5 }}>
            <Box
              onClick={() => setSidebarExpanded(true)}
              sx={{ width: 40, height: 40, borderRadius: 3, bgcolor: SA_PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", mb: 0.25 }}
            >
              <Box component="span" sx={{ fontSize: 7, fontWeight: 800, color: "white", lineHeight: 1.2, textAlign: "center" }}>JIG<br/>SAW</Box>
            </Box>
            <Box component="span" sx={{ fontSize: 8, fontWeight: 700, color: SA_PRIMARY, letterSpacing: "0.1em", mb: 1 }}>JIGSAW</Box>
            <Box
              component="button" onClick={() => router.push("/home")} title={t("nav.home")}
              sx={{ width: 44, height: 44, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: `${SA_PRIMARY}1A`, transition: "background 200ms", border: "none", cursor: "pointer", "&:hover": { bgcolor: `${SA_PRIMARY}33` } }}
            >
              <img src="/icons/commerce/home.svg" alt="" width={24} height={24} style={{ filter: "brightness(0) saturate(100%) invert(45%) sepia(96%) saturate(1500%) hue-rotate(360deg)" }} />
            </Box>
            <Box sx={{ width: 24, height: 1, bgcolor: BORDER, my: 0.75 }} />
            <Box
              component="button" onClick={() => { setSidebarExpanded(true); setMenuOpen(prev => ({ ...prev, customer: true })); }} title={t("onboarding.customer")}
              sx={{ width: 44, height: 44, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", bgcolor: "transparent", transition: "background 200ms", "&:hover": { bgcolor: "#f5f5f5" } }}
            >
              <img src="/icons/data/user-id.svg" alt="" width={24} height={24} />
            </Box>
            <Box
              component="button" onClick={() => { setSidebarExpanded(true); setMenuOpen(prev => ({ ...prev, reports: true })); }} title={locale === "en" ? "Reports" : "รายงาน"}
              sx={{ width: 44, height: 44, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", bgcolor: "transparent", transition: "background 200ms", "&:hover": { bgcolor: "#f5f5f5" } }}
            >
              <img src="/icons/data/graph-up.svg" alt="" width={24} height={24} />
            </Box>
            <Box sx={{ width: 24, height: 1, bgcolor: BORDER, my: 0.75 }} />
            <Box
              component="button" onClick={() => { setSidebarExpanded(true); setMenuOpen(prev => ({ ...prev, settings: true })); }} title={t("nav.settings")}
              sx={{ width: 44, height: 44, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", bgcolor: "transparent", transition: "background 200ms", "&:hover": { bgcolor: "#f5f5f5" } }}
            >
              <img src="/icons/commerce/settings.svg" alt="" width={24} height={24} />
            </Box>
          </Box>
        )}

        {/* Expanded (260px) */}
        {sidebarExpanded && (
          <Box sx={{ width: 260, height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1.5, borderBottom: "1px solid #f5f5f5" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }} onClick={() => router.push("/")}>
                <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: SA_PRIMARY, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Box component="span" sx={{ fontSize: 7, fontWeight: 800, color: "white", lineHeight: 1.2, textAlign: "center" }}>JIG<br/>SAW</Box>
                </Box>
                <Box component="span" sx={{ color: SA_PRIMARY, fontWeight: 700, fontSize: 18, letterSpacing: "0.05em" }}>JIGSAW</Box>
              </Box>
              <Box component="button" onClick={() => setSidebarExpanded(false)} sx={{ color: "#bbb", border: "none", bgcolor: "transparent", cursor: "pointer", fontSize: 14, "&:hover": { color: "#888" } }}>&laquo;</Box>
            </Box>

            <Box sx={{ flex: 1, overflowY: "auto", px: 1.5, py: 1 }}>
              {/* Home */}
              <Box
                component="button" onClick={() => router.push("/home")}
                sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1.25, borderRadius: 2, border: "none", cursor: "pointer", bgcolor: "transparent", transition: "background 200ms", fontSize: 16, fontWeight: 400, color: TEXT, mb: 0.5, "&:hover": { bgcolor: "#fafafa" } }}
              >
                <img src="/icons/commerce/home.svg" alt="" width={22} height={22} />
                {t("nav.home")}
                <Box component="span" sx={{ ml: "auto", fontSize: 10, bgcolor: "#4caf50", color: "white", px: 0.75, py: 0.25, borderRadius: 5, fontWeight: 600 }}>New</Box>
              </Box>

              {/* Menu label */}
              <Box component="p" sx={{ fontSize: 12, color: "#bbb", px: 1.5, mt: 1.5, mb: 0.5, fontWeight: 400 }}>{locale === "en" ? "Menu" : "เมนู"}</Box>

              {/* Customer */}
              <Box>
                <Box
                  component="button" onClick={() => setMenuOpen(prev => ({ ...prev, customer: !prev.customer }))}
                  sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1.25, borderRadius: 2, border: "none", cursor: "pointer", bgcolor: "transparent", transition: "background 200ms", fontSize: 16, fontWeight: 400, color: TEXT, "&:hover": { bgcolor: "#fafafa" } }}
                >
                  <img src="/icons/data/user-id.svg" alt="" width={22} height={22} />
                  {t("onboarding.customer")}
                  <img src="/icons/nav/arrow-dropdown.svg" alt="" width={16} height={16} style={{ marginLeft: "auto", transition: "transform 200ms", transform: menuOpen.customer ? "rotate(180deg)" : "none" }} />
                </Box>
                {menuOpen.customer && (
                  <Box sx={{ ml: 3, mt: 0.25 }}>
                    <Box
                      component="button" onClick={() => router.push("/tenantlist")}
                      sx={{ width: "100%", textAlign: "left", px: 1.5, py: 0.75, borderRadius: 2, color: SA_PRIMARY, fontWeight: 500, border: "none", cursor: "pointer", bgcolor: "transparent", transition: "background 200ms", fontSize: 15, "&:hover": { bgcolor: SA_LIGHT } }}
                    >
                      &bull; {locale === "en" ? "Customer List" : "รายชื่อลูกค้า"}
                    </Box>
                    <Box
                      component="button"
                      sx={{ width: "100%", textAlign: "left", px: 1.5, py: 0.75, borderRadius: 2, color: "#999", border: "none", cursor: "pointer", bgcolor: "transparent", transition: "background 200ms", fontSize: 15, "&:hover": { bgcolor: "#fafafa" } }}
                    >
                      &bull; {locale === "en" ? "All Contracts" : "สัญญาทั้งหมด"}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Reports */}
              <Box
                component="button" onClick={() => setMenuOpen(prev => ({ ...prev, reports: !prev.reports }))}
                sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1.25, borderRadius: 2, border: "none", cursor: "pointer", bgcolor: "transparent", transition: "background 200ms", fontSize: 16, fontWeight: 400, color: TEXT, "&:hover": { bgcolor: "#fafafa" } }}
              >
                <img src="/icons/data/graph-up.svg" alt="" width={22} height={22} />
                {locale === "en" ? "Reports" : "รายงาน"}
                <img src="/icons/nav/arrow-dropdown.svg" alt="" width={16} height={16} style={{ marginLeft: "auto", transition: "transform 200ms", transform: menuOpen.reports ? "rotate(180deg)" : "none" }} />
              </Box>

              {/* Settings label */}
              <Box component="p" sx={{ fontSize: 12, color: "#bbb", px: 1.5, mt: 1.5, mb: 0.5, fontWeight: 400 }}>{locale === "en" ? "Settings" : "ตั้งค่า"}</Box>
              <Box
                component="button" onClick={() => setMenuOpen(prev => ({ ...prev, settings: !prev.settings }))}
                sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1.25, borderRadius: 2, border: "none", cursor: "pointer", bgcolor: "transparent", transition: "background 200ms", fontSize: 16, fontWeight: 400, color: TEXT, "&:hover": { bgcolor: "#fafafa" } }}
              >
                <img src="/icons/commerce/settings.svg" alt="" width={22} height={22} />
                {locale === "en" ? "Settings" : "ตั้งค่า"}
                <img src="/icons/nav/arrow-dropdown.svg" alt="" width={16} height={16} style={{ marginLeft: "auto", transition: "transform 200ms", transform: menuOpen.settings ? "rotate(180deg)" : "none" }} />
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: BG, transition: "margin-left 300ms", ml: sidebarExpanded ? "260px" : "68px" }}>
        {sidebarExpanded && (
          <Box onClick={() => setSidebarExpanded(false)} sx={{ position: "fixed", inset: 0, zIndex: 45 }} />
        )}

        {/* TopBar */}
        <Box sx={{ height: 52, bgcolor: SA_PRIMARY, display: "flex", alignItems: "center", px: 2, gap: 1.5, flexShrink: 0, position: "relative", zIndex: 50, overflow: "visible" }}>
          <Box
            component="button" onClick={() => setSidebarExpanded(!sidebarExpanded)}
            sx={{ color: "white", border: "none", cursor: "pointer", bgcolor: "transparent", p: 0.75, borderRadius: 2, "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
          >
            <img src="/icons/nav/hamburger.svg" alt="" width={22} height={22} style={{ filter: "brightness(0) invert(1)" }} />
          </Box>
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 0.75, color: "white", fontSize: 14 }}>
            <strong>Server: Prod</strong> | Jigsaw Admin
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, position: "relative", zIndex: 60 }}>
            <Box component="span" sx={{ color: "white", fontSize: 14 }}>✉</Box>
            <Box component="span" sx={{ color: "white", fontSize: 14 }}>🔔</Box>
            <Box
              component="button" onClick={() => setLocale(locale === "th" ? "en" : "th")}
              sx={{ color: "white", fontSize: 14, fontWeight: 500, border: "none", cursor: "pointer", bgcolor: "transparent", px: 1, py: 0.5, borderRadius: 2, "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
            >
              {locale === "th" ? "TH" : "EN"} ▼
            </Box>
            <Box
              component="button" onClick={logout}
              sx={{ display: "flex", alignItems: "center", gap: 1, color: "white", fontSize: 14, fontWeight: 500, border: "none", cursor: "pointer", bgcolor: "transparent", px: 1, py: 0.5, borderRadius: 2, "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
            >
              {user?.name || "Admin"}
              <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                {(user?.name || "A").slice(0, 2)}
              </Box>
              <img src="/icons/nav/arrow-dropdown.svg" alt="" width={14} height={14} style={{ filter: "brightness(0) invert(1)" }} />
            </Box>
          </Box>
        </Box>

        {/* Page content */}
        <Box sx={{ flex: 1, position: "relative", zIndex: 10 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
