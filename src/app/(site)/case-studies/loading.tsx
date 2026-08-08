import {
  HeadingSkeleton,
  Skeleton,
  TextSkeleton,
} from "@/components/shared/Skeleton";

function CaseStudyCardSkeleton() {
  return (
    <article className="flex min-h-[350px] h-full flex-col justify-between rounded-lg border border-gray-200/80 bg-gray-100/80 px-10 py-16 shadow-sm dark:border-slate-700/80 dark:bg-[#252d41] sm:px-12 md:px-12 md:py-16">
      <div>
        <Skeleton className="mb-8 h-10 w-48 rounded-lg" />
        <HeadingSkeleton className="h-8 w-11/12" />
      </div>
      <div className="mt-8 flex items-center gap-2">
        <TextSkeleton className="h-4 w-28" />
        <TextSkeleton className="h-4 w-4" />
      </div>
    </article>
  );
}

export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading case studies"
      className="min-h-screen bg-white text-gray-900 dark:bg-[#0B0F17] dark:text-white"
    >
      <section className="relative mx-auto mb-16 mt-15 max-w-7xl overflow-hidden bg-transparent px-4 py-6 md:px-8">
        <div className="mx-auto mb-2 max-w-2xl pb-4 pt-8 text-center">
          <HeadingSkeleton className="mx-auto h-14 w-full max-w-xl md:h-20" />
          <div className="mx-auto mt-4 max-w-2xl space-y-3">
            <TextSkeleton className="w-full" />
            <TextSkeleton className="mx-auto w-10/12" />
          </div>
        </div>

        <div className="relative py-2">
          <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <CaseStudyCardSkeleton key={index} />
            ))}
          </div>
          <div className="pointer-events-none absolute left-1/4 top-1/2 -z-0 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-600/10" />
        </div>

        <div className="my-24 h-px w-full bg-gray-200 dark:bg-gray-800" />
        <section className="mx-auto max-w-6xl py-12 sm:py-16">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <Skeleton className="h-9 w-40 rounded-full" />
              <HeadingSkeleton className="mt-7 h-12 max-w-xl sm:h-14" />
              <div className="mt-6 space-y-3">
                <TextSkeleton className="w-full" />
                <TextSkeleton className="w-11/12" />
              </div>
            </div>
            <Skeleton className="aspect-[4/3] rounded-[2rem]" />
          </div>
        </section>
      </section>
    </main>
  );
}
