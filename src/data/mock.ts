export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  price: number;
  stock: number;
}

export interface PurchaseRequest {
  id: string;
  prNumber: string;
  date: string;
  requester: string;
  department: string;
  status: "Draft" | "Pending" | "Approved" | "Rejected";
  items: { productName: string; qty: number; unit: string; unitPrice: number }[];
  total: number;
}

export interface SalesOrder {
  id: string;
  soNumber: string;
  date: string;
  customer: string;
  status: "Draft" | "Confirmed" | "Shipped";
  items: { productName: string; qty: number; unitPrice: number }[];
  total: number;
  salesperson: string;
}

export interface CompanyInfo {
  name: string;
  taxId: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
}

export const products: Product[] = [
  { id: "P001", name: "น้ำมันเครื่อง 5W-30", sku: "OIL-5W30", category: "น้ำมันหล่อลื่น", unit: "ลิตร", price: 350, stock: 1200 },
  { id: "P002", name: "ยางรถยนต์ 205/55R16", sku: "TIRE-205", category: "ยางรถยนต์", unit: "เส้น", price: 2800, stock: 340 },
  { id: "P003", name: "แบตเตอรี่ 12V 65Ah", sku: "BAT-65", category: "แบตเตอรี่", unit: "ลูก", price: 3200, stock: 85 },
  { id: "P004", name: "ผ้าเบรก หน้า-หลัง", sku: "BRK-FH01", category: "ระบบเบรก", unit: "ชุด", price: 1500, stock: 220 },
  { id: "P005", name: "หัวเทียน NGK Iridium", sku: "SPK-NGK01", category: "หัวเทียน", unit: "หัว", price: 280, stock: 560 },
  { id: "P006", name: "กรองอากาศ Toyota Vios", sku: "FIL-AIR01", category: "ไส้กรอง", unit: "ชิ้น", price: 180, stock: 430 },
  { id: "P007", name: "น้ำยาหม้อน้ำ สีเขียว", sku: "CLT-GRN01", category: "น้ำยาหล่อเย็น", unit: "ลิตร", price: 120, stock: 890 },
  { id: "P008", name: "โช้คอัพหน้า KYB", sku: "SHK-KYB01", category: "ช่วงล่าง", unit: "ต้น", price: 4500, stock: 65 },
  { id: "P009", name: "สายพานไทม์มิ่ง Gates", sku: "BLT-TM01", category: "สายพาน", unit: "เส้น", price: 1800, stock: 110 },
  { id: "P010", name: "น้ำมันเกียร์ ATF", sku: "OIL-ATF01", category: "น้ำมันหล่อลื่น", unit: "ลิตร", price: 450, stock: 670 },
];

export const purchaseRequests: PurchaseRequest[] = [
  {
    id: "PR001", prNumber: "PR-2567-001", date: "2567-03-15", requester: "สมชาย ใจดี",
    department: "จัดซื้อ", status: "Approved",
    items: [
      { productName: "น้ำมันเครื่อง 5W-30", qty: 200, unit: "ลิตร", unitPrice: 320 },
      { productName: "กรองอากาศ Toyota Vios", qty: 100, unit: "ชิ้น", unitPrice: 160 },
    ],
    total: 80000,
  },
  {
    id: "PR002", prNumber: "PR-2567-002", date: "2567-03-18", requester: "วิภา สุขสม",
    department: "คลังสินค้า", status: "Pending",
    items: [
      { productName: "ยางรถยนต์ 205/55R16", qty: 40, unit: "เส้น", unitPrice: 2600 },
    ],
    total: 104000,
  },
  {
    id: "PR003", prNumber: "PR-2567-003", date: "2567-03-20", requester: "อภิชาติ มั่นคง",
    department: "ซ่อมบำรุง", status: "Draft",
    items: [
      { productName: "แบตเตอรี่ 12V 65Ah", qty: 10, unit: "ลูก", unitPrice: 3000 },
      { productName: "โช้คอัพหน้า KYB", qty: 8, unit: "ต้น", unitPrice: 4200 },
    ],
    total: 63600,
  },
  {
    id: "PR004", prNumber: "PR-2567-004", date: "2567-03-22", requester: "สมชาย ใจดี",
    department: "จัดซื้อ", status: "Rejected",
    items: [
      { productName: "หัวเทียน NGK Iridium", qty: 500, unit: "หัว", unitPrice: 250 },
    ],
    total: 125000,
  },
];

