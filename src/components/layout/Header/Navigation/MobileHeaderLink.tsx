'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeaderItem } from '../../../../types/menu';
import {
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

  const selectedHref = activeHref;
  const isPreviewing = selectedHref !== null && selectedHref !== undefined;
  const isParentActive = isPreviewing
    ? selectedHref === item.href ||
      (item.submenu?.some((subItem) => selectedHref === subItem.href) ?? false)
    : isNavigationParentActive(item, pathname);

  const baseStyle =
    'group flex w-full items-center justify-between rounded-[2rem] border px-4 py-3.5 text-left text-base font-medium transition-all duration-200 outline-none touch-manipulation select-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-cyan-300 dark:focus-visible:ring-offset-slate-950';

  const activeStyle = `${baseStyle} border-brand/20 bg-gradient-to-r from-brand/15 via-violet-500/10 to-cyan-400/10 font-semibold text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-blue-400/25 dark:from-brand/25 dark:via-violet-500/15 dark:to-cyan-400/10 dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]`;
  const inactiveStyle = `${baseStyle} border-transparent text-slate-700 hover:border-slate-950/10 hover:bg-slate-950/[0.05] hover:text-slate-950 active:bg-slate-950/[0.08] dark:text-white dark:hover:border-white/10 dark:hover:bg-white/[0.08] dark:hover:text-white dark:active:bg-white/[0.12]`;

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
      {item.submenu ? (
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
              {item.submenu.map((subItem, index) => {
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
                        ? 'block w-full rounded-[2rem] border border-brand/20 bg-brand/10 px-4 py-2.5 text-base font-semibold text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-200 touch-manipulation select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-blue-400/20 dark:bg-brand/15 dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:focus-visible:ring-cyan-300'
                        : 'block w-full rounded-[2rem] border border-transparent px-4 py-2.5 text-base font-medium text-slate-600 transition-all duration-200 touch-manipulation select-none hover:border-slate-950/10 hover:bg-slate-950/[0.05] hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-slate-400 dark:hover:border-white/10 dark:hover:bg-white/[0.07] dark:hover:text-white dark:focus-visible:ring-cyan-300'
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
