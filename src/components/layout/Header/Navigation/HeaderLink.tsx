"use client";

import { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeaderItem } from '../../../../types/menu';

const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const path = usePathname();
  const submenuId = useId();

  const itemPath = (item.href || '').split("#")[0];
  const isActive =
    path === itemPath ||
    (item.submenu?.some((subItem) => path === (subItem.href || '').split("#")[0]) ?? false);

  const handleMouseEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (item.submenu) {
      setSubmenuOpen(true);
    }
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setSubmenuOpen(false);
    }, 120);
  };

  const handleFocus = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    if (item.submenu) {
      setSubmenuOpen(true);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // Only close if focus moves completely outside the wrapper div
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setSubmenuOpen(false);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setSubmenuOpen(false);
        }
      }}
    >
      <Link
        href={item.href}
        aria-expanded={item.submenu ? submenuOpen : undefined}
        aria-haspopup={item.submenu ? "true" : undefined}
        aria-controls={item.submenu ? submenuId : undefined}
        className={`group flex items-center gap-1 whitespace-nowrap rounded-lg py-2 text-sm font-semibold no-underline transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-cyan-300 dark:focus-visible:ring-offset-slate-950 ${
          isActive
            ? "text-brand dark:text-brand"
            : "text-current hover:text-brand dark:hover:text-brand"
        }`}
      >
        <span>{item.label}</span>
        {item.submenu && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.25em"
            height="1.25em"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`shrink-0 transition-all duration-200 ${
              submenuOpen
                ? "rotate-180 text-cyan-600 dark:text-cyan-300"
                : "opacity-70 group-hover:text-cyan-600 group-hover:opacity-100 dark:group-hover:text-cyan-300"
            }`}
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="m7 10l5 5l5-5"
            />
          </svg>
        )}
      </Link>

      {submenuOpen && item.submenu && (
        <div className="absolute left-1/2 top-full z-50 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-3">
          <div
            id={submenuId}
            className="relative max-h-[70vh] overflow-y-auto overflow-x-hidden rounded-2xl border border-white/70 bg-transparent p-2.5 shadow-[0_24px_80px_rgba(15,23,42,0.16)] ring-1 ring-slate-950/[0.05] backdrop-blur-3xl animate-reveal-up dark:border-white/[0.16] dark:shadow-[0_28px_90px_rgba(2,6,23,0.55)] dark:ring-white/[0.06]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-slate-950/20 to-transparent dark:via-white/50"
            />

            <div className="relative space-y-1">
              {item.submenu.map((subItem, index) => {
                const isSubActive = path === (subItem.href || '').split("#")[0];

                return (
                  <Link
                    key={`${subItem.href}-${index}`}
                    href={subItem.href}
                    className={`group flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium no-underline transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-cyan-300 dark:focus-visible:ring-offset-slate-950 ${
                      isSubActive
                        ? "border-brand/20 bg-gradient-to-r from-brand/15 via-violet-500/10 to-cyan-400/10 font-semibold text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-blue-400/25 dark:from-brand/25 dark:via-violet-500/15 dark:to-cyan-400/10 dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                        : "border-transparent text-slate-700 hover:border-slate-950/10 hover:bg-slate-950/[0.05] hover:text-slate-950 dark:text-slate-200 dark:hover:border-white/10 dark:hover:bg-white/[0.08] dark:hover:text-white"
                    }`}
                  >
                    <span>{subItem.label}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                      className={`h-4 w-4 transition-all duration-200 ${
                        isSubActive
                          ? "translate-x-0 text-cyan-700 dark:text-cyan-200"
                          : "-translate-x-1 text-slate-500 opacity-0 group-hover:translate-x-0 group-hover:text-cyan-700 group-hover:opacity-100 dark:text-slate-500 dark:group-hover:text-cyan-200"
                      }`}
                    >
                      <path d="M5 12h14m-6-6 6 6-6 6" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderLink;
