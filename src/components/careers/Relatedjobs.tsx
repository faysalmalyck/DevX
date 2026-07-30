'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Career, careersData } from '@/data/careers';

interface RelatedJobsProps {
  currentCareer: Career;
}

export default function RelatedJobs({ currentCareer }: RelatedJobsProps) {
  // 1. Exclude active job
  const otherCareers = careersData.filter((job) => job.id !== currentCareer.id);

  // 2. Prioritize same category or department, fill remaining slots with other open roles
  const sameCategory = otherCareers.filter(
    (job) => job.category === currentCareer.category || job.department === currentCareer.department
  );
  const differentCategory = otherCareers.filter(
    (job) => job.category !== currentCareer.category && job.department !== currentCareer.department
  );

  // 3. Limit output to 2 cards
  const relatedJobs = [...sameCategory, ...differentCategory].slice(0, 2);

  if (relatedJobs.length === 0) return null;

  return (
    <section className="relative bg-slate-50 dark:bg-[#181d2b] py-20 lg:py-32 text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800/40 overflow-hidden transition-colors duration-300">
      {/* Background Decorative Graphic */}
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[300px] z-0 opacity-20">
        <svg viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 50 280 C 250 50, 550 50, 750 280"
            stroke="#ffffffff"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-slate-900 dark:text-white">
              Related Openings
            </h2>
          </div>

          <Link
            href="/careers"
            className="w-full max-w-[280px] sm:w-auto sm:max-w-none text-center rounded-full border border-slate-300 bg-white px-6 sm:px-10 py-3.5 sm:py-6 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#121623] dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-[#1a2032] dark:hover:text-white active:scale-95"
          >
            Browse all openings
          </Link>
        </motion.div>

        {/* Job Cards Container (expanded max-width for +15% card width) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 max-w-6xl mx-auto">
          {relatedJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/careers/${job.slug}`}
                className="group relative flex flex-col justify-between h-full min-h-[260px] rounded-lg border border-slate-200 dark:border-slate-700/50 bg-gradient-to-b from-white to-slate-100 dark:from-[#262F43] dark:to-[#191F32] px-8 py-9 shadow-sm dark:shadow-none backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50 dark:hover:border-slate-600 hover:shadow-xl dark:hover:shadow-2xl"
              >
                <div className="space-y-6">
                  {/* Job Details: Location | Type -> Title -> Description */}
                  <div className="space-y-6 px-8">
                    <p className="text-xs font-medium tracking-wider text-blue-500 dark:text-white">
                      {job.location} | {job.type}
                    </p>
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-500 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm font-light text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 pt-1">
                      {job.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}