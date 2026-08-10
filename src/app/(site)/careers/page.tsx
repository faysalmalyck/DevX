import React from 'react';
import Image from 'next/image';
import OpenPositions from '@/components/careers/JobPage';
import { HoverCard, ScrollReveal, StaggerContainer, StaggerItem } from '@/components/motion';
import { getPublishedCareers } from '@/lib/careers/queries';
import { getPublicCareerCategory } from '@/lib/careers/constants';

export const dynamic = 'force-dynamic';

interface BenefitItem {
  iconSrc: string;
  altText: string;
  title: string;
  description: string;
}

const benefitsData: BenefitItem[] = [
  {
    iconSrc: 'https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/621e79b8590fabeddae6b75c_icon-1-benefits-dev-template.svg',
    altText: '100% Remote',
    title: '100% remote',
    description: 'Work from anywhere with the flexibility to create your ideal workspace.',
  },
  {
    iconSrc: 'https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/621e79b82bbbb14ae6b0e46b_icon-2-benefits-dev-template.svg',
    altText: 'Unlimited PTO',
    title: 'Flexible schedule',
    description: 'We trust you to manage your schedule while delivering great results.',
  },
  {
    iconSrc: 'https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/621e79b86b682136140d11ee_icon-3-benefits-dev-template.svg',
    altText: 'Flexible Hours',
    title: 'Flexible hours',
    description: 'Choose a schedule that fits your lifestyle and peak productivity.',
  },
  {
    iconSrc: 'https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/621e79b8ac2d611ee94ef441_icon-4-benefits-dev-template.svg',
    altText: 'Medical Insurance',
    title: 'Medical insurance',
    description: 'Comprehensive health coverage to support your well-being.',
  },
];

interface CareersPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function CareersHero({ searchParams }: CareersPageProps) {
  const { category } = await searchParams;
  const selectedCategory = getPublicCareerCategory(category);
  const positions = await getPublishedCareers(selectedCategory);

  return (
    <section className="relative overflow-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-[#181d2b] dark:text-slate-100 py-20 lg:py-28">
      {/* Background Decorative Elements */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 transform opacity-30 dark:opacity-20"
      >
        <div className="h-[30rem] w-[30rem] rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Hero Block */}
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal preset="hero">
            <h1 className="text-4xl font-medium tracking-tight sm:text-6xl lg:text-6xl">
              Join our team of talented{' '}
              <span className="text-brand dark:text-brand">developers</span>
              {' '}&amp;{' '}
              <span className="text-brand dark:text-brand">engineers</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal className="mx-auto mt-6 max-w-4xl px-4 sm:px-0" delay={0.12} preset="copy">
            <p className="text-sm text-slate-600 sm:text-base dark:text-slate-400">
              We're always looking for talented individuals who are passionate about solving complex problems and building exceptional digital experiences.
            </p>
          </ScrollReveal>

          <ScrollReveal className="mt-10 flex items-center justify-center gap-x-6" delay={0.22} preset="copy">
            <a
              href="#open-positions"
className="inline-block w-3/4 sm:w-auto text-center rounded-full bg-brand px-6 sm:px-10 py-6 sm:py-7 text-sm sm:text-base font-medium text-white shadow-lg shadow-brand/20 transition-all hover:bg-brand hover:shadow-brand/40">              Browse open positions
            </a>
          </ScrollReveal>

          <div className="mt-20 w-full border-t border-slate-200 dark:border-slate-800" />
        </div>

        {/* Benefits & Perks Block */}
        <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Left Side Info */}
          <div className="flex flex-col justify-center lg:col-span-5">
            <div className="max-w-md">
              <ScrollReveal preset="heading">
                <h2 className="text-3xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                  Perks &amp; benefits of{' '}
                  <span className="text-brand dark:text-brand">working</span> at our agency
                </h2>
              </ScrollReveal>
              
              <ScrollReveal className="mt-6" delay={0.12} preset="copy">
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
                  We invest in our people by offering meaningful benefits, ongoing learning opportunities, modern tools, and a culture that values innovation, collaboration, and work-life balance.
                </p>
              </ScrollReveal>

              <ScrollReveal className="mt-8" delay={0.22} preset="copy">
                <a
                  href="#open-positions"
className="block mx-auto sm:inline-block w-3/4 sm:w-auto text-center rounded-full bg-brand px-6 sm:px-10 py-6 sm:py-7 text-sm sm:text-base font-medium text-white shadow-lg shadow-brand/20 transition-all hover:bg-brand hover:shadow-brand/40">                  Browse open positions
                </a>
              </ScrollReveal>
            </div>
          </div>

          {/* Right Side Cards */}
          <div className="lg:col-span-7">
            <StaggerContainer className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-8">
              {benefitsData.map((benefit) => (
                <StaggerItem key={benefit.title} className="h-full" preset="card">
                  <HoverCard className="h-full">
                    <div className="flex h-full flex-col rounded-2xl bg-slate-50/50 p-6 transition-colors dark:bg-transparent">
                      <ScrollReveal className="mb-6 flex h-12 w-12 items-center justify-center" preset="image">
                        <Image
                          src={benefit.iconSrc}
                          alt={benefit.altText}
                          width={48}
                          height={48}
                          className="h-full w-full object-contain"
                        />
                      </ScrollReveal>
                      <div>
                        <h3 className="text-xl font-medium text-slate-900 dark:text-white">
                          {benefit.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

        </div>
        <div className="mt-32 h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>    
        <OpenPositions
          positions={positions}
          selectedCategory={selectedCategory}
        />

      </div>
      
    </section>
  );
}
