"use client";

import { Search } from "lucide-react";

import {
  APPLICATION_STATUS_VALUES,
  formatApplicationStatus,
  type ApplicationJobFilter,
  type ApplicationStatusValue,
} from "./types";

interface ApplicationFiltersProps {
  search: string;
  careerId: string;
  status: ApplicationStatusValue | "";
  sort: "newest" | "oldest";
  jobs: ApplicationJobFilter[];
  onSearchChange: (value: string) => void;
  onCareerChange: (value: string) => void;
  onStatusChange: (value: ApplicationStatusValue | "") => void;
  onSortChange: (value: "newest" | "oldest") => void;
}

export default function ApplicationFilters({
  search,
  careerId,
  status,
  sort,
  jobs,
  onSearchChange,
  onCareerChange,
  onStatusChange,
  onSortChange,
}: ApplicationFiltersProps) {
  return (
    <section className="flex flex-col gap-3 cart-skin-box rounded-2xl p-4 xl:flex-row xl:items-center">
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">Search applications</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search candidate name or email..."
          className="consultation-input pl-10"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-3 xl:w-auto">
        <label>
          <span className="sr-only">Filter by job</span>
          <select
            value={careerId}
            onChange={(event) => onCareerChange(event.target.value)}
            className="consultation-select text-sm py-2.5 px-4"
          >
            <option value="">All jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">Filter by application status</span>
          <select
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as ApplicationStatusValue | "")
            }
            className="consultation-select text-sm py-2.5 px-4"
          >
            <option value="">All statuses</option>
            {APPLICATION_STATUS_VALUES.map((value) => (
              <option key={value} value={value}>
                {formatApplicationStatus(value)}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">Sort applications</span>
          <select
            value={sort}
            onChange={(event) =>
              onSortChange(event.target.value as "newest" | "oldest")
            }
            className="consultation-select text-sm py-2.5 px-4"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>
    </section>
  );
}
