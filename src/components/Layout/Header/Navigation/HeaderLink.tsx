"use client"
import { useRef, useState } from 'react';
import Link from 'next/link';
import { HeaderItem } from '../../../../types/menu';
import { usePathname } from 'next/navigation';

const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const path = usePathname()
  const itemPath = item.href.split("#")[0];
  const isActive =
    path === itemPath ||
    item.submenu?.some((subItem) => path === subItem.href.split("#")[0]);

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

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setSubmenuOpen(false);
        }
      }}
    >
<<<<<<< HEAD
      <Link href={item.href} className={`premium-link-line flex items-center gap-1 whitespace-nowrap py-2 text-sm font-semibold text-slate-700 transition-colors duration-300 hover:text-primary dark:text-white/75 dark:hover:text-white ${isActive ? 'text-primary dark:text-white after:w-full' : ''}`}>
=======
      <Link
  href={item.href}
  className="flex items-center gap-1  py-2 rounded-lg text-sm font-semibold text-slate-700 transition-colors duration-300 hover:text-blue-500 dark:text-white dark:hover:text-blue-500"
>
>>>>>>> 872113e (Refine navigation and update website content)
        {item.label}
        {item.submenu && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.25em"
            height="1.25em"
            viewBox="0 0 24 24"
            className={`transition-transform duration-300 ${submenuOpen ? "rotate-360" : "rotate-270"}`}
          >
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m7 10l5 5l5-5" />
          </svg>
        )}
      </Link>
      {submenuOpen && (
        <div
          className="absolute left-1/2 top-full z-50 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-3"
        >
<<<<<<< HEAD
          <div className="max-h-[70vh] overflow-y-auto rounded-3xl border border-slate-200/70 bg-white p-2 shadow-2xl shadow-slate-950/15 backdrop-blur-xl transition-all duration-200 animate-reveal-up dark:border-white/10 dark:bg-darklight dark:shadow-dark-md">
=======
          <div className="max-h-[70vh] overflow-y-auto rounded-lg rounded-r-none border border-white/10 bg-[#252C41] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
>>>>>>> 872113e (Refine navigation and update website content)
            {item.submenu?.map((subItem, index) => (
              <Link
  key={index}
  href={subItem.href}
  className={`block rounded-xl px-4 py-3 text-sm transition-colors duration-300 ${
    path === subItem.href.split("#")[0]
      ? "text-blue-500"
      : "text-white hover:text-blue-500 dark:text-white dark:hover:text-blue-500"
  }`}
>
  {subItem.label}
</Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderLink;
