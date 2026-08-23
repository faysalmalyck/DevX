"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  ShieldCheck,
  UsersRound,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import AdminBrandLogo from "@/components/admin/AdminBrandLogo";

type SalesShellProps = {
  children: React.ReactNode;
  user: {
    firstName: string;
    lastName: string;
    avatar: string | null;
    role: string;
  };
  canManage: boolean;
};

type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  managerOnly?: boolean;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/sales", icon: LayoutDashboard },
  { label: "My Leads", href: "/sales/leads", icon: ClipboardList },
  { label: "Pipeline", href: "/sales/pipeline", icon: ListChecks },
  { label: "Follow-ups", href: "/sales/follow-ups", icon: BarChart3 },
  { label: "Profile", href: "/sales/profile", icon: UserRound },
  { label: "Security", href: "/sales/security", icon: ShieldCheck },
  { label: "Sales Team", href: "/sales/team", icon: UsersRound, managerOnly: true },
];

function initials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.trim().toUpperCase() || "DX";
}

export default function SalesShell({ children, user, canManage }: SalesShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const visibleNav = navItems.filter((item) => !item.managerOnly || canManage);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    } finally {
      router.replace("/login?portal=sales&returnTo=/sales");
      router.refresh();
    }
  };

  const navigation = (mobile = false) => (
    <nav aria-label="Sales portal navigation" className="space-y-1">
      {visibleNav.map((item) => {
        const Icon = item.icon;
        const active = item.href === "/sales"
          ? pathname === "/sales"
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => mobile && setMobileOpen(false)}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition ${
              active
                ? "bg-gradient-to-r from-brand/25 to-violet-500/20 text-white shadow-lg shadow-brand/10"
                : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
            }`}
          >
            <Icon className={`h-4.5 w-4.5 ${active ? "text-cyan-200" : ""}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#090E19] text-white">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-[270px] shrink-0 flex-col border-r border-white/[0.08] bg-[#0B1120] lg:flex">
          <div className="border-b border-white/[0.08] px-5 py-5">
            <Link href="/sales" className="flex items-center gap-3" aria-label="DevX sales portal home">
              <AdminBrandLogo surface={resolvedTheme === "light" ? "light" : "dark"} alt="DevX logo" className="h-9 w-auto max-w-[150px]" />
              <span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">Revenue workspace</span>
              </span>
            </Link>
          </div>
          <div className="flex-1 px-3 py-6">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Sales workspace</p>
            {navigation()}
          </div>
          <div className="border-t border-white/[0.08] p-4">
            <Link href="/sales/profile" aria-label="Open sales profile" className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-white/[0.06]">
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-400 to-violet-500 text-xs font-black">
                {user.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : initials(user.firstName, user.lastName)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">{user.firstName} {user.lastName}</span>
                <span className="block truncate text-xs text-slate-500">{user.role}</span>
              </span>
            </Link>
            <div className="mt-3 flex gap-2">
              <Link href="/sales/security" className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2.5 text-xs font-bold transition hover:bg-white/[0.11]">
                <ShieldCheck className="h-4 w-4" /> Security
              </Link>
              <button type="button" onClick={logout} aria-label="Log out" className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-100">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-[100] bg-slate-950/75 backdrop-blur-sm lg:hidden" onMouseDown={() => setMobileOpen(false)}>
            <aside className="h-full w-[min(20rem,86vw)] border-r border-white/[0.08] bg-[#0B1120] p-4 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
              <div className="mb-6 flex items-center justify-between">
                <Link href="/sales" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-base font-black">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand">DX</span> DevX Sales
                </Link>
                <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close sales navigation" className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.08] hover:text-white"><X className="h-5 w-5" /></button>
              </div>
              {navigation(true)}
            </aside>
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-white/[0.08] bg-[#0C1220]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open sales navigation" className="rounded-lg border border-white/[0.1] p-2 text-slate-300 lg:hidden"><Menu className="h-5 w-5" /></button>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/70">Sales portal</p>
                <h1 className="text-base font-bold sm:text-lg">{pathname === "/sales" ? "Sales overview" : pathname.split("/").filter(Boolean).at(-1)?.replace(/-/g, " ")}</h1>
              </div>
            </div>
            <Link href="/" className="rounded-lg border border-white/[0.1] px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/[0.06]">View site</Link>
          </header>
          <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
