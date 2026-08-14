"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Layers3, Workflow } from "lucide-react";
import { ScrollReveal } from "@/components/motion";
import LeadCaptureDialog, { type LeadRequest } from "./LeadCaptureDialog";

export default function FinalCTA() {
  const [leadRequest, setLeadRequest] = useState<LeadRequest>(null);

  return (
    <>
      <section className="relative overflow-hidden border-t border-slate-200/70 bg-white py-20 text-slate-900 dark:border-white/10 dark:bg-darkmode dark:text-white sm:py-28 md:py-32">
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal
            className="mx-auto max-w-2xl text-center"
            preset="heading"
          >
            <h2 className="text-balance text-4xl font-medium leading-snug tracking-tight sm:text-4xl sm:leading-tight md:text-5xl">
              Ready to Fix What&apos;s Slowing Your{" "}
              <span className="text-brand">Business Down?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              Tell us where work gets stuck. We&apos;ll help you decide whether
              the right next step is new software, modernization, automation,
              or integration.
            </p>
          </ScrollReveal>

          <ScrollReveal preset="card" className="relative mt-14">
            <div
              data-testid="final-cta-card"
              className="grid grid-cols-1 overflow-hidden rounded-lg border border-slate-200 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-brand/40 hover:shadow-[0_12px_30px_rgba(54,88,255,0.16)] dark:border-slate-700/80 dark:shadow-none dark:hover:border-blue-400/50 md:grid-cols-2"
            >
              <button
                type="button"
                onClick={() => setLeadRequest({ intent: "process" })}
                className="group relative flex flex-col justify-between gap-8 bg-gradient-to-br from-brand to-[#2540c9] px-8 py-10 text-left text-white transition duration-300 hover:brightness-110 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white sm:px-10 sm:py-12"
              >
                <div>
                  <Workflow
                    className="h-8 w-8 text-white/90"
                    strokeWidth={1.5}
                  />
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight">
                    Let&apos;s Fix Your Process
                  </h3>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-white/90">
                    Share the bottlenecks, manual work, or disconnected
                    systems creating friction across the business.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                  Start the conversation
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </button>

              <Link
                href="/services/business-problems"
                className="group relative flex flex-col justify-between gap-8 border-t border-slate-200 bg-white px-8 py-10 text-left transition duration-300 hover:bg-slate-50 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand dark:border-slate-700/80 dark:bg-[#12151f] dark:hover:bg-[#161a27] dark:focus-visible:outline-blue-400 sm:px-10 sm:py-12 md:border-l md:border-t-0"
              >
                <div>
                  <Layers3 className="h-8 w-8 text-brand" strokeWidth={1.5} />
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight">
                    Explore Our Services
                  </h3>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Review the service paths, then select the challenges and
                    capabilities that fit your business.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                  View services
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </div>

            <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white font-mono text-[11px] uppercase tracking-wide text-slate-500 dark:border-white/15 dark:bg-darkmode dark:text-slate-400 md:flex">
              or
            </div>
          </ScrollReveal>
        </div>
      </section>

      <LeadCaptureDialog request={leadRequest} onClose={() => setLeadRequest(null)} />
    </>
  );
}
