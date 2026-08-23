"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { ChevronRight, Globe2, Menu, Moon, Sun, X } from "lucide-react";
import { useSession } from "@/contexts/SessionContext";
import AdminBrandLogo from "@/components/admin/AdminBrandLogo";
import AdminSidebar, { AdminSidebarAccount, AdminSidebarNav } from "@/components/admin/AdminSidebar";
import { getAdminRouteInfo } from "@/components/admin/admin-navigation";

function operatorInitials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.trim().toUpperCase() || "OP";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileDrawerRef = useRef<HTMLElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.userType !== "admin")) {
      router.replace("/login?portal=admin");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    lastFocusedElement.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const drawer = mobileDrawerRef.current;
      if (!drawer) return;

      const focusable = Array.from(drawer.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter((element) => !element.hasAttribute("disabled"));

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyboard);
    requestAnimationFrame(() => mobileDrawerRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyboard);
      lastFocusedElement.current?.focus();
      lastFocusedElement.current = null;
    };
  }, [mobileMenuOpen]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F8FC] px-6 dark:bg-[#090E19]">
        <div className="text-center">
          <div className="mx-auto flex h-14 items-center justify-center">
            <AdminBrandLogo surface="light" className="h-10 w-auto dark:hidden" />
            <AdminBrandLogo surface="dark" className="hidden h-10 w-auto dark:block" />
          </div>
          <div className="mx-auto mt-5 h-1.5 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-brand" />
          </div>
          <p className="mt-3 text-base font-medium text-slate-500 dark:text-slate-400">Opening your operations workspace…</p>
        </div>
      </div>
    );
  }

  if (!user || user.userType !== "admin") return null;

  const currentRoute = getAdminRouteInfo(pathname);
  const activeKey = currentRoute.key;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F6F8FC] text-slate-900 dark:bg-[#090E19] dark:text-white">
      <AdminSidebar active={activeKey} />

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm lg:hidden" onMouseDown={() => setMobileMenuOpen(false)}>
          <aside
            ref={mobileDrawerRef}
            id="admin-mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            tabIndex={-1}
            onMouseDown={(event) => event.stopPropagation()}
            className="flex h-full w-[min(22rem,88vw)] flex-col overflow-hidden border-r border-white/[0.08] bg-[#0B1120] text-white shadow-2xl outline-none"
          >
            <div className="flex min-h-[72px] items-center justify-between border-b border-white/[0.08] px-5">
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3" aria-label="DevX operations home">
                <AdminBrandLogo surface="dark" alt="" className="h-8 w-auto shrink-0" />
                <span>
                  <span className="block text-base font-black tracking-tight">Operations</span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">Control workspace</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-6">
              <AdminSidebarNav active={activeKey} onNavigate={() => setMobileMenuOpen(false)} />
            </div>
            <AdminSidebarAccount active={activeKey} onNavigate={() => setMobileMenuOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-30 flex h-[72px] shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#0C1220]/80 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation"
              aria-controls="admin-mobile-navigation"
              aria-expanded={mobileMenuOpen}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <nav className="hidden items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 sm:flex" aria-label="Breadcrumb">
                <Link href="/admin" className="transition hover:text-brand dark:hover:text-brand">Operations</Link>
                <ChevronRight className="h-3.5 w-3.5 text-white dark:text-slate-600" />
                <span className="truncate text-slate-700 dark:text-white">{currentRoute.label}</span>
              </nav>
              <h1 className="truncate text-base font-bold tracking-tight text-slate-900 dark:text-white sm:mt-0.5 sm:text-lg">{currentRoute.label}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="hidden h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] sm:inline-flex"
            >
              <Globe2 className="h-4 w-4" />
              View site
            </Link>
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
            >
              {resolvedTheme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
            <Link
              href="/admin/profile"
              aria-label="Open my profile"
              className="group flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition hover:bg-slate-100 dark:hover:bg-white/[0.06] sm:pr-3"
            >
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-400 to-violet-500 text-[10px] font-black text-white shadow-sm">
                {user.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : operatorInitials(user.firstName, user.lastName)}
              </span>
              <span className="hidden max-w-28 truncate text-base font-bold text-slate-700 dark:text-white sm:block">{user.firstName}</span>
            </Link>
          </div>
        </header>

        <main className="relative flex-1 overflow-x-hidden overflow-y-auto bg-[#F6F8FC] dark:bg-[#090E19]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_25%_-15%,rgba(54,88,255,0.1),transparent_42%),radial-gradient(circle_at_90%_0%,rgba(139,92,246,0.08),transparent_30%)] dark:bg-[radial-gradient(circle_at_25%_-15%,rgba(54,88,255,0.13),transparent_42%),radial-gradient(circle_at_90%_0%,rgba(139,92,246,0.1),transparent_30%)]" />
          <div className="relative mx-auto w-full max-w-[1440px] p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
