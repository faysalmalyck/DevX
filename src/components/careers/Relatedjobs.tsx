'use client';

import Link from 'next/link';
import { useInView } from '@/hooks/useInView';
import { Career, careersData } from '@/data/careers';

interface RelatedJobsProps {
  currentCareer: Career;
}

function JobCard({ job, index }: { job: Career; index: number }) {
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 100}ms` }}
      className={`transition-all duration-500 ease-out ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <Link
        href={`/careers/${job.slug}`}
        className="group relative flex flex-col justify-between h-full min-h-[240px] sm:min-h-[260px] rounded-lg border border-slate-200 dark:border-slate-700/50 bg-gradient-to-b from-white to-slate-100 dark:from-[#262F43] dark:to-[#191F32] px-5 sm:px-8 py-6 sm:py-9 shadow-sm dark:shadow-none backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50 dark:hover:border-slate-600 hover:shadow-xl dark:hover:shadow-2xl mx-auto w-full max-w-sm md:max-w-none"
      >
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-6 px-1 sm:px-8">
            <p className="text-xs font-medium tracking-wider text-brand dark:text-white">
              {job.location} | {job.type}
            </p>
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white group-hover:text-brand dark:group-hover:text-brand transition-colors">
              {job.title}
            </h3>
            <p className="text-base font-light text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 pt-1">
              {job.description}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function RelatedJobs({ currentCareer }: RelatedJobsProps) {
  const { ref: headerRef, isInView: isHeaderInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '-50px',
  });

  const otherCareers = careersData.filter((job) => job.id !== currentCareer.id);

  const sameCategory = otherCareers.filter(
    (job) => job.category === currentCareer.category || job.department === currentCareer.department
  );
  const differentCategory = otherCareers.filter(
    (job) => job.category !== currentCareer.category && job.department !== currentCareer.department
  );

  const relatedJobs = [...sameCategory, ...differentCategory].slice(0, 2);

  if (relatedJobs.length === 0) return null;

  return (
    <section className="relative bg-slate-10 dark:bg-[#181d2b] py-12 sm:py-20 lg:py-32 text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800/40 overflow-hidden transition-colors duration-300">
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[300px] z-0 opacity-20 hidden sm:block">
        <svg viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 50 280 C 250 50, 550 50, 750 280"
            stroke="#ffffffff"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <div
          ref={headerRef}
          className={`flex flex-col sm:flex-row sm:items-end justify-between items-center sm:items-stretch gap-6 transition-all duration-500 ease-out ${
            isHeaderInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="space-y-3 max-w-2xl text-center sm:text-left">
            <h2 className="text-3xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-slate-900 dark:text-white">
              Related Openings
            </h2>
          </div>

          <Link
            href="/careers"
            className="w-full max-w-[280px] sm:w-auto sm:max-w-none text-center rounded-full border border-slate-300 bg-white px-6 sm:px-10 py-5 sm:py-6 text-lg font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#121623] dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-[#1a2032] dark:hover:text-white active:scale-95"
          >
            Browse all openings
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
          {relatedJobs.map((job, index) => (
            <JobCard key={job.id} job={job} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
