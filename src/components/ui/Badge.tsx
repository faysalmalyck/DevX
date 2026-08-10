"use client";

import type { ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral" | "primary";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  /** Semantic color variant */
  variant?: BadgeVariant;
  /** Size preset */
  size?: BadgeSize;
  /** Badge text content */
  children: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Optional dot indicator */
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  error: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  info: "bg-brand/10 text-brand border-brand/20",
  neutral: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  primary: "bg-primary/10 text-primary border-primary/20",
};

const dotColors: Record<BadgeVariant, string> = {
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  error: "bg-rose-400",
  info: "bg-blue-400",
  neutral: "bg-zinc-400",
  primary: "bg-primary",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-3 py-1 text-xs",
};

/**
 * Semantic status badge with color presets matching the DevX design system.
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" dot>Failed</Badge>
 * <Badge variant="warning" size="md">Pending</Badge>
 */
export default function Badge({
  variant = "neutral",
  size = "sm",
  children,
  className = "",
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}
