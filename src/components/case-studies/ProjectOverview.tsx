'use client';

import { useInView } from '@/hooks/useInView';
import { CaseStudy } from '@/data/case-studies';

export default function ProjectOverview({ study }: { study: CaseStudy }) {
  const { ref: overviewRef, isInView: isOverviewInView } = useInView({ threshold: 0.1, triggerOnce: true, rootMargin: '-50px' });
  const { ref: executionRef, isInView: isExecutionInView } = useInView({ threshold: 0.1, triggerOnce: true });
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
    <section className="relative border-t border-slate-800/40 bg-[#0B0F17] pt-28 pb-16 text-white lg:pt-40 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Project Overview Header & Metadata */}
        <div ref={overviewRef} className="grid grid-cols-1 items-start gap-20 lg:grid-cols-12 lg:gap-32">
          {/* Left Column */}
          <div
            className={`space-y-6 lg:col-span-6 transition-all duration-600 ease-out ${
              isOverviewInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <h2 className="mb-6 text-3xl font-normal tracking-tight text-white sm:text-4xl md:text-5xl">
              {study.overview.title}
            </h2>

            <div className="space-y-6 text-base font-light leading-relaxed text-slate-300 sm:text-lg">
              {Array.isArray(study.overview.description) ? (
                study.overview.description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>{study.overview.description}</p>
              )}
            </div>
          </div>

          {/* Right Column - Metadata */}
          <div
            className={`lg:col-span-6 transition-all duration-600 ease-out delay-200 ${
              isOverviewInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              {metadataItems.map((item, index) => (
                <div key={index} className="space-y-1">
                  <span className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    {item.label}
                  </span>

                  <span className="block text-lg font-normal leading-snug text-white sm:text-xl">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Execution Section */}
        {study.execution && (
          <div
            ref={executionRef}
            className={`mt-36 lg:mt-48 transition-all duration-600 ease-out ${
              isExecutionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="mx-auto max-w-4xl rounded-lg bg-gradient-to-b from-[#252d42] via-[#1f2636] to-[#1C2335] px-8 py-14 shadow-[0_20px_80px_rgba(0,0,0,0.35)] md:px-36 md:py-24">
              <div className="max-w-3xl">
                <h2 className="text-4xl font-normal text-white md:text-5xl">
                  {study.execution.title}
                </h2>

                <div className="mt-10 space-y-8">
                  {study.execution.description?.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm md:text-base font-normal leading-6 md:leading-8 text-white"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {study.execution.bullets && study.execution.bullets.length > 0 && (
                    <ul className="list-disc space-y-5 pl-6 text-sm md:text-base font-normal leading-6 md:leading-8 text-slate-300 marker:text-slate-500">
                      {study.execution.bullets.map((bullet, index) => (
                        <li key={index}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}