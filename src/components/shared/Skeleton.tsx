type SkeletonProps = {
  className?: string;
};

const joinClasses = (...classes: Array<string | undefined>) =>
  classes.filter(Boolean).join(" ");

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={joinClasses(
        "skeleton-shimmer rounded-2xl border border-slate-950/5 bg-slate-950/[0.06] dark:border-white/[0.08] dark:bg-white/[0.08]",
        className
      )}
    />
  );
}

export function TextSkeleton({ className }: SkeletonProps) {
  return <Skeleton className={joinClasses("h-4 rounded-full", className)} />;
}

export function HeadingSkeleton({ className }: SkeletonProps) {
  return <Skeleton className={joinClasses("h-10 rounded-full", className)} />;
}

export function ImageSkeleton({ className }: SkeletonProps) {
  return <Skeleton className={joinClasses("aspect-[4/3]", className)} />;
}

export function PageHeaderSkeleton() {
  return (
    <section className="premium-shell premium-mesh relative pb-16 pt-32 md:pb-24 md:pt-44">
      <div className="container relative z-10 mx-auto max-w-6xl px-4 text-center">
        <Skeleton className="mx-auto h-9 w-44 rounded-full" />
        <HeadingSkeleton className="mx-auto mt-7 h-12 max-w-3xl sm:h-16" />
        <div className="mx-auto mt-6 max-w-2xl space-y-3">
          <TextSkeleton className="mx-auto w-full" />
          <TextSkeleton className="mx-auto w-4/5" />
        </div>
      </div>
    </section>
  );
}

export function CardSkeleton({ withImage = false }: { withImage?: boolean }) {
  return (
    <article className="glass-card rounded-[1.75rem] p-5">
      {withImage ? (
        <ImageSkeleton className="mb-5 aspect-[4/4.6] rounded-[1.35rem]" />
      ) : (
        <Skeleton className="mb-6 h-14 w-14 rounded-2xl" />
      )}
      <HeadingSkeleton className="h-6 w-3/4" />
      <div className="mt-4 space-y-3">
        <TextSkeleton className="w-full" />
        <TextSkeleton className="w-5/6" />
        <TextSkeleton className="w-2/3" />
      </div>
    </article>
  );
}

export function GridSkeleton({
  count = 6,
  withImage = false,
  className,
}: {
  count?: number;
  withImage?: boolean;
  className?: string;
}) {
  return (
    <div
      className={joinClasses(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} withImage={withImage} />
      ))}
    </div>
  );
}

export function SplitSectionSkeleton() {
  return (
    <section className="relative overflow-hidden bg-section py-20 dark:bg-darkmode">
      <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 lg:grid-cols-2 lg:items-center">
        <div>
          <Skeleton className="h-9 w-40 rounded-full" />
          <HeadingSkeleton className="mt-7 h-12 max-w-xl sm:h-14" />
          <div className="mt-6 space-y-3">
            <TextSkeleton className="w-full" />
            <TextSkeleton className="w-11/12" />
            <TextSkeleton className="w-4/5" />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
        </div>
        <ImageSkeleton className="aspect-[4/4.4] rounded-[2rem]" />
      </div>
    </section>
  );
}

export function FormSkeleton() {
  return (
    <div className="glass-card rounded-[2rem] p-6 sm:p-8">
      <HeadingSkeleton className="h-8 w-56" />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton className="h-14 rounded-2xl" />
        <Skeleton className="h-14 rounded-2xl" />
        <Skeleton className="h-14 rounded-2xl sm:col-span-2" />
        <Skeleton className="h-32 rounded-2xl sm:col-span-2" />
      </div>
      <Skeleton className="mt-6 h-14 w-44 rounded-full" />
    </div>
  );
}
