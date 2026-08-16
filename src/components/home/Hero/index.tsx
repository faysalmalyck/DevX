"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import LeadCaptureDialog, {
  type LeadRequest,
} from "@/components/home/final-cta/LeadCaptureDialog";

import AmbientFlare from "@/components/shared/AmbientFlare";

export default function HeroSection() {
  const [leadRequest, setLeadRequest] = useState<LeadRequest>(null);

  const logos = [
    {
      src: "https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/655252e496e7f416a92204d0_application-logo-dev-x-webflow-template.svg",
      alt: "Application Logo",
    },
    {
      src: "https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/655252e4ced4f1a5dd7ee116_business-logo-dev-x-webflow-template.svg",
      alt: "Business Logo",
    },
    {
      src: "https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/655252e4136dc82b49eae38d_company-logo-dev-x-webflow-template.svg",
      alt: "Company Logo",
    },
    {
      src: "https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/655252e4833171836532c49f_enterprise-logo-dev-x-webflow-template.svg",
      alt: "Enterprise Logo",
    },
    {
      src: "https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/655252e4dd8946ca68a48a09_institute-logo-dev-x-webflow-template.svg",
      alt: "Institute Logo",
    },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-white pb-12 pt-28 transition-colors duration-300 dark:bg-[#181d2b] sm:pb-20 sm:pt-36 lg:pb-32 lg:pt-44">
        <AmbientFlare variant="hero" className="pointer-events-none absolute -top-[10%] lg:-right-[6%]" />
        {/* Background Graphic Element */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-16 z-[1] w-[175vw] max-w-none -translate-x-1/2 opacity-[0.18] dark:opacity-[0.48] sm:top-20 sm:w-[108vw] sm:max-w-[860px] sm:opacity-[0.16] sm:dark:opacity-[0.4] lg:left-auto lg:-right-[475px] lg:top-[52%] lg:w-[1971.5px] lg:max-w-none lg:-translate-y-1/2 lg:translate-x-0 lg:origin-right lg:scale-80 lg:opacity-100 lg:dark:opacity-100"
        >
          <ScrollReveal className="w-full" preset="image">
            <div className="w-full animate-float-slow motion-reduce:animate-none">
              <Image
                src="/images/hero/hero.png"
                alt=""
                width={3943}
                height={2653}
                priority
                sizes="(max-width: 639px) 175vw, (max-width: 1023px) 860px, 1972px"
                className="w-full h-auto object-contain"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* Top Left Circular Flare Arc */}
        <svg
          className="pointer-events-none absolute -left-15 top-20 hidden h-[500px] w-[500px] sm:block"
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

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-start">
            <div className="w-full lg:w-[677px] text-center lg:text-left pt-2 sm:pt-6 lg:pt-24">
              <div className="max-w-[550px] mx-auto lg:mx-0">
                {/* Main Heading */}
                <ScrollReveal preset="hero">
                  <h1 className="text-balance text-4xl leading-[1.15] tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                    We Build the Technology Behind{" "}
                    <span className="text-brand dark:text-brand">
                      Growing Businesses
                    </span>
                    .
                  </h1>
                </ScrollReveal>

                {/* Subtitle / Paragraph */}
                <ScrollReveal
                  className="mt-4 sm:mt-6 max-w-[591px]"
                  delay={0.12}
                  preset="copy"
                >
                  <p className="mb-6 text-balance text-base leading-relaxed text-gray-600 dark:text-white sm:mb-8">
                    From strategy and design to scalable development, we help
                    ambitious businesses turn complex ideas into reliable
                    digital products that drive measurable growth.
                  </p>
                </ScrollReveal>

                {/* Action Buttons */}
                <ScrollReveal
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4"
                  delay={0.24}
                  preset="copy"
                >
                  <button
                    type="button"
                    onClick={() => setLeadRequest({ intent: "consultation" })}
                    className="w-full max-w-[280px] sm:w-auto sm:max-w-none inline-flex items-center justify-center px-6 sm:px-10 py-5 sm:py-5.5 text-lg font-semibold text-white bg-brand hover:bg-brand rounded-full transition-all duration-200 shadow-lg shadow-brand/25 active:scale-95 cursor-pointer"
                  >
                    Book a Free Consultation
                  </button>
                  <Link
                    href="/services"
                    className="w-full max-w-[280px] sm:w-auto sm:max-w-none text-center rounded-full border border-slate-300 bg-white px-6 sm:px-10 py-5 sm:py-6 text-lg font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#121623] dark:text-white dark:hover:border-slate-700 dark:hover:bg-[#1a2032] dark:hover:text-white active:scale-95"
                  >
                    Our services
                  </Link>
                </ScrollReveal>
              </div>
            </div>
          </div>

          {/* Logo Strip Below Hero */}
          <ScrollReveal
            className="mt-16 sm:mt-36 lg:mt-52 pt-8 sm:pt-16 border-t border-gray-200 dark:border-gray-800/60"
            delay={0.36}
            preset="copy"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
              <div className="text-center lg:text-left shrink-0">
                <p className="text-base sm:text-base font-bold text-gray-900 dark:text-white tracking-wide">
                  Trusted by{" "}
                  <span className="whitespace-nowrap">amazing clients</span>
                </p>
              </div>

              <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 items-center justify-items-center w-full lg:w-auto">
                {logos.map((logo) => (
                  <StaggerItem
                    key={logo.src}
                    className="relative h-7 sm:h-8 w-24 sm:w-32 flex items-center justify-center opacity-75 hover:opacity-100 transition-opacity duration-200 dark:invert-0 invert"
                    preset="image"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      fill
                      className="object-contain"
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <LeadCaptureDialog
        request={leadRequest}
        onClose={() => setLeadRequest(null)}
      />
    </>
  );
}

