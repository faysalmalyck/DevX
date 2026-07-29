"use client";

import type { ReactNode } from "react";

type SkeletonVariant = "card" | "table-row" | "form-field" | "avatar" | "text" | "inline";

interface LoadingSkeletonProps {
  /** Skeleton shape variant */
  variant?: SkeletonVariant;
  /** Number of skeleton items to render */
  count?: number;
  /** Additional CSS class names */
  className?: string;
}

function SkeletonPulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-white/5 border border-white/5 ${className}`} />;
}

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-white/5" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/5 rounded-lg bg-white/5" />
          <div className="h-3 w-2/5 rounded-lg bg-white/5" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded-lg bg-white/5" />
        <div className="h-3 w-4/5 rounded-lg bg-white/5" />
      </div>
      <div className="h-2 w-full rounded-full bg-white/5" />
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-4 border-b border-white/5 px-5 py-4">
      <div className="h-8 w-8 rounded-full bg-white/5 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 w-2/5 rounded-lg bg-white/5" />
        <div className="h-3 w-1/4 rounded-lg bg-white/[0.03]" />
      </div>
      <div className="h-5 w-16 rounded-full bg-white/5" />
      <div className="h-3 w-20 rounded-lg bg-white/[0.03]" />
    </div>
  );
}

function FormFieldSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-3 w-24 rounded bg-white/5" />
      <div className="h-12 w-full rounded-xl bg-white/5 border border-white/5" />
    </div>
  );
}

function AvatarSkeleton() {
  return <div className="animate-pulse h-10 w-10 rounded-full bg-white/5 border border-white/5" />;
}

function TextSkeleton() {
  return (
    <div className="animate-pulse space-y-2.5">
      <div className="h-4 w-full rounded-lg bg-white/5" />
      <div className="h-4 w-5/6 rounded-lg bg-white/5" />
      <div className="h-4 w-3/4 rounded-lg bg-white/[0.03]" />
    </div>
  );
}

function InlineSkeleton() {
  return <div className="animate-pulse inline-block h-4 w-20 rounded bg-white/5 align-middle" />;
}

const variants: Record<SkeletonVariant, () => ReactNode> = {
  card: () => <CardSkeleton />,
  "table-row": () => <TableRowSkeleton />,
  "form-field": () => <FormFieldSkeleton />,
  avatar: () => <AvatarSkeleton />,
  text: () => <TextSkeleton />,
  inline: () => <InlineSkeleton />,
};

/**
 * Animated skeleton placeholder for loading states.
 *
 * @example
 * <LoadingSkeleton variant="card" count={3} />
 * <LoadingSkeleton variant="table-row" count={5} />
 */
export default function LoadingSkeleton({
  variant = "card",
  count = 1,
  className = "",
}: LoadingSkeletonProps) {
  const Skeleton = variants[variant];

  if (variant === "card") {
    return (
      <div className={`grid gap-4 sm:grid-cols-2 ${className}`}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i}>{Skeleton()}</div>
        ))}
      </div>
    );
  }

  if (variant === "table-row") {
    return (
      <div className={`rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] overflow-hidden ${className}`}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i}>{Skeleton()}</div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{Skeleton()}</div>
      ))}
    </div>
  );
}
