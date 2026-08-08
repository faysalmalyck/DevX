import {
  HeadingSkeleton,
  Skeleton,
  TextSkeleton,
} from "./Skeleton";

export default function PricingDetailSkeleton() {
  return (
    <main className="relative mx-auto mt-12 max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pt-24 lg:mt-16 lg:px-8 lg:pt-32">
      <Skeleton className="mt-12 mb-8 h-5 w-36 rounded-full" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
        <section className="flex flex-col space-y-8 pr-0 sm:pr-4 lg:col-span-7 lg:pr-9">
          <div className="space-y-6 sm:space-y-8">
            <HeadingSkeleton className="h-12 max-w-xl sm:h-14 md:h-16" />
            <div className="space-y-3">
              <TextSkeleton className="w-full" />
              <TextSkeleton className="w-11/12" />
              <TextSkeleton className="w-4/5" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 shrink-0 rounded-full" />
                  <TextSkeleton className={index === 5 ? "w-3/5" : "w-4/5"} />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5 border-t border-slate-200 pt-8 dark:border-slate-600">
            <HeadingSkeleton className="h-9 max-w-md" />
            <div className="space-y-3">
              <TextSkeleton className="w-full" />
              <TextSkeleton className="w-full" />
              <TextSkeleton className="w-10/12" />
            </div>
            <HeadingSkeleton className="h-8 max-w-sm" />
            <div className="space-y-3">
              <TextSkeleton className="w-full" />
              <TextSkeleton className="w-5/6" />
            </div>
          </div>
        </section>

        <aside className="min-h-[450px] w-full lg:sticky lg:top-24 lg:col-span-5 sm:min-h-[500px]">
          <div className="glass-card rounded-[2rem] p-6 sm:p-8">
            <Skeleton className="h-8 w-2/3 rounded-full" />
            <div className="mt-5 space-y-3">
              <TextSkeleton className="w-full" />
              <TextSkeleton className="w-4/5" />
            </div>
            <Skeleton className="mt-8 h-12 w-32 rounded-full" />
            <div className="mt-8 space-y-4">
              <Skeleton className="h-14 rounded-2xl" />
              <Skeleton className="h-14 rounded-2xl" />
            </div>
            <Skeleton className="mt-6 h-14 w-full rounded-full" />
          </div>
        </aside>
      </div>
    </main>
  );
}