export const salesOrders: SalesOrder[] = [
  {
    id: "SO001", soNumber: "SO-2567-001", date: "2567-03-10", customer: "บจก. ออโต้พาร์ท พลัส",
    status: "Shipped", salesperson: "ธนพล วงศ์ทอง",
    items: [
      { productName: "น้ำมันเครื่อง 5W-30", qty: 100, unitPrice: 350 },
      { productName: "น้ำมันเกียร์ ATF", qty: 50, unitPrice: 450 },
    ],
    total: 57500,
  },
  {
    id: "SO002", soNumber: "SO-2567-002", date: "2567-03-14", customer: "หจก. ศูนย์ยางไทย",
    status: "Confirmed", salesperson: "ปรีชา สุวรรณ",
    items: [
      { productName: "ยางรถยนต์ 205/55R16", qty: 80, unitPrice: 2800 },
    ],
    total: 224000,
  },
  {
    id: "SO003", soNumber: "SO-2567-003", date: "2567-03-19", customer: "บจก. เจริญยนต์",
    status: "Draft", salesperson: "ธนพล วงศ์ทอง",
    items: [
      { productName: "ผ้าเบรก หน้า-หลัง", qty: 30, unitPrice: 1500 },
      { productName: "โช้คอัพหน้า KYB", qty: 10, unitPrice: 4500 },
    ],
    total: 90000,
  },
  {
    id: "SO004", soNumber: "SO-2567-004", date: "2567-03-21", customer: "ร้านช่างมิตร",
    status: "Confirmed", salesperson: "ปรีชา สุวรรณ",
    items: [
      { productName: "หัวเทียน NGK Iridium", qty: 200, unitPrice: 280 },
      { productName: "สายพานไทม์มิ่ง Gates", qty: 20, unitPrice: 1800 },
    ],
    total: 92000,
  },
  {
    id: "SO005", soNumber: "SO-2567-005", date: "2567-03-25", customer: "บจก. ออโต้พาร์ท พลัส",
    status: "Draft", salesperson: "ธนพล วงศ์ทอง",
    items: [
      { productName: "น้ำยาหม้อน้ำ สีเขียว", qty: 300, unitPrice: 120 },
    ],
    total: 36000,
  },
];

export const companyInfo: CompanyInfo = {
  name: "บริษัท จิ๊กซอว์ ออโต้พาร์ท จำกัด",
  taxId: "0105567890123",
  address: "123/45 ถ.พระราม 2 แขวงแสมดำ เขตบางขุนเทียน กรุงเทพฯ 10150",
  phone: "02-123-4567",
  email: "info@jigsaw-autoparts.co.th",
  website: "www.jigsaw-autoparts.co.th",
  logo: "",
};

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  plan: "Starter" | "Professional" | "Enterprise";
  status: "Active" | "Suspended" | "Trial";
  users: number;
  createdAt: string;
  contactEmail: string;
  contactPhone: string;
}

