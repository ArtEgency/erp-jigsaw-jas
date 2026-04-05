"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/locale";
import { useAuth } from "@/lib/auth";

/**
 * DashboardShell — Sidebar + TopBar + Main Content wrapper
 * ใช้ร่วมกันทุกหน้าใน (dashboard)
 */
export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { locale, setLocale, t } = useLocale();
  const { user, logout } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState<Record<string, boolean>>({ customer: true, settings: false, reports: false });

  return (
    <div className="min-h-screen bg-erp-bg flex">
      {/* ══ Sidebar ══ */}
      <div className={`fixed h-screen z-50 bg-white border-r border-gray-200 transition-all duration-300 ${sidebarExpanded ? "w-[260px]" : "w-[68px]"}`}>
        {/* Collapsed (68px) */}
        {!sidebarExpanded && (
          <div className="w-[68px] h-full flex flex-col items-center py-3 gap-1">
            <div className="w-10 h-10 rounded-xl bg-sa-primary flex items-center justify-center cursor-pointer mb-0.5" onClick={() => setSidebarExpanded(true)}>
              <span className="text-[7px] font-extrabold text-white leading-tight text-center">JIG<br/>SAW</span>
            </div>
            <span className="text-[8px] font-bold text-sa-primary tracking-wider mb-2">JIGSAW</span>
            <button onClick={() => router.push("/home")} className="w-11 h-11 rounded-lg flex items-center justify-center bg-sa-primary/10 transition-colors" title={t("nav.home")}>
              <img src="/icons/commerce/home.svg" alt="" width={24} height={24} style={{ filter: "brightness(0) saturate(100%) invert(45%) sepia(96%) saturate(1500%) hue-rotate(360deg)" }} />
            </button>
            <div className="w-6 h-px bg-gray-200 my-1.5" />
            <button onClick={() => { setSidebarExpanded(true); setMenuOpen(prev => ({ ...prev, customer: true })); }} className="w-11 h-11 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors" title={t("onboarding.customer")}>
              <img src="/icons/data/user-id.svg" alt="" width={24} height={24} />
            </button>
            <button onClick={() => { setSidebarExpanded(true); setMenuOpen(prev => ({ ...prev, reports: true })); }} className="w-11 h-11 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors" title={locale === "en" ? "Reports" : "รายงาน"}>
              <img src="/icons/data/graph-up.svg" alt="" width={24} height={24} />
            </button>
            <div className="w-6 h-px bg-gray-200 my-1.5" />
            <button onClick={() => { setSidebarExpanded(true); setMenuOpen(prev => ({ ...prev, settings: true })); }} className="w-11 h-11 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors" title={t("nav.settings")}>
              <img src="/icons/commerce/settings.svg" alt="" width={24} height={24} />
            </button>
          </div>
        )}

        {/* Expanded (260px) */}
        {sidebarExpanded && (
        <div className="w-[260px] h-full flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
              <div className="w-8 h-8 rounded-lg bg-sa-primary flex items-center justify-center">
                <span className="text-[7px] font-extrabold text-white leading-tight text-center">JIG<br/>SAW</span>
              </div>
              <span className="text-sa-primary font-bold text-lg tracking-wide">JIGSAW</span>
            </div>
            <button onClick={() => setSidebarExpanded(false)} className="text-gray-400 hover:text-gray-600 text-sm">&laquo;</button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2">
            {/* ภาพรวม */}
            <button onClick={() => router.push("/home")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors mb-1" style={{ fontSize: 16, fontWeight: 400, color: "#333" }}>
              <img src="/icons/commerce/home.svg" alt="" width={22} height={22} />
              {t("nav.home")}
              <span className="ml-auto text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-semibold">New</span>
            </button>

            {/* เมนู label */}
            <p className="text-xs text-gray-400 px-3 mt-3 mb-1" style={{ fontWeight: 400 }}>{locale === "en" ? "Menu" : "เมนู"}</p>

            {/* ลูกค้า */}
            <div>
              <button onClick={() => setMenuOpen(prev => ({ ...prev, customer: !prev.customer }))} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors" style={{ fontSize: 16, fontWeight: 400, color: "#333" }}>
                <img src="/icons/data/user-id.svg" alt="" width={22} height={22} />
                {t("onboarding.customer")}
                <img src="/icons/nav/arrow-dropdown.svg" alt="" width={16} height={16} className={`ml-auto transition-transform ${menuOpen.customer ? "rotate-180" : ""}`} />
              </button>
              {menuOpen.customer && (
                <div className="ml-6 mt-0.5 space-y-0.5">
                  <button onClick={() => router.push("/tenantlist")} className="w-full text-left px-3 py-1.5 rounded-lg text-sa-primary font-medium hover:bg-orange-50 transition-colors" style={{ fontSize: 15 }}>
                    &bull; {locale === "en" ? "Customer List" : "รายชื่อลูกค้า"}
                  </button>
                  <button className="w-full text-left px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors" style={{ fontSize: 15 }}>
                    &bull; {locale === "en" ? "All Contracts" : "สัญญาทั้งหมด"}
                  </button>
                </div>
              )}
            </div>

            {/* รายงาน */}
            <button onClick={() => setMenuOpen(prev => ({ ...prev, reports: !prev.reports }))} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors" style={{ fontSize: 16, fontWeight: 400, color: "#333" }}>
              <img src="/icons/data/graph-up.svg" alt="" width={22} height={22} />
              {locale === "en" ? "Reports" : "รายงาน"}
              <img src="/icons/nav/arrow-dropdown.svg" alt="" width={16} height={16} className={`ml-auto transition-transform ${menuOpen.reports ? "rotate-180" : ""}`} />
            </button>

            {/* ตั้งค่า label */}
            <p className="text-xs text-gray-400 px-3 mt-3 mb-1" style={{ fontWeight: 400 }}>{locale === "en" ? "Settings" : "ตั้งค่า"}</p>
            <button onClick={() => setMenuOpen(prev => ({ ...prev, settings: !prev.settings }))} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors" style={{ fontSize: 16, fontWeight: 400, color: "#333" }}>
              <img src="/icons/commerce/settings.svg" alt="" width={22} height={22} />
              {locale === "en" ? "Settings" : "ตั้งค่า"}
              <img src="/icons/nav/arrow-dropdown.svg" alt="" width={16} height={16} className={`ml-auto transition-transform ${menuOpen.settings ? "rotate-180" : ""}`} />
            </button>

            {/* Component Showcase ย้ายไป erp-jigsaw-design แล้ว */}
          </div>
        </div>
        )}
      </div>

      {/* ══ Main content ══ */}
      <div className={`flex-1 flex flex-col min-h-screen bg-erp-bg transition-all duration-300 ${sidebarExpanded ? "ml-[260px]" : "ml-[68px]"}`}>
        {sidebarExpanded && (
          <div className="fixed inset-0 z-[45]" onClick={() => setSidebarExpanded(false)} />
        )}

        {/* TopBar */}
        <div className="h-[52px] bg-sa-primary flex items-center px-4 gap-3 shrink-0 relative z-50 overflow-visible">
          <button className="text-white hover:bg-white/10 p-1.5 rounded-lg" onClick={() => setSidebarExpanded(!sidebarExpanded)}>
            <img src="/icons/nav/hamburger.svg" alt="" width={22} height={22} style={{ filter: "brightness(0) invert(1)" }} />
          </button>
          <div className="flex-1 flex items-center gap-1.5 text-white text-sm">
            <strong>Server: Prod</strong> | Jigsaw Admin
          </div>
          <div className="flex items-center gap-3 relative z-[60]">
            <span className="text-white text-sm">✉</span>
            <span className="text-white text-sm">🔔</span>
            <button onClick={() => setLocale(locale === "th" ? "en" : "th")} className="text-white text-sm font-medium hover:bg-white/10 px-2 py-1 rounded-lg">
              {locale === "th" ? "TH" : "EN"} ▼
            </button>
            <button onClick={logout} className="flex items-center gap-2 text-white text-sm font-medium hover:bg-white/10 px-2 py-1 rounded-lg">
              {user?.name || "Admin"}
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                {(user?.name || "A").slice(0, 2)}
              </div>
              <img src="/icons/nav/arrow-dropdown.svg" alt="" width={14} height={14} style={{ filter: "brightness(0) invert(1)" }} />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
