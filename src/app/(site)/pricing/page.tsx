"use client";

import Link from "next/link";
import { pricingPlansData } from "@/data/pricingdata";
import FAQ from "@/components/contact/FAQ";
import { HoverCard, ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion";

export default function PricingPage() {
  const plans = pricingPlansData ?? [];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white dark:bg-[#181d2b] pt-20 pb-16 text-slate-900 transition-colors duration-300 md:pt-32 md:pb-20 dark:text-white">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header Section */}
        <ScrollReveal className="mx-auto mb-10 max-w-4xl pt-4 text-center md:mb-16 md:pt-8" preset="hero">
          <h1 className="mb-4 text-3xl tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">
            Pricing for all types of{" "}
            <span className="text-blue-600 dark:text-blue-500">companies</span> and{" "}
            <span className="text-blue-600 dark:text-blue-500">needs</span>
          </h1>
        </ScrollReveal>

        {/* Cards Joined Horizontally */}
        <StaggerContainer className="grid grid-cols-1 items-stretch overflow-hidden rounded-2xl border border-slate-200 shadow-xl md:grid-cols-3 md:rounded-lg dark:border-slate-600/80 dark:shadow-2xl">
          {plans.map((plan, index) => {
            const features = plan.features ?? [];
            const isFirst = index === 0;
            const isLast = index === plans.length - 1;

            return (
              <StaggerItem key={plan.id} className="h-full" preset="card">
                <HoverCard className="h-full">
                  <div
                    className={`relative flex h-full min-h-[550px] flex-col justify-between bg-slate-50 p-6 transition-all duration-300 hover:border-blue-500/40 sm:p-8 md:min-h-[650px] md:p-10 lg:p-12 dark:bg-gradient-to-b dark:from-[#252E42] dark:to-[#1A2033] ${
                      !isLast ? "border-b border-slate-200 md:border-b-0 md:border-r dark:border-slate-500/80" : ""
                    } ${
                      plan.isPopular
                        ? "z-10 border border-blue-600 shadow-2xl dark:border-blue-500"
                        : "hover:bg-slate-100 dark:hover:brightness-110"
                    } ${isFirst ? "md:rounded-l-2xl" : ""} ${isLast ? "md:rounded-r-2xl" : ""}`}
                  >
                    <div className="flex h-full flex-col justify-between">
                      <div>
                        <div className="mb-8">
                          <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">
                            {plan.name}
                          </h2>
                          <div className="mb-4 text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-white">
                            {plan.price}
                          </div>
                          <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                            {plan.description}
                          </p>
                        </div>

                        <Link
                          href={plan.link ?? "#"}
                          className={`block text-center font-medium ${
                            plan.isPopular
                              ? "w-full rounded-full bg-blue-600 py-4 px-6 text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-500 sm:py-5"
                              : "w-full px-8 py-3.5 sm:py-5.5 rounded-full bg-white dark:bg-[#232B3E] border border-slate-200 dark:border-[#2E3850] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-slate-500 focus:ring-1 focus:ring-blue-500/40 dark:focus:ring-slate-500/40 hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-500/30 transition-all ease-in-out duration-300"
                          }`}
                        >
                          Get started
                        </Link>
                      </div>

                      <div className="mt-8 border-t border-slate-200 pt-6 sm:mt-12 sm:pt-8 dark:border-slate-700/60">
                        <div className="mb-4 text-base font-semibold text-slate-900 sm:mb-6 dark:text-white">
                          What's included:
                        </div>
                        <ul className="space-y-3 sm:space-y-4">
                          {features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-center text-sm font-semibold text-slate-700 sm:text-base dark:text-slate-300"
                            >
                              <svg
                                className={`mr-3 h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6 ${
                                  plan.isPopular
                                    ? "text-blue-600 dark:text-blue-500"
                                    : "text-slate-500 dark:text-slate-400"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>

      {/* FAQ Section Wrapper */}
      <div className="my-12 sm:my-16 md:my-24">
        <FAQ />
      </div>
    </section>
  );
}
