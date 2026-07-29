'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CaseStudy } from '@/data/case-studies';

export default function CaseStudyHero({ study }: { study: CaseStudy }) {
  return (
    <section className="relative overflow-hidden bg-[#0B0F17] pt-28 pb-16 lg:pt-36 lg:pb-24 text-white">
      {/* Decorative Vector Arches Background */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden" aria-hidden="true">
        <svg
          className="absolute left-1/2 top-12 -translate-x-1/2 w-[1200px] h-[800px] opacity-25"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Arch */}
          <path
            d="M-100 600 C 100 200, 400 100, 600 250"
            stroke={`url(#hero-gradient-1-${study.slug})`}
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {/* Right Arch */}
          <path
            d="M 600 250 C 800 400, 1100 300, 1300 700"
            stroke={`url(#hero-gradient-2-${study.slug})`}
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient id={`hero-gradient-1-${study.slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id={`hero-gradient-2-${study.slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Link */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            href="/case-studies"
            className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors"
          >
            <span className="mr-2">←</span> Back to Case Studies
          </Link>
        </motion.div>

        {/* Center Header Area */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          {/* Top Logo Container with Increased Size */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="h-10 sm:h-12 relative w-40 sm:w-48">
              <Image
                src={study.logo}
                alt=""
                fill
                sizes="(max-width: 640px) 160px, 192px"
                className="object-contain object-center brightness-[2.5] dark:brightness-100"
              />
            </div>
          </motion.div>

          {/* Centered Title without Bold */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.15]"
          >
            {study.title}
          </motion.h1>
        </div>

        {/* Main Image */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative aspect-[16/9] w-full overflow-hidden rounded-lg group"
        >
          <Image
            src={study.featuredImage}
            alt={study.title}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}