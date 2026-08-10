"use client";

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { socialPlatforms } from './data';
import { HoverCard, ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion";

export default function SocialLinks() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-slate-50 dark:bg-[#181d2b] transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Section Header */}
        <ScrollReveal preset="heading" className="space-y-4 sm:space-y-6 max-w-lg mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-rote tracking-tight text-slate-900 dark:text-white">
            Follow us for <span className="text-brand"> great content </span> about coding & development
          </h2>
        </ScrollReveal>

        {/* Social Cards Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <StaggerItem key={platform.id} preset="card" className="h-full">
                <HoverCard className="h-full">
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative flex h-full flex-col p-6 sm:p-8 rounded-lg bg-white dark:bg-[#232c3e]/40 border border-slate-200 dark:border-[#273046] shadow-sm dark:shadow-none transition-all duration-300 ease-in-out hover:border-brand/50 ${platform.colorHex} focus:outline-none focus:ring-2 focus:ring-brand`}
                    aria-label={`Visit our ${platform.name} page`}
                  >
                    {/* Header with Icon and Arrow */}
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-[#2a3449] border border-slate-200 dark:border-[#323d56] text-slate-700 dark:text-white group-hover:text-slate-900 dark:group-hover:text-white group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-6 h-6" strokeWidth={1.5} />
                      </div>
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent text-slate-400 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-[#181d2b] transition-all duration-300 -translate-y-1 translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0">
                        <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 mt-auto">
                      <h3 className="text-lg sm:text-xl font-medium text-slate-900 dark:text-white">
                        {platform.name}
                      </h3>
                      <p className="text-slate-600 dark:text-white text-base sm:text-base leading-relaxed">
                        {platform.description}
                      </p>
                    </div>
                  </a>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}