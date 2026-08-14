"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, LogOut, ShieldCheck } from "lucide-react";
import { useSession } from "@/contexts/SessionContext";
import {
  adminAccountNavigation,
  adminNavigationSections,
  type AdminArea,
} from "./admin-navigation";

export type { AdminArea } from "./admin-navigation";

type SidebarNavigationProps = {
  active: AdminArea;
  collapsed?: boolean;
  onNavigate?: () => void;
  className?: string;
};

function operatorInitials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.trim().toUpperCase() || "OP";
}

export function AdminSidebarNav({ active, collapsed = false, onNavigate, className = "" }: SidebarNavigationProps) {
  return (
    <nav aria-label="Admin navigation" className={`space-y-6 ${className}`}>
      {adminNavigationSections.map((section, sectionIndex) => (
        <div key={section.label}>
          {collapsed ? (
            sectionIndex > 0 ? <div className="mx-auto mb-3 h-px w-8 bg-white/10" /> : null
          ) : (
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              {section.label}
            </p>
          )}
          <div className="space-y-1">
            {section.items.map(({ label, href, key, icon: Icon }) => {
              const isActive = active === key;

              return (
                <Link
                  key={key}
                  href={href}
                  title={collapsed ? label : undefined}
                  aria-current={isActive ? "page" : undefined}
                  onClick={onNavigate}
                  className={`group relative flex min-h-11 items-center rounded-lg text-base font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-brand/25 to-violet-500/20 text-white shadow-[0_10px_24px_rgba(54,88,255,0.18)]"
                      : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                  } ${collapsed ? "justify-center px-2" : "gap-3 px-3"}`}
                >
                  {isActive ? <span className="absolute left-0 h-5 w-0.5 rounded-r-full bg-cyan-300" /> : null}
                  <Icon className={`h-4.5 w-4.5 shrink-0 transition-transform duration-200 ${isActive ? "text-cyan-200" : "group-hover:scale-110 group-hover:text-white"}`} />
                  {collapsed ? null : <span className="truncate">{label}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function AdminSidebarAccount({ active, collapsed = false, onNavigate }: Omit<SidebarNavigationProps, "className">) {
  const { user, logout } = useSession();
  const profile = adminAccountNavigation[0];
  const security = adminAccountNavigation[1];

  if (!user) return null;

  const signOut = () => {
    onNavigate?.();
    void logout();
  };

  return (
    <div className={`border-t border-white/[0.08] ${collapsed ? "p-3" : "p-4"}`}>
      <Link
        href={profile.href}
        title={collapsed ? profile.label : undefined}
        onClick={onNavigate}
        className={`group flex items-center rounded-lg transition ${
          active === "profile" ? "bg-white/[0.09]" : "hover:bg-white/[0.06]"
        } ${collapsed ? "justify-center p-2" : "gap-3 p-2"}`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-400 to-violet-500 text-xs font-black text-white shadow-lg shadow-blue-950/30">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            operatorInitials(user.firstName, user.lastName)
          )}
        </div>
        {collapsed ? null : (
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-white">{user.firstName} {user.lastName}</p>
            <p className="truncate text-xs text-slate-500">{user.role}</p>
          </div>
        )}
      </Link>

      <div className={`mt-3 flex ${collapsed ? "flex-col items-center gap-2" : "gap-2"}`}>
        <Link
          href={security.href}
          title={security.label}
          aria-current={active === "security" ? "page" : undefined}
          onClick={onNavigate}
          className={`flex h-10 items-center justify-center rounded-lg text-xs font-bold transition ${
            active === "security"
              ? "bg-brand text-white shadow-lg shadow-blue-950/30"
              : "bg-white/[0.06] text-white hover:bg-white/[0.1] hover:text-white"
          } ${collapsed ? "w-10" : "flex-1 gap-2"}`}
        >
          <ShieldCheck className="h-4 w-4" />
          {collapsed ? null : "Security"}
        </Link>
        <button
          type="button"
          onClick={signOut}
          title="Sign out"
          aria-label="Sign out"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-100"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar({ active }: { active: AdminArea }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem("devx_sidebar_collapsed") === "true");
  }, []);

  const toggleCollapse = () => {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem("devx_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <aside
      className={`relative z-40 hidden h-screen shrink-0 flex-col border-r border-white/[0.08] bg-[#0B1120] text-white transition-[width] duration-300 lg:flex ${
        collapsed ? "w-[84px]" : "w-[280px]"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_20%_0%,rgba(54,88,255,0.28),transparent_48%),radial-gradient(circle_at_100%_30%,rgba(139,92,246,0.2),transparent_42%)]" />
      <div className="relative flex min-h-[72px] items-center border-b border-white/[0.08] px-4">
        <Link href="/admin" className={`flex min-w-0 items-center ${collapsed ? "mx-auto" : "gap-3"}`} aria-label="DevX operations home">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 via-brand to-violet-500 text-base font-black tracking-tight text-white shadow-lg shadow-blue-950/30">
            DX
          </span>
          {collapsed ? null : (
            <span className="min-w-0">
              <span className="block truncate text-base font-black tracking-tight text-white">DevX Operations</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">Control workspace</span>
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={toggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-[26px] flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#141c2f] text-slate-400 shadow-lg transition hover:bg-[#1c2740] hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="relative flex-1 overflow-y-auto px-3 py-6">
        <AdminSidebarNav active={active} collapsed={collapsed} />
      </div>

      <div className="relative">
        <AdminSidebarAccount active={active} collapsed={collapsed} />
      </div>
    </aside>
  );
}
