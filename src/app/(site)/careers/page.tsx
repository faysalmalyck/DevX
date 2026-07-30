import React from 'react';
import Image from 'next/image';
import OpenPositions from './jobs/jobpage';

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

export default function CareersHero() {
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Hero Block */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-normal tracking-tight sm:text-6xl lg:text-6xl">
            Join our team of talented{' '}
            <span className="text-blue-600 dark:text-blue-500">developers</span>
            {' '}&amp;{' '}
            <span className="text-blue-600 dark:text-blue-500">engineers</span>
          </h1>

          <p className="mx-auto mt-6 max-w-4xl px-4 text-sm sm:text-base sm:px-0 text-slate-600 dark:text-slate-400">
            We're always looking for talented individuals who are passionate about solving complex problems and building exceptional digital experiences.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#open-positions"
              className="w-full sm:w-auto text-center rounded-full bg-blue-600 px-10 py-6 text-base font-medium text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(148,163,184,0.4)] dark:hover:shadow-[0_0_20px_rgba(203,213,225,0.25)]"
            >
              Browse open positions
            </a>
          </div>

          <div className="mt-20 w-full border-t border-slate-200 dark:border-slate-800" />
        </div>

        {/* Benefits & Perks Block */}
        <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Left Side Info */}
          <div className="flex flex-col justify-center lg:col-span-5">
            <div className="max-w-md">
              <h2 className="text-3xl font-normal tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                Perks &amp; benefits of{' '}
                <span className="text-blue-600 dark:text-blue-500">working</span> at our agency
              </h2>
              
              <p className="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
                We invest in our people by offering meaningful benefits, ongoing learning opportunities, modern tools, and a culture that values innovation, collaboration, and work-life balance.
              </p>

              <div className="mt-8">
                <a
                  href="#open-positions"
                  className="inline-flex items-center justify-center rounded-full bg-blue-500 px-8 py-6 text-base font-medium text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(148,163,184,0.4)] dark:hover:shadow-[0_0_20px_rgba(203,213,225,0.25)]"
                >
                  Browse open positions
                </a>
              </div>
            </div>
          </div>

          {/* Right Side Cards */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-8">
              {benefitsData.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex flex-col rounded-2xl bg-slate-50/50 p-6 transition-colors dark:bg-transparent"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center">
                    <Image
                      src={benefit.iconSrc}
                      alt={benefit.altText}
                      width={48}
                      height={48}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-normal text-slate-900 dark:text-white">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
        <div className="mt-32 h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>    
        <OpenPositions />

      </div>
      
    </section>
  );
}