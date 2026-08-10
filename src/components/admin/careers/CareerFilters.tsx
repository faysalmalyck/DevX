"use client";

import { Search } from "lucide-react";
import type { CareerStatus } from "@prisma/client";
import { careerStatusLabels } from "@/lib/careers/status";
import type { CareerListQuery } from "@/lib/validations/career";

type CareerFiltersProps = {
  categories: string[];
  filters: CareerListQuery;
  onChange: (next: Partial<CareerListQuery>) => void;
};

const statuses = Object.keys(careerStatusLabels) as CareerStatus[];

export default function CareerFilters({
  categories,
  filters,
  onChange,
}: CareerFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-md">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={filters.q}
          onChange={(event) => onChange({ q: event.target.value, page: 1 })}
          placeholder="Search jobs by title, slug, or department..."
          className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-base outline-none transition focus:border-brand dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <select
          value={filters.category}
          onChange={(event) => onChange({ category: event.target.value, page: 1 })}
          aria-label="Filter by category"
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-brand dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={filters.status ?? ""}
          onChange={(event) =>
            onChange({
              status: (event.target.value || undefined) as CareerStatus | undefined,
              page: 1,
            })
          }
          aria-label="Filter by status"
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-brand dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="">All statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {careerStatusLabels[status]}
            </option>
          ))}
        </select>

        <select
          value={filters.sort}
          onChange={(event) =>
            onChange({
              sort: event.target.value as CareerListQuery["sort"],
              page: 1,
            })
          }
          aria-label="Sort jobs"
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-brand dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="displayOrder_asc">Display order</option>
          <option value="displayOrder_desc">Display order: high first</option>
          <option value="title_asc">Title: A–Z</option>
          <option value="title_desc">Title: Z–A</option>
          <option value="createdAt_desc">Newest created</option>
          <option value="createdAt_asc">Oldest created</option>
          <option value="updatedAt_desc">Recently updated</option>
        </select>
      </div>
    </div>
  );
}
