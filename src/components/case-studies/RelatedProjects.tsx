'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CaseStudy, getRelatedCaseStudies } from '@/data/case-studies';
import {
  HoverCard,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion';

function RelatedProjectCard({ study }: { study: CaseStudy }) {
  return (
    <HoverCard className="h-full rounded-lg">
      <Link
        href={`/case-studies/${study.slug}`}
        className="group bg-slate-50/80 dark:bg-[#1e2436]/60 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 rounded-lg flex h-full flex-col justify-between min-h-[280px] hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg dark:hover:shadow-[0_0_25px_rgba(148,163,184,0.15)] hover:bg-slate-100 dark:hover:bg-[#1e2436] transition-all duration-300 backdrop-blur-sm"
      >
        <div>
          <ScrollReveal
            className="mb-6 h-8 relative w-36 brightness-0 dark:brightness-100"
            preset="image"
          >
            <Image
              src={study.logo}
              alt={study.alt}
              fill
              className="object-contain object-left"
            />
          </ScrollReveal>
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white group-hover:text-brand dark:group-hover:text-white transition-colors leading-snug">
            {study.title}
          </h3>
        </div>
        <div className="mt-8 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white group-hover:text-brand dark:group-hover:text-white transition-colors">
          <span>Read case study</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </Link>
    </HoverCard>
  );
}

export default function RelatedProjects({ currentId }: { currentId: number }) {
  const related = getRelatedCaseStudies(currentId);

  if (related.length === 0) return null;

  return (
    <section className="relative bg-white dark:bg-[#181d2b] py-16 text-slate-900 dark:text-white border-t border-slate-200/80 dark:border-slate-800/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal preset="heading">
          <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900 dark:text-white mb-10">
            Related Case Studies
          </h2>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {related.map((study) => (
            <StaggerItem key={study.id} className="h-full">
              <RelatedProjectCard study={study} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
