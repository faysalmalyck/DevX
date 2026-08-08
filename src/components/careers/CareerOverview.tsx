import type { PublicCareer } from '@/lib/careers/types';
import { ScrollReveal } from '@/components/motion';

export default function CareerOverview({ career }: { career: PublicCareer }) {
  return (
    <div className="max-w-3xl mx-auto text-left space-y-8" dir="ltr">
      {/* Job Description Title */}
      <ScrollReveal preset="heading">
        <h1 className="text-3xl tracking-tight text-slate-900 dark:text-white">
          Job Description
        </h1>
      </ScrollReveal>

      {/* Overview */}
      <ScrollReveal className="space-y-3" delay={0.1} preset="copy">
        <p className="text-base sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
          {career.overview}
        </p>
      </ScrollReveal>

      {/* Responsibilities Description & List */}
      <ScrollReveal className="space-y-4" delay={0.18} preset="copy">
        {career.responsibilitiesDescription && (
          <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {career.responsibilitiesDescription}
          </p>
        )}

        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
          {career.responsibilities.map((item, index) => (
            <li key={index} className="leading-relaxed">
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </div>
  );
}
