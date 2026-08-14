"use client";

import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateAction {
  /** Button label */
  label: string;
  /** Click handler */
  onClick: () => void;
}

interface EmptyStateProps {
  /** Lucide icon or custom element to display */
  icon?: ReactNode;
  /** Primary message */
  title?: string;
  /** Secondary supporting text */
  description?: string;
  /** Optional CTA button */
  action?: EmptyStateAction;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Premium empty state with icon, title, description, and optional action button.
 *
 * @example
 * <EmptyState
 *   icon={<Users className="h-12 w-12" />}
 *   title="No users found"
 *   description="Invite team members to get started."
 *   action={{ label: "Invite User", onClick: () => {} }}
 * />
 */
export default function EmptyState({
  icon,
  title = "Nothing here yet",
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center py-16 text-center rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] ${className}`}
    >
      {/* Icon */}
      <div className="mb-4 text-zinc-700">
        {icon ?? <Inbox className="h-12 w-12" />}
      </div>

      {/* Title */}
      <p className="text-zinc-500 font-semibold">{title}</p>

      {/* Description */}
      {description && (
        <p className="mt-1 max-w-sm text-xs text-zinc-600">{description}</p>
      )}

      {/* Action */}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-base font-bold text-white shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
