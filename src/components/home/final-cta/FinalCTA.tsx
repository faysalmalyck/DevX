"use client";

import { useState } from "react";
import { CalendarCheck, Send, ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/motion";
import LeadCaptureDialog, { type LeadIntent } from "./LeadCaptureDialog";

export default function FinalCTA() {
  const [activeIntent, setActiveIntent] = useState<LeadIntent | null>(null);

  return (
    <>
      <section className="relative overflow-hidden bg-slate-50 py-20 text-slate-900 dark:bg-[#181d2b] dark:text-white sm:py-28 md:py-32">
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal
            className="mx-auto max-w-2xl text-center"
            preset="heading"
          >
            <h2 className="mt-4 text-4xl font-normal leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Have a <span className="text-brand">Business Problem</span>
              <br className="hidden sm:block" /> Technology Can Solve?
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              There are two ways to start — pick whichever fits how you think
              through a decision.
            </p>
          </ScrollReveal>

          <ScrollReveal preset="card" className="relative mt-14">
            <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setActiveIntent("consultation")}
                className="group relative flex flex-col justify-between gap-8 bg-gradient-to-br from-brand to-[#2540c9] px-8 py-10 text-left text-white transition duration-300 hover:brightness-110 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white sm:px-10 sm:py-12"
              >
                <div>
                  <CalendarCheck
                    className="h-8 w-8 text-white/90"
                    strokeWidth={1.5}
                  />
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight">
                    Book a Free Consultation
                  </h3>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-white/90">
                    Get on a call this week and walk through what&apos;s
                    slowing you down.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                  Schedule a call
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveIntent("project")}
                className="group relative flex flex-col justify-between gap-8 border-t border-slate-200 bg-white px-8 py-10 text-left transition duration-300 hover:bg-slate-50 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand dark:border-white/10 dark:bg-[#12151f] dark:hover:bg-[#161a27] sm:px-10 sm:py-12 md:border-l md:border-t-0"
              >
                <div>
                  <Send className="h-8 w-8 text-brand" strokeWidth={1.5} />
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight">
                    Tell Us About Your Project
                  </h3>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Send the details and get a considered response from our
                    team.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                  Share the brief
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </button>
            </div>

            <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white font-mono text-[11px] uppercase tracking-wide text-slate-500 dark:border-white/15 dark:bg-[#181d2b] dark:text-slate-400 md:flex">
              or
            </div>
          </ScrollReveal>
        </div>
      </section>

      <LeadCaptureDialog intent={activeIntent} onClose={() => setActiveIntent(null)} />
    </>
  );
}
