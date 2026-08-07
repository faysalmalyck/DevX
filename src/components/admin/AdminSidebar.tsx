"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Building2,
  ClipboardList,
  KeyRound,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BriefcaseBusiness,
} from "lucide-react";
import { useSession } from "@/contexts/SessionContext";

export type AdminArea =
  | "dashboard"
  | "clients"
  | "team"
  | "careers"
  | "applications"
  | "admins"
  | "roles"
  | "permissions"
  | "activity"
  | "sessions"
  | "profile"
  | "security";

export default function AdminSidebar({ active }: { active: AdminArea }) {
  const { user, logout } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("devx_sidebar_collapsed");
    if (saved === "true") {
      setCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("devx_sidebar_collapsed", String(next));
  };

  const primaryNav = [
    { label: "Dashboard", href: "/admin", key: "dashboard", icon: LayoutDashboard },
    { label: "Manage Team", href: "/admin/team", key: "team", icon: Users },
    { label: "Manage Clients", href: "/admin/clients", key: "clients", icon: Building2 },
    { label: "Careers", href: "/admin/careers", key: "careers", icon: BriefcaseBusiness },
    { label: "Applications", href: "/admin/applications", key: "applications", icon: ClipboardList },
  ] as const;

  const adminNav = [
    { label: "Administrators", href: "/admin/administration/admins", key: "admins", icon: Users },
    { label: "Roles", href: "/admin/administration/roles", key: "roles", icon: ShieldCheck },
    { label: "Permissions", href: "/admin/administration/permissions", key: "permissions", icon: KeyRound },
    { label: "Activity Logs", href: "/admin/administration/activity", key: "activity", icon: ClipboardList },
    { label: "Login Sessions", href: "/admin/administration/sessions", key: "sessions", icon: KeyRound },
  ] as const;

  // Don't render the transition until mounted to avoid hydration mismatch
  if (!mounted) {
    return <aside className="hidden h-screen w-64 md:block shrink-0 border-r border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827]" />;
  }

  return (
    <aside
      className={`group relative hidden h-screen shrink-0 flex-col justify-between border-r border-slate-200 bg-white transition-all duration-300 dark:border-white/10 dark:bg-[#111827] md:flex ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col overflow-y-auto overflow-x-hidden">
        {/* Brand Header */}
        <div className={`flex h-16 shrink-0 items-center border-b border-slate-100 dark:border-white/5 ${collapsed ? "justify-center px-0" : "justify-between px-6"}`}>
          <Link
            href="/admin"
            className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
          >
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              DevX<span className="text-blue-600 dark:text-blue-500">.</span>
            </span>
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
              Ops
            </span>
          </Link>
          
          {collapsed && (
            <Link href="/admin" className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              D<span className="text-blue-600 dark:text-blue-500">.</span>
            </Link>
          )}

          {/* Toggle Button - Absolute when collapsed, inline when expanded */}
          <button
            onClick={toggleCollapse}
            className={`flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:bg-[#181d2b] dark:text-zinc-400 dark:hover:text-white ${
              collapsed ? "absolute -right-3 top-5" : ""
            }`}
          >
            {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>
        </div>

        {/* Main Navigation Sections */}
        <nav className="flex flex-col gap-6 p-4">
          <div className="flex flex-col gap-1">
            {!collapsed && (
              <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                Core Modules
              </p>
            )}
            {primaryNav.map(({ label, href, key, icon: Icon }) => {
              const isActive = active === key;
              return (
                <Link
                  key={key}
                  href={href}
                  title={collapsed ? label : undefined}
                  className={`group flex items-center rounded-xl p-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                  } ${collapsed ? "justify-center" : "gap-3 px-3"}`}
                >
                  <Icon className={`h-5 w-5 shrink-0 transition-transform duration-200 ${isActive && !collapsed ? "scale-110" : "group-hover:scale-110"}`} />
                  {!collapsed && <span className="truncate">{label}</span>}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col gap-1">
            {!collapsed && (
              <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                Administration
              </p>
            )}
            {collapsed && <div className="mx-auto my-2 h-px w-8 bg-slate-200 dark:bg-white/10" />}
            {adminNav.map(({ label, href, key, icon: Icon }) => {
              const isActive = active === key;
              return (
                <Link
                  key={key}
                  href={href}
                  title={collapsed ? label : undefined}
                  className={`group flex items-center rounded-xl p-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                  } ${collapsed ? "justify-center" : "gap-3 px-3"}`}
                >
                  <Icon className={`h-5 w-5 shrink-0 transition-transform duration-200 ${isActive && !collapsed ? "scale-110" : "group-hover:scale-110"}`} />
                  {!collapsed && <span className="truncate">{label}</span>}
                </Link>
              );
            })}
          </div>
         </nav>
      </div>

      {/* User Info & Actions */}
      <div className="border-t border-slate-100 p-4 dark:border-white/5">
        <div className={`flex flex-col ${collapsed ? "items-center gap-3" : "gap-4"}`}>
          {user && !collapsed && (
            <Link
              href="/admin/admin/profile"
              className="group flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 font-bold text-blue-600 dark:border-blue-900/50 dark:bg-blue-500/10 dark:text-blue-400">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  user.firstName[0]
                )}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-bold text-slate-900 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-xs font-medium text-slate-500 dark:text-zinc-500">
                  {user.role}
                </p>
              </div>
            </Link>
          )}

          <div className={`flex ${collapsed ? "flex-col items-center gap-2" : "items-center gap-2"}`}>
            <Link
              href="/admin/admin/security"
              title="Security Settings"
              className={`flex items-center justify-center rounded-xl font-medium transition-all duration-200 ${
                active === "security"
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              } ${collapsed ? "h-10 w-10 p-0" : "h-10 flex-1 gap-2 text-xs"}`}
            >
              <Settings className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Security</span>}
            </Link>
            
            <button
              onClick={logout}
              title="Sign Out"
              className={`flex shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition hover:bg-rose-100 hover:text-rose-700 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:hover:text-rose-400 ${
                collapsed ? "h-10 w-10" : "h-10 w-10"
              }`}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
