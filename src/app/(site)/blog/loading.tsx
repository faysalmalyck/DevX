import {
  HeadingSkeleton,
  ImageSkeleton,
  Skeleton,
  TextSkeleton,
} from "@/components/shared/Skeleton";

function FeaturedArticleSkeleton() {
  return (
    <article className="overflow-hidden rounded-lg">
      <ImageSkeleton className="mx-auto w-[95%] aspect-[16/10.5] rounded-lg" />
      <div className="p-6 sm:p-8">
        <HeadingSkeleton className="h-8 w-11/12" />
        <div className="mt-4 space-y-3">
          <TextSkeleton className="w-full" />
          <TextSkeleton className="w-10/12" />
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800/80">
          <Skeleton className="h-8 w-24 rounded-full" />
          <TextSkeleton className="h-3 w-20" />
        </div>
      </div>
    </article>
  );
}

function FeaturedListItemSkeleton() {
  return (
    <article className="flex flex-col items-start gap-4 rounded-lg px-2 py-2 sm:flex-row sm:gap-5 sm:p-2">
      <ImageSkeleton className="w-full shrink-0 rounded-lg sm:w-32 lg:w-36" />
      <div className="w-full flex-1 space-y-3 pt-1">
        <HeadingSkeleton className="h-6 w-full" />
        <TextSkeleton className="w-4/5" />
      </div>
    </article>
  );
}

function ArticleCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800/80 dark:bg-[#1e2436]">
      <ImageSkeleton className="aspect-[16/10.5] rounded-none border-0" />
      <div className="p-6 sm:p-8">
        <HeadingSkeleton className="h-7 w-11/12" />
        <div className="mt-4 space-y-3">
          <TextSkeleton className="w-full" />
          <TextSkeleton className="w-10/12" />
          <TextSkeleton className="w-3/5" />
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
      aria-label="Loading blog"
      className="min-h-screen bg-white text-slate-900 dark:bg-[#181d2b] dark:text-white"
    >
      <section className="relative overflow-hidden pb-16 pt-20 sm:pb-20 sm:pt-28 md:pb-28 md:pt-36">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col justify-between gap-6 sm:mb-16 md:flex-row md:items-end">
            <HeadingSkeleton className="h-12 w-full max-w-md sm:h-14" />
            <div className="w-full max-w-md space-y-3">
              <TextSkeleton className="w-full" />
              <TextSkeleton className="w-4/5" />
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-16 lg:gap-10">
            <div className="w-full lg:col-span-10">
              <FeaturedArticleSkeleton />
            </div>
            <div className="flex w-full flex-col gap-1 sm:gap-2 lg:col-span-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <FeaturedListItemSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800/60 dark:bg-[#181d2b] sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-6 lg:mb-12 lg:flex-row lg:items-center">
            <HeadingSkeleton className="h-10 w-64 sm:h-12" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-20 rounded-full" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:gap-10">
            {Array.from({ length: 6 }).map((_, index) => (
              <ArticleCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
