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
        "skeleton-shimmer rounded-md",
        className
      )}
    />
  );
}

export function TextSkeleton({ className }: SkeletonProps) {
  return <Skeleton className={joinClasses("h-3.5 rounded-sm", className)} />;
}

export function HeadingSkeleton({ className }: SkeletonProps) {
  return <Skeleton className={joinClasses("h-10 rounded-md", className)} />;
}

export function ImageSkeleton({ className }: SkeletonProps) {
  return <Skeleton className={joinClasses("aspect-[4/3] rounded-lg", className)} />;
}

export function PageHeaderSkeleton() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/70 bg-white pb-16 pt-28 dark:border-slate-700/60 dark:bg-[#181d2b] sm:pt-36 md:pb-24 md:pt-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-56 w-3/4 -translate-x-1/2 rounded-full bg-brand/[0.06] blur-3xl dark:bg-brand/[0.12]"
      />
      <div className="container relative z-10 mx-auto max-w-6xl px-4 text-center">
        <HeadingSkeleton className="mx-auto h-12 max-w-3xl sm:h-16" />
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
    <article className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.04)] dark:border-slate-700/70 dark:bg-[#243042] dark:shadow-none">
      {withImage ? (
        <ImageSkeleton className="aspect-[16/10] rounded-none" />
      ) : (
        <div className="border-b border-slate-200/80 p-5 dark:border-slate-700/70">
          <Skeleton className="h-12 w-12 rounded-lg" />
        </div>
      )}
      <div className="p-5">
        <HeadingSkeleton className="h-6 w-3/4" />
        <div className="mt-4 space-y-3">
          <TextSkeleton className="w-full" />
          <TextSkeleton className="w-5/6" />
          <TextSkeleton className="w-2/3" />
        </div>
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
    <section className="relative overflow-hidden border-y border-slate-200/70 bg-slate-50 py-20 dark:border-slate-700/60 dark:bg-[#181d2b]">
      <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 lg:grid-cols-2 lg:items-center">
        <div>
          <Skeleton className="h-8 w-36 rounded-full" />
          <HeadingSkeleton className="mt-7 h-12 max-w-xl sm:h-14" />
          <div className="mt-6 space-y-3">
            <TextSkeleton className="w-full" />
            <TextSkeleton className="w-11/12" />
            <TextSkeleton className="w-4/5" />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-200/80 bg-white p-4 dark:border-slate-700/70 dark:bg-[#243042]">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-3 h-7 w-1/2" />
            </div>
            <div className="rounded-lg border border-slate-200/80 bg-white p-4 dark:border-slate-700/70 dark:bg-[#243042]">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-3 h-7 w-1/2" />
            </div>
          </div>
        </div>
        <ImageSkeleton className="aspect-[16/11] rounded-lg" />
      </div>
    </section>
  );
}

export function FormSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200/80 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.04)] dark:border-slate-700/70 dark:bg-[#243042] dark:shadow-none sm:p-8">
      <HeadingSkeleton className="h-8 w-56" />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg sm:col-span-2" />
        <Skeleton className="h-32 rounded-lg sm:col-span-2" />
      </div>
      <Skeleton className="mt-6 h-14 w-44 rounded-full" />
    </div>
  );
}
