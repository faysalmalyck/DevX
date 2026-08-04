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
    <main>
      <section className="premium-shell premium-mesh relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-44">
        <div className="container relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Skeleton className="h-9 w-48 rounded-full" />
            <HeadingSkeleton className="mt-7 h-16 max-w-2xl sm:h-20" />
            <div className="mt-6 max-w-xl space-y-3">
              <TextSkeleton className="w-full" />
              <TextSkeleton className="w-10/12" />
              <TextSkeleton className="w-8/12" />
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Skeleton className="h-14 w-40 rounded-full" />
              <Skeleton className="h-14 w-36 rounded-full" />
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
            </div>
          </div>
          <ImageSkeleton className="aspect-[4/4.5] rounded-[2.25rem]" />
        </div>
      </section>
      <section className="bg-white py-16 dark:bg-darkmode">
        <div className="container mx-auto max-w-6xl px-4">
          <GridSkeleton count={3} className="lg:grid-cols-3" />
        </div>
      </section>
      <SplitSectionSkeleton />
    </main>
  );
}
