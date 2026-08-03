"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";

export default function CtaSection() {
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true, rootMargin: "-50px" });

  return (
    <section ref={ref} className="py-12">
      <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Blue breathing glow behind */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[414px] w-full max-w-[1220px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-blue-600/40 opacity-70 blur-[64px] animate-pulse"
          />

          {/* Main Card with #181d2c background & narrow border */}
          <div
            className={`relative flex h-[414px] w-full items-center justify-center overflow-hidden rounded-lg border border-slate-700/60 bg-[#181d2c] px-8 md:px-12 lg:px-16 transition-all duration-600 ease-out ${
              isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}
          >
            {/* Content Layer */}
            <div className="relative z-10 grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12">
              {/* Heading Text */}
              <div className="lg:col-span-7">
                <div
                  className={`mx-auto max-w-md text-center lg:mx-0 lg:text-left transition-all duration-500 ease-out delay-200 ${
                    isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
                  }`}
                >
                  <h2 className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-3xl tracking-tight text-transparent sm:text-5xl">
                    Ready to start working{" "}
                    <span className="text-blue-600 dark:text-blue-500">
                      together
                    </span>{" "}
                    with <span className="whitespace-nowrap">our team?</span>
                  </h2>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="lg:col-span-5">
                <div
                  className={`flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-end transition-all duration-500 ease-out delay-300 ${
                    isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'
                  }`}
                >
                  <Link
                    href="/contact"
                    className="w-full sm:w-auto text-center rounded-full bg-blue-600 px-10 py-6 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"
                  >
                    Contact us
                  </Link>
                  <Link
                    href="/services"
                    className="w-full sm:w-auto text-center rounded-full border border-slate-300 bg-white px-10 py-6 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#121623] dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-[#1a2032] dark:hover:text-white active:scale-95"
                  >
                    Browse Case Studies
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: "180px" }}></div>
      <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-600 to-transparent" />
    </section>
  );
}