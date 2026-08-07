"use client";

import { Search } from "lucide-react";

export default function CareerFilters() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-md">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <input
          type="text"
          placeholder="Search careers..."
          className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <select className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
          <option>All Departments</option>
          <option>Development</option>
          <option>Design</option>
          <option>Marketing</option>
          <option>Sales</option>
          <option>HR</option>
        </select>

        <select className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
          <option>All Status</option>
          <option>Published</option>
          <option>Draft</option>
          <option>Archived</option>
        </select>
      </div>
    </div>
  );
}