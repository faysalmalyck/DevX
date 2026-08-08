import {
  HeadingSkeleton,
  Skeleton,
  TextSkeleton,
} from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-[#181d2b] dark:text-white">
      <section className="relative overflow-hidden pb-16 pt-36 sm:pb-16 sm:pt-40 lg:pb-24 lg:pt-48">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 max-w-[650px] text-center sm:mb-12">
            <HeadingSkeleton className="mx-auto h-12 max-w-xl sm:h-14" />
            <div className="mx-auto mt-4 max-w-2xl space-y-3">
              <TextSkeleton className="w-full" />
              <TextSkeleton className="mx-auto w-4/5" />
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-[1220px] grid-cols-1 justify-items-center gap-6 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <article
                key={index}
                className="flex w-full max-w-[596px] flex-col justify-between rounded-lg border border-gray-300 bg-gray-50/50 p-8 dark:border-[#2f384f] dark:bg-gradient-to-b dark:from-[#252E41] dark:via-[#242D40] dark:to-[#1D2336] sm:p-10 lg:p-12"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <Skeleton className="h-12 w-12 shrink-0 rounded-lg sm:h-16 sm:w-16" />
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-5 w-36 rounded-full" />
                    <TextSkeleton className="mt-2 w-28" />
                    <TextSkeleton className="mt-2 w-24" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <TextSkeleton className="w-full" />
                  <TextSkeleton className="w-full" />
                  <TextSkeleton className="w-4/5" />
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex justify-center py-16">
            <Skeleton className="h-14 w-full max-w-[280px] rounded-full sm:w-52" />
          </div>
        </div>
      </section>
    </main>
  );
}
