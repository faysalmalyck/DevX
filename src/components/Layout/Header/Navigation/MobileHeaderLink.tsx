<<<<<<< HEAD
import { useId, useState } from 'react';
=======
"use client";

import { useState } from 'react';
>>>>>>> 872113e (Refine navigation and update website content)
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

  // Defer closing the drawer slightly so Next.js processes the link tap
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNavigate) {
      setTimeout(() => {
        onNavigate();
      }, 50);
    }
  };

  return (
    <div className="relative block w-full my-1">
      {item.submenu ? (
<<<<<<< HEAD
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={submenuOpen}
          aria-controls={submenuId}
          className={`flex min-h-12 w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-white ${isActive ? 'bg-gradient-to-r from-primary to-Sky-blue-mist text-white shadow-lg shadow-primary/25 dark:text-white' : ''}`}
        >
          {item.label}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 24 24"
            className={`transition-transform duration-300 ${submenuOpen ? "rotate-180" : ""}`}
=======
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSubmenuOpen((prev) => !prev);
            }}
            aria-expanded={submenuOpen}
            className={isParentActive ? activeStyle : inactiveStyle}
>>>>>>> 872113e (Refine navigation and update website content)
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
            <div className="mt-1 w-full pl-4 pr-2 space-y-1 border-l border-slate-100 dark:border-slate-800/60 ml-4 animate-fade-in">
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
<<<<<<< HEAD
          onClick={onNavigate}
          className={`flex min-h-12 w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-white ${isActive ? 'bg-gradient-to-r from-primary to-Sky-blue-mist text-white shadow-lg shadow-primary/25 dark:text-white' : ''}`}
=======
          onClick={handleLinkClick}
          className={isParentActive ? activeStyle : inactiveStyle}
>>>>>>> 872113e (Refine navigation and update website content)
        >
          {item.label}
        </Link>
      )}
<<<<<<< HEAD
      {submenuOpen && item.submenu && (
        <div
          id={submenuId}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm dark:border-white/10 dark:bg-white/[0.06]"
        >
          <Link
            href={item.href}
            onClick={onNavigate}
            className={`block rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
              path === itemPath
                ? "bg-primary text-white"
                : "text-slate-600 hover:bg-primary/10 hover:text-primary dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            }`}
          >
            {item.label}
          </Link>
          {item.submenu.map((subItem, index) => (
            <Link
              key={index}
              href={subItem.href}
              onClick={onNavigate}
              className={`block rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                path === subItem.href.split("#")[0]
                  ? "bg-primary text-white"
                  : "text-slate-600 hover:bg-primary/10 hover:text-primary dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
=======
>>>>>>> 872113e (Refine navigation and update website content)
    </div>
  );
};

export default MobileHeaderLink;