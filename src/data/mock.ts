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
  status: "เปิดใช้งาน" | "รอยืนยัน Email" | "ปิดใช้งาน" | "ระงับ Account";
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
    status: "เปิดใช้งาน",
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
    status: "รอยืนยัน Email",
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
    status: "เปิดใช้งาน",
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
    status: "ระงับ Account",
    emailVerifiedAt: "20/03/2569",
    createdAt: "20/03/2569",
    createdBy: "สลิษา จิตดี",
    updatedAt: "22/03/2569",
    updatedBy: "สลิษา จิตดี",
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

export const recentActivities = [
  { time: "10:32", action: "สร้างใบขอซื้อ PR-2567-003", user: "อภิชาติ มั่นคง", type: "create" as const },
  { time: "10:15", action: "อนุมัติใบขอซื้อ PR-2567-001", user: "ผู้จัดการฝ่ายจัดซื้อ", type: "approve" as const },
  { time: "09:45", action: "ส่งสินค้า SO-2567-001", user: "ธนพล วงศ์ทอง", type: "ship" as const },
  { time: "09:30", action: "เพิ่มสินค้าใหม่ P010", user: "สมชาย ใจดี", type: "create" as const },
  { time: "09:00", action: "ยืนยันใบสั่งขาย SO-2567-002", user: "ปรีชา สุวรรณ", type: "confirm" as const },
];
