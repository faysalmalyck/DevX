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
    <section className="relative py-6 px-1 sm:px-8 max-w-none mx-auto overflow-hidden bg-transparent transition-colors duration-300">
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

 {/* Top Left Circular Flare Arc */}
<svg
  className="pointer-events-none absolute -right-8 top-16 rotate-[90deg] hidden h-[500px] w-[500px] sm:block"
  viewBox="0 0 500 500"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <linearGradient
      id="flareArcGradient"
      x1="70"
      y1="400"
      x2="400"
      y2="70"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0%" stopColor="#4360cbff" stopOpacity="0" />
      <stop offset="20%" stopColor="#4360cbff" stopOpacity="0.15" />
      <stop offset="45%" stopColor="#4f6df5" stopOpacity="0.8" />
      <stop offset="70%" stopColor="#4360cbff" stopOpacity="0.35" />
      <stop offset="100%" stopColor="#4360cbff" stopOpacity="0" />
    </linearGradient>
  </defs>

  <path
    d="M 100 400 A 200 200 0 0 1 400 100"
    stroke="url(#flareArcGradient)"
    strokeWidth="4"
    strokeLinecap="round"
    fill="none"
  />
</svg>



        {/* Bottom Left L Shape */}
<svg
  className="pointer-events-none absolute bottom-[250px] left-[-50px] z-[1] hidden h-[420px] w-[420px] sm:block"
  viewBox="0 0 420 420"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <linearGradient
      id="bottomLeftLGradient"
      x1="70"
      y1="50"
      x2="370"
      y2="350"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0%" stopColor="#3154d8" stopOpacity="0" />
      <stop offset="20%" stopColor="#3154d8" stopOpacity="0.25" />
      <stop offset="50%" stopColor="#4f6df5" stopOpacity="1" />
      <stop offset="80%" stopColor="#3154d8" stopOpacity="0.25" />
      <stop offset="100%" stopColor="#3154d8" stopOpacity="0" />
    </linearGradient>

    <filter
      id="bottomLeftLGlow"
      x="-30%"
      y="-30%"
      width="160%"
      height="160%"
    >
      <feGaussianBlur stdDeviation="2" result="blur" />

      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <path
    d="
      M 70 50
      V 300
      Q 70 350 120 350
      H 370
    "
    stroke="url(#bottomLeftLGradient)"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    filter="url(#bottomLeftLGlow)"
    className="animate-[pulse_5s_ease-in-out_infinite]"
  />
</svg>

        {/* Grid Container */}
        <div className="relative">
        <StaggerContainer className="grid grid-cols-1 py-10 px-6 md:grid-cols-2 gap-4 relative z-10">
          {caseStudiesData.slice(0, 2).map((study) => (
            <StaggerItem
              key={study.id}
              className="h-full"
              preset="card"
            >
              <HoverCard className="h-full">
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="group relative flex h-full flex-col justify-between rounded-lg border border-gray-300 bg-gray-50/50 py-20 px-14 md:py-16 md:px-12 min-h-[350px] transition-all duration-400 ease-out dark:border-[#2f384f] dark:bg-gradient-to-b dark:from-[#252E41] dark:via-[#242D40] dark:to-[#1D2336]"
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
