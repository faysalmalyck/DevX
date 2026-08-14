"use client";

import Link from "next/link";
import { servicesData } from "@/data/services";
import ServiceCardLink from "@/components/shared/ServiceCardLink";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";

type DevelopmentProps = {
  showImprovementCta?: boolean;
};

export default function Development({
  showImprovementCta = true,
}: DevelopmentProps) {
  return (
    <section className="relative overflow-hidden bg-white py-8 text-slate-900 transition-colors duration-200 dark:bg-darkmode dark:text-white sm:py-6 md:py-6 lg:py-6">
      {/* Background Decorative Arc */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[250px] w-[350px] sm:h-[600px] sm:w-[900px] rounded-full border border-brand/20 opacity-40 blur-2xl dark:border-brand/10 dark:opacity-30"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <ScrollReveal
          className="mb-8 sm:mb-14 md:mb-16 text-center"
          preset="heading"
        >
          <h2 className="mx-auto max-w-4xl text-4xl sm:text-4xl md:text-5xl py-4 sm:py-10 md:py-16 tracking-tight text-slate-900 dark:text-white leading-tight sm:leading-snug">
            We Deliver Business Solutions Across all{" "}
            <span className="text-brand dark:text-brand">technologies</span> &amp;{" "}
            <span className="text-brand dark:text-brand">platforms</span>.
          </h2>
        </ScrollReveal>

        {/* Cards Grid Section */}
        <StaggerContainer className="grid items-stretch grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {servicesData.map((service, index) => (
            <StaggerItem
              key={service.id}
              className="h-full"
              preset="card"
            >
              <ServiceCardLink
                id={service.id}
                title={service.title}
                description={service.description}
                image={service.icon}
                href={service.href}
                priority={index < 3}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {showImprovementCta && (
          <ScrollReveal
            className="mx-auto mt-16 sm:mt-24 md:mt-28 max-w-3xl text-center"
            delay={0.12}
            preset="copy"
          >
            <h3 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Already Using Software? We Can Make It Better.
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-base text-slate-600 dark:text-slate-300">
              Upgrade legacy systems, enhance performance, or add advanced features seamlessly.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href="/services"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-brand px-8 py-5 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-brand/90 hover:shadow-[0_0_25px_rgba(54,88,255,0.4)] active:scale-95"
              >
                <span>Improve My Software</span>
                <svg
                  className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        )}
      </div>

    </section>
  );
}
