'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeaderItem } from '../../../../types/menu';

interface MobileHeaderLinkProps {
  item: HeaderItem;
  onNavigate?: () => void;
}

const MobileHeaderLink: React.FC<MobileHeaderLinkProps> = ({
  item,
  onNavigate,
}) => {
  const pathname = usePathname();
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const submenuId = useId();

  const isParentActive =
    pathname === item.href ||
    (item.submenu?.some((subItem) => pathname === subItem.href) ?? false);

  const baseStyle =
    'flex w-full items-center justify-between px-4 py-3 text-left text-base font-medium rounded-xl transition-all duration-200 outline-none border-none touch-manipulation select-none active:bg-slate-100 dark:active:bg-slate-800';

  const activeStyle = `${baseStyle} text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20 font-semibold`;
  const inactiveStyle = `${baseStyle} text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/40`;

  const handleLinkClick = () => {
    if (onNavigate) {
      setTimeout(() => {
        onNavigate();
      }, 50);
    }
  };

  return (
    <div className="relative block w-full my-1">
      {item.submenu ? (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSubmenuOpen((prev) => !prev);
            }}
            aria-expanded={submenuOpen}
            aria-controls={submenuId}
            className={isParentActive ? activeStyle : inactiveStyle}
          >
            <span>{item.label}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={`transition-transform duration-300 pointer-events-none ${
                submenuOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
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
              className="mt-1 w-full pl-4 pr-2 space-y-1 border-l border-slate-100 dark:border-slate-800/60 ml-4 animate-fade-in"
            >
              {item.submenu.map((subItem, index) => {
                const isSubActive = pathname === subItem.href;

                return (
                  <Link
                    key={`${subItem.href}-${index}`}
                    href={subItem.href}
                    onClick={handleLinkClick}
                    className={
                      isSubActive
                        ? 'block w-full py-2.5 px-4 text-sm font-semibold rounded-lg text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-950/10 touch-manipulation select-none'
                        : 'block w-full py-2.5 px-4 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all duration-200 touch-manipulation select-none'
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
          onClick={handleLinkClick}
          className={isParentActive ? activeStyle : inactiveStyle}
        >
          {item.label}
        </Link>
      )}
    </div>
  );
};

export default MobileHeaderLink;