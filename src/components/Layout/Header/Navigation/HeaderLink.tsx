"use client";

import { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeaderItem } from '../../../../types/menu';

const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const path = usePathname();

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
className={`flex items-center gap-1 whitespace-nowrap py-2 text-sm font-semibold no-underline text-gray-800 transition-colors duration-300 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-500`}      >
        <span>{item.label}</span>
        {item.submenu && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.25em"
            height="1.25em"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`transition-transform duration-300 ${
              submenuOpen ? "rotate-360 text-blue-500" : "rotate-270"
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
          <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200/70 bg-white p-2 shadow-2xl shadow-slate-950/15 backdrop-blur-xl transition-all duration-200 animate-reveal-up dark:border-white/10 dark:bg-slate-900 dark:shadow-dark-md">
            {item.submenu.map((subItem, index) => {
              const isSubActive = path === (subItem.href || '').split("#")[0];

              return (
                <Link
                  key={`${subItem.href}-${index}`}
                  href={subItem.href}
                  className={`block rounded-xl px-4 py-2.5 text-sm font-medium no-underline transition-all duration-200 ${
                    isSubActive
                      ? "bg-blue-50/50 font-semibold text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                      : "text-slate-700 hover:bg-slate-50 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800/50 dark:hover:text-blue-400"
                  }`}
                >
                  {subItem.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderLink;