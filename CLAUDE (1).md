# 📋 Briefing สำหรับ Team Jerry — erp-jigsaw-tenant (Windows)

## สวัสดีทีม Jerry! (Mintra 🟦PM / Kao 🟩DEV / Neo 🟨Tester)

คุณคือทีมที่ดูแล **erp-jigsaw-tenant** (ฝั่งลูกค้า/Tenant)
ทำงานคู่ขนานกับ Team Tom ที่ดูแล erp-jigsaw-jas (ฝั่ง Admin) บน MacBook

---

## 🏗️ ภาพรวมโปรเจกต์ Jigsaw ERP — 3 Repos

```
┌─────────────────────────────────────────┐
│   erp-jigsaw-design (Master Design)     │
│   Component Showcase / Icons / Theme    │
│   Port 3002                             │
└──────────┬──────────────┬───────────────┘
      sync │              │ sync
     ┌─────▼─────┐  ┌────▼──────┐
     │ JAS       │  │ Tenant    │
     │ (Admin)   │  │ (ลูกค้า)  │  ← คุณอยู่ที่นี่
     │ Team Tom  │  │ Team Jerry│
     │ Port 3000 │  │ Port 3001 │
     └───────────┘  └───────────┘
```

| โปรเจกต์ | ทีม | เครื่อง | GitHub | Vercel |
|----------|-----|---------|--------|--------|
| **erp-jigsaw-design** | ทั้ง 2 ทีมดูร่วมกัน | — | github.com/ArtEgency/erp-jigsaw-design | https://erp-jigsaw-design.vercel.app |
| **erp-jigsaw-jas** | Team Tom | MacBook | github.com/ArtEgency/erp-jigsaw-jas | https://erp-jigsaw.vercel.app |
| **erp-jigsaw-tenant** | **Team Jerry (คุณ)** | **Windows** | github.com/ArtEgency/erp-jigsaw-tenant | *(deploy แยก)* |

---

## 👥 โครงสร้างทีม

**Team Tom — erp-jigsaw-jas (Admin) — MacBook**
- 🟦 **โบทตี้ (Boaty)** — PM
- 🟩 **โจอี้ (Joey)** — DEV
- 🟨 **บุ้งกี้ (Bungkee)** — Tester

**Team Jerry — erp-jigsaw-tenant (Tenant) — Windows**
- 🟦 **มินตรา (Mintra)** — PM
- 🟩 **ก้าว (Kao)** — DEV
- 🟨 **นีโอ (Neo)** — Tester

---

## 🛠️ Tech Stack (ทั้ง 3 โปรเจกต์เหมือนกัน)

- **Next.js 14** (App Router) + **TypeScript**
- **MUI (Material UI)** — component library หลัก
- **MUI X DataGrid** — ตาราง List ทุกหน้า
- **React Hook Form + Zod** — form + validation
- **Font:** Sarabun (ผ่าน MUI Theme)
- **Tailwind CSS** — secondary/legacy

---

## 📦 Setup สำหรับ Team Jerry (Windows)

```bash
# 1. Clone โปรเจกต์
git clone https://github.com/ArtEgency/erp-jigsaw-tenant.git
cd erp-jigsaw-tenant
npm install
npm run dev    # เปิดที่ port 3001

# 2. (Optional) Clone Master Design ไว้ดู reference
git clone https://github.com/ArtEgency/erp-jigsaw-design.git
cd erp-jigsaw-design
npm install
npm run dev    # เปิดที่ port 3002
```

ดู Component Showcase ออนไลน์: **https://erp-jigsaw-design.vercel.app**

---

## 📁 โครงสร้าง Tenant Project

```
src/
├── app/
│   ├── (auth)/login/              # หน้า Login
│   └── (tenant)/[slug]/           # หน้าต่างๆ (dynamic route by tenant)
│       ├── page.tsx               # Dashboard
│       ├── employee/              # พนักงาน
│       ├── product/               # สินค้า
│       ├── role-permission/       # สิทธิ์
│       ├── assign-permission/     # กำหนดสิทธิ์
│       ├── setup-wizard/          # ตั้งค่าเริ่มต้น
│       └── settings/              # ตั้งค่า (business/product/warehouse)
├── components/
│   ├── layout/                    # Sidebar, TopBar, SlidePanel
│   └── ui/                        # Shared UI components (sync จาก Master Design)
├── lib/
│   ├── auth/                      # AuthProvider, permission
│   └── locale/                    # i18n (th.ts, en.ts)
└── data/                          # Mock data
```

---

## 🏗️ สถาปัตยกรรมสำคัญ

### Multi-tenant + Multi-business
- URL: `/{slug}/...` (dynamic) เช่น `/bakermart/product`
- แต่ละ tenant มีสี, modules, package เฉพาะ
- TenantShell อ่าน slug จาก `useParams()`

### Auth
- AuthProvider ครอบ root layout
- AuthLayout ครอบ protected routes
- Mock auth ผ่าน localStorage (จะเป็น real API ทีหลัง)

