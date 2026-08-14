import {
  CircleCheckBig,
  CircleDashed,
  Eye,
  ListChecks,
  Sparkles,
  UserCheck,
  UsersRound,
} from "lucide-react";

import type { ApplicationStatistics } from "./types";

interface ApplicationStatsProps {
  stats: ApplicationStatistics;
}

const statDefinitions = [
  {
    key: "total",
    label: "Total applications",
    icon: UsersRound,
    iconClass:
      "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-zinc-200",
  },
  {
    key: "new",
    label: "New",
    icon: Sparkles,
    iconClass: "bg-blue-50 text-brand dark:bg-brand/10 dark:text-brand",
  },
  {
    key: "reviewing",
    label: "Reviewing",
    icon: Eye,
    iconClass:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  },
  {
    key: "shortlisted",
    label: "Shortlisted",
    icon: ListChecks,
    iconClass:
      "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  },
  {
    key: "interview",
    label: "Interview",
    icon: CircleDashed,
    iconClass: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
  },
  {
    key: "hired",
    label: "Hired",
    icon: UserCheck,
    iconClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: CircleCheckBig,
    iconClass: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  },
] as const;

export default function ApplicationStats({ stats }: ApplicationStatsProps) {
  return (
    <section
      aria-label="Application statistics"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7"
    >
      {statDefinitions.map(({ key, label, icon: Icon, iconClass }) => (
        <div
          key={key}
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-[#111827]"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              {label}
            </p>
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {stats[key].toLocaleString()}
          </p>
        </div>
      ))}
    </section>
  );
}
