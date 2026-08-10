import Image from 'next/image';
import Link from 'next/link';
import CtaSection from '@/components/home/ready-to-contact/Ready';
import { caseStudiesData as caseStudies } from '@/data/case-studies';
import {
  HoverCard,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion';

export default function CaseStudy() {
  return (
    <section className="mt-15 mb-16 relative py-6 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden bg-transparent transition-colors duration-300">
      {/* Header Container */}
      <div className="max-w-2xl mx-auto text-center pt-8 pb-4 mb-2">
        <ScrollReveal preset="hero">
          <h2 className="text-5xl md:text-7xl tracking-tight text-gray-900 dark:text-white leading-tight ">
            Case{' '}
            <span className="text-brand dark:text-brand">Studies</span>{' '}
          </h2>
        </ScrollReveal>
        <ScrollReveal preset="copy" delay={0.12}>
          <p className="mt-4 text-gray-600 dark:text-white text-base leading-relaxed">
            Explore how we've helped startups enterprises and growing businesses solve complex challenges through innovative engineering scalable architecture and user-focused digital products.
          </p>
        </ScrollReveal>
      </div>

       {/* Grid Container */}
<div className="relative">
      <StaggerContainer className="grid grid-cols-1 py-2 md:grid-cols-2 gap-4 relative z-10">
        {caseStudies.map((study) => (
          <StaggerItem key={study.id} className="h-full">
            <HoverCard className="h-full rounded-lg">
              <Link
                href={`/case-studies/${study.slug}`}
                className="group relative bg-gray-100/80 dark:bg-[#252d41] rounded-lg border border-gray-200/80 dark:border-slate-700/80 py-20 px-14 md:py-16 md:px-12 min-h-[350px] shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-2xl transition-all duration-200 ease-in-out flex h-full flex-col justify-between"
              >
                <div>
                  <ScrollReveal
                    className="mb-8 h-10 relative w-48 dark:brightness-100 brightness-0"
                    preset="image"
                  >
                    <Image
                      src={study.logo}
                      alt={study.alt}
                      fill
                      className="object-contain object-left"
                    />
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
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-2xl blur-3xl -z-10 pointer-events-none" />
      </div>

      <div className="my-34 h-[1px] w-full bg-gray-200 dark:bg-gray-800" />
      <CtaSection />
    </section>
  );
}
