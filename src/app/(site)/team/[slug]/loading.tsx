import { HeadingSkeleton, Skeleton, TextSkeleton } from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-white px-4 pb-16 pt-32 dark:bg-[#181d2b] sm:px-6 sm:pt-40 lg:pt-48">
      <article className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-slate-50/70 p-6 dark:border-[#39435c] dark:bg-[#242D40] sm:p-10 lg:p-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10 lg:gap-14">
          <Skeleton className="h-36 w-36 shrink-0 rounded-lg sm:h-44 sm:w-44" />
          <div className="flex-1">
            <HeadingSkeleton className="h-10 max-w-sm sm:h-12" />
            <TextSkeleton className="mt-4 h-5 max-w-xs" />
            <TextSkeleton className="mt-4 h-3 w-32" />
          </div>
        </div>

        <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-16">
          {Array.from({ length: 3 }).map((_, index) => (
            <section key={index}>
              <HeadingSkeleton className="h-8 w-56" />
              <div className="mt-5 space-y-3">
                <TextSkeleton className="w-full" />
                <TextSkeleton className="w-full" />
                <TextSkeleton className="w-4/5" />
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
