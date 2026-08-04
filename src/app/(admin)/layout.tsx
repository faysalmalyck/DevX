"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/contexts/SessionContext";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar, { type AdminArea } from "@/components/admin/AdminSidebar";
import { Menu, X, LogOut, Settings, Moon, Sun, ShieldCheck, Users, Building2, KeyRound, ClipboardList, LayoutDashboard } from "lucide-react";
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
      <div className="flex min-h-screen items-center justify-center bg-[#181d2b] text-white">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-primary border-white/10 mx-auto"></div>
          <p className="text-zinc-400 font-medium">Securing operator workspace...</p>
        </div>
      </div>
    );
  }

  if (!user || user.userType !== "admin") {
    return null;
  }

  // Derive active sidebar key from pathname
  let activeKey: AdminArea = "dashboard";
  if (pathname.includes("/admin/team")) activeKey = "team";
  else if (pathname.includes("/admin/clients")) activeKey = "clients";
  else if (pathname.includes("/admin/administration/admins")) activeKey = "admins";
  else if (pathname.includes("/admin/administration/roles")) activeKey = "roles";
  else if (pathname.includes("/admin/administration/permissions")) activeKey = "permissions";
  else if (pathname.includes("/admin/administration/activity")) activeKey = "activity";
  else if (pathname.includes("/admin/administration/sessions")) activeKey = "sessions";
  else if (pathname.includes("/admin/admin/profile")) activeKey = "profile";
  else if (pathname.includes("/admin/admin/security")) activeKey = "security";

  return (
    <div className="flex min-h-screen bg-[#181d2b] text-white">
      {/* Desktop Sidebar */}
      <AdminSidebar active={activeKey} />

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/80 backdrop-blur-sm">
          <div className="relative w-64 bg-[#181d2b] p-5 border-r border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <Link href="/admin" className="text-2xl font-black text-white">
                  DevX<span className="text-primary">.</span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <AdminSidebarNav active={activeKey} onNavItemClick={() => setMobileMenuOpen(false)} />
            </div>
            <div className="border-t border-white/5 pt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary">
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    user.firstName[0]
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-zinc-500 truncate">{user.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/admin/admin/security"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex justify-center items-center gap-2 rounded-xl py-2 text-xs font-semibold border border-white/10 bg-black/20 text-zinc-400"
                >
                  <Settings className="h-4 w-4" />
                  Security
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-white/5 px-6 bg-[#181d2b] backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="text-zinc-400 hover:text-white md:hidden cursor-pointer">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold tracking-tight md:text-xl capitalize">
              {activeKey === "dashboard" ? "System Overview" : `${activeKey.replace("-", " ")}`}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white transition cursor-pointer"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link
              href="/admin/admin/security"
              className={`rounded-lg p-2 transition hover:bg-white/5 ${
                activeKey === "security" ? "text-primary bg-primary/10" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Settings className="h-5 w-5" />
            </Link>

            <div className="h-6 w-px bg-white/5" />

            <div className="flex items-center gap-3">
              <Link href="/admin/admin/profile" className="flex items-center gap-2 group">
                <div className="h-9 w-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary transition group-hover:scale-105">
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    user.firstName[0]
                  )}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold leading-tight group-hover:text-primary transition">{user.firstName} {user.lastName}</p>
                  <p className="text-[10px] text-zinc-500 leading-none">{user.role}</p>
                </div>
              </Link>
              <button
                onClick={logout}
                className="rounded-lg p-2 text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#181d2b]">
          {children}
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
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
              isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
