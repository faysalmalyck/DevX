"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/contexts/SessionContext";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, User, HelpCircle, Activity, Heart, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!isLoading && (!user || user.userType !== "user")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090e1a] text-white">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-primary border-white/10 mx-auto"></div>
          <p className="text-zinc-400 font-medium">Loading your client workspace...</p>
        </div>
      </div>
    );
  }

  if (!user || user.userType !== "user") {
    return null;
  }

  // Derive active sidebar key
  let activeKey = "dashboard";
  if (pathname.includes("/account/profile")) activeKey = "profile";
  else if (pathname.includes("/account/activities")) activeKey = "activities";
  else if (pathname.includes("/account/services")) activeKey = "services";
  else if (pathname.includes("/account/support")) activeKey = "support";
  else if (pathname.includes("/account/notifications")) activeKey = "notifications";

  return (
    <div className="flex min-h-screen bg-[#181d2b] text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-white/5 bg-[#181d2b] p-5 md:flex">
        <div>
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="text-2xl font-black tracking-tight text-white">
              DevX<span className="text-primary">.</span>
            </Link>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 uppercase">
              Portal
            </span>
          </div>

          <nav className="space-y-1">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[.15em] text-zinc-500">Client Hub</p>
            <UserSidebarNav active={activeKey} />
          </nav>
        </div>

        <div className="border-t border-white/5 pt-4 space-y-4">
          <Link href="/account/profile" className="flex items-center gap-3 group px-2 py-1.5 rounded-xl hover:bg-white/5 transition">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400">
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="h-full w-full rounded-full object-cover" />
              ) : (
                user.firstName[0]
              )}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-tight group-hover:text-primary transition">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-zinc-500 truncate leading-none">{user.role}</p>
            </div>
          </Link>

          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-500 hover:text-white transition duration-200 cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/80 backdrop-blur-sm">
          <div className="relative w-64 bg-[#181d2b] p-5 border-r border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <Link href="/account" className="text-2xl font-black text-white">
                  DevX<span className="text-primary">.</span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <UserSidebarNav active={activeKey} onNavItemClick={() => setMobileMenuOpen(false)} />
            </div>
            <div className="border-t border-white/5 pt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400">
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
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 py-2.5 text-xs font-bold text-rose-500 cursor-pointer"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-white/5 px-6 bg-[#181d2b] backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="text-zinc-400 hover:text-white md:hidden cursor-pointer">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold tracking-tight md:text-xl capitalize">
              {activeKey === "dashboard" ? "Client Workspace" : `${activeKey}`}
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
              href="/account/notifications"
              className={`rounded-lg p-2 transition hover:bg-white/5 ${
                activeKey === "notifications" ? "text-primary bg-primary/10" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Bell className="h-5 w-5" />
            </Link>

            <div className="h-6 w-px bg-white/5" />

            <Link href="/account/profile" className="flex items-center gap-2 group">
              <div className="h-9 w-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 transition group-hover:scale-105">
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

// User Portal navigation list
function UserSidebarNav({ active, onNavItemClick }: { active: string; onNavItemClick?: () => void }) {
  const sidebarItems = [
    { label: "Dashboard", href: "/account", key: "dashboard", icon: LayoutDashboard },
    { label: "My Profile", href: "/account/profile", key: "profile", icon: User },
    { label: "Planned Activities", href: "/account/activities", key: "activities", icon: Activity },
    { label: "Solutions & Services", href: "/account/services", key: "services", icon: Heart },
    { label: "Support Tickets", href: "/account/support", key: "support", icon: HelpCircle },
    { label: "Notifications", href: "/account/notifications", key: "notifications", icon: Bell },
  ];

  return (
    <div className="space-y-1">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.key;
        return (
          <Link
            key={item.key}
            href={item.href}
            onClick={onNavItemClick}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition duration-200 ${
              isActive
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