### i18n (TH/EN)
- `useLocale()` hook → `t("key")`
- Dictionary: `th.ts` + `en.ts`
- Labels/Headers เปลี่ยนตาม locale ผ่าน `t()`
- Data ที่มี EN field → แสดง EN เมื่อ locale=EN
- Data ที่ไม่มี EN field → แสดงข้อมูลเดิม ไม่แปล

---

## 📐 กฎที่ต้องรู้ (สำคัญมาก!)

### 1. Master Design = Single Source of Truth
- Component Showcase อยู่ที่ erp-jigsaw-design repo
- ดูออนไลน์: **https://erp-jigsaw-design.vercel.app**
- ทุกหน้าต้องใช้ component/icon จาก showcase เท่านั้น
- **ห้ามคิด component ใหม่เอง** → ถามก่อนเสมอ

### 2. UI ที่ต้องเท่ากันทั้ง 3 โปรเจกต์

| ส่วน | ขนาด |
|------|------|
| TopBar height | 52px |
| Sidebar collapsed | 68px |
| Sidebar expanded | 260px |
| Icon buttons | 44px (w-11 h-11) |

### 3. Design System สี

```
── Admin (Super Admin) ──
SA Primary:      #FF6B00  (ส้ม)

── Tenant (ลูกค้า) ──
Tenant Primary:  #565DFF  (ม่วง)
```

### 4. Shared Icons
- Icons อยู่ที่ `public/icons/` (sync จาก Master Design)
- ถ้าต้องเพิ่ม icon ใหม่ → rename EN kebab-case → **แจ้ง Team Tom** ให้เพิ่มที่ Master Design ก่อน → แล้ว sync กลับมา

### 5. Figma = Source of Truth สำหรับ Styling
- ทำตาม Figma design เป๊ะ
- Shell (Sidebar/TopBar/Footer) ห้ามแตะ
- Content area ออกแบบตาม Figma
- สี/Font/Icon ยึดตาม Figma

### 6. UI Patterns มาตรฐาน

**Data List:**
- การ์ดขาว + border + หัวตารางเทา + ID สีม่วง + คอลัมน์จัดการ

**Modal:**
- Header สีม่วง + 4 icons (popout/pin/expand/close)
- Drag & Drop + Resize
- ปุ่ม 4 ตัวบน header ทำงานดังนี้:

| ปุ่ม | หน้าที่ |
|------|---------|
| Expand | ขยาย modal เต็มจอ toggle ได้ |
| Pin | จำตำแหน่ง+ขนาดที่ user ปรับ เก็บใน localStorage แยกต่อ Modal |
| Pop out | เปิด window ใหม่ float ได้ sync กลับด้วย BroadcastChannel |
| Close | ปิด modal ถ้ากรอกแล้วให้ confirm ก่อน |

**Sub-tabs:**
- Active = สีขาวบนพื้นม่วง pill
- Inactive = ตัวม่วงไม่มีพื้น

### 7. Dropdown Menu — Condition ตาม Status

| Status | Action ที่แสดง |
|--------|---------------|
| รอยืนยัน Email | ส่ง Email ยืนยันซ้ำ, แก้ไขข้อมูล, ระงับ Account |
| เปิดใช้งาน | Reset รหัสผ่าน, แก้ไขข้อมูล, ระงับ Account |
| ระงับ Account | แก้ไขข้อมูล, เปิดใช้งานอีกครั้ง |

### 8. Workflow ทุกงาน
- **3 บทบาท:** Mintra (PM) → Kao (DEV) → Neo (Tester)
- ทำเสร็จ → **ตรวจสอบบน local ก่อนตอบเสมอ**
- **DPG** = `git add + commit + push`
- **DPV** = `npx vercel --prod --yes`
- ทำ DPG/DPV **เมื่อสั่งเท่านั้น**

---

## 🤝 กฎการทำงานร่วมกับ Team Tom

| หัวข้อ | วิธีทำ |
|--------|--------|
| คนละ repo | ไม่มี merge conflict |
| เพิ่ม icon ใหม่ | แจ้ง Team Tom → เพิ่มที่ Master Design → sync |
| ต้องการ component ใหม่ | คุยกับ Team Tom ให้เพิ่มใน Showcase ก่อน |
| ดู Component reference | เปิด https://erp-jigsaw-design.vercel.app |
| Sync ของใหม่ | รัน `scripts/sync.sh` ที่ Master Design repo |
| ก่อน push | `git pull` ทุกครั้ง |

---

## 🔗 ลิงก์สำคัญ

| รายการ | URL |
|--------|-----|
| Component Showcase (ดู reference) | https://erp-jigsaw-design.vercel.app |
| JAS Production (ฝั่ง Admin) | https://erp-jigsaw.vercel.app |
| GitHub — Tenant (repo ของคุณ) | https://github.com/ArtEgency/erp-jigsaw-tenant |
| GitHub — Master Design | https://github.com/ArtEgency/erp-jigsaw-design |
| GitHub — JAS | https://github.com/ArtEgency/erp-jigsaw-jas |

---

*วางไฟล์นี้ที่ root ของ project: `/CLAUDE.md`*
*Claude Code จะอ่านไฟล์นี้อัตโนมัติทุก session*
