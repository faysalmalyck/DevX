'use client';

import { CaseStudy } from '@/data/case-studies';
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion';

export default function ProjectOverview({ study }: { study: CaseStudy }) {
  const metadataItems = [
    { label: 'CLIENT', value: study.client },
    { label: 'YEAR', value: study.completionDate },
    {
      label: 'SERVICES',
      value: study.services?.join(', ') || 'Frontend Development',
    },
    {
      label: 'PLATFORM',
      value: study.techStack?.slice(0, 2).join(' & ') || 'Web and Mobile',
    },
  ];

  return (
    <section className="relative border-t border-slate-200/80 dark:border-slate-800/40 bg-white dark:bg-[#181d2b] pt-28 pb-16 text-slate-900 dark:text-white lg:pt-40 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Project Overview Header & Metadata */}
        <div className="grid grid-cols-1 items-start gap-20 lg:grid-cols-12 lg:gap-32">
          {/* Left Column */}
          <ScrollReveal className="space-y-6 lg:col-span-6" preset="left">
            <h2 className="mb-6 text-3xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
              {study.overview.title}
            </h2>

            <div className="space-y-6 text-base font-light leading-relaxed text-slate-600 dark:text-white sm:text-lg">
              {Array.isArray(study.overview.description) ? (
                study.overview.description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>{study.overview.description}</p>
              )}
            </div>
          </ScrollReveal>

          {/* Right Column - Metadata */}
          <StaggerContainer className="lg:col-span-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
            {metadataItems.map((item) => (
              <StaggerItem key={item.label} preset="right">
                <div className="space-y-1">
                  <span className="block text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {item.label}
                  </span>

                  <span className="block text-lg font-normal leading-snug text-slate-900 dark:text-white sm:text-xl">
                    {item.value}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Execution Section */}
        {study.execution && (
          <div className="mt-36 lg:mt-48">
            <div className="mx-auto max-w-4xl rounded-lg bg-slate-50 dark:bg-gradient-to-b dark:from-[#252d42] dark:via-[#1f2636] dark:to-[#1C2335] border border-slate-200 dark:border-slate-800 px-8 py-14 shadow-sm dark:shadow-[0_20px_80px_rgba(0,0,0,0.35)] md:px-36 md:py-24">
              <div className="max-w-3xl">
                <ScrollReveal preset="heading">
                  <h2 className="text-4xl font-medium text-slate-900 dark:text-white md:text-5xl">
                    {study.execution.title}
                  </h2>
                </ScrollReveal>

                <StaggerContainer className="mt-10 space-y-8">
                  {study.execution.description?.map((paragraph, index) => (
                    <StaggerItem key={index} preset="copy">
                      <p className="text-base font-normal leading-6 md:leading-8 text-slate-600 dark:text-white">
                        {paragraph}
                      </p>
                    </StaggerItem>
                  ))}

                  {study.execution.bullets && study.execution.bullets.length > 0 && (
                    <StaggerItem preset="right">
                      <ul className="list-disc space-y-5 pl-6 text-base font-normal leading-6 md:leading-8 text-slate-600 dark:text-white marker:text-slate-500">
                        {study.execution.bullets.map((bullet, index) => (
                          <li key={index}>{bullet}</li>
                        ))}
                      </ul>
                    </StaggerItem>
                  )}
                </StaggerContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
