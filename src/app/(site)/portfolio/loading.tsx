import {
  GridSkeleton,
  PageHeaderSkeleton,
} from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <main>
      <PageHeaderSkeleton />
      <section className="bg-section py-20 dark:bg-darkmode">
        <div className="container mx-auto max-w-6xl px-4">
          <GridSkeleton count={9} withImage />
        </div>
      </section>
    </main>
  );
}
