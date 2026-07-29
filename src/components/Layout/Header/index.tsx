"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { headerData } from "../Header/Navigation/menuData";
import Logo from "./Logo";
import HeaderLink from "../Header/Navigation/HeaderLink";
import MobileHeaderLink from "../Header/Navigation/MobileHeaderLink";
import { useTheme } from "next-themes";
import { SuccessfullLogin } from "@/components/Auth/AuthDialog/SuccessfulLogin";
import { FailedLogin } from "@/components/Auth/AuthDialog/FailedLogin";
import { UserRegistered } from "@/components/Auth/AuthDialog/UserRegistered";
import AuthDialogContext from "@/app/context/AuthDialogContext";
import AccountDropdown from "@/components/account/AccountDropdown";

const Header: React.FC = () => {
  const pathUrl = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleScroll = () => {
    setSticky(window.scrollY >= 80);
  };

<<<<<<< HEAD
  const closeMobileMenu = () => setNavbarOpen(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      navbarOpen
    ) {
      closeMobileMenu();
    }
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [navbarOpen]);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
=======
  const toggleMenu = () => {
    setNavbarOpen((prev) => !prev);
  };

  useEffect(() => {
    setNavbarOpen(false);
  }, [pathUrl]);

  useEffect(() => {
    setMounted(true);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
>>>>>>> 872113e (Refine navigation and update website content)

    if (navbarOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
<<<<<<< HEAD
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [navbarOpen]);
=======
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [navbarOpen, mounted]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNavbarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
>>>>>>> 872113e (Refine navigation and update website content)

  const authDialog = useContext(AuthDialogContext);
  const isDark = mounted && resolvedTheme === "dark";
  const isHomePage = pathUrl === "/";

  // Dynamic text color strategy:
  // 1. In dark mode, text is always light (`dark:text-white`).
  // 2. In light mode:
  //    - If non-sticky on homepage overlay (dark background hero), text is white (`text-white`).
  //    - If sticky or on inner pages, text is standard dark slate (`text-slate-900`).
  const navTextColor =
    !sticky && isHomePage
      ? "text-white dark:text-white"
      : "text-slate-900 dark:text-white";

  return (
    <header
<<<<<<< HEAD
      className={`fixed top-0 w-full px-2 py-3 transition-all duration-500 sm:px-4 sm:py-4 lg:px-6 ${
        navbarOpen ? "z-[1000]" : "z-50"
      } ${
=======
      className={`fixed top-0 left-0 right-0 z-[9999] w-full px-3 py-3 md:py-4 transition-all duration-300 ${
>>>>>>> 872113e (Refine navigation and update website content)
        sticky
          ? "bg-white/95 shadow-md backdrop-blur-md dark:bg-slate-900/95 dark:shadow-slate-800/50"
          : "bg-transparent"
      }`}
    >
<<<<<<< HEAD
      <div className="mx-auto flex min-h-[60px] w-full max-w-[1180px] items-center justify-between gap-2 rounded-full border border-slate-950/10 bg-white/75 px-3 py-2.5 shadow-[0_18px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:min-h-[68px] sm:px-4 lg:gap-4 lg:px-5 dark:border-white/[0.12] dark:bg-white/[0.06]">
        <Logo />
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-5 lg:flex xl:gap-8">
=======
      <div className="container relative mx-auto flex max-w-6xl items-center justify-between px-2 sm:px-4 py-1">
        <Logo />

        {/* Desktop Navigation */}
        <nav
          className={`hidden grow items-center justify-center gap-8 transition-colors duration-300 lg:flex ${navTextColor}`}
        >
>>>>>>> 872113e (Refine navigation and update website content)
          {headerData.map((item, index) => (
            <HeaderLink key={index} item={item} />
          ))}
        </nav>
<<<<<<< HEAD
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white/80 text-body-color shadow-sm duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary sm:h-11 sm:w-11 dark:border-white/10 dark:bg-white/10 dark:text-white"
          >
            <svg
              viewBox="0 0 16 16"
              className={`hidden h-6 w-6 dark:block ${
                !sticky && pathUrl === "/" && "text-white"
              }`}
            >
              <path
                d="M4.50663 3.2267L3.30663 2.03337L2.36663 2.97337L3.55996 4.1667L4.50663 3.2267ZM2.66663 7.00003H0.666626V8.33337H2.66663V7.00003ZM8.66663 0.366699H7.33329V2.33337H8.66663V0.366699V0.366699ZM13.6333 2.97337L12.6933 2.03337L11.5 3.2267L12.44 4.1667L13.6333 2.97337ZM11.4933 12.1067L12.6866 13.3067L13.6266 12.3667L12.4266 11.1734L11.4933 12.1067ZM13.3333 7.00003V8.33337H15.3333V7.00003H13.3333ZM7.99996 3.6667C5.79329 3.6667 3.99996 5.46003 3.99996 7.6667C3.99996 9.87337 5.79329 11.6667 7.99996 11.6667C10.2066 11.6667 12 9.87337 12 7.6667C12 5.46003 10.2066 3.6667 7.99996 3.6667ZM7.33329 14.9667H8.66663V13H7.33329V14.9667ZM2.36663 12.36L3.30663 13.3L4.49996 12.1L3.55996 11.16L2.36663 12.36Z"
                fill="#FFFFFF"
              />
            </svg>
            <svg
              viewBox="0 0 23 23"
              className={`h-8 w-8 text-dark dark:hidden ${
                !sticky && pathUrl === "/" && "text-white"
              }`}
            >
              <path d="M16.6111 15.855C17.591 15.1394 18.3151 14.1979 18.7723 13.1623C16.4824 13.4065 14.1342 12.4631 12.6795 10.4711C11.2248 8.47905 11.0409 5.95516 11.9705 3.84818C10.8449 3.9685 9.72768 4.37162 8.74781 5.08719C5.7759 7.25747 5.12529 11.4308 7.29558 14.4028C9.46586 17.3747 13.6392 18.0253 16.6111 15.855Z" />
            </svg>
          </button>
          <Link
            href="/contact"
            className="premium-gradient-button hidden rounded-full px-4 py-3 text-sm font-bold hover:-translate-y-0.5 lg:inline-flex xl:px-5"
          >
            Contact us
          </Link>
          <button
            onClick={() => setNavbarOpen(!navbarOpen)}
            className="block rounded-full border border-slate-200/80 bg-white/80 p-2.5 shadow-sm sm:p-3 lg:hidden dark:border-white/10 dark:bg-white/10"
            aria-label="Toggle mobile menu"
          >
            <span className="block w-6 h-0.5 bg-black dark:bg-white"></span>
            <span className="block w-6 h-0.5 bg-black dark:bg-white mt-1.5"></span>
            <span className="block w-6 h-0.5 bg-black dark:bg-white mt-1.5"></span>
          </button>
        </div>
      </div>
      {navbarOpen && (
        <button
          type="button"
          aria-label="Close mobile menu overlay"
          className="fixed inset-0 z-[998] h-dvh w-screen bg-slate-950/70 backdrop-blur-md lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <div
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed inset-y-0 right-0 z-[999] flex h-dvh max-h-dvh w-full transform flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl transition-transform duration-500 sm:max-w-sm lg:hidden dark:border-white/10 dark:bg-darkmode ${
          navbarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="shrink-0 border-b border-slate-200/80 bg-white px-5 py-5 dark:border-white/10 dark:bg-darkmode">
          <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-midnight_text dark:text-white">
            Menu
          </h2>
          <button
            onClick={closeMobileMenu}
            aria-label="Close mobile menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-900 transition-colors duration-300 hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:text-Sky-blue-mist"
=======

        {/* Action Controls & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-4 relative z-[10000]">
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`relative inline-flex h-9 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isDark ? "bg-slate-800" : "bg-slate-200"
            }`}
>>>>>>> 872113e (Refine navigation and update website content)
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

          {/* Fully Isolated Touch Button */}
          <button
            type="button"
            onClick={toggleMenu}
            className="relative z-[10001] flex h-12 w-12 items-center justify-center bg-transparent focus:outline-none lg:hidden touch-manipulation"
            aria-label="Toggle mobile menu"
            aria-expanded={navbarOpen}
          >
            <div className="relative flex h-4 w-5 flex-col justify-between pointer-events-none">
              <span
                className={`h-0.5 w-full rounded-full transition-all duration-300 ${
                  !sticky && isHomePage
                    ? "bg-white dark:bg-white"
                    : "bg-slate-900 dark:bg-white"
                } ${navbarOpen ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`h-0.5 w-full rounded-full transition-all duration-300 ${
                  !sticky && isHomePage
                    ? "bg-white dark:bg-white"
                    : "bg-slate-900 dark:bg-white"
                } ${navbarOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`h-0.5 w-full rounded-full transition-all duration-300 ${
                  !sticky && isHomePage
                    ? "bg-white dark:bg-white"
                    : "bg-slate-900 dark:bg-white"
                } ${navbarOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </div>
          </button>
          </div>
        </div>
<<<<<<< HEAD
        <nav className="flex min-h-0 flex-1 flex-col items-start gap-3 overflow-y-auto bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] dark:bg-darkmode">
          {headerData.map((item, index) => (
            <MobileHeaderLink
              key={index}
              item={item}
              onNavigate={closeMobileMenu}
            />
          ))}
          <div className="mt-4 flex w-full flex-col gap-3 border-t border-slate-200 pt-5 dark:border-white/10">
            <Link
              href="/contact"
              className="rounded-2xl border border-primary/30 px-4 py-3 text-center font-bold text-primary transition-all duration-300 hover:border-Sky-blue-mist/50 hover:bg-primary/10 hover:text-primary dark:text-white"
              onClick={closeMobileMenu}
            >
              Contact us
            </Link>
            <Link
              href="/portfolio"
              className="premium-gradient-button rounded-2xl px-4 py-3 text-center font-bold"
              onClick={closeMobileMenu}
            >
              View work
            </Link>
          </div>
        </nav>
=======
>>>>>>> 872113e (Refine navigation and update website content)
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
              aria-label="Close mobile menu"
              className={`absolute inset-0 w-full bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ${
                navbarOpen ? "opacity-100" : "opacity-0"
              }`}
              onPointerDown={() => setNavbarOpen(false)}
            />

            <div
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className={`absolute inset-x-3 top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl transition-all duration-300 ease-out dark:border-slate-800 dark:bg-slate-900 ${
                navbarOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0"
              }`}
            >
              <nav className="flex max-h-[calc(100vh-6rem)] max-h-[calc(100dvh-6rem)] flex-col overflow-y-auto overscroll-contain text-slate-900 dark:text-white">
                <div className="flex flex-col space-y-1">
                  {headerData.map((item, index) => (
                    <div
                      key={index}
                      className="w-full rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    >
                      <MobileHeaderLink
                        item={item}
                        onNavigate={() => setNavbarOpen(false)}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-2.5 border-t border-slate-200/60 pt-4 dark:border-slate-800/60">
                  <Link
                    href="/contact"
                    className="w-full rounded-xl border border-slate-300 py-3 text-center text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                    onClick={() => setNavbarOpen(false)}
                  >
                    Contact us
                  </Link>
                  <Link
                    href="/portfolio"
                    className="w-full rounded-xl bg-blue-600 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
                    onClick={() => setNavbarOpen(false)}
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