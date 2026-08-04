"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { headerData } from "@/components/layout/header/navigation/menuData";
import Logo from "@/components/layout/header/logo";
import HeaderLink from "@/components/layout/header/navigation/HeaderLink";
import MobileHeaderLink from "@/components/layout/header/navigation/MobileHeaderLink";
import { useTheme } from "next-themes";
import { SuccessfullLogin } from "@/components/auth/auth-dialog/SuccessfulLogin";
import { FailedLogin } from "@/components/auth/auth-dialog/FailedLogin";
import { UserRegistered } from "@/components/auth/auth-dialog/UserRegistered";
import AuthDialogContext from "@/contexts/AuthDialogContext";
import AccountDropdown from "@/components/account/AccountDropdown";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const Header: React.FC = () => {
  const pathUrl = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const authDialog = useContext(AuthDialogContext);
  const { itemCount, openCart } = useCart();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const handleScroll = () => {
    setSticky(window.scrollY >= 80);
  };

  const closeMobileMenu = () => setNavbarOpen(false);
  const toggleMenu = () => setNavbarOpen((prev) => !prev);

  // Auto-close mobile navigation when path changes
  useEffect(() => {
    setNavbarOpen(false);
  }, [pathUrl]);

  // Initial client setup
  useEffect(() => {
    setMounted(true);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle outside clicks and Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        navbarOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(target)
      ) {
        closeMobileMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [navbarOpen]);

  // Lock body scroll when mobile drawer is active
  useEffect(() => {
    if (!mounted) return;

    if (navbarOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("overflow");
    }

    return () => {
      document.body.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("overflow");
    };
  }, [navbarOpen, mounted]);

  const isDark = mounted && resolvedTheme === "dark";
  const isHomePage = pathUrl === "/";

  // Navigation Text & Icon Styling Strategy
  const navTextColor =
    !sticky && isHomePage
      ? "text-white dark:text-white"
      : "text-slate-900 dark:text-white";

  const burgerLineBg =
    navbarOpen
      ? "bg-slate-900 dark:bg-white"
      : !sticky && isHomePage
      ? "bg-white"
      : "bg-slate-900 dark:bg-white";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[9999] w-full px-3 py-3 md:py-4 transition-all duration-300 ${
        sticky
          ? "bg-white/95 shadow-md backdrop-blur-md dark:bg-slate-900/95 dark:shadow-slate-800/50"
          : "bg-transparent"
      }`}
    >
      <div className="container relative mx-auto flex max-w-6xl items-center justify-between px-2 sm:px-4 py-1">
        <Logo />

        {/* Desktop Navigation */}
        <nav
          className={`hidden lg:flex flex-1 items-center justify-center ${navTextColor}`}
        >
          <div className="flex items-center gap-8">
            {headerData.map((item, index) => (
              <HeaderLink key={index} item={item} />
            ))}

            <button
              type="button"
              onClick={openCart}
              className="hidden lg:inline-flex items-center gap-1 font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-500"
            >
              <span>
                Cart (
                <span className="text-gray-900 dark:text-white">
                  {itemCount}
                </span>
                )
              </span>
            </button>
          </div>
        </nav>

        {/* Action Controls & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-4 relative z-[10000]">
          {/* Theme Switcher */}
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`relative inline-flex h-9 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              mounted
                ? isDark
                  ? "bg-slate-800"
                  : "bg-slate-200"
                : "bg-slate-200 opacity-0"
            }`}
          >
            <span
              className={`pointer-events-none flex h-8 w-8 transform items-center justify-center rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out dark:bg-slate-900 ${
                isDark ? "translate-x-7" : "translate-x-0"
              } ${!sticky && isHomePage ? "border border-white/20" : ""}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-amber-500 dark:hidden"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="hidden h-4 w-4 text-sky-400 dark:block"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            </span>
          </button>

          <AccountDropdown />

          {/* Mobile Cart Trigger */}
          <button
            type="button"
            onClick={openCart}
            className={`relative flex h-10 w-10 items-center justify-center lg:hidden ${navTextColor}`}
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />

            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            ref={toggleButtonRef}
            type="button"
            onClick={toggleMenu}
            className="relative z-[10001] flex h-12 w-12 items-center justify-center bg-transparent focus:outline-none lg:hidden touch-manipulation"
            aria-label="Toggle mobile menu"
            aria-expanded={navbarOpen}
          >
            <div className="relative flex h-4 w-5 flex-col justify-between pointer-events-none">
              <span
                className={`h-0.5 w-full rounded-full transition-all duration-300 ${burgerLineBg} ${
                  navbarOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-full rounded-full transition-all duration-300 ${burgerLineBg} ${
                  navbarOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-0.5 w-full rounded-full transition-all duration-300 ${burgerLineBg} ${
                  navbarOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Auth Alerts */}
      <div
        className={`fixed top-6 end-1/2 translate-x-1/2 z-[10002] ${
          authDialog?.isSuccessDialogOpen ? "block" : "hidden"
        }`}
      >
        <SuccessfullLogin />
      </div>
      <div
        className={`fixed top-6 end-1/2 translate-x-1/2 z-[10002] ${
          authDialog?.isFailedDialogOpen ? "block" : "hidden"
        }`}
      >
        <FailedLogin />
      </div>
      <div
        className={`fixed top-6 end-1/2 translate-x-1/2 z-[10002] ${
          authDialog?.isUserRegistered ? "block" : "hidden"
        }`}
      >
        <UserRegistered />
      </div>

      {/* Mobile Menu Portal */}
      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-[9998] lg:hidden ${
              navbarOpen ? "visible" : "invisible pointer-events-none"
            }`}
            aria-hidden={!navbarOpen}
          >
            <button
              type="button"
              tabIndex={navbarOpen ? 0 : -1}
              aria-label="Close mobile menu backdrop"
              className={`absolute inset-0 w-full bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ${
                navbarOpen ? "opacity-100" : "opacity-0"
              }`}
              onPointerDown={closeMobileMenu}
            />

            <div
              ref={mobileMenuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className={`absolute inset-x-3 top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl transition-all duration-300 ease-out dark:border-slate-800 dark:bg-slate-900 ${
                navbarOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0"
              }`}
            >
              <nav className="flex max-h-[calc(100dvh-6rem)] flex-col overflow-y-auto overscroll-contain text-slate-900 dark:text-white">
                <div className="flex flex-col space-y-1">
                  {headerData.map((item, index) => (
                    <div key={index} className="w-full">
                      <MobileHeaderLink
                        item={item}
                        onNavigate={closeMobileMenu}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-2.5 border-t border-slate-200/60 pt-4 dark:border-slate-800/60">
                  <Link
                    href="/contact"
                    className="w-full rounded-xl border border-slate-300 py-3 text-center text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                    onClick={closeMobileMenu}
                  >
                    Contact us
                  </Link>
                  <Link
                    href="/portfolio"
                    className="w-full rounded-xl bg-blue-600 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
                    onClick={closeMobileMenu}
                  >
                    View work
                  </Link>
                </div>
              </nav>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};

export default Header;