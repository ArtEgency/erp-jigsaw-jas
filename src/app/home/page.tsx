"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, locale, setLocale } = useLocale();
  const [langOpen, setLangOpen] = useState(false);

  const userName = user?.name || t("onboarding.adminName");

  return (
    <div className="min-h-screen bg-erp-bg flex">
      {/* Sidebar — collapsed icon bar (68px) matching Figma */}
      <div className="fixed h-screen z-50 bg-white border-r border-gray-200 w-[68px]">
        <div className="w-[68px] h-full flex flex-col items-center py-3 gap-1">
          {/* Logo */}
          <div className="w-10 h-10 rounded-xl bg-sa-primary flex items-center justify-center cursor-pointer mb-0.5" onClick={() => router.push("/home")}>
            <span className="text-[7px] font-extrabold text-white leading-tight text-center">JIG<br/>SAW</span>
          </div>
          <span className="text-[8px] font-bold text-sa-primary tracking-wider mb-2">JIGSAW</span>

          {/* Home (active) */}
          <button onClick={() => router.push("/home")} className="w-11 h-11 rounded-lg flex items-center justify-center bg-sa-primary/10 transition-colors" title={t("nav.home")}>
            <img src="/icons/commerce/home.svg" alt="" width={24} height={24} />
          </button>

          {/* Divider */}
          <div className="w-6 h-px bg-gray-200 my-1.5" />

          {/* ลูกค้า */}
          <button onClick={() => router.push("/tenantlist")} className="w-11 h-11 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors" title={t("onboarding.customer")}>
            <img src="/icons/data/user-id.svg" alt="" width={24} height={24} />
          </button>

          {/* รายงาน */}
          <button className="w-11 h-11 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors" title={locale === "en" ? "Reports" : "รายงาน"}>
            <img src="/icons/data/graph-up.svg" alt="" width={24} height={24} />
          </button>

          {/* Divider */}
          <div className="w-6 h-px bg-gray-200 my-1.5" />

          {/* ตั้งค่า */}
          <button className="w-11 h-11 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors" title={t("nav.settings")}>
            <img src="/icons/commerce/settings.svg" alt="" width={24} height={24} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen bg-erp-bg ml-[68px]">
        {/* TopBar */}
        <div className="h-[52px] bg-sa-primary flex items-center px-4 gap-3 shrink-0">
          <div className="w-5" />
          <div className="text-xs text-white/70 flex-1">
            <strong className="text-white">Server: Prod</strong> | Admin v.1.0.01
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
                  <button onClick={() => { setLocale("th"); setLangOpen(false); }} className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50" style={{ color: locale === "th" ? "#FF6B00" : "#333", fontWeight: locale === "th" ? 600 : 400 }}>TH Thai</button>
                  <button onClick={() => { setLocale("en"); setLangOpen(false); }} className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 border-t border-gray-100" style={{ color: locale === "en" ? "#FF6B00" : "#333", fontWeight: locale === "en" ? 600 : 400 }}>EN English</button>
                </div>
              )}
            </div>
            <div className="w-px h-5 bg-white/30" />
            <span className="text-white text-xs font-medium">{userName}</span>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-sa-primary border-2 border-white/40">
              {user?.avatar || "สจ"}
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="px-5 py-2.5 text-xs text-gray-500">
          {t("nav.home")}
        </div>

        {/* Title */}
        <div className="px-5 pb-2">
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
            {t("nav.home")}
          </Typography>
        </div>

        {/* Welcome Card */}
        <Box sx={{ flex: 1, px: 3, pb: 3 }}>
          <Paper sx={{ borderRadius: 2.5, boxShadow: "0px 2px 10px rgba(76,78,100,0.12)", p: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
            {/* Illustration */}
            <Image
              src="/images/welcome-illustration.png"
              alt="Welcome"
              width={240}
              height={200}
              className="mb-4"
              priority
            />
            {/* Greeting */}
            <Typography variant="h6" sx={{ fontWeight: 400, color: "#333" }}>
              {locale === "en" ? "Hello" : "สวัสดีคุณ"} , <span style={{ color: "#FF6B00", fontWeight: 600 }}>{userName}</span>
            </Typography>
          </Paper>
        </Box>

        {/* Footer */}
        <Box sx={{ px: 3, py: 2, fontSize: 14, color: "rgba(76,78,100,0.68)" }}>
          {t("onboarding.footer")}
        </Box>
      </div>
    </div>
  );
}
