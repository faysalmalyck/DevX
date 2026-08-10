"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/motion";

export default function CtaSection() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Blue breathing glow behind */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[414px] w-full max-w-[1220px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-brand/40 opacity-70 blur-[64px] animate-pulse motion-reduce:animate-none"
          />

          {/* Main Card with #181d2c background & narrow border */}
          <ScrollReveal
            className="relative flex h-[414px] w-full items-center justify-center overflow-hidden rounded-lg border border-slate-700/60 bg-[#181d2c] px-8 md:px-12 lg:px-16"
            preset="card"
          >
            {/* Content Layer */}
            <div className="relative z-10 grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12">
              {/* Heading Text */}
              <div className="lg:col-span-7">
                <ScrollReveal
                  className="mx-auto max-w-md text-center lg:mx-0 lg:text-left"
                  delay={0.12}
                  preset="left"
                >
                  <h2 className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-3xl tracking-tight text-transparent sm:text-5xl">
                    Ready to start working{" "}
                    <span className="text-brand dark:text-brand">
                      together
                    </span>{" "}
                    with <span className="whitespace-nowrap">our team?</span>
                  </h2>
                </ScrollReveal>
              </div>

              {/* Action Buttons */}
              <div className="lg:col-span-5">
                <ScrollReveal
                  className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-end"
                  delay={0.24}
                  preset="right"
                >
                  <Link
              href="/contact"
              className="w-full max-w-[280px] sm:w-auto sm:max-w-none text-center rounded-full bg-brand px-6 sm:px-10 py-5 sm:py-6 text-lg font-semibold text-white transition-all duration-200 hover:bg-brand hover:shadow-[0_0_20px_rgba(54,88,255,0.4)] active:scale-95"
            >
              Contact us
            </Link>
            <Link
              href="/services"
              className="w-full max-w-[280px] sm:w-auto sm:max-w-none text-center rounded-full border border-slate-300 bg-white px-6 sm:px-10 py-5 sm:py-6 text-lg font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#121623] dark:text-white dark:hover:border-slate-700 dark:hover:bg-[#1a2032] dark:hover:text-white active:scale-95"
            >
              Case Studies
            </Link>
                </ScrollReveal>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
      <div style={{ height: "180px" }}></div>
      <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-600 to-transparent" />
    </section>
  );
}