export const tenants: Tenant[] = [
  {
    id: "T001", name: "บริษัท จิ๊กซอว์ ออโต้พาร์ท จำกัด", subdomain: "jigsaw-auto",
    plan: "Enterprise", status: "Active", users: 25, createdAt: "2566-06-15",
    contactEmail: "admin@jigsaw-auto.co.th", contactPhone: "02-123-4567",
  },
  {
    id: "T002", name: "บจก. สยามเทรดดิ้ง", subdomain: "siam-trading",
    plan: "Professional", status: "Active", users: 12, createdAt: "2566-09-01",
    contactEmail: "info@siamtrading.co.th", contactPhone: "02-555-6789",
  },
  {
    id: "T003", name: "หจก. ไทยซัพพลาย", subdomain: "thai-supply",
    plan: "Starter", status: "Trial", users: 3, createdAt: "2567-02-20",
    contactEmail: "contact@thaisupply.com", contactPhone: "081-234-5678",
  },
  {
    id: "T004", name: "บจก. กรีนโลจิสติกส์", subdomain: "green-logistics",
    plan: "Professional", status: "Active", users: 18, createdAt: "2566-11-10",
    contactEmail: "admin@greenlogistics.co.th", contactPhone: "02-987-6543",
  },
  {
    id: "T005", name: "บจก. เอเชียเน็ตเวิร์ค", subdomain: "asia-network",
    plan: "Enterprise", status: "Suspended", users: 30, createdAt: "2566-03-05",
    contactEmail: "support@asianetwork.co.th", contactPhone: "02-111-2222",
  },
];

