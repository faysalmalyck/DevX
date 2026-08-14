import {
  HeadingSkeleton,
  Skeleton,
  TextSkeleton,
} from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-white pt-20 text-slate-900 dark:bg-[#181d2b] dark:text-white md:pt-32">
      <section className="relative overflow-hidden pb-16 md:pb-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-4xl pt-4 text-center md:mb-16 md:pt-8">
            <HeadingSkeleton className="mx-auto h-12 max-w-3xl sm:h-14 md:h-16" />
            <TextSkeleton className="mx-auto mt-6 max-w-2xl" />
          </div>

          <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-slate-200 shadow-xl md:grid-cols-3 md:rounded-lg dark:border-slate-600/80 dark:shadow-2xl">
            {Array.from({ length: 3 }).map((_, index) => (
              <article
                key={index}
                className={`flex min-h-[550px] flex-col justify-between bg-slate-50 p-6 sm:p-8 md:min-h-[650px] md:p-10 lg:p-12 dark:bg-gradient-to-b dark:from-[#252E42] dark:to-[#1A2033] ${
                  index < 2
                    ? "border-b border-slate-200 md:border-b-0 md:border-r dark:border-slate-500/80"
                    : ""
                }`}
              >
                <div>
                  <Skeleton className="h-5 w-28 rounded-full" />
                  <HeadingSkeleton className="mt-5 h-10 w-3/5" />
                  <div className="mt-5 space-y-3">
                    <TextSkeleton className="w-full" />
                    <TextSkeleton className="w-5/6" />
                  </div>
                  <Skeleton className="mt-8 h-14 w-full rounded-full" />
                </div>

                <div className="mt-8 border-t border-slate-200 pt-6 sm:mt-12 sm:pt-8 dark:border-slate-700/60">
                  <Skeleton className="h-5 w-36 rounded-full" />
                  <div className="mt-6 space-y-4">
                    {Array.from({ length: 5 }).map((_, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5 shrink-0 rounded-full" />
                        <TextSkeleton className={featureIndex === 4 ? "w-3/5" : "w-4/5"} />
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-section py-16 dark:border-white/5 dark:bg-darkmode md:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <HeadingSkeleton className="mx-auto h-10 max-w-md" />
          <div className="mt-10 space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
