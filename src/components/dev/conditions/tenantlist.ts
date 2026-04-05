import { PageCondition } from "./types";

export const tenantlistCondition: PageCondition = {
  page: "Tenant List (รายชื่อลูกค้า)",
  path: "/tenantlist",
  description: "หน้าจัดการรายชื่อลูกค้า (Master Account) ทั้งหมดในระบบ JAS Admin",

  requirements: [
    "แสดงรายชื่อลูกค้าทั้งหมดในตาราง DataGrid",
    "กรองได้ตาม กลุ่มลูกค้า (ทั่วไป/ขายส่ง/ขายปลีก/VIP)",
    "กรองได้ตาม สถานะ (Active/รอยืนยัน/ระงับ)",
    "ค้นหาตามชื่อลูกค้า (search by name)",
    "แบ่ง Tab: ลูกค้าปัจจุบัน / ลูกค้าที่ยกเลิก / ลูกค้าที่ระงับ",
    "กดเพิ่มลูกค้าใหม่ → เปิด Modal สร้าง Master Account",
    "Modal มีปุ่ม Pop out เปิดเป็น window แยก",
    "กดแถว → เปิด SlidePanel แสดงรายละเอียด",
    "Meatball menu (⋮) → ดู/แก้ไข/ระงับ/ยกเลิก",
    "ส่งออกรายงาน (Export)",
    "i18n รองรับ TH/EN",
  ],

  validations: [
    { field: "email", rule: "required, email format, unique", when: "เพิ่มลูกค้าใหม่" },
    { field: "firstName", rule: "required", when: "เพิ่มลูกค้าใหม่" },
    { field: "lastName", rule: "required", when: "เพิ่มลูกค้าใหม่" },
    { field: "position", rule: "required", when: "เพิ่มลูกค้าใหม่" },
    { field: "customerGroup", rule: "required, enum: ทั่วไป/ขายส่ง/ขายปลีก/VIP", when: "เพิ่มลูกค้าใหม่" },
    { field: "tenantQuota", rule: "required, number, min: 1", when: "เพิ่มลูกค้าใหม่" },
    { field: "phone", rule: "optional, phone format", when: "เพิ่มลูกค้าใหม่" },
  ],

  flow: [
    "1. User เข้าหน้า /tenantlist → โหลดข้อมูล Master Account ทั้งหมด",
    "2. เลือก Tab (ปัจจุบัน/ยกเลิก/ระงับ) → filter ข้อมูลตาม status",
    "3. กรอง dropdown กลุ่มลูกค้า/สถานะ → filter เพิ่ม",
    "4. พิมพ์ค้นหา → filter ตาม firstName + lastName + company",
    "5. กดปุ่ม '+ เพิ่มลูกค้า' → เปิด Modal สร้าง Master Account",
    "6. กรอกข้อมูล → Validate ทุก field",
    "7. กด บันทึก → สร้าง Master Account + generate ID (MA-YY-MM-XXXX)",
    "8. ระบบส่ง Email ยืนยันตัวตนให้ผู้ติดต่อ",
    "9. ลูกค้าใหม่จะมีสถานะ 'รอยืนยัน Email'",
    "10. เมื่อยืนยัน Email → สถานะเปลี่ยนเป็น 'Active'",
    "11. กดแถว → เปิด SlidePanel ดูรายละเอียด + Tenant ที่สร้าง",
  ],

  dataModel: [
    { field: "id", type: "string", example: "MA-26-04-0001", unique: true },
    { field: "firstName", type: "string", required: true },
    { field: "lastName", type: "string", required: true },
    { field: "position", type: "string", required: true },
    { field: "company", type: "string" },
    { field: "email", type: "string", required: true, unique: true },
    { field: "phone", type: "string" },
    { field: "customerGroup", type: "enum", example: "ทั่วไป/ขายส่ง/ขายปลีก/VIP" },
    { field: "tenantQuota", type: "number", default: 3 },
    { field: "tenantUsed", type: "number", default: 0 },
    { field: "status", type: "enum", example: "Active/รอยืนยัน Email/ระงับ/ยกเลิก" },
    { field: "emailVerifiedAt", type: "datetime" },
  ],
};
