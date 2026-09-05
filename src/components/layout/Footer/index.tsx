"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  const isAuthOrAdminPage =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/sales") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/reset-password");

  if (isAuthOrAdminPage) {
    return null;
  }

  return (
    <footer className="w-full bg-[#181d2b] text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Top Section */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-slate-800 py-12 md:flex-row md:items-center">

          <div className="max-w-md space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo/DevX.svg"
                alt="Dev X Logo"
                width={240}
                height={80}
                className="h-12 w-auto"
                priority
              />
            </Link>

            <p className="text-base text-white">
              Trusted by growing businesses to architect, develop, and scale
              secure, high performance software systems built for long term
              success.
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-4 sm:flex-row md:w-auto">
            <Link
              href="/contact"
              className="w-full max-w-[280px] rounded-full bg-brand px-6 py-5 text-center text-lg font-semibold text-white transition-all duration-200 hover:bg-brand hover:shadow-[0_0_20px_rgba(54,88,255,0.4)] active:scale-95 sm:w-auto sm:max-w-none sm:px-10 sm:py-6"
            >
              Contact us
            </Link>

            <Link
              href="/services"
              className="w-full max-w-[280px] rounded-full border border-slate-300 bg-white px-6 py-5 text-center text-lg font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#121623] dark:text-white dark:hover:border-slate-700 dark:hover:bg-[#1a2032] dark:hover:text-white active:scale-95 sm:w-auto sm:max-w-none sm:px-10 sm:py-6"
            >
              Browse Services
            </Link>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-[auto_auto_auto_1fr] md:gap-x-12 lg:grid-cols-[auto_auto_auto_1fr] lg:gap-x-16">

          {/* Pages */}
          <div>
            <h3 className="mb-4 text-xl font-extrabold text-white">
              Pages
            </h3>

            <ul className="space-y-3 text-lg font-medium text-slate-200">
              <li>
                <Link href="/" className="transition hover:text-blue-500">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/about" className="transition hover:text-blue-500">
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/business-problem"
                  className="transition hover:text-blue-500"
                >
                  Business Problem
                </Link>
              </li>

              <li>
                <Link href="/careers" className="transition hover:text-blue-500">
                  Careers
                </Link>
              </li>

              <li>
                <Link
                  href="/case-studies"
                  className="transition hover:text-blue-500"
                >
                  Case Studies
                </Link>
              </li>

              <li>
                <Link href="/blog" className="transition hover:text-blue-500">
                  Blogs & Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-xl font-extrabold text-white">
              Services
            </h3>

            <div className="grid grid-cols-2 gap-x-5">
              <ul className="space-y-3 text-lg font-medium text-slate-200">
                <li>
                  <Link
                    href="/services/custom-software-development"
                    className="transition hover:text-blue-500"
                  >
                    Custom Software
                  </Link>
                </li>

                <li>
                  <Link
                    href="/services/web-development"
                    className="transition hover:text-blue-500"
                  >
                    Web Development
                  </Link>
                </li>

                <li>
                  <Link
                    href="/services/mobile-applications"
                    className="transition hover:text-blue-500"
                  >
                    Mobile Applications
                  </Link>
                </li>

                <li>
                  <Link
                    href="/services/SaaS"
                    className="transition hover:text-blue-500"
                  >
                    SaaS
                  </Link>
                </li>

                <li>
                  <Link
                    href="/services/ai-solutions"
                    className="transition hover:text-blue-500"
                  >
                    AI Solutions
                  </Link>
                </li>
              </ul>

              <ul className="space-y-3 text-lg font-medium text-slate-200">
                <li>
                  <Link
                    href="/services/crm-erp"
                    className="transition hover:text-blue-500"
                  >
                    CRM/ERP
                  </Link>
                </li>

                <li>
                  <Link
                    href="/services/business-automation"
                    className="transition hover:text-blue-500"
                  >
                    Business Automation
                  </Link>
                </li>

                <li>
                  <Link
                    href="/services/legacy-modernization"
                    className="transition hover:text-blue-500"
                  >
                    Legacy Modernization
                  </Link>
                </li>

                <li>
                  <Link
                    href="/databases-data-science"
                    className="transition hover:text-blue-500"
                  >
                    Databases & Data Science
                  </Link>
                </li>

                <li>
                  <Link
                    href="/services/system-integration"
                    className="transition hover:text-blue-500"
                  >
                    System Integration
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Utilities */}
          <div>
            <h3 className="mb-4 text-xl font-extrabold text-white">
              Utilities
            </h3>

            <ul className="space-y-3 text-base font-medium text-slate-200">
              <li>
                <Link
                  href="/portfolio"
                  className="transition hover:text-blue-500"
                >
                  Clients
                </Link>
              </li>

              <li>
                <Link
                  href="/pricing"
                  className="transition hover:text-blue-500"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="max-w-sm md:ml-auto md:pl-8 lg:pl-12">
            <h3 className="mb-2 text-xl font-extrabold text-white">
              Subscribe to our newsletter
            </h3>

            <p className="mb-4 text-lg text-white">
              To be updated with all the latest trends and product releases.
            </p>

            <form className="flex flex-col items-center gap-3 sm:items-stretch">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full rounded-full border border-slate-200 bg-white px-8 py-3.5 text-slate-900 placeholder-slate-400 transition-all duration-300 ease-in-out hover:ring-1 hover:ring-slate-300 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/40 dark:border-[#2E3850] dark:bg-[#232B3E] dark:text-white dark:placeholder-slate-400 dark:hover:ring-slate-500/30 dark:focus:border-slate-500 dark:focus:ring-slate-500/40 sm:py-5.5"
              />

              <button
                type="submit"
                className="w-full max-w-[280px] rounded-full bg-brand px-6 py-5 text-center text-lg font-semibold text-white transition-all duration-200 hover:bg-brand hover:shadow-[0_0_20px_rgba(54,88,255,0.4)] active:scale-95 sm:w-auto sm:max-w-none sm:px-10 sm:py-6"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 py-8 text-center text-base text-white md:flex-row md:text-left">

          <p>
            Copyright © 2026 Dev X | Powered by{" "}
            <a
              href="https://www.instagram.com/faysal.malyck/"
              target="_blank"
              rel="noreferrer"
              className="text-slate-200 font-medium transition hover:text-blue-500"
            >
              Faysal Malick
            </a>
          </p>

          <div className="flex space-x-3">

            {/* Facebook */}
            <a
              href="https://www.facebook.com/developersexperience1"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="group relative flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700/60 bg-gradient-to-b from-slate-800/90 to-slate-900/90 text-slate-400 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:text-brand hover:shadow-[0_0_20px_rgba(54,88,255,0.35)]"
            >
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22 12A10 10 0 1 0 10.44 21.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/development.experience/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="group relative flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700/60 bg-gradient-to-b from-slate-800/90 to-slate-900/90 text-slate-400 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/50 hover:text-pink-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.35)]"
            >
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm5.25-3.15a1.1 1.1 0 1 1-1.1 1.1 1.1 0 0 1 1.1-1.1Z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="group relative flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700/60 bg-gradient-to-b from-slate-800/90 to-slate-900/90 text-slate-400 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/50 hover:text-sky-400 hover:shadow-[0_0_20px_rgba(14,165,233,0.35)]"
            >
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4.98 3.5A1.48 1.48 0 1 1 3.5 4.98 1.48 1.48 0 0 1 4.98 3.5ZM3.5 8h3v12h-3Zm5 0h2.88v1.64h.04c.4-.76 1.38-1.56 2.84-1.56C17.2 8.08 19 9.6 19 13v7h-3v-6.2c0-1.48-.03-3.38-2.06-3.38-2.07 0-2.39 1.62-2.39 3.28V20h-3Z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="group relative flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700/60 bg-gradient-to-b from-slate-800/90 to-slate-900/90 text-slate-400 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:text-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.35)]"
            >
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 0 0 .5 6.2C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.8.5-5.8.5-5.8s0-4-.5-5.8ZM9.75 15.5v-7L16 12l-6.25 3.5Z" />
              </svg>
            </a>

          </div>
        </div>

      </div>
    </footer>
  );
}