"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HeaderItem, MegaMenuSection, SubmenuItem } from "@/types/menu";
import {
  isNavigationHrefActive,
  isNavigationParentActive,
  splitNavigationHref,
  useLocationHash,
} from "@/components/layout/Header/Navigation/navigationState";

function ArrowIcon({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

type MegaMenuLinkProps = {
  item: SubmenuItem;
  section: MegaMenuSection;
  isActive: boolean;
};

function MegaMenuLink({ item, section, isActive }: MegaMenuLinkProps) {
  const { hash: itemHash } = splitNavigationHref(item.href);
  const isPricing = section.featured;
  const isCardLayout = section.layout === "cards";

  return (
    <li>
      <Link
        href={item.href}
        aria-current={isActive ? (itemHash ? "location" : "page") : undefined}
        className={`group flex w-full items-start justify-between gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium no-underline transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-cyan-300 dark:focus-visible:ring-offset-[#1a2031] ${
          isPricing
            ? "border-brand/25 bg-brand/10 text-brand hover:-translate-y-0.5 hover:border-brand/45 hover:bg-brand/15 dark:border-blue-400/30 dark:bg-brand/20 dark:text-white dark:hover:border-blue-400/50 dark:hover:bg-brand/25"
            : isCardLayout
              ? isActive
                ? "border-brand/30 bg-brand/10 font-semibold text-brand shadow-sm dark:border-blue-400/35 dark:bg-brand/20 dark:text-white"
                : "h-full border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md dark:border-slate-600 dark:bg-[#1e2538] dark:text-white dark:hover:border-blue-400/50"
            : isActive
              ? "border-brand/25 bg-brand/10 font-semibold text-brand dark:border-blue-400/30 dark:bg-brand/20 dark:text-white"
              : "border-transparent text-slate-700 hover:border-slate-950/10 hover:bg-slate-950/[0.05] hover:text-brand dark:text-slate-200 dark:hover:border-white/10 dark:hover:bg-white/[0.08] dark:hover:text-white"
        }`}
      >
        <span className="min-w-0">
          <span className="block">{item.label}</span>
          {item.description ? (
            <span className="mt-1 block text-xs font-normal leading-5 text-slate-500 dark:text-slate-300">
              {item.description}
            </span>
          ) : null}
        </span>
        <ArrowIcon
          className={`mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200 ${
            isPricing || isActive || isCardLayout
              ? "text-current"
              : "-translate-x-1 text-slate-400 opacity-0 group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100 dark:text-slate-500 dark:group-hover:text-cyan-200"
          }`}
        />
      </Link>
    </li>
  );
}

const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const path = usePathname();
  const hash = useLocationHash();
  const submenuId = useId();
  const hasMegaMenu = Boolean(item.megaMenu);
  const hasSubmenu = Boolean(item.submenu || item.megaMenu);
  const isActive = isNavigationParentActive(item, path);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
  );

  useEffect(() => {
    setSubmenuOpen(false);
  }, [path]);

  const openSubmenu = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    if (hasSubmenu) setSubmenuOpen(true);
  };

  const closeSubmenu = () => {
    if (!hasSubmenu) return;

    closeTimer.current = setTimeout(() => {
      setSubmenuOpen(false);
    }, 120);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setSubmenuOpen(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!hasSubmenu) return;

    if (event.key === "Escape") {
      event.preventDefault();
      triggerRef.current?.focus();
      setSubmenuOpen(false);
      return;
    }

    if (hasMegaMenu && event.key === "ArrowDown") {
      event.preventDefault();
      openSubmenu();
      window.requestAnimationFrame(() => {
        document
          .getElementById(submenuId)
          ?.querySelector<HTMLAnchorElement>('a[href]')
          ?.focus();
      });
    }
  };

  const triggerClassName = `group flex items-center gap-1 whitespace-nowrap rounded-lg py-2 text-lg font-semibold no-underline transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-cyan-300 dark:focus-visible:ring-offset-slate-950 ${
    isActive
      ? "text-brand dark:text-brand"
      : "text-current hover:text-brand dark:hover:text-brand"
  }`;

  return (
    <div
      className="relative"
      onMouseEnter={openSubmenu}
      onMouseLeave={closeSubmenu}
      onFocus={openSubmenu}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      {hasMegaMenu ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setSubmenuOpen((isOpen) => !isOpen)}
          aria-expanded={submenuOpen}
          aria-haspopup="true"
          aria-controls={submenuId}
          className={triggerClassName}
        >
          <span>{item.label}</span>
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
              d="m7 10l5 5 5-5"
            />
          </svg>
        </button>
      ) : (
        <Link
          href={item.href}
          aria-expanded={item.submenu ? submenuOpen : undefined}
          aria-haspopup={item.submenu ? "true" : undefined}
          aria-controls={item.submenu ? submenuId : undefined}
          aria-current={isActive ? "page" : undefined}
          className={triggerClassName}
        >
          <span>{item.label}</span>
          {item.submenu ? (
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
                d="m7 10l5 5 5-5"
              />
            </svg>
          ) : null}
        </Link>
      )}

      {hasMegaMenu && item.megaMenu ? (
        <div
          className={`absolute left-1/2 top-full z-50 ${
            item.megaMenu.layout === "two-columns"
              ? "w-[min(46rem,calc(100vw-2rem))]"
              : "w-[min(58rem,calc(100vw-2rem))]"
          } -translate-x-1/2 pt-3 transition-all duration-200 ease-out ${
            submenuOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          <div
            id={submenuId}
            aria-label={`${item.label} navigation`}
            aria-hidden={!submenuOpen}
            inert={!submenuOpen}
            className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-xl transition-colors duration-300 dark:border-slate-600/80 dark:bg-[linear-gradient(to_bottom,#262d43,#1a2031)] dark:shadow-2xl"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent"
            />

            <div className={`relative grid grid-cols-1 ${
              item.megaMenu.layout === "columns"
                ? "lg:grid-cols-[1.45fr_1fr_0.8fr]"
                : item.megaMenu.layout === "two-columns"
                  ? "lg:grid-cols-[1.45fr_1fr]"
                  : ""
            }`}>
              {item.megaMenu.sections.map((section, index) => (
                <section
                  key={section.id}
                  aria-labelledby={`${submenuId}-${section.id}`}
                  className={`p-5 sm:p-6 ${
                    index > 0
                      ? `border-t border-slate-200 dark:border-slate-600/80 ${
                          item.megaMenu?.layout !== "stacked"
                            ? "lg:border-l lg:border-t-0"
                            : ""
                        }`
                      : ""
                  } ${section.featured ? "bg-brand/[0.04] dark:bg-brand/[0.08]" : ""}`}
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2
                      id={`${submenuId}-${section.id}`}
                      className="text-sm font-bold tracking-tight text-slate-950 dark:text-white"
                    >
                      {section.title}
                    </h2>
                    {section.href ? (
                      <Link
                        href={section.href}
                        className="shrink-0 text-xs font-semibold text-brand no-underline transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:text-cyan-300 dark:focus-visible:ring-cyan-300"
                      >
                        {section.actionLabel ?? "View all"}
                      </Link>
                    ) : null}
                  </div>

                  <ul
                    className={
                      section.layout === "cards"
                        ? `grid gap-2 ${
                            section.columns === 3
                              ? "sm:grid-cols-2 lg:grid-cols-3"
                              : section.columns === 2
                                ? "sm:grid-cols-2"
                                : ""
                          }`
                        : section.columns === 3
                          ? "grid gap-1 sm:grid-cols-2 lg:grid-cols-3"
                          : section.columns === 2
                            ? "grid gap-1 sm:grid-cols-2"
                            : "space-y-1"
                    }
                  >
                    {section.items.map((menuItem) => (
                      <MegaMenuLink
                        key={menuItem.href}
                        item={menuItem}
                        section={section}
                        isActive={isNavigationHrefActive(menuItem.href, path, hash)}
                      />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {submenuOpen && item.submenu ? (
        <div className="absolute left-1/2 top-full z-50 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-3">
          <div
            id={submenuId}
            className="relative max-h-[70vh] overflow-y-auto overflow-x-hidden rounded-lg border border-white/70 bg-transparent p-2.5 shadow-[0_24px_80px_rgba(15,23,42,0.16)] ring-1 ring-slate-950/[0.05] backdrop-blur-3xl animate-reveal-up dark:border-white/[0.16] dark:shadow-[0_28px_90px_rgba(2,6,23,0.55)] dark:ring-white/[0.06]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-slate-950/20 to-transparent dark:via-white/50"
            />

            <div className="relative space-y-1">
              {item.submenu.map((subItem, index) => {
                const isSubActive = isNavigationHrefActive(subItem.href, path, hash);
                const { hash: subItemHash } = splitNavigationHref(subItem.href);

                return (
                  <Link
                    key={`${subItem.href}-${index}`}
                    href={subItem.href}
                    aria-current={isSubActive ? (subItemHash ? "location" : "page") : undefined}
                    className={`group flex items-center justify-between rounded-lg border px-4 py-3 text-base font-medium no-underline transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-cyan-300 dark:focus-visible:ring-offset-slate-950 ${
                      isSubActive
                        ? "border-brand/20 bg-gradient-to-r from-brand/15 via-violet-500/10 to-cyan-400/10 font-semibold text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-blue-400/25 dark:from-brand/25 dark:via-violet-500/15 dark:to-cyan-400/10 dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                        : "border-transparent text-slate-700 hover:border-slate-950/10 hover:bg-slate-950/[0.05] hover:text-slate-950 dark:text-white dark:hover:border-white/10 dark:hover:bg-white/[0.08] dark:hover:text-white"
                    }`}
                  >
                    <span>{subItem.label}</span>
                    <ArrowIcon
                      className={`h-4 w-4 transition-all duration-200 ${
                        isSubActive
                          ? "translate-x-0 text-cyan-700 dark:text-cyan-200"
                          : "-translate-x-1 text-slate-500 opacity-0 group-hover:translate-x-0 group-hover:text-cyan-700 group-hover:opacity-100 dark:text-slate-500 dark:group-hover:text-cyan-200"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HeaderLink;
