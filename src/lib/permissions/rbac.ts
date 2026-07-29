import {
  CEO_ADMIN_ID,
  ADMIN_SESSION_KEY,
  USER_SESSION_KEY,
} from "@/lib/auth/constants";

export {
  CEO_ADMIN_ID,
  ADMIN_SESSION_KEY,
  USER_SESSION_KEY,
};

export const permissionModules = [
  "Dashboard",
  "Website Pages",
  "Hero Section",
  "Services",
  "Portfolio",
  "Clients",
  "Testimonials",
  "Blogs",
  "Careers",
  "Jobs",
  "Applications",
  "Media Library",
  "Team Members",
  "Contacts",
  "Newsletter",
  "SEO",
  "Website Settings",
  "Appearance",
  "Navigation",
  "Analytics",
  "Users",
  "Administrators",
  "Roles",
  "Permissions",
  "Audit Logs",
  "System Settings",
] as const;

export const permissionActions = [
  "VIEW",
  "CREATE",
  "EDIT",
  "DELETE",
  "PUBLISH",
  "APPROVE",
  "EXPORT",
  "IMPORT",
  "MANAGE",
] as const;

export type PermissionModule = (typeof permissionModules)[number];
export type PermissionAction = (typeof permissionActions)[number];

export type AdminRole =
  | "CEO"
  | "Administrator"
  | "Content Manager"
  | "Marketing Manager"
  | "HR Manager"
  | "Sales Manager"
  | "Finance Manager"
  | "Project Manager"
  | "Support Manager"
  | "Developer"
  | "Custom Role";

export type AdminStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "INVITED"
  | "LOCKED";

export interface Administrator {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  avatar: string;
  designation: string;
  department: string;
  bio: string;
  role: AdminRole;
  status: AdminStatus;
  twoFactorEnabled: boolean;
  lastLogin: string | null;
  createdAt: string;
  permissions: string[];
  isCeo?: boolean;
}

export function isProtectedCeo(admin: Administrator): boolean {
  return admin.id === CEO_ADMIN_ID || admin.isCeo === true;
}

export function canManageAdmin(
  actor: Administrator,
  target: Administrator
): boolean {
  return !isProtectedCeo(target) || isProtectedCeo(actor);
}

export function hasPermission(
  admin: Administrator,
  module: PermissionModule,
  action: PermissionAction
): boolean {
  if (admin.role === "CEO") {
    return true;
  }

  return (
    admin.permissions.includes(`${module}:${action}`) ||
    admin.permissions.includes(`${module}:MANAGE`)
  );
}