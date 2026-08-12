"use client";

import Image from "next/image";
import Link from "next/link";
import { servicesData } from "@/data/services";
import {
  HoverCard,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";

export default function Development() {
  return (
    <section className="relative overflow-hidden bg-white text-slate-900 transition-colors duration-200 dark:bg-[#181d2b] dark:text-white py-8 sm:py-12 md:py-20 lg:py-24">
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
              <HoverCard className="h-full">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-brand/40 hover:shadow-[0_12px_30px_rgba(54,88,255,0.16)] dark:border-slate-700/80 dark:bg-gradient-to-b dark:from-[#2A3147] dark:via-[#232B40] dark:to-[#1B2235] dark:shadow-none dark:hover:border-blue-400/50">
                  {/* Graphic Section */}
                  <div className="relative flex h-52 sm:h-56 md:h-64 w-full items-center justify-center overflow-hidden rounded-t-xl bg-slate-100/50 dark:bg-transparent">
                    <div
                      className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
                      style={{
                        backgroundImage:
                          "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-transparent dark:from-brand/5 opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

                    <ScrollReveal className="absolute inset-0" preset="image">
                      <div className="relative h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
                        <Image
                          src={service.icon.src}
                          alt={service.icon.alt}
                          fill
                          priority={index < 3}
                          className="object-cover object-center"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    </ScrollReveal>
                  </div>

                  {/* Divider */}
                  <div className="mb-4 sm:mb-6 h-px bg-slate-200 dark:bg-slate-700/80 transition-colors duration-300 group-hover:bg-brand/40" />

                  {/* Content */}
                  <div className="flex flex-1 flex-col px-5 sm:px-6 md:px-8 pb-6">
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-brand dark:group-hover:text-brand">
                      {service.title}
                    </h3>

                    <p className="mt-2 text-base sm:text-base leading-6 sm:leading-7 text-slate-600 dark:text-white">
                      {service.description}
                    </p>
                  </div>
                </div>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA Section */}
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
              href="/contact"
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
      </div>

      <div className="my-6 sm:my-12 h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent opacity-60" />
    </section>
  );
}