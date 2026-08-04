import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Career } from '@/data/careers';

export default function CareerHero({ career }: { career: Career }) {
  return (
    <div className="relative overflow-hidden bg-slate-10 dark:bg-[#181D2C] py-12 sm:py-16 lg:py-24 transition-colors duration-200">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Link on Top Left */}
        <Link
          href="/careers"
          className="mt-12 mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-x-1 hover:text-blue-500 dark:text-slate-200 dark:hover:text-blue-500"
>
  <ArrowLeft className="h-4 w-4" />
         Back to all careers
        </Link>

        <div className="mx-auto max-w-lg text-center">
          {/* Location | Full time */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3 sm:mb-4 text-sm sm:text-base font-medium text-slate-800 dark:text-white">
            <span>{career.location}</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>{career.type}</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl xs:text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-900 dark:text-white tracking-tight leading-tight">
            {career.title}
          </h1>

          {/* Career Description */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed px-2 sm:px-0">
            {career.description || career.overview}
          </p>

          {/* Apply Button */}
          <div className="mt-8 sm:mt-12 flex justify-center">
  <a
    href="#apply"
    className="inline-block w-3/4 sm:w-auto text-center rounded-full bg-blue-600 px-6 sm:px-10 py-5 sm:py-5 text-sm sm:text-base font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-blue-500/40"
  >
    Apply now
  </a>
</div>
        </div>
      </div>
    </div>
  );
}