export interface MasterAccount {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  company: string;
  customerGroup: string;
  email: string;
  phone: string;
  tenantQuota: number;
  tenantUsed: number;
  status: "รอยืนยัน" | "รอสร้างธุรกิจ" | "กำลังใช้งาน" | "ระงับการใช้งาน" | "หมดอายุ";
  emailVerifiedAt: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export const masterAccounts: MasterAccount[] = [
  {
    id: "MA-69-03-0001",
    firstName: "สมชาย",
    lastName: "วงศ์ใหญ่",
    position: "ผู้จัดการทั่วไป",
    company: "กลุ่มสยาม",
    customerGroup: "ขายส่ง",
    email: "somchai@siamgroup.co.th",
    phone: "081-234-5678",
    tenantQuota: 3,
    tenantUsed: 1,
    status: "กำลังใช้งาน",
    emailVerifiedAt: "26/03/2569 14:32",
    createdAt: "26/03/2569",
    createdBy: "สลิษา จิตดี",
    updatedAt: "26/03/2569",
    updatedBy: "สลิษา จิตดี",
  },
  {
    id: "MA-69-03-0002",
    firstName: "วิภา",
    lastName: "รัตนพันธ์",
    position: "CEO",
    company: "ไทยมาร์ท",
    customerGroup: "ขายปลีก",
    email: "wipa@thaimart.co.th",
    phone: "089-456-7890",
    tenantQuota: 5,
    tenantUsed: 0,
    status: "รอยืนยัน",
    emailVerifiedAt: null,
    createdAt: "25/03/2569",
    createdBy: "สลิษา จิตดี",
    updatedAt: "25/03/2569",
    updatedBy: "สลิษา จิตดี",
  },
  {
    id: "MA-69-03-0003",
    firstName: "ประกิต",
    lastName: "สมบูรณ์ชัย",
    position: "IT Manager",
    company: "เอ็นเตอร์ไพรส์ โซลูชั่น",
    customerGroup: "ทั่วไป",
    email: "prakit@enterprise-sol.co.th",
    phone: "062-123-9999",
    tenantQuota: 2,
    tenantUsed: 2,
    status: "กำลังใช้งาน",
    emailVerifiedAt: "20/03/2569 09:15",
    createdAt: "20/03/2569",
    createdBy: "สลิษา จิตดี",
    updatedAt: "22/03/2569",
    updatedBy: "สลิษา จิตดี",
  },
  {
    id: "MA-69-03-0004",
    firstName: "ชัยชนะ",
    lastName: "มงคล",
    position: "ผู้จัดการทั่วไป",
    company: "มงคล เทรดดิ้ง",
    customerGroup: "ขายปลีก",
    email: "chaichana@mongkol.co.th",
    phone: "062-345-8965",
    tenantQuota: 3,
    tenantUsed: 1,
    status: "ระงับการใช้งาน",
    emailVerifiedAt: "20/03/2569",
    createdAt: "20/03/2569",
    createdBy: "สลิษา จิตดี",
    updatedAt: "22/03/2569",
    updatedBy: "สลิษา จิตดี",
  },
  {
    id: "MA-69-03-0005",
    firstName: "นภัสสร",
    lastName: "พิมพ์ทอง",
    position: "COO",
    company: "โกลบอล ฟู้ดส์",
    customerGroup: "ขายส่ง",
    email: "napatsorn@globalfoods.co.th",
    phone: "095-678-1234",
    tenantQuota: 4,
    tenantUsed: 0,
    status: "รอสร้างธุรกิจ",
    emailVerifiedAt: "28/03/2569 10:00",
    createdAt: "28/03/2569",
    createdBy: "สลิษา จิตดี",
    updatedAt: "28/03/2569",
    updatedBy: "สลิษา จิตดี",
  },
  {
    id: "MA-69-03-0006",
    firstName: "ธนวัฒน์",
    lastName: "สิริกุล",
    position: "Managing Director",
    company: "สิริกุล กรุ๊ป",
    customerGroup: "VIP",
    email: "thanawat@sirikul.co.th",
    phone: "081-999-8888",
    tenantQuota: 10,
    tenantUsed: 3,
    status: "กำลังใช้งาน",
    emailVerifiedAt: "15/03/2569 08:30",
    createdAt: "15/03/2569",
    createdBy: "สลิษา จิตดี",
    updatedAt: "01/04/2569",
    updatedBy: "สลิษา จิตดี",
  },
  {
    id: "MA-69-03-0007",
    firstName: "พิชญา",
    lastName: "แสงดาว",
    position: "ผู้จัดการฝ่ายขาย",
    company: "ดาวเรือง คอมเมิร์ซ",
    customerGroup: "ทั่วไป",
    email: "pitchaya@daoreung.co.th",
    phone: "087-111-2222",
    tenantQuota: 2,
    tenantUsed: 0,
    status: "รอยืนยัน",
    emailVerifiedAt: null,
    createdAt: "01/04/2569",
    createdBy: "สลิษา จิตดี",
    updatedAt: "01/04/2569",
    updatedBy: "สลิษา จิตดี",
  },
  {
    id: "MA-69-03-0008",
    firstName: "อนุชา",
    lastName: "เจริญสุข",
    position: "CFO",
    company: "เจริญสุข โฮลดิ้ง",
    customerGroup: "VIP",
    email: "anucha@charoensuk.co.th",
    phone: "086-333-4444",
    tenantQuota: 8,
    tenantUsed: 5,
    status: "หมดอายุ",
    emailVerifiedAt: "10/01/2569 11:00",
    createdAt: "10/01/2569",
    createdBy: "สลิษา จิตดี",
    updatedAt: "31/03/2569",
    updatedBy: "ระบบ",
  },
  {
    id: "MA-69-03-0009",
    firstName: "กมลวรรณ",
    lastName: "ศรีสว่าง",
    position: "ผู้อำนวยการ",
    company: "ศรีสว่าง อินเตอร์",
    customerGroup: "ขายส่ง",
    email: "kamonwan@srisawang.co.th",
    phone: "091-555-6666",
    tenantQuota: 3,
    tenantUsed: 0,
    status: "รอสร้างธุรกิจ",
    emailVerifiedAt: "02/04/2569 09:45",
    createdAt: "02/04/2569",
    createdBy: "สลิษา จิตดี",
    updatedAt: "02/04/2569",
    updatedBy: "สลิษา จิตดี",
  },
  {
    id: "MA-69-03-0010",
    firstName: "ภูริทัต",
    lastName: "วงศ์ประเสริฐ",
    position: "CTO",
    company: "เทคไทย โซลูชั่น",
    customerGroup: "ทั่วไป",
    email: "puritat@techthai.co.th",
    phone: "064-777-8888",
    tenantQuota: 5,
    tenantUsed: 2,
    status: "หมดอายุ",
    emailVerifiedAt: "05/12/2568 14:20",
    createdAt: "05/12/2568",
    createdBy: "สลิษา จิตดี",
    updatedAt: "05/03/2569",
    updatedBy: "ระบบ",
  },
];

export interface TenantDetail {
  id: string;
  nameTh: string;
  nameEn: string;
  entityType: string;
  businessType: string;
  taxId: string;
  subdomain: string;
  deploymentTier: "Cloud" | "Dedicated" | "On-premise";
  quotas: { user: number; branch: number; warehouse: number; storage: number; auditLog: number; onboarding: number };
  backupFreq: number;
  backupUnit: "ชั่วโมง" | "วัน";
  modules: { id: string; name: string; status: "locked" | "on" | "off" }[];
  contractStart: string;
  contractEnd: string;
  autoRenewal: boolean;
  status: "Active" | "รอ Setup Wizard" | "Suspended";
}

export const sampleTenantDetail: TenantDetail = {
  id: "TNT-001",
  nameTh: "บริษัท สยามเทรด จำกัด",
  nameEn: "Siam Trade Co., Ltd.",
  entityType: "บริษัทจำกัด (บจ.)",
  businessType: "Trading — ซื้อมาขายไป",
  taxId: "0105565012345",
  subdomain: "siamtrade",
  deploymentTier: "Cloud",
  quotas: { user: 20, branch: 3, warehouse: 5, storage: 20, auditLog: 12, onboarding: 10 },
  backupFreq: 1,
  backupUnit: "วัน",
  modules: [
    { id: "MD-1", name: "งานของฉัน", status: "locked" },
    { id: "MD-2", name: "สินค้า", status: "locked" },
    { id: "MD-3", name: "จัดซื้อ", status: "locked" },
    { id: "MD-4", name: "คลัง", status: "locked" },
    { id: "MD-5", name: "คู่ค้า", status: "locked" },
    { id: "MD-6", name: "ขาย", status: "locked" },
    { id: "MD-7", name: "การเงิน", status: "locked" },
    { id: "MD-8", name: "บุคคล", status: "locked" },
    { id: "MD-9", name: "รายงาน", status: "locked" },
    { id: "MD-10", name: "Analytics", status: "locked" },
    { id: "MD-11", name: "ตั้งค่า", status: "locked" },
    { id: "MD-12", name: "Backoffice", status: "on" },
    { id: "MD-13", name: "โปรโมชั่น", status: "off" },
    { id: "MD-14", name: "Omni", status: "off" },
    { id: "MD-15", name: "CRM", status: "off" },
  ],
  contractStart: "01/04/2569",
  contractEnd: "31/03/2570",
  autoRenewal: false,
  status: "รอ Setup Wizard",
};

/* ── Account Tenants — tenants linked to each master account ── */
export interface AccountTenant {
  id: string;
  accountId: string;
  nameTh: string;
  nameEn: string;
  subdomain: string;
  deploymentTier: "Cloud" | "Dedicated" | "On-premise";
  entityType: string;
  businessType: string;
  taxId: string;
  logoText: string;
  quotas: { user: number; branch: number; warehouse: number; storage: number; auditLog: number; onboarding: number };
  cores: string[];
  contractStart: string;
  contractEnd: string;
  autoRenewal: boolean;
  status: "เปิดใช้งาน" | "รอ Setup Wizard" | "ระงับ";
}

export const accountTenants: AccountTenant[] = [
  // MA-69-03-0001 สมชาย — กำลังใช้งาน, quota 3, used 1
  {
    id: "TNT-0001-01", accountId: "MA-69-03-0001",
    nameTh: "กลุ่มสยาม สำนักงานใหญ่", nameEn: "Siam Group HQ",
    subdomain: "siamgroup", deploymentTier: "Cloud",
    entityType: "บริษัทจำกัด (บจ.)", businessType: "Trading - ซื้อมาขายไป",
    taxId: "0105565012345", logoText: "กลุ่ม\nสยาม",
    quotas: { user: 20, branch: 5, warehouse: 3, storage: 10, auditLog: 12, onboarding: 10 },
    cores: ["Jigsaw Core Allder Now", "Allder Cafe"],
    contractStart: "01/01/2569", contractEnd: "31/12/2569", autoRenewal: true,
    status: "เปิดใช้งาน",
  },
  // MA-69-03-0003 ประกิต — กำลังใช้งาน, quota 2, used 2 (เต็ม!)
  {
    id: "TNT-0003-01", accountId: "MA-69-03-0003",
    nameTh: "เอ็นเตอร์ไพรส์ โซลูชั่น สาขา 1", nameEn: "Enterprise Solution Branch 1",
    subdomain: "enterprise1", deploymentTier: "Cloud",
    entityType: "บริษัทจำกัด (บจ.)", businessType: "Service - บริการ",
    taxId: "0105567890001", logoText: "ENT\nSOL",
    quotas: { user: 10, branch: 2, warehouse: 1, storage: 5, auditLog: 6, onboarding: 5 },
    cores: ["Jigsaw Core Allder Now"],
    contractStart: "01/03/2569", contractEnd: "28/02/2570", autoRenewal: false,
    status: "เปิดใช้งาน",
  },
  {
    id: "TNT-0003-02", accountId: "MA-69-03-0003",
    nameTh: "เอ็นเตอร์ไพรส์ โซลูชั่น สาขา 2", nameEn: "Enterprise Solution Branch 2",
    subdomain: "enterprise2", deploymentTier: "Cloud",
    entityType: "บริษัทจำกัด (บจ.)", businessType: "Service - บริการ",
    taxId: "0105567890002", logoText: "ENT\nSOL",
    quotas: { user: 5, branch: 1, warehouse: 1, storage: 3, auditLog: 6, onboarding: 5 },
    cores: ["Jigsaw Core Allder Now"],
    contractStart: "15/03/2569", contractEnd: "14/03/2570", autoRenewal: false,
    status: "รอ Setup Wizard",
  },
  // MA-69-03-0004 ชัยชนะ — ระงับการใช้งาน, quota 3, used 1
  {
    id: "TNT-0004-01", accountId: "MA-69-03-0004",
    nameTh: "มงคล เทรดดิ้ง สำนักงานใหญ่", nameEn: "Mongkol Trading HQ",
    subdomain: "mongkol", deploymentTier: "Dedicated",
    entityType: "ห้างหุ้นส่วนจำกัด (หจก.)", businessType: "Trading - ซื้อมาขายไป",
    taxId: "0105566001234", logoText: "มงคล\nTRD",
    quotas: { user: 15, branch: 3, warehouse: 2, storage: 8, auditLog: 12, onboarding: 8 },
    cores: ["Jigsaw Core Allder Now", "CarDeler"],
    contractStart: "01/06/2568", contractEnd: "31/05/2569", autoRenewal: true,
    status: "ระงับ",
  },
  // MA-69-03-0006 ธนวัฒน์ — กำลังใช้งาน, quota 10, used 3
  {
    id: "TNT-0006-01", accountId: "MA-69-03-0006",
    nameTh: "สิริกุล กรุ๊ป สำนักงานใหญ่", nameEn: "Sirikul Group HQ",
    subdomain: "sirikul", deploymentTier: "Dedicated",
    entityType: "บริษัทมหาชนจำกัด (บมจ.)", businessType: "Manufacturing - ผลิต",
    taxId: "0107558000123", logoText: "สิริกุล\nGRP",
    quotas: { user: 50, branch: 10, warehouse: 5, storage: 50, auditLog: 24, onboarding: 20 },
    cores: ["Jigsaw Core Allder Now", "Manufacturing", "Extension"],
    contractStart: "01/01/2569", contractEnd: "31/12/2570", autoRenewal: true,
    status: "เปิดใช้งาน",
  },
  {
    id: "TNT-0006-02", accountId: "MA-69-03-0006",
    nameTh: "สิริกุล โลจิสติกส์", nameEn: "Sirikul Logistics",
    subdomain: "sirikul-log", deploymentTier: "Cloud",
    entityType: "บริษัทจำกัด (บจ.)", businessType: "Logistics - ขนส่ง",
    taxId: "0105569000456", logoText: "สิริกุล\nLOG",
    quotas: { user: 15, branch: 5, warehouse: 3, storage: 10, auditLog: 12, onboarding: 10 },
    cores: ["Jigsaw Core Allder Now"],
    contractStart: "01/03/2569", contractEnd: "28/02/2570", autoRenewal: false,
    status: "เปิดใช้งาน",
  },
  {
    id: "TNT-0006-03", accountId: "MA-69-03-0006",
    nameTh: "สิริกุล ฟู้ด", nameEn: "Sirikul Food",
    subdomain: "sirikul-food", deploymentTier: "Cloud",
    entityType: "บริษัทจำกัด (บจ.)", businessType: "Food & Beverage - อาหารและเครื่องดื่ม",
    taxId: "0105569000789", logoText: "สิริกุล\nFOOD",
    quotas: { user: 10, branch: 3, warehouse: 2, storage: 5, auditLog: 6, onboarding: 5 },
    cores: ["Jigsaw Core Allder Now", "Allder Cafe"],
    contractStart: "15/03/2569", contractEnd: "14/03/2570", autoRenewal: false,
    status: "รอ Setup Wizard",
  },
  // MA-69-03-0008 อนุชา — หมดอายุ, quota 8, used 5
  {
    id: "TNT-0008-01", accountId: "MA-69-03-0008",
    nameTh: "เจริญสุข ออโต้", nameEn: "Charoensuk Auto",
    subdomain: "csauto", deploymentTier: "On-premise",
    entityType: "บริษัทจำกัด (บจ.)", businessType: "Trading - ซื้อมาขายไป",
    taxId: "0105562000111", logoText: "เจริญ\nสุข",
    quotas: { user: 30, branch: 8, warehouse: 5, storage: 20, auditLog: 12, onboarding: 10 },
    cores: ["Jigsaw Core Allder Now", "CarDeler"],
    contractStart: "01/01/2568", contractEnd: "31/12/2568", autoRenewal: false,
    status: "เปิดใช้งาน",
  },
  {
    id: "TNT-0008-02", accountId: "MA-69-03-0008",
    nameTh: "เจริญสุข พาร์ท", nameEn: "Charoensuk Parts",
    subdomain: "csparts", deploymentTier: "Cloud",
    entityType: "บริษัทจำกัด (บจ.)", businessType: "Trading - ซื้อมาขายไป",
    taxId: "0105562000222", logoText: "CS\nPARTS",
    quotas: { user: 10, branch: 3, warehouse: 2, storage: 5, auditLog: 6, onboarding: 5 },
    cores: ["Jigsaw Core Allder Now"],
    contractStart: "01/04/2568", contractEnd: "31/03/2569", autoRenewal: false,
    status: "เปิดใช้งาน",
  },
  {
    id: "TNT-0008-03", accountId: "MA-69-03-0008",
    nameTh: "เจริญสุข เซอร์วิส", nameEn: "Charoensuk Service",
    subdomain: "csservice", deploymentTier: "Cloud",
    entityType: "ห้างหุ้นส่วนจำกัด (หจก.)", businessType: "Service - บริการ",
    taxId: "0105562000333", logoText: "CS\nSVC",
    quotas: { user: 8, branch: 2, warehouse: 1, storage: 3, auditLog: 6, onboarding: 5 },
    cores: ["Jigsaw Core Allder Now"],
    contractStart: "01/06/2568", contractEnd: "31/05/2569", autoRenewal: false,
    status: "เปิดใช้งาน",
  },
  {
    id: "TNT-0008-04", accountId: "MA-69-03-0008",
    nameTh: "เจริญสุข ดิจิตอล", nameEn: "Charoensuk Digital",
    subdomain: "csdigital", deploymentTier: "Cloud",
    entityType: "บริษัทจำกัด (บจ.)", businessType: "Tech - เทคโนโลยี",
    taxId: "0105562000444", logoText: "CS\nDIGI",
    quotas: { user: 5, branch: 1, warehouse: 1, storage: 2, auditLog: 6, onboarding: 3 },
    cores: ["Jigsaw Core Allder Now", "Extension"],
    contractStart: "01/09/2568", contractEnd: "31/08/2569", autoRenewal: false,
    status: "รอ Setup Wizard",
  },
  {
    id: "TNT-0008-05", accountId: "MA-69-03-0008",
    nameTh: "เจริญสุข ฟาร์ม", nameEn: "Charoensuk Farm",
    subdomain: "csfarm", deploymentTier: "Cloud",
    entityType: "บริษัทจำกัด (บจ.)", businessType: "Agriculture - เกษตรกรรม",
    taxId: "0105562000555", logoText: "CS\nFARM",
    quotas: { user: 5, branch: 1, warehouse: 1, storage: 2, auditLog: 6, onboarding: 3 },
    cores: ["Jigsaw Core Allder Now"],
    contractStart: "01/11/2568", contractEnd: "31/10/2569", autoRenewal: false,
    status: "เปิดใช้งาน",
  },
  // MA-69-03-0010 ภูริทัต — หมดอายุ, quota 5, used 2
  {
    id: "TNT-0010-01", accountId: "MA-69-03-0010",
    nameTh: "เทคไทย โซลูชั่น", nameEn: "TechThai Solution",
    subdomain: "techthai", deploymentTier: "Cloud",
    entityType: "บริษัทจำกัด (บจ.)", businessType: "Tech - เทคโนโลยี",
    taxId: "0105568000111", logoText: "TECH\nTHAI",
    quotas: { user: 15, branch: 3, warehouse: 2, storage: 10, auditLog: 12, onboarding: 8 },
    cores: ["Jigsaw Core Allder Now", "Extension"],
    contractStart: "01/12/2567", contractEnd: "30/11/2568", autoRenewal: false,
    status: "เปิดใช้งาน",
  },
  {
    id: "TNT-0010-02", accountId: "MA-69-03-0010",
    nameTh: "เทคไทย คลาวด์", nameEn: "TechThai Cloud",
    subdomain: "techthai-cloud", deploymentTier: "Cloud",
    entityType: "บริษัทจำกัด (บจ.)", businessType: "Tech - เทคโนโลยี",
    taxId: "0105568000222", logoText: "TT\nCLOUD",
    quotas: { user: 10, branch: 2, warehouse: 1, storage: 5, auditLog: 6, onboarding: 5 },
    cores: ["Jigsaw Core Allder Now"],
    contractStart: "01/03/2568", contractEnd: "28/02/2569", autoRenewal: false,
    status: "รอ Setup Wizard",
  },
];

export const recentActivities = [
  { time: "10:32", action: "สร้างใบขอซื้อ PR-2567-003", user: "อภิชาติ มั่นคง", type: "create" as const },
  { time: "10:15", action: "อนุมัติใบขอซื้อ PR-2567-001", user: "ผู้จัดการฝ่ายจัดซื้อ", type: "approve" as const },
  { time: "09:45", action: "ส่งสินค้า SO-2567-001", user: "ธนพล วงศ์ทอง", type: "ship" as const },
  { time: "09:30", action: "เพิ่มสินค้าใหม่ P010", user: "สมชาย ใจดี", type: "create" as const },
  { time: "09:00", action: "ยืนยันใบสั่งขาย SO-2567-002", user: "ปรีชา สุวรรณ", type: "confirm" as const },
];
