import type { CSSProperties } from 'react';
import Image from 'next/image';
import {
  HoverCard,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion';

export default function ProcessSection() {
  const steps = [
    {
      id: 1,
      title: '1. Project Idea',
      description: 'Define business goals, strategy, and project requirements clearly.',
      highlightText: 'Strategic planning.',
      imageOn: '/images/Process/plan-on.png',
      imageOff: '/images/Process/plan-off.png',
    },
    {
      id: 2,
      title: '2. Development & Execution',
      description: 'Build, test, and refine every feature with precision.',
      highlightText: 'Build with precision.',
      imageOn: '/images/Process/launch-on.png',
      imageOff: '/images/Process/launch-off.png',
    },
    {
      id: 3,
      title: '3. Launch & Scale',
      description: 'Launch your product and scale for long term growth.',
      highlightText: 'Continuous growth.',
      imageOn: '/images/Process/scale-on.png',
      imageOff: '/images/Process/scale-off.png',
    },
  ];

  return (
    <section className="relative w-full pt-6 sm:pt-10 pb-36 sm:pb-48 px-4 md:px-8 dark:bg-[#181d2b] overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal
          className="max-w-4xl mx-auto text-center pt-0 sm:pt-2 pb-4 sm:pb-6 mb-4 sm:mb-8"
          preset="heading"
        >
          <h2 className="text-4xl sm:text-4xl md:text-5xl tracking-tight text-gray-900 dark:text-white leading-snug sm:leading-tight">
            We deliver through a simple, yet{' '}
            <span className="text-brand dark:text-brand">Powerful</span> and{' '}
            <span className="text-brand dark:text-brand">Effective</span> Process.
          </h2>
        </ScrollReveal>

     {/* Bottom Left Circular Flare Arc */}
<svg
  className="pointer-events-none absolute -left-5 bottom-24 rotate-270 hidden h-[500px] w-[500px] sm:block"
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



      {/* Top Right L Shape */}
<svg
  className="pointer-events-none absolute right-[-20] top-[70px] z-0 rotate-[-25deg] hidden h-[420px] w-[420px] sm:block"
  viewBox="0 0 420 420"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <linearGradient
      id="processTopRightLGradient"
      x1="50"
      y1="70"
      x2="350"
      y2="370"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0%" stopColor="#3154d8" stopOpacity="0" />
      <stop offset="20%" stopColor="#3154d8" stopOpacity="0.25" />
      <stop offset="50%" stopColor="#4f6df5" stopOpacity="1" />
      <stop offset="80%" stopColor="#3154d8" stopOpacity="0.25" />
      <stop offset="100%" stopColor="#3154d8" stopOpacity="0" />
    </linearGradient>

    <filter
      id="processTopRightLGlow"
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
      M 50 70
      H 300
      Q 350 70 350 120
      V 370
    "
    stroke="url(#processTopRightLGradient)"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    filter="url(#processTopRightLGlow)"
    className="animate-[pulse_5s_ease-in-out_infinite]"
  />
</svg>


        <div className="relative">
          <StaggerContainer
            className="relative z-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-2 lg:pb-16"
          >
            {steps.map((step, index) => (
              <StaggerItem
                key={step.id}
                className="flex w-full justify-center"
                preset={step.id === 2 ? 'right' : 'left'}
              >
                <div
                  data-process-step={step.id}
                  className="flex w-full justify-center [transform:translateY(0)] xl:[transform:translateY(var(--process-step-offset))]"
                  style={
                    {
                      '--process-step-offset': `${index * 75}px`,
                    } as CSSProperties
                  }
                >
                  <HoverCard className="w-full max-w-sm">
                    <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-lg border border-gray-300 bg-gray-50/50 min-h-[380px] sm:min-h-[450px] w-full max-w-sm transition-all duration-400 ease-out dark:border-[#2f384f] dark:bg-gradient-to-b dark:from-[#252E41] dark:via-[#242D40] dark:to-[#1D2336]">

                      <div className="relative h-[220px] sm:h-[280px] w-full bg-slate-800 overflow-hidden">
                        <ScrollReveal className="absolute inset-0" preset="image">
                          <Image
                            src={step.imageOn}
                            alt={`${step.title} Active`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 386px"
                            className="object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-500"
                            priority
                          />
                        </ScrollReveal>
                        <ScrollReveal
                          className="absolute inset-0"
                          delay={0.08}
                          preset="image"
                        >
                          <Image
                            src={step.imageOff}
                            alt={`${step.title} Inactive`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 386px"
                            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          />
                        </ScrollReveal>
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#243042] to-transparent pointer-events-none" />
                      </div>

                      <div className="p-5 sm:p-6 py-4 flex-1 flex flex-col justify-center">
                        <h3 className="text-lg sm:text-xl px-4 font-bold text-white mb-2 sm:mb-3">
                          {step.title}
                        </h3>
                        <p className="text-white text-base px-4 leading-relaxed">
                          {step.description}{' '}
                          <span className="whitespace-nowrap">{step.highlightText}</span>
                        </p>
                      </div>

                    </div>
                  </HoverCard>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand/10 rounded-lg blur-3xl -z-10 pointer-events-none" />
        </div>

      </div>
    </section>
  );
}