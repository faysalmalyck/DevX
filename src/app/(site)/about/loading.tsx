import {
  GridSkeleton,
  PageHeaderSkeleton,
  SplitSectionSkeleton,
} from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <main>
      <PageHeaderSkeleton />
      <section className="premium-shell premium-mesh relative overflow-hidden py-20 lg:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <GridSkeleton count={6} />
        </div>
      </section>
      <SplitSectionSkeleton />
      <section className="bg-section py-20 dark:bg-darkmode">
        <div className="container mx-auto max-w-5xl px-4">
          <GridSkeleton count={4} withImage className="lg:grid-cols-2" />
        </div>
      </section>
    </main>
  );
}
