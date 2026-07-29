import Link from 'next/link';
import { Career } from '@/data/careers';

export default function CareerHero({ career }: { career: Career }) {
  return (
    <div className="relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/careers"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-8 transition-colors"
        >
          <span className="mr-2">←</span> Back to all careers
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-semibold tracking-wide uppercase text-blue-600 dark:text-blue-400">
              <span className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">{career.department}</span>
              <span className="bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full">{career.workMode}</span>
              <span className="bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full">{career.type}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-normal text-slate-900 dark:text-white tracking-tight">
              {career.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span>📍 Location:</span>
                <span className="font-medium text-slate-900 dark:text-slate-200">{career.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💼 Experience:</span>
                <span className="font-medium text-slate-900 dark:text-slate-200">{career.experience}</span>
              </div>
            </div>
          </div>
          <div>
            <a
              href="#apply"
              className="inline-block w-full sm:w-auto text-center rounded-full bg-blue-600 px-8 py-4 text-base font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-blue-500/40"
            >
              Apply for this Position
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
