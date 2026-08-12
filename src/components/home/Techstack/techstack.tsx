import React from 'react'
import { techStack } from '@/data/techstack'
import { ScrollReveal } from '@/components/motion'

export default function TechStackSection() {
  return (
    <section className="relative bg-white dark:bg-[#181d2b] py-16 overflow-hidden transition-colors duration-300">
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center mb-16">
        <ScrollReveal preset="heading">
          <h2 className="text-5xl tracking-tight text-slate-900 dark:text-white sm:text-5xl sm:leading-[1.15] mb-6">
            Technologies That Power{' '}
            <span className="text-brand dark:text-brand">
              Innovation
            </span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.12} preset="copy">
          <p className="max-w-2xl mx-auto text-lg leading-relaxed text-slate-600 dark:text-white">
            Every solution is built with carefully selected programming languages and development tools that maximize quality, speed, and long term maintainability.
          </p>
        </ScrollReveal>
      </div>

      <ScrollReveal className="relative z-10" preset="image">
        <div className="group relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-100%); }
            }
            .animate-marquee {
              animation: marquee 35s linear infinite;
            }
            .group:hover .animate-marquee {
              animation-play-state: paused;
            }
            @media (prefers-reduced-motion: reduce) {
              .animate-marquee {
                animation-play-state: paused;
              }
            }
          `}</style>

          <div className="flex w-max gap-12">
            {/* Track 1 */}
            <div className="animate-marquee flex shrink-0 gap-12 items-center">
              {techStack.map((item, idx) => (
                <img
                  key={`primary-${idx}`}
                  src={item.src}
                  alt={item.name}
                  title={item.name}
                  width={48}
                  height={48}
                  loading="lazy"
                  decoding="async"
                  className={`w-12 h-12 object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 hover:scale-105 cursor-pointer ${
                    item.invertInDark ? 'dark:invert' : ''
                  }`}
                />
              ))}
            </div>

            {/* Track 2 */}
            <div className="animate-marquee flex shrink-0 gap-12 items-center" aria-hidden="true">
              {techStack.map((item, idx) => (
                <img
                  key={`duplicate-${idx}`}
                  src={item.src}
                  alt=""
                  width={48}
                  height={48}
                  loading="lazy"
                  decoding="async"
                  className={`w-12 h-12 object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 hover:scale-105 cursor-pointer ${
                    item.invertInDark ? 'dark:invert' : ''
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      <div className="mt-36 mb-12 h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600 sm:mt-28 sm:mb-12" />
    </section>
  )
}
