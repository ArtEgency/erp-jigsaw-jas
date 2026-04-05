import { PageCondition } from "./types";
import { tenantlistCondition } from "./tenantlist";

/**
 * Registry รวม condition ทุกหน้า
 * key = pathname (ไม่รวม slug)
 *
 * เพิ่มหน้าใหม่:
 * 1. สร้างไฟล์ conditions/xxx.ts
 * 2. import + เพิ่มใน object นี้
 */
export const CONDITIONS: Record<string, PageCondition> = {
  "/tenantlist": tenantlistCondition,
  // เพิ่มได้เรื่อยๆ:
  // "/dashboard": dashboardCondition,
  // "/reports": reportsCondition,
};

export type { PageCondition } from "./types";
export type { ValidationRule, DataField } from "./types";
