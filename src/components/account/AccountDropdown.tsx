"use client";

import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, Settings, UserRound, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ADMIN_SESSION_KEY } from "@/lib/auth/constants";

type AccountItem = [string, string, LucideIcon];

const accountItems: AccountItem[] = [
  ["Profile", "/profile", UserRound],
  ["Dashboard", "/admin", LayoutDashboard],
  ["Settings", "/profile#settings", Settings],
];

export default function AccountDropdown() {
  const [authenticated, setAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      setAuthenticated(sessionStorage.getItem(ADMIN_SESSION_KEY) === "true");
    };

    const handleOutsideClick = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    sync();

    window.addEventListener("DevX-auth-change", sync);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("DevX-auth-change", sync);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  if (!authenticated) {
    return (
      <Link
        href="/login"
        className="hidden sm:inline-flex px-8 py-3.5 rounded-full bg-brand text-lg font-semibold text-white text-center hover:bg-brand transition-colors duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
      >
        Login
      </Link>
    );
  }

  const logout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    window.dispatchEvent(new Event("DevX-auth-change"));
    window.location.assign("/");
  };

  return (
    <div ref={root} className="relative hidden lg:block">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-white/70 bg-transparent py-1.5 pl-1.5 pr-3 text-base font-bold text-slate-900 shadow-sm backdrop-blur-xl transition hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/[0.12] dark:text-white dark:focus-visible:ring-cyan-300 dark:focus-visible:ring-offset-slate-950"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-sky-400 text-xs text-white">
          FM
        </span>
        <span>Account</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-72 rounded-2xl border border-white/70 bg-transparent p-2 text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.16)] ring-1 ring-slate-950/[0.05] backdrop-blur-3xl dark:border-white/[0.16] dark:text-white dark:shadow-[0_28px_90px_rgba(2,6,23,0.55)] dark:ring-white/[0.06]"
        >
          <div className="p-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-sky-400 font-bold text-white">
                FM
              </span>
              <div>
                <p className="font-bold">Faysal Mushtaq</p>
                <p className="text-xs text-slate-500 dark:text-white/55">ceo@DevX.com</p>
              </div>
            </div>
            <span className="mt-3 inline-block rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600">
              CEO • Super Admin
            </span>
          </div>

          <div className="my-1 border-t border-slate-950/10 dark:border-white/10" />

          {accountItems.map(([label, href, Icon]) => (
            <Link
              key={href}
              role="menuitem"
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-base font-medium text-slate-700 transition hover:bg-slate-950/[0.05] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-white dark:hover:bg-white/[0.08] dark:focus-visible:ring-cyan-300"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}

          <div className="my-1 border-t border-slate-950/10 dark:border-white/10" />

          <button
            role="menuitem"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-base font-bold text-rose-500 transition hover:bg-rose-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
