'use client';

import Image from 'next/image';
import { useInView } from '@/hooks/useInView';
import { CaseStudy } from '@/data/case-studies';

export default function ResultsMetrics({ study }: { study: CaseStudy }) {
  const { ref: headerRef, isInView: isHeaderInView } = useInView({ threshold: 0.1, triggerOnce: true, rootMargin: '-50px' });
  const { ref: imageRef, isInView: isImageInView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section className="relative bg-[#0B0F17] pt-36 pb-20 lg:pt-56 lg:pb-32 text-white border-t border-slate-800/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        <div ref={headerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-start">
          <div
            className={`lg:col-span-5 transition-all duration-500 ease-out ${
              isHeaderInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight text-white">
              Project results
            </h2>
          </div>

          <div
            className={`lg:col-span-7 space-y-6 text-white font-light text-base sm:text-lg leading-relaxed max-w-xl lg:max-w-2xl transition-all duration-500 ease-out delay-100 ${
              isHeaderInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            {Array.isArray(study.result.description) ? (
              study.result.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p>{study.result.description}</p>
            )}
          </div>
        </div>

        <div className="relative mt-28 lg:mt-40">
          <div className="pointer-events-none absolute -top-20 left-12 w-[500px] h-[300px] -z-0 opacity-30">
            <svg viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 50 280 C 150 50, 350 50, 450 280"
                stroke="#6366F1"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>
          </div>

          {study.resultImage && (
            <div
              ref={imageRef}
              className={`overflow-hidden rounded-[28px] border border-slate-800/60 transition-all duration-600 ease-out delay-200 ${
                isImageInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <img
                src={study.resultImage}
                alt={`${study.title} results`}
                className="h-auto w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}