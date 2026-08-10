import type { PublicCareer } from '@/lib/careers/types';
import { ScrollReveal } from '@/components/motion';

export default function CareerDetails({ career }: { career: PublicCareer }) {
  return (
    <div className="max-w-3xl mx-auto text-left space-y-8">
      {/* Job Requirements */}
      <ScrollReveal className="space-y-6" preset="heading">
        <h2 className="text-3xl text-slate-900 dark:text-white">
          Job Requirements
        </h2>

        {career.requirementsDescription && (
          <p className="text-base sm:text-base leading-relaxed text-slate-600 dark:text-white">
            {career.requirementsDescription}
          </p>
        )}

        <ul className="space-y-3">
          {career.requirements.map((item, index) => (
            <li key={index} className="flex items-start text-slate-600 dark:text-white">
              <span className="text-brand dark:text-brand mr-3 text-lg">•</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </ScrollReveal>

      {/* Preferred Qualifications */}
      {career.preferredQualifications && career.preferredQualifications.length > 0 && (
        <ScrollReveal className="space-y-4" delay={0.14} preset="copy">
          <h3 className="text-xl text-slate-900 dark:text-white">
            Preferred Qualifications
          </h3>
          <ul className="space-y-3">
            {career.preferredQualifications.map((item, index) => (
              <li key={index} className="flex items-start text-slate-600 dark:text-white">
                <span className="text-brand dark:text-brand mr-3 text-lg">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      )}
    </div>
  );
}
