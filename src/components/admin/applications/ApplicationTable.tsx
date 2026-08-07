"use client";

import { Download, Eye, FileText, Trash2 } from "lucide-react";

import ApplicationStatusBadge from "./ApplicationStatusBadge";
import type { ApplicationListItem } from "./types";

interface ApplicationTableProps {
  applications: ApplicationListItem[];
  loading: boolean;
  onOpen: (applicationId: string) => void;
  onDelete: (application: ApplicationListItem) => void;
}

function formatSubmissionDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function resumeHref(applicationId: string): string {
  return `/api/admin/applications/${encodeURIComponent(applicationId)}/resume`;
}

export default function ApplicationTable({
  applications,
  loading,
  onOpen,
  onDelete,
}: ApplicationTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111827]">
      <div className="overflow-x-auto">
        <table className="min-w-[1050px] w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-500">
            <tr>
              <th className="px-5 py-4">Candidate</th>
              <th className="px-4 py-4">Applied job</th>
              <th className="px-4 py-4">Contact</th>
              <th className="px-4 py-4">Experience</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Submitted</th>
              <th className="px-4 py-4">Resume</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 7 }, (_, index) => (
                <tr
                  key={`application-loading-${index}`}
                  className="border-b border-slate-100 dark:border-white/[0.06]"
                >
                  {Array.from({ length: 8 }, (_, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-4">
                      <div className="h-4 animate-pulse rounded bg-slate-100 dark:bg-white/[0.06]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-16 text-center">
                  <FileText className="mx-auto h-9 w-9 text-slate-300 dark:text-zinc-700" />
                  <p className="mt-3 font-semibold text-slate-700 dark:text-zinc-300">
                    No applications found
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">
                    Try changing the search or filter options.
                  </p>
                </td>
              </tr>
            ) : (
              applications.map((application) => (
                <tr
                  key={application.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50/80 dark:border-white/[0.06] dark:hover:bg-white/[0.025]"
                >
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onOpen(application.id)}
                      className="group text-left"
                    >
                      <span className="block font-bold text-slate-900 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        {application.fullName}
                      </span>
                      <span className="mt-0.5 block max-w-52 truncate text-xs text-slate-500 dark:text-zinc-500">
                        {application.email}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium text-slate-700 dark:text-zinc-200">
                      {application.career.title}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-slate-700 dark:text-zinc-300">
                      <span className="block">{application.email}</span>
                      <span className="mt-0.5 block text-xs text-slate-500 dark:text-zinc-500">
                        {application.phone}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-700 dark:text-zinc-300">
                    {application.yearsOfExperience} years
                  </td>
                  <td className="px-4 py-4">
                    <ApplicationStatusBadge status={application.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-zinc-400">
                    {formatSubmissionDate(application.createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    <a
                      href={resumeHref(application.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      Download
                    </a>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onOpen(application.id)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 dark:text-zinc-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                        aria-label={`View ${application.fullName}'s application`}
                        title="View application"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(application)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                        aria-label={`Delete ${application.fullName}'s application`}
                        title="Delete application"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
