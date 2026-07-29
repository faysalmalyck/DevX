import { Career } from '@/data/careers';

export default function CareerOverview({ career }: { career: Career }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Role Overview</h2>
      <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
        {career.overview}
      </p>
    </div>
  );
}
