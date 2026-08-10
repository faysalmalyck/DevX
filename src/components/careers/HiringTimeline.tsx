import type { PublicCareer } from '@/lib/careers/types';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/motion';
import ApplyButton from '@/components/careers/ApplyButton';

export default function HiringTimeline({ career }: { career: PublicCareer }) {
  return (
    <div>
      <ScrollReveal preset="heading">
        <h2 className="mb-6 max-w-2xl text-2xl text-slate-900 dark:text-white">Our Hiring Process</h2>
      </ScrollReveal>
      <StaggerContainer className="relative ml-4 mt-8 space-y-8 border-l-2 border-brand/30 dark:border-brand/20">
        {career.hiringProcess.map((step, index) => (
          <StaggerItem key={step.step} className="relative pl-6" preset={index % 2 === 0 ? 'left' : 'right'}>
            <div className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white text-sm font-bold shadow-md">
              {step.step}
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">{step.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
          </StaggerItem>
        ))}
      </StaggerContainer>
      <div className="mt-8 sm:mt-12 flex justify-center">
  <ApplyButton
    careerSlug={career.slug}
    careerTitle={career.title}
    className="inline-block w-3/4 sm:w-auto text-center rounded-full bg-brand px-6 sm:px-10 py-5 sm:py-5 text-sm sm:text-base font-medium text-white shadow-lg shadow-brand/20 transition-all hover:bg-brand hover:shadow-brand/40"
  >
    Apply now
  </ApplyButton>
</div>
    </div>
  );
}
