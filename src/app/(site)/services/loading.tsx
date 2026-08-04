import {
  FormSkeleton,
  GridSkeleton,
  PageHeaderSkeleton,
  SplitSectionSkeleton,
} from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <main>
      <PageHeaderSkeleton />
      <section className="bg-section py-20 dark:bg-darkmode">
        <div className="container mx-auto max-w-6xl px-4">
          <GridSkeleton count={6} />
        </div>
      </section>
      <SplitSectionSkeleton />
      <section className="bg-white py-20 dark:bg-darklight">
        <div className="container mx-auto max-w-6xl px-4">
          <FormSkeleton />
        </div>
      </section>
    </main>
  );
}
