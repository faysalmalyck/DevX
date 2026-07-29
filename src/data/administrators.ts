import type { Administrator } from "@/lib/permissions/rbac";
import { CEO_ADMIN_ID, permissionModules, permissionActions } from "@/lib/permissions/rbac";
export const ADMIN_STORAGE_KEY = "DevX-administrators";
const allPermissions = permissionModules.flatMap((module) => permissionActions.map((action) => `${module}:${action}`));
export const defaultAdministrators: Administrator[] = [
  { id: CEO_ADMIN_ID, firstName: "Faysal", lastName: "Mushtaq", email: "ceo@DevX.com", phone: "", username: "faysal", avatar: "/images/hero/faysal.png", designation: "CEO & Founder", department: "Executive", bio: "Primary platform owner.", role: "CEO", status: "ACTIVE", twoFactorEnabled: true, lastLogin: new Date().toISOString(), createdAt: "2025-01-01T00:00:00.000Z", permissions: allPermissions, isCeo: true },
  { id: "admin-content", firstName: "Barkat", lastName: "", email: "barkat@DevX.com", phone: "", username: "barkat", avatar: "/images/hero/barkat.jpg", designation: "CTO", department: "Engineering", bio: "", role: "Administrator", status: "ACTIVE", twoFactorEnabled: true, lastLogin: "2026-07-16T10:20:00.000Z", createdAt: "2025-03-01T00:00:00.000Z", permissions: ["Dashboard:VIEW", "Clients:MANAGE", "Team Members:MANAGE" ] },
];
