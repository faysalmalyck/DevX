import {
  GridSkeleton,
  HeadingSkeleton,
  ImageSkeleton,
  Skeleton,
  SplitSectionSkeleton,
  TextSkeleton,
} from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading DevX"
      className="min-h-screen overflow-hidden bg-white text-slate-900 dark:bg-[#181d2b] dark:text-white"
    >
      <p className="sr-only" role="status">
        Loading page content
      </p>
      <section className="relative overflow-hidden border-b border-slate-200/70 pb-16 pt-28 dark:border-slate-700/60 sm:pt-36 md:pb-24 md:pt-44">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-brand/[0.07] blur-[120px] dark:bg-brand/[0.14]"
        />
        <div className="container relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-2xl">
            <Skeleton className="h-6 w-28 rounded-full" />
            <HeadingSkeleton className="mt-7 h-14 max-w-xl sm:h-16" />
            <HeadingSkeleton className="mt-3 h-14 w-4/5 max-w-lg sm:h-16" />
            <div className="mt-6 max-w-xl space-y-3">
              <TextSkeleton className="w-full" />
              <TextSkeleton className="w-10/12" />
              <TextSkeleton className="w-8/12" />
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Skeleton className="h-14 w-40 rounded-full" />
              <Skeleton className="h-14 w-36 rounded-full" />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div
              aria-hidden="true"
              className="absolute inset-x-10 top-10 h-64 rounded-full bg-brand/10 blur-3xl dark:bg-brand/20"
            />
            <ImageSkeleton className="relative aspect-[16/11] rounded-lg" />
            <div className="relative mx-auto -mt-10 grid w-[88%] grid-cols-3 gap-3 rounded-lg border border-slate-200/80 bg-white/95 p-3 shadow-lg shadow-slate-950/5 dark:border-slate-700/70 dark:bg-[#243042]/95 dark:shadow-none">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200/70 bg-white py-8 dark:border-slate-700/60 dark:bg-[#181d2b] sm:py-10">
        <div className="container mx-auto flex max-w-6xl flex-col gap-5 px-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-4 w-44" />
          <div className="grid grid-cols-3 gap-x-8 gap-y-4 sm:flex sm:items-center sm:gap-10">
            <Skeleton className="h-5 w-16 rounded-sm" />
            <Skeleton className="h-5 w-20 rounded-sm" />
            <Skeleton className="h-5 w-14 rounded-sm" />
            <Skeleton className="h-5 w-20 rounded-sm" />
            <Skeleton className="h-5 w-16 rounded-sm" />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-[#181d2b] sm:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <HeadingSkeleton className="mx-auto h-11 w-full max-w-2xl sm:h-12" />
            <TextSkeleton className="mx-auto mt-5 w-4/5" />
          </div>
          <GridSkeleton count={3} className="lg:grid-cols-3" />
        </div>
      </section>

      <SplitSectionSkeleton />
    </main>
  );
}
