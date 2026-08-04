import {
  FormSkeleton,
  GridSkeleton,
  PageHeaderSkeleton,
  Skeleton,
} from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <main>
      <PageHeaderSkeleton />
      <section className="bg-section py-20 dark:bg-darkmode">
        <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <GridSkeleton count={3} className="grid-cols-1 sm:grid-cols-1 lg:grid-cols-1" />
          </div>
          <FormSkeleton />
        </div>
      </section>
      <section className="bg-white py-20 dark:bg-darklight">
        <div className="container mx-auto max-w-6xl px-4">
          <Skeleton className="h-80 rounded-[2rem]" />
        </div>
      </section>
    </main>
  );
}
