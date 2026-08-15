import {
  HeadingSkeleton,
  ImageSkeleton,
  Skeleton,
  TextSkeleton,
} from "@/components/shared/Skeleton";

function RelatedCaseStudySkeleton() {
  return (
    <article className="flex min-h-[280px] h-full flex-col justify-between rounded-lg border border-slate-800 bg-[#111726]/60 p-8 sm:p-10">
      <div>
        <Skeleton className="mb-6 h-8 w-36 rounded-lg" />
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
      aria-label="Loading case study"
      className="min-h-screen bg-white text-slate-900 dark:bg-[#181d2b] dark:text-white"
    >
      <section className="relative overflow-hidden pb-16 pt-28 lg:pb-24 lg:pt-36">
        <div className="pointer-events-none absolute left-1/2 top-1/4 h-[350px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[140px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="mb-8 h-5 w-44 rounded-full" />
          <div className="mx-auto mb-12 max-w-4xl text-center sm:mb-16">
            <Skeleton className="mx-auto mb-6 h-12 w-48 rounded-lg" />
            <HeadingSkeleton className="mx-auto h-12 w-full max-w-4xl sm:h-16 lg:h-20" />
          </div>
          <ImageSkeleton className="aspect-[16/9] rounded-lg border-slate-800/60 bg-white/[0.08] dark:bg-white/[0.08]" />
        </div>
      </section>

      <section className="border-t border-slate-800/40 pb-16 pt-28 lg:pb-24 lg:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-20 lg:grid-cols-12 lg:gap-32">
            <div className="space-y-6 lg:col-span-6">
              <HeadingSkeleton className="h-11 w-3/4 sm:h-12" />
              <div className="space-y-4">
                <TextSkeleton className="w-full" />
                <TextSkeleton className="w-full" />
                <TextSkeleton className="w-11/12" />
                <TextSkeleton className="w-4/5" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:col-span-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <TextSkeleton className="h-3 w-16" />
                  <TextSkeleton className="h-6 w-4/5" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-36 rounded-lg bg-gradient-to-b from-[#252d42] via-[#1f2636] to-[#1C2335] px-8 py-14 md:mt-48 md:px-36 md:py-24">
            <HeadingSkeleton className="h-12 w-3/5" />
            <div className="mt-10 space-y-4">
              <TextSkeleton className="w-full" />
              <TextSkeleton className="w-full" />
              <TextSkeleton className="w-11/12" />
              <TextSkeleton className="w-4/5" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800/40 pb-20 pt-36 lg:pb-32 lg:pt-56">
        <div className="mx-auto max-w-7xl space-y-16 px-4 sm:space-y-24 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-20">
            <HeadingSkeleton className="h-12 w-64 lg:col-span-5" />
            <div className="space-y-4 lg:col-span-7">
              <TextSkeleton className="w-full" />
              <TextSkeleton className="w-11/12" />
              <TextSkeleton className="w-4/5" />
            </div>
          </div>
          <ImageSkeleton className="aspect-[16/9] rounded-[28px] border-slate-800/60 bg-white/[0.08] dark:bg-white/[0.08]" />
        </div>
      </section>

      <section className="border-t border-slate-800/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <HeadingSkeleton className="mb-10 h-10 w-72" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <RelatedCaseStudySkeleton />
            <RelatedCaseStudySkeleton />
          </div>
        </div>
      </section>
    </main>
  );
}
