import {
  HeadingSkeleton,
  Skeleton,
  TextSkeleton,
} from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <main>
      <section className="relative mx-auto mb-16 mt-16 max-w-7xl overflow-hidden bg-transparent px-4 py-6 md:px-8">
        <div className="mx-auto mb-2 max-w-2xl pb-4 pt-8 text-center">
          <HeadingSkeleton className="mx-auto h-14 max-w-lg md:h-20" />
          <div className="mx-auto mt-5 space-y-3">
            <TextSkeleton className="w-full" />
            <TextSkeleton className="mx-auto w-11/12" />
          </div>
        </div>

        <div className="relative py-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <article
                key={index}
                className="flex min-h-[350px] flex-col justify-between rounded-lg border border-gray-200/80 bg-gray-100/80 px-14 py-20 dark:border-slate-700/80 dark:bg-[#252d41] md:px-12 md:py-16"
              >
                <div>
                  <Skeleton className="h-10 w-48 rounded-lg" />
                  <HeadingSkeleton className="mt-8 h-8 max-w-sm" />
                </div>
                <div className="flex items-center gap-2">
                  <TextSkeleton className="w-28" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="my-24 h-px w-full bg-gray-200 dark:bg-gray-800" />

        <div className="glass-card mx-auto max-w-5xl rounded-[2rem] px-6 py-10 text-center sm:px-10 sm:py-12">
          <Skeleton className="mx-auto h-12 w-12 rounded-full" />
          <HeadingSkeleton className="mx-auto mt-6 h-10 max-w-md" />
          <div className="mx-auto mt-4 max-w-2xl space-y-3">
            <TextSkeleton className="w-full" />
            <TextSkeleton className="mx-auto w-3/4" />
          </div>
          <Skeleton className="mx-auto mt-8 h-14 w-44 rounded-full" />
        </div>
      </section>
    </main>
  );
}
