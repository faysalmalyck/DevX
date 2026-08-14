import {
  GridSkeleton,
  HeadingSkeleton,
  PageHeaderSkeleton,
  Skeleton,
  TextSkeleton,
} from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <main>
      <PageHeaderSkeleton />
      <section className="relative overflow-hidden bg-section py-20 dark:bg-darkmode">
        <div className="container mx-auto max-w-6xl px-4">
          <Skeleton className="h-9 w-44 rounded-full" />
          <HeadingSkeleton className="mt-6 h-12 max-w-3xl" />
          <div className="mt-10">
            <GridSkeleton count={4} className="lg:grid-cols-4" />
          </div>
        </div>
      </section>
      <section className="bg-white py-20 dark:bg-darklight">
        <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 lg:grid-cols-2">
          {[0, 1].map((column) => (
            <div key={column}>
              <Skeleton className="h-9 w-44 rounded-full" />
              <HeadingSkeleton className="mt-6 h-12 max-w-lg" />
              <div className="mt-8 space-y-4">
                {[0, 1, 2, 3].map((item) => (
                  <Skeleton key={item} className="h-20 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-section py-20 dark:bg-darkmode">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="glass-card rounded-[2rem] px-6 py-10 text-center sm:px-10 sm:py-12">
            <Skeleton className="mx-auto h-12 w-12 rounded-full" />
            <HeadingSkeleton className="mx-auto mt-6 h-10 max-w-md" />
            <div className="mx-auto mt-4 max-w-2xl space-y-3">
              <TextSkeleton className="w-full" />
              <TextSkeleton className="mx-auto w-3/4" />
            </div>
            <Skeleton className="mx-auto mt-8 h-14 w-40 rounded-full" />
          </div>
        </div>
      </section>
    </main>
  );
}
