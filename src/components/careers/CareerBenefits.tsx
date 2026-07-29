import { Career } from '@/data/careers';

export default function CareerBenefits({ career }: { career: Career }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">Benefits & Perks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {career.benefits.map((benefit, index) => (
          <div key={index} className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-blue-500 mr-3 text-xl">✨</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium text-sm sm:text-base">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
