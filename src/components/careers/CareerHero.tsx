import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ScrollReveal } from '@/components/motion';
import type { PublicCareer } from '@/lib/careers/types';
import ApplyButton from '@/components/careers/ApplyButton';

export default function CareerHero({ career }: { career: PublicCareer }) {
  return (
    <div className="relative overflow-hidden bg-slate-10 dark:bg-[#181D2C] py-12 sm:py-16 lg:py-24 transition-colors duration-200">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Link on Top Left */}
        <Link
          href="/careers"
          className="mt-12 mb-8 inline-flex items-center gap-2 text-base font-semibold text-slate-700 transition-all duration-300 hover:-translate-x-1 hover:text-brand dark:text-white dark:hover:text-brand"
>
  <ArrowLeft className="h-4 w-4" />
         Back to all careers
        </Link>

        <div className="mx-auto max-w-lg text-center">
          {/* Location | Full time */}
          <ScrollReveal className="mb-3 flex flex-wrap items-center justify-center gap-2 text-base font-medium text-slate-800 sm:mb-4 sm:text-base dark:text-white" preset="copy">
            <span>{career.location}</span>
            <span className="text-white dark:text-slate-700">|</span>
            <span>{career.type}</span>
          </ScrollReveal>

          {/* Title */}
          <ScrollReveal preset="hero">
            <h1 className="text-5xl font-medium leading-tight tracking-tight text-slate-900 xs:text-3xl sm:text-4xl lg:text-5xl dark:text-white">
              {career.title}
            </h1>
          </ScrollReveal>

          {/* Career Description */}
          <ScrollReveal className="mt-4 px-2 sm:mt-6 sm:px-0" delay={0.14} preset="copy">
            <p className="text-lg leading-relaxed text-slate-600 dark:text-white">
              {career.description || career.overview}
            </p>
          </ScrollReveal>

          {/* Apply Button */}
          <div className="mt-8 sm:mt-12 flex justify-center">
  <ApplyButton
    careerSlug={career.slug}
    careerTitle={career.title}
    className="inline-block w-3/4 sm:w-auto text-center rounded-full bg-brand px-6 sm:px-10 py-5 sm:py-5 text-lg font-semibold text-white shadow-lg shadow-brand/20 transition-all hover:bg-brand hover:shadow-brand/40"
  >
    Apply now
  </ApplyButton>
</div>
        </div>
      </div>
    </div>
  );
}
