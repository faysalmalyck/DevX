'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  publicCareerCategories,
  type PublicCareerCategory,
} from '@/lib/careers/constants';
import { HoverCard, ScrollReveal, StaggerContainer, StaggerItem } from '@/components/motion';
import type { PublicCareer } from '@/lib/careers/types';

type OpenPositionsProps = {
  positions: PublicCareer[];
  selectedCategory: PublicCareerCategory;
};

export default function OpenPositions({
  positions,
  selectedCategory,
}: OpenPositionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const selectCategory = (category: PublicCareerCategory) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }

    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  };

  return (
    <section id="open-positions" className="py-20 bg-white dark:bg-[#181d2b] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <ScrollReveal className="mb-4" preset="heading">
            <h2 className="text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              Browse our available <span className="text-brand dark:text-brand">positions</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal className="mb-8" delay={0.12} preset="copy">
            <p className="text-base text-slate-600 sm:text-lg dark:text-slate-400">
              Explore our current job openings and find a role that matches your skills, experience, and career goals. We are always looking for talented people to join our team.
            </p>
          </ScrollReveal>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {publicCareerCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => selectCategory(category.id)}
className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-transparent hover:border-slate-400 dark:hover:border-transparent hover:ring-2 hover:ring-slate-400/50 dark:hover:ring-slate-400/40 hover:shadow-[0_0_12px_rgba(148,163,184,0.35)] ${                  selectedCategory === category.id
                    ? 'bg-brand text-white shadow-md shadow-brand/20 dark:grey-400'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Positions Grid */}
        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {positions.map((position) => (
            <StaggerItem key={position.id} className="h-full" preset="card">
              <HoverCard className="h-full">
                <Link
                  href={`/careers/${position.slug}`}
                  className="group flex h-full min-h-[260px] flex-col justify-between rounded-md border border-slate-200/80 bg-slate-50 p-8 transition-all duration-200 hover:border-slate-400 hover:shadow-lg sm:p-10 dark:border-slate-700/60 dark:bg-slate-800/50 dark:hover:border-slate-500"
                >
                  <div>
                    <div className="mb-4 flex items-center space-x-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      <span>{position.location}</span>
                      <span className="inline-block h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span>{position.type}</span>
                    </div>

                    <h3 className="mb-3 text-2xl font-medium text-slate-900 transition-colors group-hover:text-brand sm:text-3xl dark:text-white dark:group-hover:text-brand">
                      {position.title}
                    </h3>
                  </div>

                  <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                    {position.description}
                  </p>
                </Link>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {positions.length === 0 && (
          <ScrollReveal className="py-12 text-center text-slate-500 dark:text-slate-400" preset="copy">
            No open positions available for this category right now.
          </ScrollReveal>
        )}

      </div>
      <div className="mt-36 h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>    
    </section>

    
  );
}
