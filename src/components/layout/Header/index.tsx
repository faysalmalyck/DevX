"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { headerData } from "@/components/layout/Header/Navigation/menuData";
import Logo from "@/components/layout/Header/Logo";
import HeaderLink from "@/components/layout/Header/Navigation/HeaderLink";
import MobileHeaderLink from "@/components/layout/Header/Navigation/MobileHeaderLink";
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
  const [mobileActiveHref, setMobileActiveHref] = useState<string | null>(null);
  const [sticky, setSticky] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const wasMobileMenuOpen = useRef(false);

  const isAuthOrAdminPage = pathUrl?.startsWith("/admin") || pathUrl?.startsWith("/login") || pathUrl?.startsWith("/register") || pathUrl?.startsWith("/forgot-password") || pathUrl?.startsWith("/reset-password");

  const handleScroll = () => {
    setSticky(window.scrollY >= 80);
  };

  const closeMobileMenu = () => {
    setNavbarOpen(false);
    setMobileActiveHref(null);
  };
  const toggleMenu = () => {
    if (navbarOpen) {
      setMobileActiveHref(null);
    }
    setNavbarOpen((prev) => !prev);
  };

  // Auto-close mobile navigation when path changes
  useEffect(() => {
    setNavbarOpen(false);
    setMobileActiveHref(null);
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

  // Keep keyboard focus within the mobile dialog and return it to its trigger when closed.
  useEffect(() => {
    if (!mounted) return;

    if (!navbarOpen) {
      if (wasMobileMenuOpen.current) {
        toggleButtonRef.current?.focus();
      }
      wasMobileMenuOpen.current = false;
      return;
    }

    wasMobileMenuOpen.current = true;
    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');
    const focusableElements = () =>
      Array.from(
        mobileMenuRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []
      );
    const focusFrame = window.requestAnimationFrame(() => {
      focusableElements()[0]?.focus();
    });
    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const elements = focusableElements();
      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleTab);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleTab);
    };
  }, [navbarOpen, mounted]);

  const isDark = mounted && resolvedTheme === "dark";
  const isHomePage = pathUrl === "/";

  const navTextColor = "text-slate-900 dark:text-white";
  const burgerLineBg = "bg-slate-900 dark:bg-white";
  const mobileControlColor = navbarOpen
    ? "text-slate-900 hover:text-brand dark:text-white dark:hover:text-cyan-300"
    : "text-slate-900 hover:text-brand dark:text-white dark:hover:text-brand";

  if (isAuthOrAdminPage) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[9999] w-full px-3 py-3 md:py-4 transition-all duration-300 ${
        navbarOpen
          ? "border-b border-slate-950/[0.06] bg-transparent shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-3xl dark:border-white/[0.12] dark:shadow-[0_12px_40px_rgba(2,6,23,0.35)]"
          : sticky
          ? "border-b border-slate-950/10 bg-transparent shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-3xl dark:border-white/[0.12] dark:shadow-[0_12px_40px_rgba(2,6,23,0.35)]"
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
              className="group hidden items-center font-semibold text-slate-900 transition-colors duration-200 hover:text-brand dark:text-white dark:hover:text-brand lg:inline-flex"
            >
              <span className="text-slate-900 transition-colors duration-200 group-hover:text-brand dark:text-white dark:group-hover:text-brand">
                Cart(
              </span>

              <span className="text-slate-900 transition-colors duration-200 group-hover:text-brand dark:text-white dark:group-hover:text-brand">
                {itemCount}
              </span>

              <span className="text-slate-900 transition-colors duration-200 group-hover:text-brand dark:text-white dark:group-hover:text-brand">
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
            className={`relative inline-flex h-9 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-cyan-300 dark:focus-visible:ring-offset-slate-950 ${
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
            className={`relative flex h-10 w-10 items-center justify-center transition-colors lg:hidden ${mobileControlColor}`}
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5 stroke-current" />

            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            ref={toggleButtonRef}
            type="button"
            onClick={toggleMenu}
            onTouchEnd={(e) => {
              e.preventDefault();
              toggleMenu();
            }}
            className="relative z-[10001] flex h-12 w-12 touch-manipulation select-none items-center justify-center bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-cyan-300 dark:focus-visible:ring-offset-slate-950 lg:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={navbarOpen}
            aria-controls="mobile-menu"
          >
            <div className="pointer-events-none relative flex h-4 w-5 flex-col justify-between">
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
            inert={!navbarOpen}
          >
            <button
              type="button"
              tabIndex={navbarOpen ? 0 : -1}
              aria-label="Close mobile menu backdrop"
              className={`absolute inset-0 w-full bg-transparent backdrop-blur-[3px] transition-opacity duration-300 ${
                navbarOpen ? "opacity-100" : "opacity-0"
              }`}
              onPointerDown={closeMobileMenu}
            />

            <div
              ref={mobileMenuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              id="mobile-menu"
              className={`absolute inset-x-3 top-24 max-h-[calc(100dvh-7rem)] overflow-x-hidden overflow-y-auto overscroll-contain rounded-[2rem] border border-white/70 bg-transparent p-3 shadow-[0_24px_80px_rgba(15,23,42,0.18)] ring-1 ring-slate-950/[0.05] backdrop-blur-3xl transition-all duration-300 ease-out dark:border-white/[0.16] dark:shadow-[0_28px_90px_rgba(2,6,23,0.55)] dark:ring-white/[0.06] ${
                navbarOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0"
              }`}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-slate-950/20 to-transparent dark:via-white/50"
              />

              <nav className="relative flex flex-col text-slate-900 dark:text-white">
                <div className="pr-1">
                  <div
                    className="flex flex-col space-y-1"
                    onMouseLeave={() => setMobileActiveHref(null)}
                  >
                    {headerData.map((item, index) => (
                      <div key={index} className="w-full">
                        <MobileHeaderLink
                          item={item}
                          activeHref={mobileActiveHref}
                          onActiveChange={setMobileActiveHref}
                          onNavigate={closeMobileMenu}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 border-t border-slate-950/10 pt-4 dark:border-white/10">
                  <Link
                    href="/contact"
                    className="w-full rounded-[2rem] border border-white/75 bg-transparent py-4 text-center text-sm font-semibold text-slate-900 backdrop-blur-xl transition-colors hover:border-slate-950/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/[0.16] dark:text-white dark:hover:border-white/30 dark:focus-visible:ring-cyan-300 dark:focus-visible:ring-offset-slate-950"
                    onClick={closeMobileMenu}
                  >
                    Contact us
                  </Link>
                  <Link
                    href="/portfolio"
                    className="w-full rounded-[2rem] bg-brand py-4 text-center text-sm font-semibold text-white shadow-[0_14px_32px_rgba(54,88,255,0.3)] transition-all hover:bg-brand active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
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
