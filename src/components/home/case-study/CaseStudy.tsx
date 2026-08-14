import Image from 'next/image';
import Link from 'next/link';
import { caseStudiesData } from '@/data/case-studies'; // Adjust path based on your folder setup
import {
  HoverCard,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion';

export default function CaseStudiesSection() {
  return (
    <section className="relative py-6 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden bg-transparent transition-colors duration-300">
      <div>
        {/* Header Container */}
        <ScrollReveal
          className="max-w-2xl mx-auto text-center pt-8 pb-12 mb-10"
          preset="heading"
        >
          <h2 className="text-4xl md:text-5xl tracking-tight text-gray-900 dark:text-white leading-tight">
            Discover how we had helped{' '}
            <br className="hidden md:inline" />
            <span className="text-brand dark:text-brand">world class companies</span>{' '}
            <span className="whitespace-nowrap">in the past</span>
          </h2>
        </ScrollReveal>

        {/* Grid Container */}
        <div className="relative">
        <StaggerContainer className="grid grid-cols-1 py-10 md:grid-cols-2 gap-4 relative z-10">
          {caseStudiesData.slice(0, 2).map((study) => (
            <StaggerItem
              key={study.id}
              className="h-full"
              preset="card"
            >
              <HoverCard className="h-full">
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="group relative h-full bg-gray-100/80 dark:bg-[#252d41] rounded-lg border border-gray-200/80 dark:border-slate-700/80 py-20 px-14 md:py-16 md:px-12 min-h-[350px] shadow-sm dark:shadow-none transition-[border-color,box-shadow] duration-200 ease-in-out flex flex-col justify-between hover:border-brand/40 hover:shadow-[0_12px_30px_rgba(54,88,255,0.16)]"
                >
                  <div>
                    <ScrollReveal
                      className="mb-8 h-10 relative w-48"
                      preset="image"
                    >
                      <div className="absolute inset-0 dark:brightness-100 brightness-0">
                        <Image
                          src={study.logo}
                          alt={study.alt}
                          fill
                          className="object-contain object-left"
                        />
                      </div>
                    </ScrollReveal>
                    <h3 className="text-xl md:text-2xl text-gray-900 dark:text-white mb-8 font-semibold">
                      {study.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold group-hover:text-brand dark:group-hover:text-brand transition-colors duration-200 mt-auto">
                    <span>Read case study</span>
                    <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Decorative Background Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-brand/10 dark:bg-brand/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-lg blur-3xl -z-10 pointer-events-none" />
        </div>

        {/* Action Buttons Container */}
        <ScrollReveal className="mt-16 text-center" preset="copy">
        <div className="flex flex-col sm:flex-row py-16 items-center justify-center gap-4">
          <Link
            href="/contact"
            className="w-full max-w-[280px] sm:w-auto sm:max-w-none text-center rounded-full bg-brand px-6 sm:px-10 py-5 sm:py-6 text-lg font-semibold text-white transition-all duration-200 hover:bg-brand hover:shadow-[0_0_20px_rgba(54,88,255,0.4)] active:scale-95"
          >
            Contact us
          </Link>
          <Link
            href="/case-studies"
            className="w-full max-w-[280px] sm:w-auto sm:max-w-none text-center rounded-full border border-slate-300 bg-white px-6 sm:px-10 py-5 sm:py-6 text-lg font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#121623] dark:text-white dark:hover:border-slate-700 dark:hover:bg-[#1a2032] dark:hover:text-white active:scale-95"
          >
            Browse Case Studies
          </Link>
        </div>
        <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
        </ScrollReveal>
      </div>
    </section>
  );
}
