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
    <HoverCard className="h-full rounded-2xl">
      <Link
        href={`/case-studies/${study.slug}`}
        className="group bg-[#111726]/60 border border-slate-800 p-8 sm:p-10 rounded-2xl flex h-full flex-col justify-between min-h-[280px] hover:border-slate-600 hover:shadow-[0_0_25px_rgba(148,163,184,0.15)] hover:bg-[#111726] transition-all duration-300 backdrop-blur-sm"
      >
        <div>
          <ScrollReveal
            className="mb-6 h-8 relative w-36 dark:brightness-100 brightness-0"
            preset="image"
          >
            <Image
              src={study.logo}
              alt={study.alt}
              fill
              className="object-contain object-left"
            />
          </ScrollReveal>
          <h3 className="text-xl sm:text-2xl font-semibold text-white group-hover:text-slate-200 transition-colors leading-snug">
            {study.title}
          </h3>
        </div>
        <div className="mt-8 flex items-center gap-2 text-base font-semibold text-slate-300 group-hover:text-white transition-colors">
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
    <section className="relative bg-[#0B0F17] py-16 text-white border-t border-slate-800/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal preset="heading">
          <h2 className="text-2xl sm:text-4xl font-semibold text-white mb-10">
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
