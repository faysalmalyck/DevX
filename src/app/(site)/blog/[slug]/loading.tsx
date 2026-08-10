import {
  HeadingSkeleton,
  ImageSkeleton,
  Skeleton,
  TextSkeleton,
} from "@/components/shared/Skeleton";

function RelatedArticleSkeleton() {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800/80 dark:bg-[#1e2436]">
      <ImageSkeleton className="aspect-[16/10.5] rounded-none border-0" />
      <div className="p-6 sm:p-8">
        <HeadingSkeleton className="h-7 w-11/12" />
        <div className="mt-4 space-y-3">
          <TextSkeleton className="w-full" />
          <TextSkeleton className="w-4/5" />
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800/80">
          <Skeleton className="h-8 w-24 rounded-full" />
          <TextSkeleton className="h-3 w-20" />
        </div>
      </div>
    </article>
  );
}

export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading article"
      className="min-h-screen bg-slate-50 py-8 text-slate-900 dark:bg-[#181d2b] dark:text-white sm:py-12 lg:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Skeleton className="mt-4 h-5 w-40 rounded-full sm:mt-8" />

        <header className="py-8 text-center sm:py-12 lg:py-16">
          <div className="flex items-center justify-center gap-3">
            <Skeleton className="h-7 w-24 rounded-full" />
            <TextSkeleton className="h-3 w-3" />
            <TextSkeleton className="h-3 w-24" />
          </div>
          <HeadingSkeleton className="mx-auto mt-6 h-12 max-w-5xl sm:h-16 lg:h-20" />
          <div className="mx-auto mt-6 max-w-3xl space-y-3">
            <TextSkeleton className="w-full" />
            <TextSkeleton className="mx-auto w-10/12" />
          </div>
        </header>

        <ImageSkeleton className="mb-12 aspect-[16/9] rounded-2xl sm:mb-16" />

        <section className="mx-auto max-w-4xl space-y-5 px-2 sm:px-6">
          <HeadingSkeleton className="h-9 w-3/5" />
          <div className="space-y-3">
            <TextSkeleton className="w-full" />
            <TextSkeleton className="w-full" />
            <TextSkeleton className="w-11/12" />
            <TextSkeleton className="w-4/5" />
          </div>
          <HeadingSkeleton className="mt-10 h-8 w-2/5" />
          <div className="space-y-3">
            <TextSkeleton className="w-full" />
            <TextSkeleton className="w-10/12" />
            <TextSkeleton className="w-full" />
          </div>
          <Skeleton className="my-8 h-28 rounded-r-lg border-l-4 border-l-brand" />
        </section>

        <div className="my-12 border-t border-slate-200 dark:border-slate-800 sm:my-16" />

        <section>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <HeadingSkeleton className="h-9 w-56" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-10">
            <RelatedArticleSkeleton />
            <RelatedArticleSkeleton />
          </div>
        </section>
      </div>
    </main>
  );
}
