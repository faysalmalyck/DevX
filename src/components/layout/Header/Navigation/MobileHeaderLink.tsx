'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeaderItem } from '../../../../types/menu';
import {
  getNavigationItems,
  isNavigationHrefActive,
  isNavigationParentActive,
  splitNavigationHref,
  useLocationHash,
} from '@/components/layout/Header/Navigation/navigationState';

interface MobileHeaderLinkProps {
  item: HeaderItem;
  activeHref?: string | null;
  onActiveChange?: (href: string) => void;
  onNavigate?: () => void;
}

const MobileHeaderLink: React.FC<MobileHeaderLinkProps> = ({
  item,
  activeHref,
  onActiveChange,
  onNavigate,
}) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const submenuId = useId();
  const pathname = usePathname();
  const hash = useLocationHash();
  const navigationItems = getNavigationItems(item);
  const hasMegaMenu = Boolean(item.megaMenu);
  const hasSubmenu = Boolean(item.submenu || item.megaMenu);

  const selectedHref = activeHref;
  const isPreviewing = selectedHref !== null && selectedHref !== undefined;
  const isParentActive = isPreviewing
    ? selectedHref === item.href ||
      navigationItems.some((subItem) => selectedHref === subItem.href)
    : isNavigationParentActive(item, pathname);

  const baseStyle =
    'group flex w-full items-center justify-between rounded-[2rem] border px-4 py-3.5 text-left text-lg font-semibold transition-all duration-200 outline-none touch-manipulation select-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-cyan-300 dark:focus-visible:ring-offset-slate-950';

  const activeStyle = `${baseStyle} border-brand/20 bg-gradient-to-r from-brand/15 via-violet-500/10 to-cyan-400/10 font-semibold text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-blue-400/25 dark:from-brand/25 dark:via-violet-500/15 dark:to-cyan-400/10 dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]`;
  const inactiveStyle = `${baseStyle} border-transparent text-slate-700 hover:border-brand/20 hover:bg-brand/10 hover:text-brand active:bg-slate-950/[0.08] dark:text-white dark:hover:border-blue-400/20 dark:hover:bg-brand/20 dark:hover:text-blue-400 dark:active:bg-white/[0.12]`;

  const handleLinkClick = () => {
    if (onNavigate) {
      setTimeout(() => {
        onNavigate();
      }, 50);
    }
  };

  return (
    <div
      className="relative my-1 block w-full"
      onMouseEnter={() => onActiveChange?.(item.href)}
    >
      {hasSubmenu ? (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onActiveChange?.(item.href);
              setSubmenuOpen((prev) => !prev);
            }}
            aria-expanded={submenuOpen}
            aria-controls={submenuId}
            aria-current={isParentActive ? 'page' : undefined}
            className={isParentActive ? activeStyle : inactiveStyle}
          >
            <span>{item.label}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={`pointer-events-none shrink-0 transition-all duration-200 ${
                submenuOpen
                  ? 'rotate-180 text-cyan-600 dark:text-cyan-300'
                  : 'text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-300'
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
          </button>

          {submenuOpen && (
            <div
              id={submenuId}
              className="ml-4 mt-2 w-full space-y-1 border-l border-slate-950/10 pl-4 pr-1 animate-reveal-up dark:border-white/10"
            >
              {hasMegaMenu && item.megaMenu ? (
                <div className="space-y-4 pb-1">
                  {item.megaMenu.sections.map((section) => (
                    <section
                      key={section.id}
                      aria-labelledby={`${submenuId}-${section.id}`}
                      className={`rounded-2xl p-2 ${
                        section.featured ? "bg-brand/[0.07] dark:bg-brand/[0.14]" : ""
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between gap-3 px-2">
                        <h3
                          id={`${submenuId}-${section.id}`}
                          className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300"
                        >
                          {section.title}
                        </h3>
                        {section.href ? (
                          <Link
                            href={section.href}
                            onClick={handleLinkClick}
                            className="text-xs font-semibold text-brand no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:focus-visible:ring-cyan-300"
                          >
                            {section.actionLabel ?? "View all"}
                          </Link>
                        ) : null}
                      </div>

                      <div className="space-y-1">
                        {section.items.map((subItem) => {
                          const isSubActive = isPreviewing
                            ? selectedHref === subItem.href
                            : isNavigationHrefActive(subItem.href, pathname, hash);
                          const { hash: subItemHash } = splitNavigationHref(subItem.href);

                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              aria-current={
                                isSubActive
                                  ? subItemHash
                                    ? "location"
                                    : "page"
                                  : undefined
                              }
                              onMouseEnter={() => onActiveChange?.(subItem.href)}
                              onClick={() => {
                                onActiveChange?.(subItem.href);
                                handleLinkClick();
                              }}
                              className={`block w-full rounded-2xl border px-4 py-2.5 text-lg font-semibold no-underline transition-all duration-200 touch-manipulation select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:focus-visible:ring-cyan-300 ${
                                section.featured
                                  ? "border-brand/25 bg-brand/10 text-brand hover:text-brand dark:border-blue-400/30 dark:bg-brand/20 dark:text-white dark:hover:text-blue-400"
                                  : section.layout === "cards"
                                    ? isSubActive
                                      ? "border-brand/30 bg-brand/10 text-brand shadow-sm dark:border-blue-400/35 dark:bg-brand/20 dark:text-white"
                                      : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-brand/40 hover:text-brand dark:border-slate-600 dark:bg-[#1e2538] dark:text-white dark:hover:border-blue-400/50 dark:hover:text-blue-400"
                                  : isSubActive
                                    ? "border-brand/20 bg-brand/10 text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-blue-400/20 dark:bg-brand/15 dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                                    : "border-transparent text-slate-600 hover:border-brand/20 hover:bg-brand/10 hover:text-brand dark:text-slate-300 dark:hover:border-blue-400/20 dark:hover:bg-brand/20 dark:hover:text-blue-400"
                              }`}
                            >
                              <span>{subItem.label}</span>
                              {subItem.description ? (
                                <span className="mt-1 block text-xs font-normal leading-5 text-slate-500 dark:text-slate-300">
                                  {subItem.description}
                                </span>
                              ) : null}
                            </Link>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              ) : item.submenu?.map((subItem, index) => {
                const isSubActive = isPreviewing
                  ? selectedHref === subItem.href
                  : isNavigationHrefActive(subItem.href, pathname, hash);
                const { hash: subItemHash } = splitNavigationHref(
                  subItem.href,
                );

                return (
                  <Link
                    key={`${subItem.href}-${index}`}
                    href={subItem.href}
                    aria-current={
                      isSubActive
                        ? subItemHash
                          ? 'location'
                          : 'page'
                        : undefined
                    }
                    onMouseEnter={() => onActiveChange?.(subItem.href)}
                    onClick={() => {
                      onActiveChange?.(subItem.href);
                      handleLinkClick();
                    }}
                    className={
                      isSubActive
                        ? 'block w-full rounded-[2rem] border border-brand/20 bg-brand/10 px-4 py-2.5 text-lg font-semibold text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-200 touch-manipulation select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-blue-400/20 dark:bg-brand/15 dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:focus-visible:ring-cyan-300'
                        : 'block w-full rounded-[2rem] border border-transparent px-4 py-2.5 text-lg font-semibold text-slate-600 transition-all duration-200 touch-manipulation select-none hover:border-brand/20 hover:bg-brand/10 hover:text-brand dark:text-slate-300 dark:hover:border-blue-400/20 dark:hover:bg-brand/20 dark:hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:focus-visible:ring-cyan-300'
                    }
                  >
                    {subItem.label}
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.href}
          aria-current={isParentActive ? 'page' : undefined}
          onClick={() => {
            onActiveChange?.(item.href);
            handleLinkClick();
          }}
          className={isParentActive ? activeStyle : inactiveStyle}
        >
          {item.label}
        </Link>
      )}
    </div>
  );
};

export default MobileHeaderLink;
