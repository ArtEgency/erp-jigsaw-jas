"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from "next/image";
import SlidePanel from "@/components/layout/SlidePanel";
import FloatingField from "@/components/layout/FloatingField";
import { masterAccounts, MasterAccount, sampleTenantDetail } from "@/data/mock";

type Screen = "s1" | "s2" | "s2e" | "s3" | "s4" | "s4e" | "s5" | "s6" | "s7" | "s8";

const customerGroupColors: Record<string, string> = {
  "ขายส่ง": "bg-purple-50 text-purple-700",
  "ขายปลีก": "bg-green-50 text-green-800",
  "ทั่วไป": "bg-orange-50 text-orange-700",
  "VIP": "bg-blue-50 text-blue-700",
};

const allModules = sampleTenantDetail.modules;

export default function OnboardingPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("s1");
  const [search, setSearch] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<MasterAccount>(masterAccounts[0]);
  const [showToast, setShowToast] = useState(false);

  // S2 form state
  const [accountForm, setAccountForm] = useState({
    company: "", firstName: "", lastName: "", position: "",
    customerGroup: "ทั่วไป", email: "", phone: "", tenantQuota: "3",
  });
  const [emailError, setEmailError] = useState(false);

  // S6 tenant form state
  const [tenantForm, setTenantForm] = useState({
    nameTh: "", nameEn: "", entityType: "บริษัทจำกัด (บจ.)",
    businessType: "Trading — ซื้อมาขายไป", taxId: "", subdomain: "",
    tier: "Cloud" as "Cloud" | "Dedicated" | "On-premise",
    quotaUser: "20", quotaBranch: "3", quotaWarehouse: "5",
    quotaStorage: "20", quotaAuditLog: "12", quotaOnboarding: "10",
    backupFreq: "1", backupUnit: "วัน",
    contractStart: "01/04/2569", contractEnd: "31/03/2570",
    autoRenewal: false,
  });
  const [moduleStates, setModuleStates] = useState(
    allModules.map((m) => ({ ...m }))
  );

  // S4 password state
  const [password, setPassword] = useState("Jigsaw@2569");
  const [confirmPassword, setConfirmPassword] = useState("Jigsaw@2569");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // S5 active tab
  const [detailTab, setDetailTab] = useState<"general" | "tenants" | "contracts" | "history">("general");

  const go = (s: Screen) => {
    setScreen(s);
    window.scrollTo(0, 0);
  };

  const filtered = masterAccounts.filter(
    (a) =>
      a.firstName.includes(search) ||
      a.lastName.includes(search) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase())
  );

  // Password strength
  const pwChecks = [
    { label: "อย่างน้อย 8 ตัวอักษร", ok: password.length >= 8 },
    { label: "มีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว", ok: /[A-Z]/.test(password) },
    { label: "มีตัวเลขอย่างน้อย 1 ตัว", ok: /[0-9]/.test(password) },
    { label: "มีอักขระพิเศษอย่างน้อย 1 ตัว", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const pwStrength = pwChecks.filter((c) => c.ok).length;

  // ─── TOPBAR SA ───
  const TopBarSA = () => (
    <div className="h-[52px] bg-sa-primary flex items-center px-4 gap-3 shrink-0">
      <span className="text-white/80 text-lg cursor-pointer">&#9776;</span>
      <div className="text-xs text-white/70 flex-1">
        <strong className="text-white">Server: Prod</strong> | Jigsaw Admin
      </div>
      <div className="flex items-center gap-3">
        <span className="text-white text-sm">&#9993;</span>
        <span className="text-white text-sm relative">
          &#128276;
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-sa-primary" />
        </span>
        <div className="w-px h-5 bg-white/30" />
        <span className="text-white text-xs font-medium">สลิษา จิตดี</span>
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-sa-primary border-2 border-white/40">
          สจ
        </div>
      </div>
    </div>
  );

  // ─── TOPBAR TA (for email/verify screens) ───
  const TopBarTA = ({ info }: { info: string }) => (
    <div className="h-[52px] bg-brand-primary flex items-center px-4 gap-3 shrink-0">
      <span className="text-white/80 text-lg">&#9776;</span>
      <div className="text-xs text-white/70 flex-1">
        <strong className="text-white">{info}</strong>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-brand-primary border-2 border-white/40">
          สม
        </div>
      </div>
    </div>
  );

  // ─── BREADCRUMB ───
  const Breadcrumb = ({ items }: { items: { label: string; onClick?: () => void }[] }) => (
    <div className="px-5 py-2.5 text-xs text-erp-muted flex items-center gap-1.5 bg-white border-b border-erp-border">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-gray-300">&#8250;</span>}
          {item.onClick ? (
            <button onClick={item.onClick} className="text-sa-primary hover:underline">
              {item.label}
            </button>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );

  // ─── SCREEN META ───
  const ScreenMetaBar = ({ id, title, actor }: { id: string; title: string; actor: "sa" | "ta" }) => (
    <div className="bg-[#1e1e2e] px-4 py-2 flex items-center gap-2.5 flex-wrap shrink-0">
      <span className="text-[10px] font-mono text-blue-300 bg-[#1e3a5f] px-2 py-0.5 rounded">{id}</span>
      <span className="text-xs font-medium text-white flex-1">{title}</span>
      <span className={`text-[10px] px-2 py-0.5 rounded-lg ${
        actor === "sa" ? "bg-[#1e3a5f] text-blue-300" : "bg-[#3d2800] text-yellow-300"
      }`}>
        {actor === "sa" ? "Super Admin" : "Tenant Admin"}
      </span>
    </div>
  );

  // ═══════════════════ S1: MASTER ACCOUNT LIST ═══════════════════
  const renderS1 = () => (
    <div className="flex flex-col flex-1">
      <ScreenMetaBar id="S-01-01" title="Master Account List — Data List" actor="sa" />
      <TopBarSA />
      <Breadcrumb items={[{ label: "ลูกค้า" }, { label: "รายชื่อลูกค้า" }]} />
      <div className="px-5 pt-3 pb-2">
        <h1 className="text-xl font-bold text-erp-text">รายชื่อลูกค้า</h1>
      </div>
      <div className="flex-1 px-5 pb-5">
        {/* Toolbar */}
        <div className="flex items-center gap-2.5 mb-3 flex-wrap">
          <button className="px-3 py-2 bg-white border border-erp-border rounded-md text-xs hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
            &#128228; ส่งออกรายงาน
          </button>
          <div className="flex-1" />
          <input
            type="text"
            placeholder="ค้นหารายชื่อลูกค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border-[1.5px] border-erp-border rounded-md text-xs w-60 focus:outline-none focus:border-sa-primary"
          />
          <button
            onClick={() => {
              setAccountForm({ company: "", firstName: "", lastName: "", position: "", customerGroup: "ทั่วไป", email: "", phone: "", tenantQuota: "3" });
              setEmailError(false);
              go("s2");
            }}
            className="px-4 py-2 bg-sa-primary hover:bg-sa-hover text-white text-xs rounded-md font-semibold transition-colors"
          >
            + เพิ่มลูกค้า
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-erp-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white border-b border-erp-border">
                <th className="px-3.5 py-3 text-left text-[11px] font-semibold text-erp-muted whitespace-nowrap">รหัส Account</th>
                <th className="px-3.5 py-3 text-left text-[11px] font-semibold text-erp-muted">ชื่อ-นามสกุล</th>
                <th className="px-3.5 py-3 text-left text-[11px] font-semibold text-erp-muted">กลุ่มลูกค้า</th>
                <th className="px-3.5 py-3 text-left text-[11px] font-semibold text-erp-muted">อีเมล (Master Email)</th>
                <th className="px-3.5 py-3 text-left text-[11px] font-semibold text-erp-muted">เบอร์โทรศัพท์</th>
                <th className="px-3.5 py-3 text-left text-[11px] font-semibold text-erp-muted">วันที่ยืนยัน Email</th>
                <th className="px-3.5 py-3 text-left text-[11px] font-semibold text-erp-muted">จำนวนธุรกิจ</th>
                <th className="px-3.5 py-3 text-left text-[11px] font-semibold text-erp-muted">สถานะ</th>
                <th className="px-3.5 py-3 text-left text-[11px] font-semibold text-erp-muted">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-gray-50 hover:bg-[#f8f6ff] cursor-pointer transition-colors"
                  onClick={() => { setSelectedAccount(a); setDetailTab("general"); go("s5"); }}
                >
                  <td className="px-3.5 py-3">
                    <span className="font-mono text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      {a.id}
                    </span>
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="font-semibold text-erp-text">{a.firstName} {a.lastName}</div>
                    <div className="text-[11px] text-erp-muted">{a.position}</div>
                  </td>
                  <td className="px-3.5 py-3">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${customerGroupColors[a.customerGroup] || "bg-gray-100 text-gray-600"}`}>
                      {a.customerGroup}
                    </span>
                  </td>
                  <td className="px-3.5 py-3 text-xs text-gray-500">{a.email}</td>
                  <td className="px-3.5 py-3 text-xs">{a.phone}</td>
                  <td className="px-3.5 py-3 text-xs text-erp-muted">{a.emailVerifiedAt || "—"}</td>
                  <td className="px-3.5 py-3">
                    <span className="font-semibold text-sa-primary">{a.tenantUsed}</span>
                    <span className="text-erp-muted">/{a.tenantQuota}</span>
                  </td>
                  <td className="px-3.5 py-3">
                    {a.status === "เปิดใช้งาน" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-50 text-green-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        เปิดใช้งาน
                      </span>
                    ) : a.status === "รอยืนยัน Email" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        รอยืนยัน Email
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        ปิดใช้งาน
                      </span>
                    )}
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedAccount(a); setDetailTab("general"); go("s5"); }}
                        className="w-7 h-7 rounded border border-erp-border bg-white flex items-center justify-center text-erp-muted hover:border-sa-primary hover:text-sa-primary text-xs transition-colors"
                      >
                        &#9998;
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="w-7 h-7 rounded border border-erp-border bg-white flex items-center justify-center text-erp-muted hover:border-sa-primary hover:text-sa-primary text-xs transition-colors"
                      >
                        &#8942;
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex items-center justify-end gap-2 px-3.5 py-2.5 border-t border-erp-border text-xs text-erp-muted">
            <span>จำนวนรายการต่อหน้า</span>
            <select className="px-1.5 py-0.5 border border-erp-border rounded text-[11px]">
              <option>6</option><option>12</option><option>25</option>
            </select>
            <span className="mx-1">1–{filtered.length} of {filtered.length}</span>
            <button className="w-6 h-6 rounded border border-erp-border bg-white flex items-center justify-center text-xs hover:bg-gray-50">&#8249;</button>
            <button className="w-6 h-6 rounded border border-sa-primary bg-sa-primary text-white flex items-center justify-center text-xs">1</button>
            <button className="w-6 h-6 rounded border border-erp-border bg-white flex items-center justify-center text-xs hover:bg-gray-50">&#8250;</button>
          </div>
        </div>
      </div>
      <div className="px-5 py-2.5 text-[11px] text-gray-400 border-t border-erp-border bg-white text-center">
        &copy; 2569, Made with &#10084; by ERP Jigsaw
      </div>
    </div>
  );

  // ═══════════════════ S2: CREATE ACCOUNT PANEL ═══════════════════
  const renderS2 = () => (
    <div className="flex flex-col flex-1">
      <ScreenMetaBar id="S-01-02" title="ฟอร์มสร้าง Master Account — Slide Panel (Filled State)" actor="sa" />
      <TopBarSA />
      <Breadcrumb items={[{ label: "Master Accounts", onClick: () => go("s1") }, { label: "สร้างใหม่" }]} />
      <div className="px-5 pt-3 pb-2">
        <h1 className="text-xl font-bold text-erp-text">Master Accounts</h1>
      </div>
      <div className="flex-1 relative">
        <SlidePanel
          open={true}
          title="สร้าง Master Account"
          onClose={() => go("s1")}
          headerColor="sa"
          footer={
            <>
              <button onClick={() => go("s1")} className="px-4 py-2 border border-erp-border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                ยกเลิก
              </button>
              <button onClick={() => go("s3")} className="px-4 py-2 bg-sa-primary hover:bg-sa-hover text-white text-sm rounded-lg font-medium transition-colors">
                บันทึก
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <FloatingField label="ชื่อบริษัท / ห้างร้าน" value={accountForm.company} onChange={(v) => setAccountForm({ ...accountForm, company: v })} variant="sa" />
            <div className="grid grid-cols-2 gap-3">
              <FloatingField label="ชื่อ" value={accountForm.firstName} onChange={(v) => setAccountForm({ ...accountForm, firstName: v })} variant="sa" required />
              <FloatingField label="นามสกุล" value={accountForm.lastName} onChange={(v) => setAccountForm({ ...accountForm, lastName: v })} variant="sa" required />
            </div>
            <FloatingField label="ตำแหน่ง" value={accountForm.position} onChange={(v) => setAccountForm({ ...accountForm, position: v })} variant="sa" required />
            <div className="field-group sa">
              <select
                value={accountForm.customerGroup}
                onChange={(e) => setAccountForm({ ...accountForm, customerGroup: e.target.value })}
              >
                <option value="ทั่วไป">ทั่วไป</option>
                <option value="ขายส่ง">ขายส่ง</option>
                <option value="ขายปลีก">ขายปลีก</option>
                <option value="VIP">VIP</option>
                <option value="Founding Partner">Founding Partner</option>
              </select>
              <label>กลุ่มลูกค้า <span className="text-erp-error">*</span></label>
            </div>
            <div>
              <FloatingField label="อีเมล (Master Email)" value={accountForm.email} onChange={(v) => setAccountForm({ ...accountForm, email: v })} variant="sa" required />
              {accountForm.email && !emailError && (
                <p className="text-[10px] text-green-600 mt-1 pl-0.5">&#10003; ยังไม่มีในระบบ &middot; ใช้เป็น login หลักของ Account นี้</p>
              )}
            </div>
            <div>
              <p className="text-[11px] text-erp-muted mb-1.5 font-medium">เบอร์โทรศัพท์ <span className="text-erp-error">*</span></p>
              <div className="flex border-[1.5px] border-erp-border rounded-md overflow-hidden focus-within:border-sa-primary transition-colors">
                <div className="px-2.5 py-2 bg-gray-50 border-r border-erp-border flex items-center gap-1 text-xs text-erp-muted whitespace-nowrap">
                  &#127481;&#127469; +66 &#9662;
                </div>
                <input
                  className="flex-1 px-3 py-2 text-sm outline-none"
                  value={accountForm.phone}
                  onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                />
              </div>
            </div>
            <FloatingField label="จำนวนธุรกิจ (Tenant Quota)" value={accountForm.tenantQuota} onChange={(v) => setAccountForm({ ...accountForm, tenantQuota: v })} variant="sa" required type="number" />
            <p className="text-[11px] text-erp-muted -mt-2 pl-0.5">จำนวน Tenant สูงสุดที่สร้างได้ภายใต้ Account นี้</p>
            <div className="p-2.5 bg-[#FF6B00]/10 rounded-md border border-[#FF6B00]/20 text-xs text-sa-primary">
              ระบบจะส่ง Email ยืนยันตัวตนให้ผู้ติดต่อทันที
            </div>
          </div>
        </SlidePanel>
      </div>
    </div>
  );

  // ═══════════════════ S2e: ERROR STATE ═══════════════════
  const renderS2e = () => (
    <div className="flex flex-col flex-1">
      <ScreenMetaBar id="S-01-02e" title="Error — Email ซ้ำในระบบ · ปุ่ม disabled" actor="sa" />
      <TopBarSA />
      <Breadcrumb items={[{ label: "Master Accounts", onClick: () => go("s1") }, { label: "สร้างใหม่" }]} />
      <div className="px-5 pt-3 pb-2">
        <h1 className="text-xl font-bold text-erp-text">Master Accounts</h1>
      </div>
      <div className="flex-1 relative">
        <SlidePanel
          open={true}
          title="สร้าง Master Account"
          onClose={() => go("s1")}
          headerColor="sa"
          footer={
            <>
              <button onClick={() => go("s1")} className="px-4 py-2 border border-erp-border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                ยกเลิก
              </button>
              <button disabled className="px-4 py-2 bg-sa-primary text-white text-sm rounded-lg font-medium opacity-40 cursor-not-allowed">
                บันทึก
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <FloatingField label="ชื่อ-นามสกุล" value="วิภา รัตนพันธ์" onChange={() => {}} variant="sa" required />
            <FloatingField label="ตำแหน่ง" value="CEO" onChange={() => {}} variant="sa" required />
            <div>
              <div className="field-group sa required">
                <input value="wipa@thaimart.co.th" readOnly className="!border-erp-error" />
                <label>อีเมล (Master Email) <span className="text-erp-error">*</span></label>
              </div>
              <p className="text-[10px] text-erp-error mt-1 pl-0.5">&#10005; อีเมลนี้มีในระบบแล้ว</p>
            </div>
            <div>
              <p className="text-[11px] text-erp-muted mb-1.5 font-medium">เบอร์โทรศัพท์ <span className="text-erp-error">*</span></p>
              <div className="flex border-[1.5px] border-erp-border rounded-md overflow-hidden">
                <div className="px-2.5 py-2 bg-gray-50 border-r border-erp-border flex items-center gap-1 text-xs text-erp-muted">
                  &#127481;&#127469; +66 &#9662;
                </div>
                <input className="flex-1 px-3 py-2 text-sm outline-none" value="0894567890" readOnly />
              </div>
            </div>
            <FloatingField label="Tenant Quota" value="5" onChange={() => {}} variant="sa" required type="number" />
            <div className="p-2.5 bg-red-50 rounded-md border border-red-200 text-xs text-erp-error">
              &#9888; กรุณาแก้ไขข้อมูลให้ถูกต้องก่อนบันทึก
            </div>
          </div>
        </SlidePanel>
      </div>
    </div>
  );

  // ═══════════════════ S3: VERIFY EMAIL ═══════════════════
  const renderS3 = () => (
    <div className="flex flex-col flex-1">
      <ScreenMetaBar id="S-01-03" title="Verify Email — ส่งให้ Tenant Admin ทันทีหลัง Save" actor="ta" />
      <TopBarTA info="Email Client — somchai@siamgroup.co.th" />
      <div className="flex-1 pt-4 bg-[#f0ede6]">
        <div className="flex items-start justify-center p-5">
          <div className="w-full max-w-[560px]">
            {/* Email client bar */}
            <div className="bg-brand-primary px-3.5 py-2 rounded-t-lg text-[11px] text-white/70">
              &#128231; somchai@siamgroup.co.th &middot; จาก: no-reply@jigsawerp.com
            </div>
            {/* Email card */}
            <div className="bg-white border border-gray-300 rounded-b-lg overflow-hidden">
              <div className="bg-brand-primary px-6 py-5 text-center">
                <div className="text-base font-extrabold text-white tracking-wide">&#129513; ERP JIGSAW</div>
                <div className="text-[11px] text-white/70 mt-0.5">ยืนยันอีเมลของคุณ</div>
              </div>
              <div className="px-6 py-5">
                <div className="text-[11px] text-gray-400 mb-3.5 pb-2.5 border-b border-erp-border">
                  จาก: no-reply@jigsawerp.com &nbsp;&middot;&nbsp; ถึง: somchai@siamgroup.co.th
                </div>
                <div className="text-sm font-semibold mb-2">สวัสดีคุณสมชาย,</div>
                <div className="text-sm text-gray-600 leading-relaxed mb-3">
                  ทีม Jigsaw ได้สร้าง <strong className="text-erp-text">Master Account</strong> สำหรับคุณเรียบร้อยแล้ว<br />
                  กรุณากดปุ่มด้านล่างเพื่อยืนยันอีเมลและตั้งรหัสผ่าน
                </div>
                <div className="text-xs text-gray-400 mb-3">
                  ลิงก์นี้หมดอายุภายใน <strong className="text-gray-600">48 ชั่วโมง</strong> และใช้ได้เพียงครั้งเดียว
                </div>
                <button
                  onClick={() => go("s4")}
                  className="w-full py-3 bg-brand-primary hover:bg-brand-hover text-white rounded-md text-sm font-semibold transition-colors my-4"
                >
                  ยืนยันอีเมลและตั้งรหัสผ่าน
                </button>
                <div className="text-[11px] text-gray-400 text-center mb-2">หรือคัดลอกลิงก์นี้:</div>
                <div className="bg-gray-50 rounded-md px-3 py-2 text-[11px] text-blue-700 font-mono border border-erp-border break-all">
                  verify.jigsawerp.com/activate?token=eyJhbGciOiJIUzI1NiIsIn...
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-erp-border text-[11px] text-gray-400 text-center leading-relaxed">
                หากคุณไม่ได้ร้องขอ Account นี้ กรุณาเพิกเฉย<br />
                มีปัญหา? ติดต่อ support@jigsawerp.com &middot; &copy; 2569 ERP Jigsaw
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ═══════════════════ S4: SET PASSWORD ═══════════════════
  const renderS4 = () => (
    <div className="flex flex-col flex-1">
      <ScreenMetaBar id="S-01-04" title="ตั้ง Password ครั้งแรก — Token Valid · Filled State" actor="ta" />
      <TopBarTA info="verify.jigsawerp.com" />
      <div className="flex-1 bg-erp-bg flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border border-erp-border p-7 w-full max-w-[400px] shadow-lg">
          <div className="w-13 h-13 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3.5 text-xl">
            &#9989;
          </div>
          <h2 className="text-lg font-bold text-center mb-1">ยืนยันอีเมลสำเร็จ!</h2>
          <p className="text-xs text-erp-muted text-center leading-relaxed mb-4">
            กรุณาตั้งรหัสผ่านเพื่อเริ่มใช้งาน Master Account
          </p>
          <div className="text-center mb-5">
            <span className="inline-block text-[11px] px-3.5 py-1 bg-gray-50 rounded-full text-erp-muted border border-erp-border">
              somchai@siamgroup.co.th
            </span>
          </div>

          {/* Password field */}
          <div className="mb-2">
            <p className="text-[11px] text-erp-muted mb-1 font-medium">รหัสผ่านใหม่ <span className="text-erp-error">*</span></p>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2.5 pr-10 border-[1.5px] rounded-md text-sm outline-none transition-colors ${
                  pwStrength === 4 ? "border-green-500" : "border-erp-border"
                } focus:border-brand-primary`}
              />
              <button
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
              >
                {showPw ? "&#128584;" : "&#128065;"}
              </button>
            </div>
          </div>

          {/* Strength bar */}
          <div className="flex gap-1 h-1 mb-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`flex-1 rounded-sm ${i < pwStrength ? "bg-green-500" : "bg-erp-border"}`} />
            ))}
          </div>
          {pwStrength === 4 && <p className="text-[10px] font-semibold text-green-600 mb-2">รหัสผ่านแข็งแกร่ง</p>}

          {/* Rules */}
          <div className="bg-gray-50 rounded-md p-2.5 mb-3">
            {pwChecks.map((r, i) => (
              <div key={i} className={`flex items-center gap-1.5 text-[11px] mb-0.5 last:mb-0 ${r.ok ? "text-green-600" : "text-erp-muted"}`}>
                <span className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] shrink-0 ${r.ok ? "bg-green-50 text-green-600" : "bg-erp-border text-transparent"}`}>
                  &#10003;
                </span>
                {r.label}
              </div>
            ))}
          </div>

          {/* Confirm password */}
          <p className="text-[11px] text-erp-muted mb-1 font-medium">ยืนยันรหัสผ่าน <span className="text-erp-error">*</span></p>
          <div className="relative mb-4">
            <input
              type={showConfirmPw ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-2.5 pr-10 border-[1.5px] rounded-md text-sm outline-none transition-colors ${
                confirmPassword && confirmPassword === password ? "border-green-500" : "border-erp-border"
              } focus:border-brand-primary`}
            />
            <button
              onClick={() => setShowConfirmPw(!showConfirmPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
            >
              {showConfirmPw ? "&#128584;" : "&#128065;"}
            </button>
          </div>

          <button
            onClick={() => go("s5")}
            className="w-full py-3 bg-brand-primary hover:bg-brand-hover text-white rounded-md text-sm font-bold transition-colors"
          >
            ตั้งรหัสผ่านและเริ่มใช้งาน
          </button>
        </div>
      </div>
    </div>
  );

  // ═══════════════════ S4e: TOKEN EXPIRED ═══════════════════
  const renderS4e = () => (
    <div className="flex flex-col flex-1">
      <ScreenMetaBar id="S-01-04e" title="Token หมดอายุ — Error Screen" actor="ta" />
      <TopBarTA info="verify.jigsawerp.com" />
      <div className="flex-1 bg-red-50/50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border border-red-200 p-7 w-full max-w-[400px] shadow-lg">
          <div className="w-13 h-13 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3.5 text-xl">
            &#9888;&#65039;
          </div>
          <h2 className="text-lg font-bold text-center mb-1 text-erp-error">ลิงก์นี้ใช้งานไม่ได้แล้ว</h2>
          <p className="text-xs text-erp-muted text-center leading-relaxed mb-4">
            ลิงก์อาจหมดอายุแล้ว (48 ชั่วโมง)<br />หรืออาจถูกใช้งานไปแล้ว
          </p>
          <div className="text-xs text-erp-muted text-center mb-5 p-2.5 bg-gray-50 rounded-md">
            กรุณาติดต่อทีม Jigsaw เพื่อขอลิงก์ใหม่<br />
            <strong>support@jigsawerp.com</strong>
          </div>
          <button className="w-full py-3 bg-erp-error hover:bg-red-700 text-white rounded-md text-sm font-bold transition-colors">
            ขอลิงก์ใหม่
          </button>
        </div>
      </div>
    </div>
  );

  // ═══════════════════ S5: ACCOUNT DETAIL ═══════════════════
  const renderS5 = () => (
    <div className="flex flex-col flex-1">
      <ScreenMetaBar id="S-01-05" title={`Account Detail — Tab: ข้อมูลทั่วไป + Tenants (${selectedAccount.tenantUsed}/${selectedAccount.tenantQuota})`} actor="sa" />
      <TopBarSA />
      <Breadcrumb items={[
        { label: "Master Accounts", onClick: () => go("s1") },
        { label: `${selectedAccount.firstName} ${selectedAccount.lastName}` },
      ]} />
      {/* Detail Header */}
      <div className="px-5 bg-white border-b border-erp-border">
        <h1 className="text-xl font-bold pt-3 pb-2.5">ข้อมูลลูกค้า</h1>
        <div className="flex gap-0">
          {(["general", "tenants", "contracts", "history"] as const).map((tab) => {
            const labels = {
              general: "ข้อมูลทั่วไป",
              tenants: `Tenants (${selectedAccount.tenantUsed}/${selectedAccount.tenantQuota})`,
              contracts: "สัญญา",
              history: "ประวัติ",
            };
            return (
              <button
                key={tab}
                onClick={() => setDetailTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
                  detailTab === tab
                    ? "bg-sa-primary text-white"
                    : "text-erp-muted hover:text-erp-text"
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>
      {/* Detail Body */}
      <div className="flex-1 p-5 overflow-y-auto">
        {detailTab === "general" && (
          <>
            {/* General Info Card */}
            <div className="bg-white rounded-lg border border-erp-border p-5 mb-3.5">
              <h3 className="text-sm font-bold text-sa-primary mb-3.5">ข้อมูลทั่วไป</h3>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="field-group sa">
                  <input value={selectedAccount.id} readOnly className="!bg-gray-50 !text-blue-700 !font-mono !font-semibold" />
                  <label>รหัส Account</label>
                </div>
                <div className="field-group sa">
                  <select defaultValue={selectedAccount.customerGroup}>
                    <option>ทั่วไป</option><option>ขายส่ง</option><option>ขายปลีก</option><option>VIP</option><option>Founding Partner</option>
                  </select>
                  <label>กลุ่มลูกค้า <span className="text-erp-error">*</span></label>
                </div>
                <FloatingField label="ชื่อ" value={selectedAccount.firstName} onChange={() => {}} variant="sa" required />
                <FloatingField label="นามสกุล" value={selectedAccount.lastName} onChange={() => {}} variant="sa" required />
                <div className="field-group sa">
                  <select><option>นาย</option><option>นาง</option><option>นางสาว</option></select>
                  <label>คำนำหน้า <span className="text-erp-error">*</span></label>
                </div>
                <FloatingField label="ตำแหน่ง" value={selectedAccount.position} onChange={() => {}} variant="sa" />
                <FloatingField label="ชื่อบริษัท / ห้างร้าน" value={selectedAccount.company} onChange={() => {}} variant="sa" />
                <FloatingField label="อีเมล" value={selectedAccount.email} onChange={() => {}} variant="sa" required />
                <div>
                  <p className="text-[11px] text-erp-muted mb-1 font-medium">เบอร์โทรศัพท์</p>
                  <div className="flex border-[1.5px] border-erp-border rounded-md overflow-hidden">
                    <div className="px-2.5 py-2 bg-gray-50 border-r border-erp-border flex items-center gap-1 text-xs text-erp-muted">
                      &#127481;&#127469; +66 &#9662;
                    </div>
                    <input className="flex-1 px-3 py-2 text-sm outline-none" defaultValue={selectedAccount.phone} />
                  </div>
                </div>
                <div className="field-group sa">
                  <input value={selectedAccount.emailVerifiedAt || "—"} readOnly className="!bg-gray-50 !text-erp-muted" />
                  <label>วันที่ยืนยัน Email</label>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] text-erp-muted mb-1.5 font-medium">สถานะ</p>
                  <div className="flex gap-5">
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedAccount.status === "เปิดใช้งาน" ? "border-sa-primary" : "border-erp-border"}`}>
                        {selectedAccount.status === "เปิดใช้งาน" && <span className="w-2 h-2 rounded-full bg-sa-primary" />}
                      </span>
                      เปิดใช้งาน
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedAccount.status === "ปิดใช้งาน" ? "border-sa-primary" : "border-erp-border"}`}>
                        {selectedAccount.status === "ปิดใช้งาน" && <span className="w-2 h-2 rounded-full bg-sa-primary" />}
                      </span>
                      ปิดใช้งาน
                    </label>
                  </div>
                </div>
                <div className="field-group sa">
                  <input value={`${selectedAccount.createdAt} — ${selectedAccount.createdBy}`} readOnly className="!bg-gray-50 !text-erp-muted" />
                  <label>วันที่ลงทะเบียน</label>
                </div>
                <div className="field-group sa">
                  <input value={`${selectedAccount.updatedAt} — ${selectedAccount.updatedBy}`} readOnly className="!bg-gray-50 !text-erp-muted" />
                  <label>วันที่แก้ไขล่าสุด</label>
                </div>
              </div>

              {/* SA Actions */}
              <div className="mt-3.5 p-3 bg-[#FF6B00]/5 rounded-lg border border-[#FF6B00]/15">
                <p className="text-[11px] font-semibold text-sa-primary mb-2">&#9881; การดำเนินการของ Super Admin</p>
                <div className="flex gap-2 flex-wrap">
                  <button className="px-3 py-1.5 bg-white border border-erp-border rounded-md text-xs hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
                    &#128231; Reset Email ยืนยัน
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-erp-error rounded-md text-xs text-erp-error hover:bg-red-50 flex items-center gap-1.5 transition-colors">
                    &#128273; Reset รหัสผ่าน
                  </button>
                </div>
                <p className="text-[11px] text-erp-muted mt-1.5">ผู้ติดต่อจะได้รับ Email พร้อมลิงก์ดำเนินการ</p>
              </div>

              <div className="flex justify-end gap-2.5 mt-3.5">
                <button className="px-4 py-2 border border-erp-border rounded-lg text-sm hover:bg-gray-50 transition-colors">ยกเลิก</button>
                <button className="px-4 py-2 bg-sa-primary hover:bg-sa-hover text-white text-sm rounded-lg font-medium transition-colors">บันทึก</button>
              </div>
            </div>

            {/* Tenant Quota Card */}
            <div className="bg-white rounded-lg border border-erp-border p-5">
              <h3 className="text-sm font-bold text-sa-primary mb-3.5">ข้อมูล Tenant Quota</h3>
              <div className="bg-[#FF6B00]/10 rounded-md px-3 py-2 text-xs text-sa-primary border border-[#FF6B00]/20">
                Tenant Quota: <strong>{selectedAccount.tenantUsed} / {selectedAccount.tenantQuota} บริษัท</strong> &middot; เหลืออีก {selectedAccount.tenantQuota - selectedAccount.tenantUsed} บริษัทที่สามารถสร้างได้
              </div>
              {selectedAccount.tenantUsed === 0 ? (
                <div className="mt-3 flex flex-col items-center justify-center p-6 bg-orange-50 rounded-lg border border-orange-200 gap-2">
                  <p className="text-sm text-orange-600 font-medium">ยังไม่มี Tenant ภายใต้ Account นี้</p>
                  <button
                    onClick={() => go("s6")}
                    className="mt-1 px-4 py-2 bg-sa-primary hover:bg-sa-hover text-white text-sm rounded-md font-medium transition-colors"
                  >
                    + สร้าง Tenant ใหม่
                  </button>
                </div>
              ) : (
                <div className="mt-3">
                  <button
                    onClick={() => go("s6")}
                    className="w-full flex items-center justify-center gap-2 py-3 border-[1.5px] border-dashed border-sa-primary rounded-lg bg-white text-sm text-sa-primary hover:bg-[#FF6B00]/5 transition-colors"
                  >
                    + สร้าง Tenant ใหม่ภายใต้ Account นี้ (เหลือ {selectedAccount.tenantQuota - selectedAccount.tenantUsed} บริษัท)
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {detailTab === "tenants" && (
          <div className="bg-white rounded-lg border border-erp-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-sa-primary">Tenants ภายใต้ Account นี้</h3>
              <span className="text-xs text-erp-muted">{selectedAccount.tenantUsed} จาก {selectedAccount.tenantQuota} บริษัท</span>
            </div>
            <div className="bg-[#FF6B00]/10 rounded-md px-3 py-2 text-xs text-sa-primary border border-[#FF6B00]/20 mb-3">
              จำนวนธุรกิจ (Tenant Quota): <strong>{selectedAccount.tenantUsed} / {selectedAccount.tenantQuota} บริษัท</strong> ใช้ไปแล้ว &middot; เหลืออีก {selectedAccount.tenantQuota - selectedAccount.tenantUsed} บริษัท
            </div>
            {selectedAccount.tenantUsed > 0 && (
              <div className="border border-erp-border rounded-lg p-3.5 flex items-center gap-3 mb-2 hover:border-sa-primary hover:bg-[#FF6B00]/5 cursor-pointer transition-colors">
                <div className="w-8 h-8 rounded-md bg-[#FF6B00]/10 flex items-center justify-center text-xs font-bold text-sa-primary shrink-0">ST</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">บริษัท สยามเทรด จำกัด</div>
                  <div className="text-[11px] text-erp-muted mt-0.5">siamtrade.jigsawerp.com &middot; Cloud &middot; MD-1–11, MD-12</div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  รอ Setup Wizard
                </span>
              </div>
            )}
            <button
              onClick={() => go("s6")}
              className="w-full flex items-center justify-center gap-2 py-3 border-[1.5px] border-dashed border-sa-primary rounded-lg bg-white text-sm text-sa-primary hover:bg-[#FF6B00]/5 transition-colors mt-1"
            >
              + สร้าง Tenant ใหม่ภายใต้ Account นี้ (เหลือ {selectedAccount.tenantQuota - selectedAccount.tenantUsed} บริษัท)
            </button>
          </div>
        )}

        {(detailTab === "contracts" || detailTab === "history") && (
          <div className="bg-white rounded-lg border border-erp-border p-10 text-center">
            <p className="text-erp-muted text-sm">ยังไม่มีข้อมูล</p>
          </div>
        )}
      </div>
    </div>
  );

  // ═══════════════════ S6: CREATE TENANT FORM ═══════════════════
  const renderS6 = () => (
    <div className="flex flex-col flex-1">
      <ScreenMetaBar id="S-01-06" title="ฟอร์มสร้าง Tenant — ข้อมูลนิติบุคคล + Package (Slide Panel)" actor="sa" />
      <TopBarSA />
      <Breadcrumb items={[
        { label: "Master Accounts", onClick: () => go("s1") },
        { label: selectedAccount.firstName, onClick: () => go("s5") },
        { label: "สร้าง Tenant" },
      ]} />
      <div className="flex-1 relative">
        <SlidePanel
          open={true}
          title={`สร้าง Tenant ใหม่ — Tenant #${selectedAccount.tenantUsed + 1}`}
          onClose={() => go("s5")}
          headerColor="sa"
          width={500}
          footer={
            <>
              <button onClick={() => go("s5")} className="px-4 py-2 border border-erp-border rounded-lg text-sm hover:bg-gray-50 transition-colors">
                ยกเลิก
              </button>
              <button onClick={() => go("s7")} className="px-4 py-2 bg-sa-primary hover:bg-sa-hover text-white text-sm rounded-lg font-medium transition-colors">
                บันทึก
              </button>
            </>
          }
        >
          <div className="space-y-3">
            {/* Section: ข้อมูลนิติบุคคล */}
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-xs font-semibold text-erp-muted whitespace-nowrap">ข้อมูลนิติบุคคล</span>
              <div className="flex-1 h-px bg-erp-border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FloatingField label="ชื่อบริษัท (TH)" value={tenantForm.nameTh} onChange={(v) => setTenantForm({ ...tenantForm, nameTh: v })} variant="sa" required />
              <FloatingField label="ชื่อบริษัท (EN)" value={tenantForm.nameEn} onChange={(v) => setTenantForm({ ...tenantForm, nameEn: v })} variant="sa" required />
              <div className="field-group sa">
                <select value={tenantForm.entityType} onChange={(e) => setTenantForm({ ...tenantForm, entityType: e.target.value })}>
                  <option>บริษัทจำกัด (บจ.)</option><option>ห้างหุ้นส่วนจำกัด (หจก.)</option><option>บริษัทมหาชน (บมจ.)</option>
                </select>
                <label>ประเภทนิติบุคคล <span className="text-erp-error">*</span></label>
              </div>
              <div className="field-group sa">
                <select value={tenantForm.businessType} onChange={(e) => setTenantForm({ ...tenantForm, businessType: e.target.value })}>
                  <option>Trading — ซื้อมาขายไป</option><option>Manufacturing — ผลิต</option><option>Service — บริการ</option>
                </select>
                <label>ประเภทธุรกิจ <span className="text-erp-error">*</span></label>
              </div>
              <FloatingField label="เลขผู้เสียภาษี" value={tenantForm.taxId} onChange={(v) => setTenantForm({ ...tenantForm, taxId: v })} variant="sa" required />
              <div>
                <p className="text-[11px] text-erp-muted mb-1 font-medium">Subdomain <span className="text-erp-error">*</span></p>
                <div className="flex border-[1.5px] border-green-500 rounded-md overflow-hidden">
                  <input
                    className="flex-1 px-2.5 py-2 text-sm outline-none"
                    value={tenantForm.subdomain}
                    onChange={(e) => setTenantForm({ ...tenantForm, subdomain: e.target.value })}
                  />
                  <div className="px-2.5 py-2 bg-gray-50 border-l border-erp-border text-xs text-erp-muted whitespace-nowrap">
                    .jigsawerp.com
                  </div>
                </div>
                <p className="text-[10px] text-erp-error mt-1 pl-0.5">&#128274; Lock ถาวรหลัง Save</p>
              </div>
            </div>

            {/* Section: Package & Quota */}
            <div className="flex items-center gap-2.5 mt-4 mb-1">
              <span className="text-xs font-semibold text-erp-muted whitespace-nowrap">Package & Quota</span>
              <div className="flex-1 h-px bg-erp-border" />
            </div>

            {/* Deployment Tier */}
            <div className="bg-gray-50 border border-erp-border rounded-md p-3">
              <p className="text-[11px] font-bold text-erp-muted mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sa-primary" />
                Deployment Tier
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(["Cloud", "Dedicated", "On-premise"] as const).map((tier) => {
                  const subs = { Cloud: "Shared · Huawei", Dedicated: "Private · Huawei", "On-premise": "Server ลูกค้า" };
                  return (
                    <button
                      key={tier}
                      onClick={() => setTenantForm({ ...tenantForm, tier })}
                      className={`border rounded-md p-2.5 text-left transition-colors ${
                        tenantForm.tier === tier
                          ? "border-sa-primary bg-[#FF6B00]/10"
                          : "border-erp-border bg-white hover:border-sa-primary"
                      }`}
                    >
                      <div className="text-xs font-semibold">{tier}</div>
                      <div className="text-[10px] text-erp-muted mt-0.5">{subs[tier]}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resource Quota */}
            <div className="bg-gray-50 border border-erp-border rounded-md p-3">
              <p className="text-[11px] font-bold text-erp-muted mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sa-primary" />
                Resource Quota
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "quotaUser", label: "User", unit: "คน" },
                  { key: "quotaBranch", label: "Branch", unit: "สาขา" },
                  { key: "quotaWarehouse", label: "Warehouse", unit: "คลัง" },
                  { key: "quotaStorage", label: "Storage", unit: "GB" },
                  { key: "quotaAuditLog", label: "Audit Log", unit: "เดือน" },
                  { key: "quotaOnboarding", label: "Onboarding", unit: "ชม." },
                ].map((q) => (
                  <div key={q.key} className="border border-erp-border rounded-md p-2 bg-white">
                    <div className="text-[10px] text-gray-400 mb-1">{q.label}</div>
                    <div className="flex items-center gap-1">
                      <input
                        className="px-1.5 py-1 border border-erp-border rounded text-xs w-14 outline-none focus:border-sa-primary"
                        value={(tenantForm as unknown as Record<string, string>)[q.key]}
                        onChange={(e) => setTenantForm({ ...tenantForm, [q.key]: e.target.value })}
                      />
                      <span className="text-[11px] text-erp-muted">{q.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5 p-2 bg-orange-50 rounded-md text-[11px] text-orange-600 mt-2 border border-orange-200">
                &#9888; แจ้งเตือนอัตโนมัติที่ 80% และ 100% — ไม่บล็อกการใช้งาน
              </div>
            </div>

            {/* Backup Frequency */}
            <div className="bg-gray-50 border border-erp-border rounded-md p-3">
              <p className="text-[11px] font-bold text-erp-muted mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sa-primary" />
                Backup Frequency
              </p>
              <div className="flex items-center gap-2">
                <input
                  className="px-2 py-1.5 border border-erp-border rounded-md text-xs w-16 outline-none focus:border-sa-primary"
                  value={tenantForm.backupFreq}
                  onChange={(e) => setTenantForm({ ...tenantForm, backupFreq: e.target.value })}
                />
                <div className="flex border border-erp-border rounded-md overflow-hidden">
                  {(["ชั่วโมง", "วัน"] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setTenantForm({ ...tenantForm, backupUnit: u })}
                      className={`px-3 py-1.5 text-[11px] transition-colors ${
                        tenantForm.backupUnit === u
                          ? "bg-sa-primary text-white"
                          : "bg-white text-erp-muted hover:bg-gray-50"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modules */}
            <div className="bg-gray-50 border border-erp-border rounded-md p-3">
              <p className="text-[11px] font-bold text-erp-muted mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sa-primary" />
                Modules (สัญญาที่ 1)
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {moduleStates.map((m, i) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      if (m.status === "locked") return;
                      const next = [...moduleStates];
                      next[i] = { ...m, status: m.status === "on" ? "off" : "on" };
                      setModuleStates(next);
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1.5 border rounded-md text-[11px] transition-colors ${
                      m.status === "locked"
                        ? "bg-gray-100 text-erp-muted border-erp-border cursor-default"
                        : m.status === "on"
                        ? "bg-[#FF6B00]/10 border-[#FF6B00]/30 text-sa-primary"
                        : "bg-white text-erp-muted border-erp-border hover:border-sa-primary"
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-sm border-[1.5px] shrink-0 ${
                      m.status === "locked"
                        ? "bg-gray-300 border-gray-300"
                        : m.status === "on"
                        ? "bg-sa-primary border-sa-primary"
                        : "border-erp-border"
                    }`} />
                    <span className="flex-1 text-left">{m.id} {m.name}</span>
                    <span className={`w-4 h-4 rounded-sm flex items-center justify-center text-[10px] ${
                      m.status === "on" ? "bg-[#FF6B00]/20 text-sa-primary" : "bg-gray-100 text-erp-muted"
                    } ${m.status === "off" ? "opacity-30" : ""}`}>
                      &#9881;
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contract */}
            <div className="bg-gray-50 border border-erp-border rounded-md p-3">
              <p className="text-[11px] font-bold text-erp-muted mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sa-primary" />
                สัญญา
              </p>
              <div className="grid grid-cols-2 gap-3">
                <FloatingField label="วันเริ่มสัญญา" value={tenantForm.contractStart} onChange={(v) => setTenantForm({ ...tenantForm, contractStart: v })} variant="sa" required />
                <FloatingField label="วันหมดสัญญา" value={tenantForm.contractEnd} onChange={(v) => setTenantForm({ ...tenantForm, contractEnd: v })} variant="sa" required />
              </div>
              <div className="mt-3">
                <p className="text-[11px] text-erp-muted mb-1.5 font-medium">Auto-renewal</p>
                <div className="flex gap-5">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${tenantForm.autoRenewal ? "border-sa-primary" : "border-erp-border"}`}>
                      {tenantForm.autoRenewal && <span className="w-2 h-2 rounded-full bg-sa-primary" />}
                    </span>
                    ต่ออายุอัตโนมัติ
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!tenantForm.autoRenewal ? "border-sa-primary" : "border-erp-border"}`}>
                      {!tenantForm.autoRenewal && <span className="w-2 h-2 rounded-full bg-sa-primary" />}
                    </span>
                    ไม่ต่ออายุอัตโนมัติ
                  </label>
                </div>
              </div>
              <div className="flex gap-1.5 p-2 bg-green-50 rounded-md text-[11px] text-green-700 mt-3 border border-green-200">
                &#10003; เมื่อกดบันทึก ระบบจะสร้างสัญญาที่ 1 อัตโนมัติ และส่ง Welcome Email ให้ TA
              </div>
            </div>
          </div>
        </SlidePanel>
      </div>
    </div>
  );

  // ═══════════════════ S7: WELCOME EMAIL ═══════════════════
  const renderS7 = () => (
    <div className="flex flex-col flex-1">
      <ScreenMetaBar id="S-01-07" title="Welcome Email — ส่งให้ TA หลัง Provision สำเร็จ" actor="ta" />
      <TopBarTA info="Email Client — somchai@siamgroup.co.th" />
      <div className="flex-1 pt-4 bg-[#f0ede6]">
        <div className="flex items-start justify-center p-5">
          <div className="w-full max-w-[560px]">
            <div className="bg-brand-primary px-3.5 py-2 rounded-t-lg text-[11px] text-white/70">
              &#128231; somchai@siamgroup.co.th &middot; จาก: no-reply@jigsawerp.com
            </div>
            <div className="bg-white border border-gray-300 rounded-b-lg overflow-hidden">
              <div className="bg-green-700 px-6 py-5 text-center">
                <div className="text-base font-extrabold text-white tracking-wide">&#129513; ERP JIGSAW</div>
                <div className="text-[11px] text-white/70 mt-0.5">ยินดีต้อนรับ! ระบบของคุณพร้อมแล้ว &#127881;</div>
              </div>
              <div className="px-6 py-5">
                <div className="text-[11px] text-gray-400 mb-3.5 pb-2.5 border-b border-erp-border">
                  จาก: no-reply@jigsawerp.com &nbsp;&middot;&nbsp; ถึง: somchai@siamgroup.co.th
                </div>
                <div className="text-sm font-semibold mb-2">สวัสดีคุณสมชาย,</div>
                <div className="text-sm text-gray-600 leading-relaxed mb-3">
                  ยินดีต้อนรับสู่ <strong className="text-erp-text">ERP Jigsaw!</strong><br />
                  บัญชีสำหรับ <strong className="text-erp-text">บริษัท สยามเทรด จำกัด</strong> ถูกสร้างเรียบร้อยแล้ว
                </div>
                <div className="bg-gray-50 rounded-md p-3 mb-3 border border-erp-border">
                  <div className="text-[11px] text-gray-400 mb-1.5">ข้อมูล Tenant ของคุณ</div>
                  <div className="text-sm font-bold">บริษัท สยามเทรด จำกัด</div>
                  <div className="bg-gray-100 rounded-md px-3 py-2 text-[11px] text-blue-700 font-mono mt-2 mb-1 border border-erp-border">
                    siamtrade.jigsawerp.com
                  </div>
                  <div className="text-[11px] text-erp-muted">Cloud &middot; MD-1–11 + MD-12 Backoffice &middot; สัญญาที่ 1</div>
                </div>
                <div className="text-sm text-gray-600 leading-relaxed mb-1">
                  กรุณากดปุ่มด้านล่างเพื่อเข้าสู่ระบบและทำ Setup Wizard
                </div>
                <div className="text-xs text-gray-400 mb-3">(ใช้รหัสผ่านที่ตั้งไว้ในขั้นตอนก่อนหน้า)</div>
                <button
                  onClick={() => { setShowToast(true); go("s8"); }}
                  className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-md text-sm font-semibold transition-colors"
                >
                  เข้าสู่ระบบและเริ่ม Setup Wizard &#8594;
                </button>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-erp-border text-[11px] text-gray-400 text-center leading-relaxed">
                มีปัญหา? ติดต่อ support@jigsawerp.com &middot; &copy; 2569 ERP Jigsaw
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ═══════════════════ S8: TENANT LIST (POST-CREATE) ═══════════════════
  const renderS8 = () => (
    <div className="flex flex-col flex-1">
      <ScreenMetaBar id="S-01-08" title="Account Detail — Tenant List หลังสร้างสำเร็จ (F-01 Done)" actor="sa" />
      <TopBarSA />
      {/* Success toast */}
      {showToast && (
        <div className="bg-green-50 text-green-700 border-b border-green-200 px-4 py-2.5 text-xs flex items-center gap-2 shrink-0">
          &#9989; <strong>สร้าง Tenant สำเร็จ!</strong> ส่ง Welcome Email ให้ somchai@siamgroup.co.th แล้ว
        </div>
      )}
      <Breadcrumb items={[
        { label: "รายชื่อลูกค้า", onClick: () => go("s1") },
        { label: "สมชาย วงศ์ใหญ่" },
      ]} />
      {/* Detail Header */}
      <div className="px-5 bg-white border-b border-erp-border">
        <h1 className="text-xl font-bold pt-3 pb-2.5">ข้อมูลลูกค้า</h1>
        <div className="flex gap-0">
          <button className="px-4 py-2 text-sm font-medium text-erp-muted hover:text-erp-text rounded-t transition-colors">
            ข้อมูลทั่วไป
          </button>
          <button className="px-4 py-2 text-sm font-medium bg-sa-primary text-white rounded-t transition-colors">
            Tenants (1/3)
          </button>
          <button className="px-4 py-2 text-sm font-medium text-erp-muted hover:text-erp-text rounded-t transition-colors">
            สัญญา
          </button>
          <button className="px-4 py-2 text-sm font-medium text-erp-muted hover:text-erp-text rounded-t transition-colors">
            ประวัติ
          </button>
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 p-5">
        <div className="bg-white rounded-lg border border-erp-border p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-sa-primary">Tenants ภายใต้ Account นี้</h3>
            <span className="text-xs text-erp-muted">1 จาก 3 บริษัท</span>
          </div>
          <div className="bg-[#FF6B00]/10 rounded-md px-3 py-2 text-xs text-sa-primary border border-[#FF6B00]/20 mb-3">
            จำนวนธุรกิจ (Tenant Quota): <strong>1 / 3 บริษัท</strong> ใช้ไปแล้ว &middot; เหลืออีก 2 บริษัท
          </div>
          {/* Tenant item */}
          <div className="border border-erp-border rounded-lg p-3.5 flex items-center gap-3 mb-2 hover:border-sa-primary hover:bg-[#FF6B00]/5 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-md bg-[#FF6B00]/10 flex items-center justify-center text-xs font-bold text-sa-primary shrink-0">ST</div>
            <div className="flex-1">
              <div className="text-sm font-semibold">บริษัท สยามเทรด จำกัด</div>
              <div className="text-[11px] text-erp-muted mt-0.5">siamtrade.jigsawerp.com &middot; Cloud &middot; MD-1–11, MD-12</div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-600">
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              รอ Setup Wizard
            </span>
          </div>
          <button
            onClick={() => go("s6")}
            className="w-full flex items-center justify-center gap-2 py-3 border-[1.5px] border-dashed border-sa-primary rounded-lg bg-white text-sm text-sa-primary hover:bg-[#FF6B00]/5 transition-colors mt-1"
          >
            + สร้าง Tenant ใหม่ภายใต้ Account นี้ (เหลือ 2 บริษัท)
          </button>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/80 text-green-300 rounded-lg text-[11px]">
          &#10003; F-01 จบ &#8594; F-02 Setup Wizard
        </div>
      </div>
    </div>
  );

  // ═══════════════════ RENDER ROUTER ═══════════════════
  const screens: Record<Screen, () => JSX.Element> = {
    s1: renderS1, s2: renderS2, s2e: renderS2e, s3: renderS3,
    s4: renderS4, s4e: renderS4e, s5: renderS5, s6: renderS6,
    s7: renderS7, s8: renderS8,
  };

  const navItems: { id: Screen; num: string; label: string; section?: string }[] = [
    { id: "s1", num: "01", label: "Master Account List", section: "Step 1 — SA สร้าง Account" },
    { id: "s2", num: "02", label: "ฟอร์มสร้าง Account" },
    { id: "s2e", num: "02e", label: "Error — Email ซ้ำ" },
    { id: "s3", num: "03", label: "Email: Verify", section: "Step 2 — TA ยืนยัน Email" },
    { id: "s4", num: "04", label: "ตั้ง Password" },
    { id: "s4e", num: "04e", label: "Token หมดอายุ" },
    { id: "s5", num: "05", label: "Account Detail", section: "Step 3 — SA สร้าง Tenant" },
    { id: "s6", num: "06", label: "ฟอร์มสร้าง Tenant" },
    { id: "s7", num: "07", label: "Email: Welcome" },
    { id: "s8", num: "08", label: "Tenant List (Done)" },
  ];

  return (
    <div className="min-h-screen bg-erp-bg flex">
      {/* Icon Sidebar */}
      <div className="w-[52px] bg-[#2D2D2D] flex flex-col items-center fixed h-screen z-50">
        <div className="w-[52px] h-14 bg-sa-primary flex items-center justify-center cursor-pointer" onClick={() => router.push("/")}>
          <span className="text-[9px] font-extrabold text-white text-center leading-tight tracking-wider">JIG<br />SAW</span>
        </div>
        <div className="mt-1 flex flex-col gap-0.5">
          {["&#8962;", "&#9201;", "&#128203;", "&#128230;", "&#128101;", "&#127991;", "&#128202;"].map((icon, i) => (
            <div
              key={i}
              className={`w-11 h-10 flex items-center justify-center rounded-md cursor-pointer text-sm transition-colors ${
                i === 4 ? "bg-[#FF6B00]/15 text-sa-primary" : "text-gray-500 hover:bg-[#3a3a3a] hover:text-white"
              }`}
              dangerouslySetInnerHTML={{ __html: icon }}
            />
          ))}
        </div>
        <div className="flex-1" />
        <div className="mb-2 flex flex-col gap-0.5">
          <div className="w-11 h-10 flex items-center justify-center rounded-md cursor-pointer text-sm text-gray-500 hover:bg-[#3a3a3a] hover:text-white">&#9881;</div>
          <div className="w-11 h-10 flex items-center justify-center rounded-md cursor-pointer text-sm text-gray-500 hover:bg-[#3a3a3a] hover:text-white">&bull;&bull;&bull;</div>
        </div>
      </div>

      {/* Screen Nav */}
      <div className="w-[220px] bg-[#12121f] fixed left-[52px] h-screen z-40 overflow-y-auto">
        <div className="px-3 py-2 pb-3 border-b border-[#2a2a3e] bg-[#0e0e1a]">
          <div className="text-xs font-semibold text-white">&#129513; F-01 Wireframe</div>
          <div className="text-[10px] text-gray-600 mt-0.5">ERP Jigsaw — Onboarding</div>
        </div>
        <div className="py-1.5">
          {navItems.map((item) => (
            <div key={item.id}>
              {item.section && (
                <div className="px-3 pt-2 pb-1 text-[9px] font-semibold text-gray-500 uppercase tracking-wider">
                  {item.section}
                </div>
              )}
              <button
                onClick={() => go(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs border-l-2 transition-colors ${
                  screen === item.id
                    ? "text-white bg-[#1a1a2e] border-l-sa-primary"
                    : "text-gray-500 border-transparent hover:text-gray-300 hover:bg-[#1a1a2e]"
                }`}
              >
                <span className="font-mono text-[10px] w-5 opacity-70">{item.num}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === "s8" && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-sa-primary text-white">&#10003;</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="ml-[272px] flex-1 flex flex-col min-h-screen bg-erp-bg">
        {screens[screen]()}
      </div>
    </div>
  );
}
