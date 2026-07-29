'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getRelatedCaseStudies } from '@/data/case-studies';

export default function RelatedProjects({ currentId }: { currentId: number }) {
  const related = getRelatedCaseStudies(currentId);

  if (related.length === 0) return null;

  return (
    <section className="relative bg-[#0B0F17] py-16 text-white border-t border-slate-800/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-4xl font-semibold text-white mb-10"
        >
          Related Case Studies
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {related.map((study, idx) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link
                href={`/case-studies/${study.slug}`}
                className="group bg-[#111726]/60 border border-slate-800 p-8 sm:p-10 rounded-2xl flex flex-col justify-between min-h-[280px] hover:border-slate-600 hover:shadow-[0_0_25px_rgba(148,163,184,0.15)] hover:bg-[#111726] transition-all duration-300 backdrop-blur-sm"
              >
                <div>
                  <div className="mb-6 h-8 relative w-36 dark:brightness-100 brightness-0">
                    <Image
                      src={study.logo}
                      alt={study.alt}
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white group-hover:text-slate-200 transition-colors leading-snug">
                    {study.title}
                  </h3>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                  <span>Read case study</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}