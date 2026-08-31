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
  showHeading?: boolean;
  showCornerFlares?: boolean;
};

export default function Development({
  showImprovementCta = true,
  showHeading = true,
  showCornerFlares = true,
}: DevelopmentProps) {
  const bottomFlarePosClass = showImprovementCta
    ? "bottom-6"
    : "-bottom-24 sm:-bottom-32 lg:-bottom-36";

  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-16 text-slate-900 transition-colors duration-200 dark:bg-darkmode dark:text-white sm:pt-6 sm:pb-24 md:pt-6 md:pb-28 lg:pt-6 lg:pb-32">
      {/* Background Decorative Arc */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[250px] w-[350px] sm:h-[600px] sm:w-[900px] rounded-full border border-brand/20 opacity-40 blur-2xl dark:border-brand/10 dark:opacity-30"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {showHeading && (
          <ScrollReveal
            className="mb-8 text-center sm:mb-14 md:mb-16"
            preset="heading"
          >
            <h2 className="mx-auto max-w-4xl py-4 text-4xl leading-tight tracking-tight text-slate-900 dark:text-white sm:py-10 sm:text-4xl sm:leading-snug md:py-16 md:text-5xl">
              We Deliver Business Solutions Across all{" "}
              <span className="text-brand dark:text-brand">technologies</span> &amp;{" "}
              <span className="text-brand dark:text-brand">platforms</span>.
            </h2>
          </ScrollReveal>
        )}

        {showCornerFlares && (
          <>
            {/* Top Left Circular Flare Arc */}
            <svg
              className="pointer-events-none absolute -left-40 top-20 hidden h-[500px] w-[500px] sm:block"
              viewBox="0 0 500 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="flareArcGradient"
                  x1="70"
                  y1="400"
                  x2="400"
                  y2="70"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#4360cbff" stopOpacity="0" />
                  <stop offset="20%" stopColor="#4360cbff" stopOpacity="0.15" />
                  <stop offset="45%" stopColor="#4f6df5" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#4360cbff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#4360cbff" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path
                d="M 100 400 A 200 200 0 0 1 400 100"
                stroke="url(#flareArcGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Bottom Right L Shape */}
            <svg
              className={`pointer-events-none absolute -right-20 hidden h-[420px] w-[420px] sm:block ${bottomFlarePosClass}`}
              viewBox="0 0 420 420"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Gradient */}
                <linearGradient
                  id="bottomRightLGradient"
                  x1="40"
                  y1="350"
                  x2="350"
                  y2="80"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#3154d8" stopOpacity="0" />
                  <stop offset="20%" stopColor="#3154d8" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#4f6df5" stopOpacity="1" />
                  <stop offset="80%" stopColor="#3154d8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3154d8" stopOpacity="0" />
                </linearGradient>

                {/* Soft Glow */}
                <filter
                  id="bottomRightLGlow"
                  x="-30%"
                  y="-30%"
                  width="160%"
                  height="160%"
                >
                  <feGaussianBlur stdDeviation="2" result="blur" />

                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="
                  M 40 350
                  H 320
                  Q 370 350 370 300
                  V 40
                "
                stroke="url(#bottomRightLGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                filter="url(#bottomRightLGlow)"
                className="animate-[pulse_5s_ease-in-out_infinite]"
              />
            </svg>
          </>
        )}

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
                href="/services/business-problems"
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
