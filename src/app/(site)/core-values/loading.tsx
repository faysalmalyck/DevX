import {
  GridSkeleton,
  HeadingSkeleton,
  Skeleton,
  TextSkeleton,
} from "@/components/Common/Skeleton";

export default function Loading() {
  return (
    <main>
      <section className="premium-shell premium-mesh relative overflow-hidden py-20 lg:py-28">
        <div className="container relative z-10 mx-auto max-w-6xl px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
            <Skeleton className="mx-auto h-9 w-44 rounded-full" />
            <HeadingSkeleton className="mx-auto mt-6 h-12 max-w-xl" />
            <div className="mx-auto mt-4 max-w-2xl space-y-3">
              <TextSkeleton className="w-full" />
              <TextSkeleton className="mx-auto w-4/5" />
            </div>
          </div>
          <GridSkeleton count={6} />
        </div>
      </section>
    </main>
  );
}
