"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SuperAdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Hero Image */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-gradient-to-br from-[#0a1628] via-[#0f2847] to-[#1a3a5c] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#FF6B00]/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-[#FF6B00]/15" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-[#FF6B00]/10" />
          <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-[#FF6B00]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-cyan-500/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center">
          <div className="text-8xl font-bold text-white/10 tracking-widest mb-4">ERP</div>
          <p className="text-[#FF6B00]/60 text-sm tracking-[0.3em] uppercase">Enterprise Resource Planning</p>
          <div className="absolute -top-20 -left-20 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
            👥
          </div>
          <div className="absolute -top-10 right-0 w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl">
            ⚙️
          </div>
          <div className="absolute -bottom-16 -left-10 w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl">
            ☁️
          </div>
          <div className="absolute -bottom-10 right-10 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-lg">
            🔍
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white px-8">
        <div className="w-full max-w-[380px]">
          {/* Logo */}
          <div className="text-center mb-8">
            <Image
              src="/logo-jigsaw.png"
              alt="JIGSAW"
              width={220}
              height={50}
              className="mx-auto mb-4"
              priority
            />
            <p className="text-sa-primary text-sm font-medium">ยินดีต้อนรับผู้ดูแลระบบ</p>
            <p className="text-sa-primary/70 text-sm">JIGSAW Backoffice</p>
          </div>

          {/* Form */}
          <h2 className="text-center text-lg font-bold text-erp-text mb-6">เข้าสู่ระบบ</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-erp-error/30 rounded-lg text-erp-error text-sm text-center">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <div className="field-group sa">
              <input
                type="text"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
              />
              <label>อีเมล/เบอร์โทรศัพท์/รหัสพนักงาน</label>
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="field-group sa relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <label>รหัสผ่าน</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-erp-muted hover:text-erp-text text-lg"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-erp-border text-sa-primary focus:ring-sa-primary accent-sa-primary"
              />
              <span className="text-sm text-erp-muted">จำรหัสผ่าน</span>
            </label>
            <button className="text-sm text-sa-primary hover:underline">ลืมรหัสผ่าน ?</button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-sa-primary hover:bg-sa-hover text-white rounded-lg font-semibold transition-colors text-sm"
          >
            เข้าสู่ระบบ
          </button>

          {/* Footer */}
          <p className="text-center text-xs text-erp-muted mt-6">
            หากพบปัญหาการเข้าสู่ระบบ{" "}
            <button className="text-sa-primary hover:underline">กรุณาติดต่อผู้ดูแลระบบ</button>
          </p>
        </div>
      </div>
    </div>
  );
}
