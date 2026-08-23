import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  KeyRound,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

export type AdminArea =
  | "dashboard"
  | "clients"
  | "team"
  | "careers"
  | "applications"
  | "admins"
  | "team-access"
  | "roles"
  | "permissions"
  | "activity"
  | "sessions"
  | "sales"
  | "sales-leads"
  | "sales-team"
  | "sales-access"
  | "profile"
  | "security";

export type AdminNavigationItem = {
  label: string;
  href: string;
  key: AdminArea;
  icon: LucideIcon;
  description?: string;
};

export type AdminNavigationSection = {
  label: string;
  items: AdminNavigationItem[];
  requiresSalesGovernance?: boolean;
};

export const adminNavigationSections: AdminNavigationSection[] = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", href: "/admin", key: "dashboard", icon: LayoutDashboard, description: "Workspace health and activity" },
    ],
  },
  {
    label: "Sales Management",
    requiresSalesGovernance: true,
    items: [
      {
        label: "Overview",
        href: "/admin/sales",
        key: "sales",
        icon: BarChart3,
        description: "Sales pipeline and performance oversight",
      },
      {
        label: "Leads",
        href: "/admin/sales/leads",
        key: "sales-leads",
        icon: ClipboardList,
        description: "Lead records and pipeline oversight",
      },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Team", href: "/admin/team", key: "team", icon: Users, description: "Profiles and public directory" },
      { label: "Clients", href: "/admin/clients", key: "clients", icon: Building2, description: "Client accounts and records" },
      { label: "Careers", href: "/admin/careers", key: "careers", icon: BriefcaseBusiness, description: "Open roles and publishing" },
      { label: "Applications", href: "/admin/applications", key: "applications", icon: ClipboardList, description: "Candidate submissions" },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Team Access", href: "/admin/administration/access", key: "team-access", icon: KeyRound, description: "Grant Administrator or Sales access from TeamMembers" },
      { label: "Roles", href: "/admin/administration/roles", key: "roles", icon: ShieldCheck, description: "Workspace roles" },
      { label: "Permissions", href: "/admin/administration/permissions", key: "permissions", icon: KeyRound, description: "Access policies" },
      { label: "Activity log", href: "/admin/administration/activity", key: "activity", icon: ClipboardList, description: "Audited changes" },
      { label: "Login sessions", href: "/admin/administration/sessions", key: "sessions", icon: KeyRound, description: "Operator sessions" },
    ],
  },
];

export const adminAccountNavigation: AdminNavigationItem[] = [
  { label: "My profile", href: "/admin/profile", key: "profile", icon: UserRound, description: "Your operator profile" },
  { label: "Security", href: "/admin/security", key: "security", icon: Settings, description: "Password and sessions" },
];

const allNavigationItems = [...adminNavigationSections.flatMap((section) => section.items), ...adminAccountNavigation];

export function getAdminRouteInfo(pathname: string): AdminNavigationItem {
  if (pathname === "/admin" || pathname === "/admin/") {
    return adminNavigationSections[0].items[0];
  }

  return (
    [...allNavigationItems]
      .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
      .sort((left, right) => right.href.length - left.href.length)[0] ?? adminNavigationSections[0].items[0]
  );
}
