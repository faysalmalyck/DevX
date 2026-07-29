'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CaseStudy } from '@/data/case-studies';

export default function ResultsMetrics({ study }: { study: CaseStudy }) {
  return (
    <section className="relative bg-[#0B0F17] pt-36 pb-20 lg:pt-56 lg:pb-32 text-white border-t border-slate-800/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight text-white">
              Project results
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 space-y-6 text-white font-light text-base sm:text-lg leading-relaxed max-w-xl lg:max-w-2xl"
          >
            {Array.isArray(study.result.description) ? (
              study.result.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p>{study.result.description}</p>
            )}
          </motion.div>
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
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="overflow-hidden rounded-[28px] border border-slate-800/60"
            >
              <img
                src={study.resultImage}
                alt={`${study.title} results`}
                className="h-auto w-full object-cover"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}