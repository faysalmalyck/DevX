"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/contexts/SessionContext";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar, { type AdminArea } from "@/components/admin/AdminSidebar";
import {
  Menu,
  X,
  LogOut,
  Settings,
  Moon,
  Sun,
  ShieldCheck,
  Users,
  Building2,
  KeyRound,
  ClipboardList,
  BriefcaseBusiness,
  LayoutDashboard,
  Search,
  Bell,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!isLoading && (!user || user.userType !== "admin")) {
      router.push("/login?portal=admin");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#0B0F19]">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-white/10 dark:border-t-blue-500" />
          <p className="font-medium text-slate-500 dark:text-zinc-400">
            Securing operator workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.userType !== "admin") {
    return null;
  }

  let activeKey: AdminArea = "dashboard";
  let pageTitle = "System Overview";
  
  if (pathname.includes("/admin/team")) { activeKey = "team"; pageTitle = "Manage Team"; }
  else if (pathname.includes("/admin/clients")) { activeKey = "clients"; pageTitle = "Manage Clients"; }
  else if (pathname.includes("/admin/careers")) { activeKey = "careers"; pageTitle = "Career Management"; }
  else if (pathname.includes("/admin/applications")) { activeKey = "applications"; pageTitle = "Applications"; }
  else if (pathname.includes("/admin/administration/admins")) { activeKey = "admins"; pageTitle = "Administrators"; }
  else if (pathname.includes("/admin/administration/roles")) { activeKey = "roles"; pageTitle = "Roles"; }
  else if (pathname.includes("/admin/administration/permissions")) { activeKey = "permissions"; pageTitle = "Permissions"; }
  else if (pathname.includes("/admin/administration/activity")) { activeKey = "activity"; pageTitle = "Activity Logs"; }
  else if (pathname.includes("/admin/administration/sessions")) { activeKey = "sessions"; pageTitle = "Login Sessions"; }
  else if (pathname.includes("/admin/admin/profile")) { activeKey = "profile"; pageTitle = "Profile"; }
  else if (pathname.includes("/admin/admin/security")) { activeKey = "security"; pageTitle = "Security Settings"; }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#0B0F19] dark:text-white">
      {/* Desktop Sidebar */}
      <AdminSidebar active={activeKey} />

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex bg-slate-950/60 backdrop-blur-sm lg:hidden">
          <div className="relative flex w-[280px] max-w-[80vw] flex-col justify-between border-r border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-[#111827]">
            <div>
              <div className="mb-8 flex items-center justify-between">
                <Link href="/admin" className="text-2xl font-black text-slate-900 dark:text-white">
                  DevX  <span className="text-blue-600 dark:text-blue-500">.</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <AdminSidebarNav active={activeKey} onNavItemClick={() => setMobileMenuOpen(false)} />
            </div>
            
            <div className="mt-8 space-y-4 border-t border-slate-200 pt-6 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-sm font-bold text-blue-600 shadow-sm dark:border-zinc-800 dark:bg-blue-500/20 dark:text-blue-400">
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    user.firstName[0]
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user.firstName} {user.lastName}</p>
                  <p className="truncate text-xs font-medium text-slate-500 dark:text-zinc-500">{user.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/admin/admin/security"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <Settings className="h-4 w-4" />
                  Security
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-[#0B0F19]">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-[#111827]/80 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Breadcrumb Navigation */}
            <nav className="hidden items-center gap-2 text-sm font-medium sm:flex">
              <Link href="/admin" className="text-slate-500 transition hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white">
                Admin
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-400 dark:text-zinc-600" />
              <span className="text-slate-900 dark:text-white">{pageTitle}</span>
            </nav>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white sm:hidden">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Global Search */}
            <div className="hidden lg:block relative group">
               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
               </div>
               <input 
                  type="text" 
                  placeholder="Search resources..." 
                  className="w-64 rounded-full border border-slate-200 bg-slate-100 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:w-72 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-zinc-900/50 dark:focus:bg-[#111827]"
               />
               <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-500">⌘K</span>
               </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                className="relative rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#111827]"></span>
              </button>

              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>

            <div className="hidden h-6 w-px bg-slate-200 dark:bg-white/10 sm:block" />

            <div className="hidden sm:flex items-center gap-3">
              <Link href="/admin/admin/profile" className="group flex items-center gap-3 rounded-full py-1 pl-1 pr-3 transition hover:bg-slate-100 dark:hover:bg-white/5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-xs font-bold text-blue-600 shadow-sm transition group-hover:scale-105 dark:border-zinc-800 dark:bg-blue-500/20 dark:text-blue-400">
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    user.firstName[0]
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold leading-tight text-slate-900 transition dark:text-white">
                    {user.firstName}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Content body - scrollable area */}
        <main className="relative flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 transition-colors duration-300 dark:bg-[#0B0F19]">
          <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Sidebar navigation for mobile menu
function AdminSidebarNav({ active, onNavItemClick }: { active: string; onNavItemClick?: () => void }) {
  const sidebarItems = [
    { label: "Dashboard", href: "/admin", key: "dashboard", icon: LayoutDashboard },
    { label: "Manage Team", href: "/admin/team", key: "team", icon: Users },
    { label: "Manage Clients", href: "/admin/clients", key: "clients", icon: Building2 },
    { label: "Careers", href: "/admin/careers", key: "careers", icon: BriefcaseBusiness },
    { label: "Applications", href: "/admin/applications", key: "applications", icon: ClipboardList },
    { label: "Administrators", href: "/admin/administration/admins", key: "admins", icon: Users },
    { label: "Roles", href: "/admin/administration/roles", key: "roles", icon: ShieldCheck },
    { label: "Permissions", href: "/admin/administration/permissions", key: "permissions", icon: KeyRound },
    { label: "Activity Logs", href: "/admin/administration/activity", key: "activity", icon: ClipboardList },
    { label: "Login Sessions", href: "/admin/administration/sessions", key: "sessions", icon: KeyRound },
  ];

  return (
    <nav className="space-y-1">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.key;
        return (
          <Link
            key={item.key}
            href={item.href}
            onClick={onNavItemClick}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
