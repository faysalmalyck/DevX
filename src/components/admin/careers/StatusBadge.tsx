import type { CareerStatus } from "@prisma/client";
import { careerStatusLabels } from "@/lib/careers/status";

const statusClasses: Record<CareerStatus, string> = {
  DRAFT:
    "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300",
  PUBLISHED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300",
  CLOSED:
    "bg-rose-100 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300",
  ARCHIVED:
    "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
};

export default function StatusBadge({ status }: { status: CareerStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[status]}`}
    >
      {careerStatusLabels[status]}
    </span>
  );
}
