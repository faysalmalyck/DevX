import {
  GridSkeleton,
  PageHeaderSkeleton,
  Skeleton,
} from "@/components/Common/Skeleton";

export default function Loading() {
  return (
    <main>
      <PageHeaderSkeleton />
      <section className="relative overflow-hidden bg-section py-20 dark:bg-darkmode">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-20 flex justify-center">
            <div className="glass-card w-full max-w-3xl rounded-[2.5rem] p-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[18rem_1fr] md:items-center">
                <Skeleton className="aspect-[4/4.5] rounded-[2rem]" />
                <div>
                  <Skeleton className="h-8 w-40 rounded-full" />
                  <Skeleton className="mt-4 h-10 w-64 rounded-full" />
                  <div className="mt-5 space-y-3">
                    <Skeleton className="h-4 w-full rounded-full" />
                    <Skeleton className="h-4 w-10/12 rounded-full" />
                    <Skeleton className="h-4 w-8/12 rounded-full" />
                  </div>
                  <div className="mt-8 flex gap-3">
                    <Skeleton className="h-11 w-11 rounded-full" />
                    <Skeleton className="h-11 w-11 rounded-full" />
                    <Skeleton className="h-11 w-11 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <GridSkeleton count={4} withImage className="lg:grid-cols-2" />
        </div>
      </section>
    </main>
  );
}
