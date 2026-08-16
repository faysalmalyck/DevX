"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/motion";
import AmbientFlare from "@/components/shared/AmbientFlare";
import LeadCaptureDialog, {
  type LeadRequest,
} from "@/components/home/final-cta/LeadCaptureDialog";

type SolutionLeadCTAProps = Readonly<{
  solutionTitle: string;
}>;

export default function SolutionLeadCTA({
  solutionTitle,
}: SolutionLeadCTAProps) {
  const [request, setRequest] = useState<LeadRequest>(null);

  return (
    <>
      <section
        aria-labelledby="solution-lead-cta-heading"
        className="relative isolate overflow-hidden bg-slate-50 py-16 text-white transition-colors duration-300 dark:bg-darkmode sm:py-20 lg:py-24"
      >
        <div className="relative mx-auto w-full max-w-[1220px] px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <AmbientFlare variant="banner" />

            <ScrollReveal preset="card" className="relative z-10">
              <div className="relative">
                {/* Blue-600 Breathing Glow */}
                <div className="absolute -inset-1 animate-pulse rounded-2xl bg-blue-600/50 blur-2xl duration-[3000ms]" />

                <div className="relative overflow-hidden rounded-2xl border border-[#3b4458] bg-[#181e2d] shadow-[0_28px_100px_rgba(2,6,23,0.35)]">
                  {/* Inside Curve Lines with Synchronized Breathing Animation */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 1220 414"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute inset-0 hidden h-full w-full animate-pulse text-[#697185]/45 duration-[4000ms] lg:block"
                  >
                    <defs>
                      {/* Gradient 1: Tapered opacity and stroke thickness (Thick mid, thin ends) */}
                      <linearGradient id="solution-curve1-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.05" />
                        <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
                      </linearGradient>

                      {/* Gradient 2: Tapered opacity and stroke thickness (Thick mid, thin ends) */}
                      <linearGradient id="solution-curve2-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.05" />
                        <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>

                    {/* Outer lower-opacity paths to create mid-section thickness taper */}
                    <path
                      d="M355 84H540C570 84 594 108 594 138V322"
                      fill="none"
                      stroke="url(#solution-curve1-gradient)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M355 84H540C570 84 594 108 594 138V322"
                      fill="none"
                      stroke="url(#solution-curve1-gradient)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      opacity="0.75"
                    />

                    <path
                      d="M924 0C890 88 895 191 940 255C997 334 1093 356 1220 319"
                      fill="none"
                      stroke="url(#solution-curve2-gradient)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M924 0C890 88 895 191 940 255C997 334 1093 356 1220 319"
                      fill="none"
                      stroke="url(#solution-curve2-gradient)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      opacity="0.75"
                    />
                  </svg>

                  <div className="relative z-10 grid min-h-[28rem] items-center gap-10 px-7 py-14 sm:px-10 sm:py-16 lg:h-[414px] lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14 lg:px-16 lg:py-0">
                    <ScrollReveal className="max-w-[650px]" delay={0.1} preset="left">
                      <h2
                        id="solution-lead-cta-heading"
                        className="text-3xl font-normal leading-[1.14] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.5rem]"
                      >
                        Have a{" "}
                        <span className="text-brand">
                          {solutionTitle.toLowerCase()}
                        </span>{" "}
                        project in mind?
                      </h2>
                    </ScrollReveal>

                    <ScrollReveal
                      className="flex flex-col items-center gap-4 sm:flex-row sm:items-center lg:justify-end lg:gap-9"
                      delay={0.2}
                      preset="right"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setRequest({ intent: "project", topics: [solutionTitle] })
                        }
                        className="inline-flex h-[4.25rem] w-full max-w-[280px] items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-8 text-lg font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(37,99,235,0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand active:translate-y-0 sm:w-auto sm:max-w-none"
                      >
                        Discuss this project
                      </button>
                    </ScrollReveal>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <LeadCaptureDialog
        request={request}
        onClose={() => setRequest(null)}
      />
    </>
  );
}