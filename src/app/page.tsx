"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function JASLandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-erp-body flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo-jigsaw.png"
            alt="JIGSAW"
            width={200}
            height={46}
            className="mx-auto mb-4"
            priority
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <p className="text-white/50 text-sm mt-1">Enterprise Resource Planning</p>
        </div>

        {/* JAS Admin Entry */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 w-[480px]">
          <h2 className="text-white text-lg font-semibold mb-1">Jigsaw Admin (JAS)</h2>
          <p className="text-white/40 text-sm mb-6">admin.jigsawx.com — ระบบจัดการสำหรับทีม Jigsaw</p>

          <div className="space-y-3">
            {/* JAS Admin Login */}
            <button
              onClick={() => router.push("/login")}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-[#FF6B00]/20 hover:border-[#FF6B00]/50 transition-all group"
            >
              <div className="w-11 h-11 rounded-lg bg-[#FF6B00]/20 flex items-center justify-center shrink-0">
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">เข้าสู่ระบบ Admin</p>
                <p className="text-white/40 text-xs mt-0.5 truncate">จัดการ Accounts, Onboarding, ระบบ</p>
              </div>
              <span className="text-white/30 text-lg group-hover:text-[#FF6B00] transition-colors shrink-0">&rarr;</span>
            </button>
          </div>

          {/* Component Showcase Link */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <button
              onClick={() => router.push("/component-showcase")}
              className="text-white/40 text-xs hover:text-white/70 transition-colors flex items-center gap-1.5 mx-auto"
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              Component Showcase / Design System
            </button>
          </div>
        </div>

        <p className="text-white/20 text-xs mt-6">Jigsaw ERP v1.0 — JAS Admin · admin.jigsawx.com</p>
      </div>
    </div>
  );
}
