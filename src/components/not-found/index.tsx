"use client";

import React from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/motion";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#181d2b] py-16 text-white dark:bg-[#181d2b] sm:py-24 lg:py-32">
      {/* Top Right Ambient Arc */}
      <svg
        className="pointer-events-none absolute -right-20 -top-20 h-[500px] w-[500px] opacity-70 sm:right-0 sm:top-0 sm:h-[600px] sm:w-[600px]"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 600 100 A 450 450 0 0 0 150 600"
          stroke="url(#topArcGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="topArcGradient" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#1d4ed8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#181d2b" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Bottom Left Breathing Gradient Line (Symmetrical Taper) */}
      {/* L Shape Gradient */}
<svg
        className="pointer-events-none absolute bottom-[-67px] left-[280px] hidden h-[420px] w-[420px] sm:block"
        viewBox="0 0 420 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
  <defs>
    {/* Gradient */}
    <linearGradient
      id="lShapeGradient"
      x1="70"
      y1="50"
      x2="350"
      y2="350"
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
      id="lShapeGlow"
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
      M 70 50
      V 300
      Q 70 350 120 350
      H 370
    "
    stroke="url(#lShapeGradient)"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    filter="url(#lShapeGlow)"
    className="animate-[pulse_5s_ease-in-out_infinite]"
  />
</svg>
      {/* Main Centered Content Card */}
      <div className="relative z-10 mt-15 mx-auto w-full max-w-xl px-4 sm:px-6">
        <ScrollReveal preset="hero">
          <div className="flex flex-col items-center rounded-lg border border-slate-800/80 bg-gradient-to-b from-[#262E43] via-[#1F263B] to-[#191F31] p-8 text-center shadow-sm backdrop-blur-md sm:rounded-lg sm:p-12 md:p-16 dark:border-slate-800/80">
            {/* 404 Header Number */}
            <h1 className="text-6xl font-medium tracking-tight text-white sm:text-7xl md:text-8xl lg:text-[100px] leading-none">
              404
            </h1>

            {/* Subheading */}
            <h2 className="mt-4 text-2xl font-medium tracking-tight text-white sm:mt-6 sm:text-3xl md:text-4xl">
              Page not found
            </h2>

            {/* Description */}
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300 sm:mt-4 sm:text-base sm:leading-7 dark:text-slate-300">
              The page you are looking for doesn&apos;t exist, has been removed, or is temporarily unavailable.
            </p>

            {/* Action Button */}
            <div className="mt-8 sm:mt-10">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-brand px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand/25 transition-all duration-300 hover:bg-brand/90 hover:shadow-[0_0_25px_rgba(54,88,255,0.4)] active:scale-95 sm:px-10 sm:py-4"
              >
                Back home
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}