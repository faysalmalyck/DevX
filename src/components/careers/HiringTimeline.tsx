import { Career } from '@/data/careers';

export default function HiringTimeline({ career }: { career: Career }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">Our Hiring Process</h2>
      <div className="relative border-l-2 border-blue-500/30 dark:border-blue-500/20 ml-4 space-y-8">
        {career.hiringProcess.map((step) => (
          <div key={step.step} className="relative pl-6">
            <div className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold shadow-md">
              {step.step}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{step.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
