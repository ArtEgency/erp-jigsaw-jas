/* ══════════════════════════════════════════════════
   Permission Configuration
   role → allowed routes mapping
   ══════════════════════════════════════════════════ */

export type Role = "super-admin" | "tenant-admin" | "viewer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  tenantSlug?: string; // for tenant-admin only
}

/* ── Route permission map ── */
const ROLE_PERMISSIONS: Record<Role, string[]> = {
  "super-admin": ["*"], // access everything
  "tenant-admin": [
    "/",
    "/login",
    "/setup-wizard",
    "/employee",
    "/product",
    "/assign-permission",
    "/role-permission",
    "/settings",
    "/settings/business",
    "/settings/product",
    "/settings/warehouse",
  ],
  viewer: ["/", "/login"],
};

/* ── Check if role can access path ── */
export function hasPermission(role: Role, pathname: string): boolean {
  const allowed = ROLE_PERMISSIONS[role];
  if (!allowed) return false;
  if (allowed.includes("*")) return true;
  return allowed.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

/* ── Mock users for development ── */
export const MOCK_USERS: Record<string, User> = {
  admin: {
    id: "u1",
    email: "admin@jigsawx.com",
    name: "สลิษา จิตดี",
    role: "super-admin",
    avatar: "สจ",
  },
  tenant: {
    id: "u2",
    email: "somchai@siamgroup.co.th",
    name: "สมชาย วงศ์ใหญ่",
    role: "tenant-admin",
    avatar: "สว",
    tenantSlug: "june",
  },
};
